import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postCommentsService } from "@/features/post-comments/services/post-comments.service";
import { mapApiComment } from "@/features/post-comments/mapper/post-comments.mapper";
import type { PostComment } from "@/features/post-comments/types/post-comments.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface PostCommentsState {
  postId: string | null;
  items: PostComment[];
  status: RequestStatus;
  error: string | null;
}

const initialState: PostCommentsState = {
  postId: null,
  items: [],
  status: "idle",
  error: null,
};

export const fetchPostComments = createAsyncThunk<
  { postId: string; comments: PostComment[] },
  string,
  { rejectValue: string }
>("postComments/fetch", async (postId, { getState, rejectWithValue }) => {
  try {
    const response = await postCommentsService.getComments(postId);
    const state = getState() as { auth: { user: { id: string } | null } };
    const currentUserId = state.auth.user?.id ?? null;
    return { postId, comments: response.data.result.map((row) => mapApiComment(row, currentUserId)) };
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const addPostComment = createAsyncThunk<void, { postId: string; text: string }, { rejectValue: string }>(
  "postComments/add",
  async ({ postId, text }, { dispatch, rejectWithValue }) => {
    try {
      await postCommentsService.postComment(postId, text);
      await dispatch(fetchPostComments(postId));
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const editPostComment = createAsyncThunk<
  void,
  { postId: string; commentId: string; text: string },
  { rejectValue: string }
>("postComments/edit", async ({ postId, commentId, text }, { dispatch, rejectWithValue }) => {
  try {
    await postCommentsService.editComment(postId, commentId, text);
    await dispatch(fetchPostComments(postId));
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const deletePostComment = createAsyncThunk<void, { postId: string; commentId: string }, { rejectValue: string }>(
  "postComments/delete",
  async ({ postId, commentId }, { dispatch, rejectWithValue }) => {
    try {
      await postCommentsService.deleteComment(commentId);
      await dispatch(fetchPostComments(postId));
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const postCommentsSlice = createSlice({
  name: "postComments",
  initialState,
  reducers: {
    resetPostComments: (state) => {
      state.postId = null;
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostComments.pending, (state, action) => {
        state.postId = action.meta.arg;
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPostComments.fulfilled, (state, action) => {
        if (state.postId !== action.payload.postId) return;
        state.status = "succeeded";
        state.items = action.payload.comments;
      })
      .addCase(fetchPostComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Something went wrong. Please try again.";
      });
  },
});

export const { resetPostComments } = postCommentsSlice.actions;
export default postCommentsSlice.reducer;
