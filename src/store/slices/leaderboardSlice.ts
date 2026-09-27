import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { leaderboardService } from "@/features/leaderboard/services/leaderboard.service";
import { mapApiTopCreator, mapApiTopFan } from "@/features/leaderboard/mapper/leaderboard.mapper";
import type { LeaderboardEntry, LeaderboardMode } from "@/features/leaderboard/types/leaderboard.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface LeaderboardState {
  /** Cache key: "creators" or "fans:<creatorId>". */
  key: string | null;
  entries: LeaderboardEntry[];
  status: RequestStatus;
  error: string | null;
}

const initialState: LeaderboardState = { key: null, entries: [], status: "idle", error: null };

export const fetchLeaderboard = createAsyncThunk<
  { key: string; entries: LeaderboardEntry[] },
  { mode: LeaderboardMode; creatorId?: string },
  { rejectValue: string }
>("leaderboard/fetch", async ({ mode, creatorId }, { rejectWithValue }) => {
  try {
    if (mode === "fans") {
      if (!creatorId) return rejectWithValue("Missing creator for the fans leaderboard.");
      const response = await leaderboardService.getTopFans(creatorId);
      return { key: `fans:${creatorId}`, entries: (response.data.result ?? []).map(mapApiTopFan) };
    }
    const response = await leaderboardService.getTopCreators();
    return { key: "creators", entries: (response.data.result ?? []).map(mapApiTopCreator) };
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.key = action.payload.key;
        state.entries = action.payload.entries;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Something went wrong. Please try again.";
      });
  },
});

export default leaderboardSlice.reducer;
