import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { creatorAnalyticsService } from "@/features/creator-analytics/services/creator-analytics.service";
import { mapApiEarning, mapApiPost, mapApiTopFan } from "@/features/creator-analytics/mapper/creator-analytics.mapper";
import {
  DEFAULT_ANALYTICS_RANGE,
  MAX_EARNING_PAGES,
  MAX_POST_PAGES,
} from "@/features/creator-analytics/constants/creator-analytics";
import type {
  AnalyticsEarning,
  AnalyticsPost,
  AnalyticsRangeKey,
  AnalyticsTopFan,
} from "@/features/creator-analytics/types/creator-analytics.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface CreatorAnalyticsState {
  earnings: AnalyticsEarning[];
  /** True when the account had more earning pages than the page-cap loaded. */
  earningsTruncated: boolean;
  posts: AnalyticsPost[];
  postsTruncated: boolean;
  topFans: AnalyticsTopFan[];
  range: AnalyticsRangeKey;
  status: RequestStatus;
  error: string | null;
}

const initialState: CreatorAnalyticsState = {
  earnings: [],
  earningsTruncated: false,
  posts: [],
  postsTruncated: false,
  topFans: [],
  range: DEFAULT_ANALYTICS_RANGE,
  status: "idle",
  error: null,
};

interface AnalyticsBundle {
  earnings: AnalyticsEarning[];
  earningsTruncated: boolean;
  posts: AnalyticsPost[];
  postsTruncated: boolean;
  topFans: AnalyticsTopFan[];
}

async function loadAllEarnings(): Promise<{ rows: AnalyticsEarning[]; truncated: boolean }> {
  const rows: AnalyticsEarning[] = [];
  let page = 1;
  let morePages = true;
  while (morePages && page <= MAX_EARNING_PAGES) {
    const response = await creatorAnalyticsService.getEarnings(page);
    rows.push(...response.data.result.map(mapApiEarning));
    morePages = response.data.more_page;
    page += 1;
  }
  return { rows, truncated: morePages };
}

async function loadAllPosts(creatorId: string): Promise<{ rows: AnalyticsPost[]; truncated: boolean }> {
  const rows: AnalyticsPost[] = [];
  let page = 1;
  let morePages = true;
  while (morePages && page <= MAX_POST_PAGES) {
    const response = await creatorAnalyticsService.getMyPosts(creatorId, page);
    rows.push(...response.data.result.map(mapApiPost));
    morePages = response.data.more_page;
    page += 1;
  }
  return { rows, truncated: morePages };
}

export const fetchAnalyticsBundle = createAsyncThunk<AnalyticsBundle, void, { rejectValue: string }>(
  "creatorAnalytics/fetchBundle",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: { user: { id: string } | null } };
    const userId = state.auth.user?.id;
    if (!userId) return rejectWithValue("Sign in to view analytics.");

    try {
      const [earnings, posts, topFansResponse] = await Promise.all([
        loadAllEarnings(),
        loadAllPosts(userId),
        creatorAnalyticsService.getTopFans(userId),
      ]);
      return {
        earnings: earnings.rows,
        earningsTruncated: earnings.truncated,
        posts: posts.rows,
        postsTruncated: posts.truncated,
        topFans: topFansResponse.data.result.map(mapApiTopFan),
      };
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const creatorAnalyticsSlice = createSlice({
  name: "creatorAnalytics",
  initialState,
  reducers: {
    setAnalyticsRange: (state, action: PayloadAction<AnalyticsRangeKey>) => {
      state.range = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsBundle.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAnalyticsBundle.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.earnings = action.payload.earnings;
        state.earningsTruncated = action.payload.earningsTruncated;
        state.posts = action.payload.posts;
        state.postsTruncated = action.payload.postsTruncated;
        state.topFans = action.payload.topFans;
      })
      .addCase(fetchAnalyticsBundle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to load analytics.";
      });
  },
});

export const { setAnalyticsRange } = creatorAnalyticsSlice.actions;
export default creatorAnalyticsSlice.reducer;
