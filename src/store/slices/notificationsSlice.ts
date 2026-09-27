import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { notificationsService } from "@/features/notifications/services/notifications.service";
import { mapApiNotification } from "@/features/notifications/mapper/notifications.mapper";
import type { NotificationItem } from "@/features/notifications/types/notifications.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface NotificationsState {
  items: NotificationItem[];
  page: number;
  hasMore: boolean;
  status: RequestStatus;
  isLoadingMore: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  items: [],
  page: 0,
  hasMore: true,
  status: "idle",
  isLoadingMore: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk<
  { items: NotificationItem[]; page: number; hasMore: boolean; append: boolean },
  { page: number; append: boolean },
  { rejectValue: string }
>("notifications/fetchNotifications", async ({ page, append }, { rejectWithValue }) => {
  try {
    const response = await notificationsService.getNotifications(page);
    return {
      items: response.data.result.map((notification) => mapApiNotification(notification)),
      page: response.data.current_page,
      hasMore: response.data.more_page,
      append,
    };
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    resetNotifications: (state) => {
      state.items = [];
      state.page = 0;
      state.hasMore = true;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state, action) => {
        if (action.meta.arg.append) {
          state.isLoadingMore = true;
        } else {
          state.status = "loading";
        }
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoadingMore = false;
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
        state.items = action.payload.append ? [...state.items, ...action.payload.items] : action.payload.items;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.isLoadingMore = false;
        state.error = action.payload ?? "Something went wrong. Please try again.";
      });
  },
});

export const { resetNotifications } = notificationsSlice.actions;

export const markNotificationRead = createAsyncThunk<void, string, { rejectValue: string }>(
  "notifications/markRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      await notificationsService.markRead(notificationId);
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export default notificationsSlice.reducer;
