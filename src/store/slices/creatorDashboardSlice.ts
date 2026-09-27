import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { creatorDashboardService } from "@/features/creator-dashboard/services/creator-dashboard.service";
import {
  mapApiCoinTransaction,
  mapApiContentPerformance,
  mapApiCreatorPackage,
  mapApiEarning,
  mapApiScheduledPost,
  mapApiWithdrawal,
} from "@/features/creator-dashboard/mapper/creator-dashboard.mapper";
import type { CreatorDashboardBundle, WithdrawalRequestInput } from "@/features/creator-dashboard/types/creator-dashboard.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface CreatorDashboardState {
  bundle: CreatorDashboardBundle | null;
  status: RequestStatus;
  error: string | null;
  submittingWithdrawal: boolean;
}

const initialState: CreatorDashboardState = {
  bundle: null,
  status: "idle",
  error: null,
  submittingWithdrawal: false,
};

export const fetchCreatorDashboard = createAsyncThunk<CreatorDashboardBundle, string, { rejectValue: string }>(
  "creatorDashboard/fetch",
  async (creatorId, { rejectWithValue }) => {
    try {
      const [profileResponse, packagesResponse, postsResponse, earningsResponse, coinTransactionsResponse, withdrawalsResponse] =
        await Promise.all([
          creatorDashboardService.getProfile(),
          creatorDashboardService.getPackages(creatorId, 1),
          creatorDashboardService.getMyPosts(creatorId, 1),
          creatorDashboardService.getEarnings(1),
          creatorDashboardService.getCoinTransactions(1),
          creatorDashboardService.getWithdrawals(1),
        ]);

      const profile = profileResponse.data.result[0];
      const posts = postsResponse.data.result;

      return {
        wallet: {
          walletBalance: profile?.wallet_amount ?? 0,
          coinBalance: profile?.coin_wallet ?? 0,
          earnedCoins: profile?.earned_coin ?? 0,
        },
        packages: packagesResponse.data.result.map(mapApiCreatorPackage),
        contentPerformance: posts.map(mapApiContentPerformance),
        scheduledPosts: posts.filter((post) => post.is_schedule === 1).map(mapApiScheduledPost),
        earnings: earningsResponse.data.result.map(mapApiEarning),
        coinTransactions: coinTransactionsResponse.data.result.map(mapApiCoinTransaction),
        withdrawals: withdrawalsResponse.data.result.map(mapApiWithdrawal),
      } satisfies CreatorDashboardBundle;
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const requestWithdrawal = createAsyncThunk<void, WithdrawalRequestInput, { rejectValue: string }>(
  "creatorDashboard/requestWithdrawal",
  async (input, { dispatch, getState, rejectWithValue }) => {
    try {
      await creatorDashboardService.requestWithdrawal(input);
      const state = getState() as { auth: { user: { id: string } | null } };
      const creatorId = state.auth.user?.id;
      if (creatorId) await dispatch(fetchCreatorDashboard(creatorId));
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const creatorDashboardSlice = createSlice({
  name: "creatorDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreatorDashboard.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCreatorDashboard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bundle = action.payload;
      })
      .addCase(fetchCreatorDashboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Something went wrong. Please try again.";
      })
      .addCase(requestWithdrawal.pending, (state) => {
        state.submittingWithdrawal = true;
      })
      .addCase(requestWithdrawal.fulfilled, (state) => {
        state.submittingWithdrawal = false;
      })
      .addCase(requestWithdrawal.rejected, (state) => {
        state.submittingWithdrawal = false;
      });
  },
});

export default creatorDashboardSlice.reducer;
