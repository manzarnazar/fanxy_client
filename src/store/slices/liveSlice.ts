import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { liveService, type BroadcastGiftInput } from "@/features/live/services/live.service";
import { mapApiLiveGift, mapApiLiveUser } from "@/features/live/mapper/live.mapper";
import { creatorProfileService } from "@/features/creator-profile/services/creator-profile.service";
import { mapApiCreatorProfile } from "@/features/creator-profile/mapper/creator-profile.mapper";
import type { CreatorProfile } from "@/features/creator-profile/types/creator-profile.types";
import type { LiveGift, LiveStreamCard } from "@/features/live/types/live.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface LiveState {
  streams: {
    items: LiveStreamCard[];
    page: number;
    hasMore: boolean;
    status: RequestStatus;
    error: string | null;
  };
  watch: {
    hostId: string | null;
    hostProfile: CreatorProfile | null;
    status: RequestStatus;
    error: string | null;
  };
  gifts: {
    items: LiveGift[];
    status: RequestStatus;
  };
  coinBalance: number | null;
  giftSending: boolean;
}

const initialState: LiveState = {
  streams: { items: [], page: 0, hasMore: true, status: "idle", error: null },
  watch: { hostId: null, hostProfile: null, status: "idle", error: null },
  gifts: { items: [], status: "idle" },
  coinBalance: null,
  giftSending: false,
};

export const fetchLiveStreams = createAsyncThunk<
  { items: LiveStreamCard[]; page: number; hasMore: boolean; append: boolean },
  { page: number; append: boolean },
  { rejectValue: string }
>("live/fetchStreams", async ({ page, append }, { rejectWithValue }) => {
  try {
    const response = await liveService.listLiveUsers(page);
    return {
      items: (response.data.result ?? []).map(mapApiLiveUser),
      page: response.data.current_page ?? page,
      hasMore: Boolean(response.data.more_page),
      append,
    };
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

// The watch page mirrors the Flutter gating (livestreams.dart watchLive):
// list-level is_buy first, then the host profile's can_view_live_stream.
export const fetchLiveHostProfile = createAsyncThunk<
  { hostId: string; profile: CreatorProfile },
  string,
  { rejectValue: string }
>("live/fetchHostProfile", async (hostId, { rejectWithValue }) => {
  try {
    const response = await creatorProfileService.getProfile(hostId);
    const row = response.data.result?.[0];
    if (!row) return rejectWithValue("This stream is no longer available.");
    return { hostId, profile: mapApiCreatorProfile(row) };
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const fetchLiveGifts = createAsyncThunk<LiveGift[], void, { rejectValue: string }>(
  "live/fetchGifts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await liveService.getGifts();
      return (response.data.result ?? []).map(mapApiLiveGift);
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

// Coin balance comes from the viewer's own get_profile row (coin_wallet),
// exactly like the Flutter gift tray (goliveprovider.dart).
export const fetchLiveCoinBalance = createAsyncThunk<number, string, { rejectValue: string }>(
  "live/fetchCoinBalance",
  async (myUserId, { rejectWithValue }) => {
    try {
      const response = await creatorProfileService.getProfile(myUserId);
      return response.data.result?.[0]?.coin_wallet ?? 0;
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const sendLiveGift = createAsyncThunk<
  { coin: number },
  { broadcast: BroadcastGiftInput; toUserId: string; gift: LiveGift },
  { rejectValue: string }
>("live/sendGift", async ({ broadcast, toUserId, gift }, { rejectWithValue }) => {
  try {
    // Order mirrors the Flutter app: broadcast the animation first, then
    // record the coin transaction on the backend.
    await liveService.broadcastGift(broadcast);
    const transactionId = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `web-${Date.now()}`;
    await liveService.sendGift(toUserId, gift.id, `Live gift: ${gift.name}`, transactionId);
    return { coin: gift.coin };
  } catch (error: unknown) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const liveSlice = createSlice({
  name: "live",
  initialState,
  reducers: {
    resetLiveWatch: (state) => {
      state.watch = initialState.watch;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveStreams.pending, (state, action) => {
        state.streams.status = action.meta.arg.append ? state.streams.status : "loading";
        state.streams.error = null;
      })
      .addCase(fetchLiveStreams.fulfilled, (state, action) => {
        state.streams.status = "succeeded";
        state.streams.page = action.payload.page;
        state.streams.hasMore = action.payload.hasMore;
        state.streams.items = action.payload.append
          ? [...state.streams.items, ...action.payload.items]
          : action.payload.items;
      })
      .addCase(fetchLiveStreams.rejected, (state, action) => {
        state.streams.status = "failed";
        state.streams.error = action.payload ?? "Something went wrong. Please try again.";
      })
      .addCase(fetchLiveHostProfile.pending, (state, action) => {
        state.watch.hostId = action.meta.arg;
        state.watch.status = "loading";
        state.watch.error = null;
      })
      .addCase(fetchLiveHostProfile.fulfilled, (state, action) => {
        state.watch.status = "succeeded";
        state.watch.hostId = action.payload.hostId;
        state.watch.hostProfile = action.payload.profile;
      })
      .addCase(fetchLiveHostProfile.rejected, (state, action) => {
        state.watch.status = "failed";
        state.watch.error = action.payload ?? "Something went wrong. Please try again.";
      })
      .addCase(fetchLiveGifts.pending, (state) => {
        state.gifts.status = "loading";
      })
      .addCase(fetchLiveGifts.fulfilled, (state, action: PayloadAction<LiveGift[]>) => {
        state.gifts.status = "succeeded";
        state.gifts.items = action.payload;
      })
      .addCase(fetchLiveGifts.rejected, (state) => {
        state.gifts.status = "failed";
      })
      .addCase(fetchLiveCoinBalance.fulfilled, (state, action) => {
        state.coinBalance = action.payload;
      })
      .addCase(sendLiveGift.pending, (state) => {
        state.giftSending = true;
      })
      .addCase(sendLiveGift.fulfilled, (state, action) => {
        state.giftSending = false;
        if (state.coinBalance !== null) {
          state.coinBalance = Math.max(0, state.coinBalance - action.payload.coin);
        }
      })
      .addCase(sendLiveGift.rejected, (state) => {
        state.giftSending = false;
      });
  },
});

export const { resetLiveWatch } = liveSlice.actions;
export default liveSlice.reducer;
