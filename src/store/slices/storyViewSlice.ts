import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storyViewService } from "@/features/story-view/services/story-view.service";
import { buildStoryBundle, mapStoryGroupSummaries } from "@/features/story-view/mapper/story-view.mapper";
import type { StoryBundle, StoryGroupSummary } from "@/features/story-view/types/story-view.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface StoryViewState {
  username: string | null;
  bundle: StoryBundle | null;
  status: RequestStatus;
  error: string | null;
  groups: StoryGroupSummary[];
  groupsStatus: RequestStatus;
  groupsError: string | null;
}

const initialState: StoryViewState = {
  username: null,
  bundle: null,
  status: "idle",
  error: null,
  groups: [],
  groupsStatus: "idle",
  groupsError: null,
};

// The real get_story endpoint returns every creator's story group in one
// list (no per-username fetch), so loading a single username's stories
// means fetching the whole list and finding the matching group client-side.
export const fetchStoryBundle = createAsyncThunk<{ username: string; bundle: StoryBundle | null }, string, { rejectValue: string }>(
  "storyView/fetchBundle",
  async (username, { rejectWithValue }) => {
    try {
      const response = await storyViewService.getStories(1);
      return { username, bundle: buildStoryBundle(response.data.result, username) };
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

// Feeds the /stories index — the same get_story list, mapped to creator
// summaries (creators with zero renderable stories are dropped).
export const fetchStoryGroups = createAsyncThunk<StoryGroupSummary[], void, { rejectValue: string }>(
  "storyView/fetchGroups",
  async (_, { rejectWithValue }) => {
    try {
      const response = await storyViewService.getStories(1);
      return mapStoryGroupSummaries(response.data.result);
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const storyViewSlice = createSlice({
  name: "storyView",
  initialState,
  reducers: {
    resetStoryView: (state) => {
      state.username = null;
      state.bundle = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoryBundle.pending, (state, action) => {
        state.username = action.meta.arg;
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStoryBundle.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bundle = action.payload.bundle;
      })
      .addCase(fetchStoryBundle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Something went wrong. Please try again.";
      })
      .addCase(fetchStoryGroups.pending, (state) => {
        state.groupsStatus = "loading";
        state.groupsError = null;
      })
      .addCase(fetchStoryGroups.fulfilled, (state, action) => {
        state.groupsStatus = "succeeded";
        state.groups = action.payload;
      })
      .addCase(fetchStoryGroups.rejected, (state, action) => {
        state.groupsStatus = "failed";
        state.groupsError = action.payload ?? "Unable to load stories.";
      });
  },
});

export const { resetStoryView } = storyViewSlice.actions;

export const recordStoryView = createAsyncThunk<void, string, { rejectValue: string }>(
  "storyView/recordView",
  async (storyId, { rejectWithValue }) => {
    try {
      await storyViewService.recordView(storyId);
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const reportStory = createAsyncThunk<string, { storyId: string; reportUserId: string; reason: string }, { rejectValue: string }>(
  "storyView/reportStory",
  async ({ storyId, reportUserId, reason }, { rejectWithValue }) => {
    try {
      const response = await storyViewService.reportStory(storyId, reportUserId, reason);
      return response.data.message;
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const deleteStory = createAsyncThunk<void, string, { rejectValue: string }>(
  "storyView/deleteStory",
  async (storyId, { rejectWithValue }) => {
    try {
      await storyViewService.deleteStory(storyId);
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export default storyViewSlice.reducer;
