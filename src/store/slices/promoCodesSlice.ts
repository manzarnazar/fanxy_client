import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { promoCodesService } from "@/features/promo-codes/services/promo-codes.service";
import { mapApiPromoCode } from "@/features/promo-codes/mapper/promo-codes.mapper";
import type { PromoCode } from "@/features/promo-codes/types/promo-codes.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface PromoCodesState {
  promoCodes: PromoCode[];
  status: RequestStatus;
  error: string | null;
}

const initialState: PromoCodesState = {
  promoCodes: [],
  status: "idle",
  error: null,
};

export const fetchMyPromoCodes = createAsyncThunk<PromoCode[], void, { rejectValue: string }>(
  "promoCodes/fetch",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: { user: { id: string } | null } };
    const userId = state.auth.user?.id;
    if (!userId) return rejectWithValue("Sign in to view promo codes.");

    try {
      const response = await promoCodesService.getMyPromoCodes(userId);
      return response.data.result.map(mapApiPromoCode);
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const promoCodesSlice = createSlice({
  name: "promoCodes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyPromoCodes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyPromoCodes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.promoCodes = action.payload;
      })
      .addCase(fetchMyPromoCodes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to load promo codes.";
      });
  },
});

export default promoCodesSlice.reducer;
