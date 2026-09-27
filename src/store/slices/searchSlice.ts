import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { searchService } from "@/features/search/services/search.service";
import { mapApiSearchUser } from "@/features/search/mapper/search.mapper";
import type { SearchResult } from "@/features/search/types/search.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface SearchState {
  query: string;
  results: SearchResult[];
  page: number;
  hasMore: boolean;
  status: RequestStatus;
  isLoadingMore: boolean;
  error: string | null;
}

const initialState: SearchState = {
  query: "",
  results: [],
  page: 0,
  hasMore: false,
  status: "idle",
  isLoadingMore: false,
  error: null,
};

export const runSearch = createAsyncThunk<
  { results: SearchResult[]; page: number; hasMore: boolean; append: boolean; query: string },
  { query: string; page: number; append: boolean },
  { rejectValue: string }
>("search/run", async ({ query, page, append }, { rejectWithValue }) => {
  try {
    const response = await searchService.searchUsers(query, page);
    return {
      results: response.data.result.map(mapApiSearchUser),
      page: response.data.current_page,
      hasMore: response.data.more_page,
      append,
      query,
    };
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    searchCleared: () => initialState,
    searchQueryChanged: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runSearch.pending, (state, action) => {
        if (action.meta.arg.append) {
          state.isLoadingMore = true;
        } else {
          state.status = "loading";
          state.error = null;
        }
      })
      .addCase(runSearch.fulfilled, (state, action) => {
        // Ignore stale responses from a superseded query.
        if (action.payload.query !== state.query) return;
        state.status = "succeeded";
        state.isLoadingMore = false;
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
        state.results = action.payload.append ? [...state.results, ...action.payload.results] : action.payload.results;
      })
      .addCase(runSearch.rejected, (state, action) => {
        state.isLoadingMore = false;
        if (action.meta.arg.append) return;
        state.status = "failed";
        state.error = action.payload ?? "Search failed. Please try again.";
      });
  },
});

export const { searchCleared, searchQueryChanged } = searchSlice.actions;
export default searchSlice.reducer;
