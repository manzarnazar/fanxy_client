import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { messagesService } from "@/features/messages/services/messages.service";
import { mapSearchUserToCandidate } from "@/features/messages/mapper/messages.mapper";
import type { ChatMessage, Conversation, MessageCandidate } from "@/features/messages/types/messages.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

// Conversations and thread messages are fed by Firestore onSnapshot listeners
// (see useConversationsSubscription / useChatThread) dispatching the plain
// reducers below — realtime pushes don't fit the request/response thunk
// shape. Only the REST-backed people search stays a thunk.
interface MessagesState {
  conversations: Conversation[];
  conversationsStatus: RequestStatus;
  conversationsError: string | null;
  /** True when the signed-in account has no firebase_id — chat can't work for it. */
  chatIdentityMissing: boolean;

  selectedId: string | null;

  threadConvId: string | null;
  threadMessages: ChatMessage[];
  threadStatus: RequestStatus;

  candidates: MessageCandidate[];
  candidatesStatus: RequestStatus;
}

const initialState: MessagesState = {
  conversations: [],
  conversationsStatus: "idle",
  conversationsError: null,
  chatIdentityMissing: false,
  selectedId: null,
  threadConvId: null,
  threadMessages: [],
  threadStatus: "idle",
  candidates: [],
  candidatesStatus: "idle",
};

export const searchMessageCandidates = createAsyncThunk<MessageCandidate[], string, { rejectValue: string }>(
  "messages/searchCandidates",
  async (searchText, { rejectWithValue }) => {
    try {
      const response = await messagesService.searchUsers(searchText);
      return response.data.result.map(mapSearchUserToCandidate);
    } catch (error: unknown) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    conversationsLoading: (state) => {
      if (state.conversationsStatus === "idle") state.conversationsStatus = "loading";
    },
    conversationsReceived: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
      state.conversationsStatus = "succeeded";
      state.conversationsError = null;
    },
    conversationsFailed: (state, action: PayloadAction<string>) => {
      state.conversationsStatus = "failed";
      state.conversationsError = action.payload;
    },
    chatIdentityMissing: (state, action: PayloadAction<boolean>) => {
      state.chatIdentityMissing = action.payload;
    },
    selectConversation: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload;
    },
    threadOpened: (state, action: PayloadAction<string>) => {
      state.threadConvId = action.payload;
      state.threadMessages = [];
      state.threadStatus = "loading";
    },
    threadMessagesReceived: (state, action: PayloadAction<{ convId: string; messages: ChatMessage[] }>) => {
      // Ignore late snapshots from a thread the user already navigated away from.
      if (state.threadConvId !== action.payload.convId) return;
      state.threadMessages = action.payload.messages;
      state.threadStatus = "succeeded";
    },
    threadFailed: (state, action: PayloadAction<{ convId: string }>) => {
      if (state.threadConvId !== action.payload.convId) return;
      state.threadStatus = "failed";
    },
    threadClosed: (state) => {
      state.threadConvId = null;
      state.threadMessages = [];
      state.threadStatus = "idle";
    },
    candidatesCleared: (state) => {
      state.candidates = [];
      state.candidatesStatus = "idle";
    },
    conversationPrefUpdated: (
      state,
      action: PayloadAction<{ convId: string; prefs: Partial<Pick<Conversation, "pinned" | "muted" | "archived">> }>,
    ) => {
      const conversation = state.conversations.find((item) => item.id === action.payload.convId);
      if (conversation) Object.assign(conversation, action.payload.prefs);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMessageCandidates.pending, (state) => {
        state.candidatesStatus = "loading";
      })
      .addCase(searchMessageCandidates.fulfilled, (state, action) => {
        state.candidatesStatus = "succeeded";
        state.candidates = action.payload;
      })
      .addCase(searchMessageCandidates.rejected, (state) => {
        state.candidatesStatus = "failed";
        state.candidates = [];
      });
  },
});

export const {
  conversationsLoading,
  conversationsReceived,
  conversationsFailed,
  chatIdentityMissing,
  selectConversation,
  threadOpened,
  threadMessagesReceived,
  threadFailed,
  threadClosed,
  candidatesCleared,
  conversationPrefUpdated,
} = messagesSlice.actions;
export default messagesSlice.reducer;
