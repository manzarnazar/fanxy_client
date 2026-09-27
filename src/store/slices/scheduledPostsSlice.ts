import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { scheduledPostsService } from "@/features/scheduled-posts/services/scheduled-posts.service";
import { mapApiScheduledPost } from "@/features/scheduled-posts/mapper/scheduled-posts.mapper";
import { MAX_SCHEDULED_PAGES } from "@/features/scheduled-posts/constants/scheduled-posts";
import type { ScheduledPost } from "@/features/scheduled-posts/types/scheduled-posts.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface ScheduledPostsState {
  posts: ScheduledPost[];
  status: RequestStatus;
  error: string | null;
  deletingId: string | null;
}

const initialState: ScheduledPostsState = {
  posts: [],
  status: "idle",
  error: null,
  deletingId: null,
};

export const fetchScheduledPosts = createAsyncThunk<ScheduledPost[], void, { rejectValue: string }>(
  "scheduledPosts/fetch",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: { user: { id: string } | null } };
    const userId = state.auth.user?.id;
    if (!userId) return rejectWithValue("Sign in to view scheduled posts.");

    try {
      const now = new Date();
      const posts: ScheduledPost[] = [];
      let page = 1;
      let morePages = true;
      while (morePages && page <= MAX_SCHEDULED_PAGES) {
        const response = await scheduledPostsService.getMyPosts(userId, page);
        for (const row of response.data.result) {
          const mapped = mapApiScheduledPost(row, now);
          if (mapped) posts.push(mapped);
        }
        morePages = response.data.more_page;
        page += 1;
      }
      return posts.sort((a, b) => a.scheduledAtMs - b.scheduledAtMs);
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const deleteScheduledPost = createAsyncThunk<string, string, { rejectValue: string }>(
  "scheduledPosts/delete",
  async (postId, { rejectWithValue }) => {
    try {
      await scheduledPostsService.deletePost(postId);
      return postId;
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const scheduledPostsSlice = createSlice({
  name: "scheduledPosts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchScheduledPosts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchScheduledPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchScheduledPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to load scheduled posts.";
      })
      .addCase(deleteScheduledPost.pending, (state, action) => {
        state.deletingId = action.meta.arg;
      })
      .addCase(deleteScheduledPost.fulfilled, (state, action) => {
        state.deletingId = null;
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      })
      .addCase(deleteScheduledPost.rejected, (state) => {
        state.deletingId = null;
      });
  },
});

export default scheduledPostsSlice.reducer;
