import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { reelsService } from "@/features/reels/services/reels.service";
import { mapApiReelsResponse } from "@/features/reels/mapper/reels.mapper";
import type { Reel } from "@/features/reels/types/reels.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface ReelsState {
  reels: Reel[];
  page: number;
  hasMore: boolean;
  status: RequestStatus;
  isLoadingMore: boolean;
  error: string | null;
}

const initialState: ReelsState = {
  reels: [],
  page: 0,
  hasMore: true,
  status: "idle",
  isLoadingMore: false,
  error: null,
};

export const fetchReels = createAsyncThunk<
  { reels: Reel[]; page: number; hasMore: boolean; append: boolean },
  { page: number; append: boolean },
  { rejectValue: string }
>("reels/fetchReels", async ({ page, append }, { rejectWithValue }) => {
  try {
    const response = await reelsService.getReels(page);
    const mapped = mapApiReelsResponse(response.data);
    return { ...mapped, append };
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const reelsSlice = createSlice({
  name: "reels",
  initialState,
  reducers: {
    resetReels: (state) => {
      state.reels = [];
      state.page = 0;
      state.hasMore = true;
      state.status = "idle";
      state.error = null;
    },
    optimisticToggleLike: (state, action: PayloadAction<string>) => {
      const reel = state.reels.find((item) => item.id === action.payload);
      if (reel) {
        reel.likedByMe = !reel.likedByMe;
        reel.likeCount += reel.likedByMe ? 1 : -1;
      }
    },
    optimisticToggleFollow: (state, action: PayloadAction<string>) => {
      state.reels.forEach((reel) => {
        if (reel.creatorId === action.payload) reel.followedByMe = !reel.followedByMe;
      });
    },
    optimisticToggleSubscribe: (state, action: PayloadAction<string>) => {
      state.reels.forEach((reel) => {
        if (reel.creatorId === action.payload) reel.subscribedByMe = !reel.subscribedByMe;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReels.pending, (state, action) => {
        if (action.meta.arg.append) {
          state.isLoadingMore = true;
        } else {
          state.status = "loading";
        }
        state.error = null;
      })
      .addCase(fetchReels.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoadingMore = false;
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
        state.reels = action.payload.append ? [...state.reels, ...action.payload.reels] : action.payload.reels;
      })
      .addCase(fetchReels.rejected, (state, action) => {
        state.status = "failed";
        state.isLoadingMore = false;
        state.error = action.payload ?? "Something went wrong. Please try again.";
      });
  },
});

export const { resetReels, optimisticToggleLike, optimisticToggleFollow, optimisticToggleSubscribe } = reelsSlice.actions;

export const toggleLike = createAsyncThunk<void, string, { rejectValue: string }>(
  "reels/toggleLike",
  async (reelId, { dispatch, rejectWithValue }) => {
    dispatch(optimisticToggleLike(reelId));
    try {
      await reelsService.toggleLike(reelId);
    } catch (error: unknown) {
      dispatch(optimisticToggleLike(reelId));
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

// The real backend has no follow or subscribe-toggle endpoint (relationships
// are subscription-purchase-only), so these stay local-only optimistic UI
// state rather than calling a fake API.
export const toggleFollow = createAsyncThunk<void, string>("reels/toggleFollow", async (creatorId, { dispatch }) => {
  dispatch(optimisticToggleFollow(creatorId));
});

export const toggleSubscribe = createAsyncThunk<void, string>("reels/toggleSubscribe", async (creatorId, { dispatch }) => {
  dispatch(optimisticToggleSubscribe(creatorId));
});

export const reportReel = createAsyncThunk<string, { reelId: string; reason: string }, { rejectValue: string }>(
  "reels/reportReel",
  async ({ reelId, reason }, { rejectWithValue }) => {
    try {
      const response = await reelsService.reportReel(reelId, reason);
      return response.data.message;
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export default reelsSlice.reducer;
