import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { creatorProfileService } from "@/features/creator-profile/services/creator-profile.service";
import {
  mapApiCreatorProfile,
  mapApiCreatorProfilePost,
} from "@/features/creator-profile/mapper/creator-profile.mapper";
import type { CreatorProfile, CreatorProfilePost } from "@/features/creator-profile/types/creator-profile.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface CreatorProfileState {
  creatorId: string | null;
  profile: CreatorProfile | null;
  status: RequestStatus;
  error: string | null;
  posts: {
    items: CreatorProfilePost[];
    totalRows: number;
    page: number;
    hasMore: boolean;
    status: RequestStatus;
    error: string | null;
  };
  blockPending: boolean;
}

const initialState: CreatorProfileState = {
  creatorId: null,
  profile: null,
  status: "idle",
  error: null,
  posts: { items: [], totalRows: 0, page: 0, hasMore: true, status: "idle", error: null },
  blockPending: false,
};

export const fetchCreatorProfile = createAsyncThunk<
  { creatorId: string; profile: CreatorProfile },
  string,
  { rejectValue: string }
>("creatorProfile/fetchProfile", async (creatorId, { rejectWithValue }) => {
  try {
    const response = await creatorProfileService.getProfile(creatorId);
    const row = response.data.result?.[0];
    if (!row) return rejectWithValue("This profile doesn't exist.");
    return { creatorId, profile: mapApiCreatorProfile(row) };
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const fetchCreatorProfilePosts = createAsyncThunk<
  { posts: CreatorProfilePost[]; totalRows: number; page: number; hasMore: boolean; append: boolean },
  { creatorId: string; page: number; append: boolean },
  { rejectValue: string }
>("creatorProfile/fetchPosts", async ({ creatorId, page, append }, { rejectWithValue }) => {
  try {
    const response = await creatorProfileService.getPosts(creatorId, page);
    return {
      posts: (response.data.result ?? []).map(mapApiCreatorProfilePost),
      totalRows: response.data.total_rows ?? 0,
      page: response.data.current_page ?? page,
      hasMore: Boolean(response.data.more_page),
      append,
    };
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const toggleBlockCreator = createAsyncThunk<void, string, { rejectValue: string }>(
  "creatorProfile/toggleBlock",
  async (creatorId, { rejectWithValue }) => {
    try {
      await creatorProfileService.toggleBlock(creatorId);
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const creatorProfileSlice = createSlice({
  name: "creatorProfile",
  initialState,
  reducers: {
    resetCreatorProfile: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreatorProfile.pending, (state, action) => {
        state.creatorId = action.meta.arg;
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCreatorProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.creatorId = action.payload.creatorId;
        state.profile = action.payload.profile;
      })
      .addCase(fetchCreatorProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Something went wrong. Please try again.";
      })
      .addCase(fetchCreatorProfilePosts.pending, (state, action) => {
        state.posts.status = action.meta.arg.append ? state.posts.status : "loading";
        state.posts.error = null;
      })
      .addCase(fetchCreatorProfilePosts.fulfilled, (state, action) => {
        state.posts.status = "succeeded";
        state.posts.totalRows = action.payload.totalRows;
        state.posts.page = action.payload.page;
        state.posts.hasMore = action.payload.hasMore;
        state.posts.items = action.payload.append
          ? [...state.posts.items, ...action.payload.posts]
          : action.payload.posts;
      })
      .addCase(fetchCreatorProfilePosts.rejected, (state, action) => {
        state.posts.status = "failed";
        state.posts.error = action.payload ?? "Something went wrong. Please try again.";
      })
      .addCase(toggleBlockCreator.pending, (state) => {
        state.blockPending = true;
      })
      .addCase(toggleBlockCreator.fulfilled, (state) => {
        state.blockPending = false;
        if (state.profile) state.profile.blocked = !state.profile.blocked;
      })
      .addCase(toggleBlockCreator.rejected, (state) => {
        state.blockPending = false;
      });
  },
});

export const { resetCreatorProfile } = creatorProfileSlice.actions;
export default creatorProfileSlice.reducer;
