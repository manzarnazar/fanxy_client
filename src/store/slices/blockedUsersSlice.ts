import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { blockedUsersService } from "@/features/blocked-users/services/blocked-users.service";
import { mapApiBlockedUser } from "@/features/blocked-users/mapper/blocked-users.mapper";
import type { BlockedUser } from "@/features/blocked-users/types/blocked-users.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface BlockedUsersState {
  items: BlockedUser[];
  totalRows: number;
  page: number;
  hasMore: boolean;
  status: RequestStatus;
  error: string | null;
  unblockingId: string | null;
}

const initialState: BlockedUsersState = {
  items: [],
  totalRows: 0,
  page: 0,
  hasMore: true,
  status: "idle",
  error: null,
  unblockingId: null,
};

export const fetchBlockedUsers = createAsyncThunk<
  { items: BlockedUser[]; totalRows: number; page: number; hasMore: boolean; append: boolean },
  { page: number; append: boolean },
  { rejectValue: string }
>("blockedUsers/fetch", async ({ page, append }, { rejectWithValue }) => {
  try {
    const response = await blockedUsersService.getBlockList(page);
    return {
      items: (response.data.result ?? []).map(mapApiBlockedUser),
      totalRows: response.data.total_rows ?? 0,
      page: response.data.current_page ?? page,
      hasMore: Boolean(response.data.more_page),
      append,
    };
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const unblockUser = createAsyncThunk<string, string, { rejectValue: string }>(
  "blockedUsers/unblock",
  async (blockUserId, { rejectWithValue }) => {
    try {
      await blockedUsersService.toggleBlock(blockUserId);
      return blockUserId;
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const blockedUsersSlice = createSlice({
  name: "blockedUsers",
  initialState,
  reducers: {
    resetBlockedUsers: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlockedUsers.pending, (state, action) => {
        state.status = action.meta.arg.append ? state.status : "loading";
        state.error = null;
      })
      .addCase(fetchBlockedUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.totalRows = action.payload.totalRows;
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
        state.items = action.payload.append ? [...state.items, ...action.payload.items] : action.payload.items;
      })
      .addCase(fetchBlockedUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Something went wrong. Please try again.";
      })
      .addCase(unblockUser.pending, (state, action) => {
        state.unblockingId = action.meta.arg;
      })
      .addCase(unblockUser.fulfilled, (state, action) => {
        state.unblockingId = null;
        state.items = state.items.filter((item) => item.blockUserId !== action.payload);
        state.totalRows = Math.max(0, state.totalRows - 1);
      })
      .addCase(unblockUser.rejected, (state) => {
        state.unblockingId = null;
      });
  },
});

export const { resetBlockedUsers } = blockedUsersSlice.actions;
export default blockedUsersSlice.reducer;
