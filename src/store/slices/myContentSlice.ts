import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { myContentService, type PostContentPayload } from "@/features/my-content/services/my-content.service";
import { mapPostToContentItem, mapStoryToContentItem } from "@/features/my-content/mapper/my-content.mapper";
import type { ContentItem, UploadPostInput } from "@/features/my-content/types/my-content.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";
import { captureVideoThumbnail } from "@/lib/utils/video-thumbnail";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface ContentListState {
  items: ContentItem[];
  page: number;
  hasMore: boolean;
  totalCount: number;
  status: RequestStatus;
  isLoadingMore: boolean;
  error: string | null;
}

interface MyContentState {
  posts: ContentListState;
  stories: ContentListState;
  uploadStatus: RequestStatus;
}

function createInitialListState(): ContentListState {
  return { items: [], page: 0, hasMore: true, totalCount: 0, status: "idle", isLoadingMore: false, error: null };
}

const initialState: MyContentState = {
  posts: createInitialListState(),
  stories: createInitialListState(),
  uploadStatus: "idle",
};

export const fetchMyPosts = createAsyncThunk<
  { items: ContentItem[]; page: number; hasMore: boolean; totalCount: number; append: boolean },
  { userId: string; page: number; append: boolean },
  { rejectValue: string }
>("myContent/fetchPosts", async ({ userId, page, append }, { rejectWithValue }) => {
  try {
    const response = await myContentService.getUserPosts(userId, page);
    return {
      items: response.data.result.map((post) => mapPostToContentItem(post)),
      page: response.data.current_page,
      hasMore: response.data.more_page,
      totalCount: response.data.total_rows,
      append,
    };
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const fetchMyStories = createAsyncThunk<
  { items: ContentItem[]; page: number; hasMore: boolean; totalCount: number; append: boolean },
  { userId: string; page: number; append: boolean },
  { rejectValue: string }
>("myContent/fetchStories", async ({ userId, page, append }, { rejectWithValue }) => {
  try {
    const response = await myContentService.getUserStories(userId, page);
    const items = response.data.result.flatMap((group) => group.story.map((story) => mapStoryToContentItem(story)));
    return {
      items,
      page: response.data.current_page,
      hasMore: response.data.more_page,
      totalCount: response.data.total_rows,
      append,
    };
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const myContentSlice = createSlice({
  name: "myContent",
  initialState,
  reducers: {
    resetMyPosts: (state) => {
      state.posts = createInitialListState();
    },
    resetMyStories: (state) => {
      state.stories = createInitialListState();
    },
    removePostItem: (state, action: PayloadAction<string>) => {
      state.posts.items = state.posts.items.filter((item) => item.id !== action.payload);
    },
    removeStoryItem: (state, action: PayloadAction<string>) => {
      state.stories.items = state.stories.items.filter((item) => item.id !== action.payload);
    },
    resetUploadStatus: (state) => {
      state.uploadStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyPosts.pending, (state, action) => {
        if (action.meta.arg.append) state.posts.isLoadingMore = true;
        else state.posts.status = "loading";
        state.posts.error = null;
      })
      .addCase(fetchMyPosts.fulfilled, (state, action) => {
        state.posts.status = "succeeded";
        state.posts.isLoadingMore = false;
        state.posts.page = action.payload.page;
        state.posts.hasMore = action.payload.hasMore;
        state.posts.totalCount = action.payload.totalCount;
        state.posts.items = action.payload.append ? [...state.posts.items, ...action.payload.items] : action.payload.items;
      })
      .addCase(fetchMyPosts.rejected, (state, action) => {
        state.posts.status = "failed";
        state.posts.isLoadingMore = false;
        state.posts.error = action.payload ?? "Something went wrong. Please try again.";
      })
      .addCase(fetchMyStories.pending, (state, action) => {
        if (action.meta.arg.append) state.stories.isLoadingMore = true;
        else state.stories.status = "loading";
        state.stories.error = null;
      })
      .addCase(fetchMyStories.fulfilled, (state, action) => {
        state.stories.status = "succeeded";
        state.stories.isLoadingMore = false;
        state.stories.page = action.payload.page;
        state.stories.hasMore = action.payload.hasMore;
        state.stories.totalCount = action.payload.totalCount;
        state.stories.items = action.payload.append ? [...state.stories.items, ...action.payload.items] : action.payload.items;
      })
      .addCase(fetchMyStories.rejected, (state, action) => {
        state.stories.status = "failed";
        state.stories.isLoadingMore = false;
        state.stories.error = action.payload ?? "Something went wrong. Please try again.";
      })
      .addCase(uploadPost.pending, (state) => {
        state.uploadStatus = "loading";
      })
      .addCase(uploadPost.fulfilled, (state) => {
        state.uploadStatus = "succeeded";
      })
      .addCase(uploadPost.rejected, (state) => {
        state.uploadStatus = "failed";
      });
  },
});

export const { resetMyPosts, resetMyStories, removePostItem, removeStoryItem, resetUploadStatus } = myContentSlice.actions;

export const deleteMyPost = createAsyncThunk<void, string, { rejectValue: string }>(
  "myContent/deletePost",
  async (postId, { dispatch, rejectWithValue }) => {
    dispatch(removePostItem(postId));
    try {
      await myContentService.deletePost(postId);
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const deleteMyStory = createAsyncThunk<void, string, { rejectValue: string }>(
  "myContent/deleteStory",
  async (storyId, { dispatch, rejectWithValue }) => {
    dispatch(removeStoryItem(storyId));
    try {
      await myContentService.deleteStory(storyId);
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const uploadStory = createAsyncThunk<
  void,
  { description: string; mediaType: "image" | "video"; file: File },
  { rejectValue: string }
>("myContent/uploadStory", async ({ description, mediaType, file }, { rejectWithValue }) => {
  try {
    await myContentService.uploadStory(description, mediaType, file);
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const uploadPost = createAsyncThunk<void, { userId: string; input: UploadPostInput }, { rejectValue: string }>(
  "myContent/uploadPost",
  async ({ userId, input }, { dispatch, rejectWithValue }) => {
    try {
      // Each file goes through image_upload first; upload_post then receives
      // ALL of them in one post_content array (multi-content posts). The
      // Flutter app forwards the file NAMES (not URLs) into post_content.
      const contents: PostContentPayload[] = [];
      for (const file of input.mediaFiles) {
        const isVideo = file.type.startsWith("video/");
        // Videos must ship with a thumbnail image — capture one from the file.
        const coverFile = isVideo ? await captureVideoThumbnail(file).catch(() => null) : null;
        const uploadResponse = await myContentService.uploadImage(file, isVideo ? "video" : "image", coverFile);
        const uploaded = uploadResponse.data.result;
        contents.push({
          content_type: isVideo ? 2 : 1,
          image: uploaded?.image_name || "",
          video: uploaded?.video_name || "",
        });
      }
      if (contents.length === 0) return rejectWithValue("Add media before publishing.");

      await myContentService.uploadPost(input, contents);
      await dispatch(fetchMyPosts({ userId, page: 1, append: false }));
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export default myContentSlice.reducer;
