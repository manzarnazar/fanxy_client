import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { withdrawalsService } from "@/features/withdrawals/services/withdrawals.service";
import { mapApiWithdrawal } from "@/features/withdrawals/mapper/withdrawals.mapper";
import type { Withdrawal, WithdrawalRequestInput } from "@/features/withdrawals/types/withdrawals.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

const MAX_WITHDRAWAL_PAGES = 10;

interface WithdrawalsState {
  withdrawals: Withdrawal[];
  truncated: boolean;
  status: RequestStatus;
  error: string | null;
  submitting: boolean;
}

const initialState: WithdrawalsState = {
  withdrawals: [],
  truncated: false,
  status: "idle",
  error: null,
  submitting: false,
};

export const fetchWithdrawals = createAsyncThunk<
  { rows: Withdrawal[]; truncated: boolean },
  void,
  { rejectValue: string }
>("withdrawals/fetch", async (_, { rejectWithValue }) => {
  try {
    const rows: Withdrawal[] = [];
    let page = 1;
    let morePages = true;
    while (morePages && page <= MAX_WITHDRAWAL_PAGES) {
      const response = await withdrawalsService.getWithdrawals(page);
      rows.push(...response.data.result.map(mapApiWithdrawal));
      morePages = response.data.more_page;
      page += 1;
    }
    return { rows, truncated: morePages };
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const submitWithdrawalRequest = createAsyncThunk<void, WithdrawalRequestInput, { rejectValue: string }>(
  "withdrawals/request",
  async (input, { dispatch, rejectWithValue }) => {
    try {
      await withdrawalsService.requestWithdrawal(input);
      // The list is the only confirmation surface — refresh it so the new
      // request shows up immediately.
      void dispatch(fetchWithdrawals());
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const withdrawalsSlice = createSlice({
  name: "withdrawals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWithdrawals.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWithdrawals.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.withdrawals = action.payload.rows;
        state.truncated = action.payload.truncated;
      })
      .addCase(fetchWithdrawals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to load withdrawals.";
      })
      .addCase(submitWithdrawalRequest.pending, (state) => {
        state.submitting = true;
      })
      .addCase(submitWithdrawalRequest.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(submitWithdrawalRequest.rejected, (state) => {
        state.submitting = false;
      });
  },
});

export default withdrawalsSlice.reducer;
