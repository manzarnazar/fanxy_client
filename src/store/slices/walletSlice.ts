import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { walletService } from "@/features/wallet/services/wallet.service";
import { mapCoinPack, mapCoinTransaction } from "@/features/wallet/mapper/wallet.mapper";
import type { CoinPack, CoinTransaction } from "@/features/wallet/types/wallet.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

const MAX_TRANSACTION_PAGES = 10;

interface WalletState {
  coinPacks: CoinPack[];
  transactions: CoinTransaction[];
  truncated: boolean;
  status: RequestStatus;
  error: string | null;
}

const initialState: WalletState = {
  coinPacks: [],
  transactions: [],
  truncated: false,
  status: "idle",
  error: null,
};

export const fetchWalletBundle = createAsyncThunk<
  { coinPacks: CoinPack[]; transactions: CoinTransaction[]; truncated: boolean },
  void,
  { rejectValue: string }
>("wallet/fetchBundle", async (_, { rejectWithValue }) => {
  try {
    const [packsResponse, transactionsResult] = await Promise.all([
      walletService.getCoinPackages(),
      (async () => {
        const rows: CoinTransaction[] = [];
        let page = 1;
        let morePages = true;
        while (morePages && page <= MAX_TRANSACTION_PAGES) {
          const response = await walletService.getCoinTransactions(page);
          rows.push(...response.data.result.map(mapCoinTransaction));
          morePages = response.data.more_page;
          page += 1;
        }
        return { rows, truncated: morePages };
      })(),
    ]);

    return {
      coinPacks: packsResponse.data.result.filter((pack) => pack.status === 1).map(mapCoinPack),
      transactions: transactionsResult.rows,
      truncated: transactionsResult.truncated,
    };
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletBundle.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWalletBundle.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.coinPacks = action.payload.coinPacks;
        state.transactions = action.payload.transactions;
        state.truncated = action.payload.truncated;
      })
      .addCase(fetchWalletBundle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to load your wallet.";
      });
  },
});

export default walletSlice.reducer;
