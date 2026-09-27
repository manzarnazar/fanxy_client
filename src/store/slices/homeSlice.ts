import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { homeService } from "@/features/home/services/home.service";
import { mapApiLiveUser, mapApiPost, mapApiStoryGroup } from "@/features/home/mapper/home.mapper";
import type { LiveCreator, Post, StoryGroup } from "@/features/home/types/home.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface FeedState {
  posts: Post[];
  page: number;
  hasMore: boolean;
  status: RequestStatus;
  isLoadingMore: boolean;
  error: string | null;
}

interface HomeState {
  feed: FeedState;
  stories: StoryGroup[];
  storiesStatus: RequestStatus;
  liveUsers: LiveCreator[];
  liveUsersStatus: RequestStatus;
}

const initialFeedState: FeedState = {
  posts: [],
  page: 0,
  hasMore: true,
  status: "idle",
  isLoadingMore: false,
  error: null,
};

const initialState: HomeState = {
  feed: initialFeedState,
  stories: [],
  storiesStatus: "idle",
  liveUsers: [],
  liveUsersStatus: "idle",
};

export const fetchFeed = createAsyncThunk<
  { posts: Post[]; page: number; hasMore: boolean; append: boolean },
  { page: number; append: boolean },
  { rejectValue: string }
>("home/fetchFeed", async ({ page, append }, { rejectWithValue }) => {
  try {
    const response = await homeService.getFeed(page);
    return {
      posts: response.data.result.map(mapApiPost),
      page: response.data.current_page,
      hasMore: response.data.more_page,
      append,
    };
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const fetchStories = createAsyncThunk<StoryGroup[], void, { rejectValue: string }>(
  "home/fetchStories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await homeService.getStories(1);
      // The API includes creators with zero stories — drop them.
      return response.data.result.map(mapApiStoryGroup).filter((group) => group.items.length > 0);
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const fetchLiveUsers = createAsyncThunk<LiveCreator[], void, { rejectValue: string }>(
  "home/fetchLiveUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await homeService.getLiveUsers(1);
      return response.data.result.map(mapApiLiveUser);
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    resetFeed: (state) => {
      state.feed = initialFeedState;
    },
    optimisticToggleLike: (state, action: PayloadAction<string>) => {
      const post = state.feed.posts.find((item) => item.id === action.payload);
      if (post) {
        post.likedByMe = !post.likedByMe;
        post.likeCount += post.likedByMe ? 1 : -1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state, action) => {
        if (action.meta.arg.append) {
          state.feed.isLoadingMore = true;
        } else {
          state.feed.status = "loading";
        }
        state.feed.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.feed.status = "succeeded";
        state.feed.isLoadingMore = false;
        state.feed.page = action.payload.page;
        state.feed.hasMore = action.payload.hasMore;
        state.feed.posts = action.payload.append
          ? [...state.feed.posts, ...action.payload.posts]
          : action.payload.posts;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.feed.status = "failed";
        state.feed.isLoadingMore = false;
        state.feed.error = action.payload ?? "Something went wrong. Please try again.";
      })
      .addCase(fetchStories.pending, (state) => {
        state.storiesStatus = "loading";
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.storiesStatus = "succeeded";
        state.stories = action.payload;
      })
      .addCase(fetchStories.rejected, (state) => {
        state.storiesStatus = "failed";
      })
      .addCase(fetchLiveUsers.pending, (state) => {
        state.liveUsersStatus = "loading";
      })
      .addCase(fetchLiveUsers.fulfilled, (state, action) => {
        state.liveUsersStatus = "succeeded";
        state.liveUsers = action.payload;
      })
      .addCase(fetchLiveUsers.rejected, (state) => {
        state.liveUsersStatus = "failed";
      });
  },
});

export const { resetFeed, optimisticToggleLike } = homeSlice.actions;

export const toggleLike = createAsyncThunk<void, string, { rejectValue: string }>(
  "home/toggleLike",
  async (postId, { dispatch, rejectWithValue }) => {
    dispatch(optimisticToggleLike(postId));
    try {
      await homeService.toggleLike(postId);
    } catch (error: unknown) {
      dispatch(optimisticToggleLike(postId));
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export default homeSlice.reducer;
