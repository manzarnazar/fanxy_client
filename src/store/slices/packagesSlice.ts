import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { packagesService } from "@/features/packages/services/packages.service";
import { mapApiPackage } from "@/features/packages/mapper/packages.mapper";
import type { CreatorPackage, PackageFormInput } from "@/features/packages/types/packages.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface PackagesState {
  packages: CreatorPackage[];
  page: number;
  hasMore: boolean;
  status: RequestStatus;
  isLoadingMore: boolean;
  error: string | null;
  saving: boolean;
  deletingId: string | null;
}

const initialState: PackagesState = {
  packages: [],
  page: 0,
  hasMore: true,
  status: "idle",
  isLoadingMore: false,
  error: null,
  saving: false,
  deletingId: null,
};

export const fetchPackages = createAsyncThunk<
  { packages: CreatorPackage[]; page: number; hasMore: boolean; append: boolean },
  { userId: string; page: number; append: boolean },
  { rejectValue: string }
>("packages/fetch", async ({ userId, page, append }, { rejectWithValue }) => {
  try {
    const response = await packagesService.getPackages(userId, page);
    return {
      packages: response.data.result.map((row) => mapApiPackage(row)),
      page: response.data.current_page,
      hasMore: response.data.more_page,
      append,
    };
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const createPackage = createAsyncThunk<void, { userId: string; input: PackageFormInput }, { rejectValue: string }>(
  "packages/create",
  async ({ userId, input }, { dispatch, rejectWithValue }) => {
    try {
      await packagesService.createPackage(input);
      await dispatch(fetchPackages({ userId, page: 1, append: false }));
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const editPackage = createAsyncThunk<
  void,
  { userId: string; packageId: string; input: PackageFormInput },
  { rejectValue: string }
>("packages/edit", async ({ userId, packageId, input }, { dispatch, rejectWithValue }) => {
  try {
    await packagesService.editPackage(packageId, input);
    await dispatch(fetchPackages({ userId, page: 1, append: false }));
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const deletePackage = createAsyncThunk<string, { packageId: string }, { rejectValue: string }>(
  "packages/delete",
  async ({ packageId }, { rejectWithValue }) => {
    try {
      await packagesService.deletePackage(packageId);
      return packageId;
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const packagesSlice = createSlice({
  name: "packages",
  initialState,
  reducers: {
    resetPackages: (state) => {
      state.packages = [];
      state.page = 0;
      state.hasMore = true;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.pending, (state, action) => {
        if (action.meta.arg.append) state.isLoadingMore = true;
        else state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoadingMore = false;
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
        state.packages = action.payload.append ? [...state.packages, ...action.payload.packages] : action.payload.packages;
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.status = "failed";
        state.isLoadingMore = false;
        state.error = action.payload ?? "Something went wrong. Please try again.";
      })
      .addCase(createPackage.pending, (state) => {
        state.saving = true;
      })
      .addCase(createPackage.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(createPackage.rejected, (state) => {
        state.saving = false;
      })
      .addCase(editPackage.pending, (state) => {
        state.saving = true;
      })
      .addCase(editPackage.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(editPackage.rejected, (state) => {
        state.saving = false;
      })
      .addCase(deletePackage.pending, (state, action) => {
        state.deletingId = action.meta.arg.packageId;
      })
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.deletingId = null;
        state.packages = state.packages.filter((pkg) => pkg.id !== action.payload);
      })
      .addCase(deletePackage.rejected, (state) => {
        state.deletingId = null;
      });
  },
});

export const { resetPackages } = packagesSlice.actions;
export default packagesSlice.reducer;
