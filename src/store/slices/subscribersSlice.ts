import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { subscribersService } from "@/features/subscribers/services/subscribers.service";
import { mapTopFan, mergeSubscribers } from "@/features/subscribers/mapper/subscribers.mapper";
import type { Subscriber, TopSupporter } from "@/features/subscribers/types/subscribers.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface SubscribersState {
  subscribers: Subscriber[];
  page: number;
  hasMore: boolean;
  status: RequestStatus;
  isLoadingMore: boolean;
  error: string | null;
  topFans: TopSupporter[];
  topFansStatus: RequestStatus;
}

const initialState: SubscribersState = {
  subscribers: [],
  page: 0,
  hasMore: true,
  status: "idle",
  isLoadingMore: false,
  error: null,
  topFans: [],
  topFansStatus: "idle",
};

export const fetchSubscribers = createAsyncThunk<
  { subscribers: Subscriber[]; page: number; hasMore: boolean },
  { page: number; append: boolean },
  { state: { subscribers: SubscribersState }; rejectValue: string }
>("subscribers/fetch", async ({ page, append }, { getState, rejectWithValue }) => {
  try {
    const response = await subscribersService.getEarnings(page);
    const existing = append ? getState().subscribers.subscribers : [];
    return {
      subscribers: mergeSubscribers(existing, response.data.result),
      page: response.data.current_page,
      hasMore: response.data.more_page,
    };
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const fetchTopFans = createAsyncThunk<TopSupporter[], string, { rejectValue: string }>(
  "subscribers/fetchTopFans",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await subscribersService.getTopFans(userId);
      return response.data.result.map(mapTopFan);
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const toggleSubscriberBlock = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("subscribers/toggleBlock", async (userId, { rejectWithValue }) => {
  try {
    await subscribersService.toggleBlock(userId);
    return userId;
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const subscribersSlice = createSlice({
  name: "subscribers",
  initialState,
  reducers: {
    resetSubscribers: (state) => {
      state.subscribers = [];
      state.page = 0;
      state.hasMore = true;
      state.status = "idle";
      state.error = null;
    },
    setSubscriberBlocked: (state, action: PayloadAction<{ userId: string; blocked: boolean }>) => {
      const subscriber = state.subscribers.find((entry) => entry.userId === action.payload.userId);
      if (subscriber) subscriber.blocked = action.payload.blocked;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscribers.pending, (state, action) => {
        if (action.meta.arg.append) state.isLoadingMore = true;
        else state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSubscribers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoadingMore = false;
        state.subscribers = action.payload.subscribers;
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchSubscribers.rejected, (state, action) => {
        state.status = "failed";
        state.isLoadingMore = false;
        state.error = action.payload ?? "Something went wrong. Please try again.";
      })
      .addCase(fetchTopFans.pending, (state) => {
        state.topFansStatus = "loading";
      })
      .addCase(fetchTopFans.fulfilled, (state, action) => {
        state.topFansStatus = "succeeded";
        state.topFans = action.payload;
      })
      .addCase(fetchTopFans.rejected, (state) => {
        state.topFansStatus = "failed";
      })
      .addCase(toggleSubscriberBlock.fulfilled, (state, action) => {
        const subscriber = state.subscribers.find((entry) => entry.userId === action.payload);
        if (subscriber) subscriber.blocked = !subscriber.blocked;
      });
  },
});

export const { resetSubscribers, setSubscriberBlocked } = subscribersSlice.actions;
export default subscribersSlice.reducer;
