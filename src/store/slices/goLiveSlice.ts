import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { goLiveService } from "@/features/go-live/services/go-live.service";
import { mapLiveGift, mapZegoConfig } from "@/features/go-live/mapper/go-live.mapper";
import type { GoLivePhase, LiveGift, LiveSummary, ZegoLiveConfig } from "@/features/go-live/types/go-live.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface GoLiveState {
  phase: GoLivePhase;
  zegoConfig: ZegoLiveConfig | null;
  gifts: LiveGift[];
  initStatus: RequestStatus;
  error: string | null;
  starting: boolean;
  ending: boolean;
  /** Epoch ms when add_live_user succeeded — drives the duration timer. */
  startedAt: number | null;
  summary: LiveSummary | null;
}

const initialState: GoLiveState = {
  phase: "setup",
  zegoConfig: null,
  gifts: [],
  initStatus: "idle",
  error: null,
  starting: false,
  ending: false,
  startedAt: null,
  summary: null,
};

export const fetchGoLiveBundle = createAsyncThunk<
  { zegoConfig: ZegoLiveConfig | null; gifts: LiveGift[] },
  void,
  { rejectValue: string }
>("goLive/fetchBundle", async (_, { rejectWithValue }) => {
  try {
    const [settingsResponse, giftsResponse] = await Promise.all([
      goLiveService.getGeneralSettings(),
      goLiveService.getGifts().catch(() => null),
    ]);
    return {
      zegoConfig: mapZegoConfig(settingsResponse.data.result),
      gifts: giftsResponse ? giftsResponse.data.result.map(mapLiveGift) : [],
    };
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const startLiveStream = createAsyncThunk<number, { roomId: string }, { rejectValue: string }>(
  "goLive/start",
  async ({ roomId }, { rejectWithValue }) => {
    try {
      await goLiveService.startLive(roomId);
      return Date.now();
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const endLiveStream = createAsyncThunk<number, void, { rejectValue: string }>(
  "goLive/end",
  async (_, { rejectWithValue }) => {
    try {
      await goLiveService.endLive();
      return Date.now();
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const goLiveSlice = createSlice({
  name: "goLive",
  initialState,
  reducers: {
    goLiveReset: () => initialState,
    goLivePhaseChanged: (state, action: PayloadAction<GoLivePhase>) => {
      state.phase = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoLiveBundle.pending, (state) => {
        state.initStatus = "loading";
        state.error = null;
      })
      .addCase(fetchGoLiveBundle.fulfilled, (state, action) => {
        state.initStatus = "succeeded";
        state.zegoConfig = action.payload.zegoConfig;
        state.gifts = action.payload.gifts;
      })
      .addCase(fetchGoLiveBundle.rejected, (state, action) => {
        state.initStatus = "failed";
        state.error = action.payload ?? "Unable to load live streaming settings.";
      })
      .addCase(startLiveStream.pending, (state) => {
        state.starting = true;
      })
      .addCase(startLiveStream.fulfilled, (state, action) => {
        state.starting = false;
        state.startedAt = action.payload;
        state.phase = "live";
        state.summary = null;
      })
      .addCase(startLiveStream.rejected, (state) => {
        state.starting = false;
      })
      .addCase(endLiveStream.pending, (state) => {
        state.ending = true;
      })
      .addCase(endLiveStream.fulfilled, (state, action) => {
        state.ending = false;
        state.summary = {
          durationSeconds: state.startedAt ? Math.max(0, Math.round((action.payload - state.startedAt) / 1000)) : 0,
          endedAt: action.payload,
        };
        state.startedAt = null;
        state.phase = "summary";
      })
      .addCase(endLiveStream.rejected, (state) => {
        state.ending = false;
      });
  },
});

export const { goLiveReset, goLivePhaseChanged } = goLiveSlice.actions;
export default goLiveSlice.reducer;
