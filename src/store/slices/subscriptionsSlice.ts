import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { subscriptionsService } from "@/features/subscriptions/services/subscriptions.service";
import { mapApiSubscription } from "@/features/subscriptions/mapper/subscriptions.mapper";
import type { Subscription } from "@/features/subscriptions/types/subscriptions.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

const MAX_SUBSCRIPTION_PAGES = 10;

interface SubscriptionsState {
  subscriptions: Subscription[];
  truncated: boolean;
  status: RequestStatus;
  error: string | null;
}

const initialState: SubscriptionsState = {
  subscriptions: [],
  truncated: false,
  status: "idle",
  error: null,
};

export const fetchMySubscriptions = createAsyncThunk<
  { rows: Subscription[]; truncated: boolean },
  void,
  { rejectValue: string }
>("subscriptions/fetch", async (_, { rejectWithValue }) => {
  try {
    const now = new Date();
    const rows: Subscription[] = [];
    let page = 1;
    let morePages = true;
    while (morePages && page <= MAX_SUBSCRIPTION_PAGES) {
      const response = await subscriptionsService.getMySubscriptions(page);
      rows.push(...response.data.result.map((row) => mapApiSubscription(row, now)));
      morePages = response.data.more_page;
      page += 1;
    }
    return { rows, truncated: morePages };
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMySubscriptions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMySubscriptions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subscriptions = action.payload.rows;
        state.truncated = action.payload.truncated;
      })
      .addCase(fetchMySubscriptions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to load your subscriptions.";
      });
  },
});

export default subscriptionsSlice.reducer;
