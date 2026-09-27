import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import uiReducer from "@/store/slices/uiSlice";
import homeReducer from "@/store/slices/homeSlice";
import reelsReducer from "@/store/slices/reelsSlice";
import creatorProfileReducer from "@/store/slices/creatorProfileSlice";
import storyViewReducer from "@/store/slices/storyViewSlice";
import liveReducer from "@/store/slices/liveSlice";
import notificationsReducer from "@/store/slices/notificationsSlice";
import messagesReducer from "@/store/slices/messagesSlice";
import settingsReducer from "@/store/slices/settingsSlice";
import creatorDashboardReducer from "@/store/slices/creatorDashboardSlice";
import myContentReducer from "@/store/slices/myContentSlice";
import subscribersReducer from "@/store/slices/subscribersSlice";
import postCommentsReducer from "@/store/slices/postCommentsSlice";
import packagesReducer from "@/store/slices/packagesSlice";
import creatorAnalyticsReducer from "@/store/slices/creatorAnalyticsSlice";
import scheduledPostsReducer from "@/store/slices/scheduledPostsSlice";
import checkoutReducer from "@/store/slices/checkoutSlice";
import goLiveReducer from "@/store/slices/goLiveSlice";
import withdrawalsReducer from "@/store/slices/withdrawalsSlice";
import promoCodesReducer from "@/store/slices/promoCodesSlice";
import walletReducer from "@/store/slices/walletSlice";
import subscriptionsReducer from "@/store/slices/subscriptionsSlice";
import searchReducer from "@/store/slices/searchSlice";
import appSettingsReducer from "@/store/slices/appSettingsSlice";
import blockedUsersReducer from "@/store/slices/blockedUsersSlice";
import leaderboardReducer from "@/store/slices/leaderboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    home: homeReducer,
    reels: reelsReducer,
    creatorProfile: creatorProfileReducer,
    storyView: storyViewReducer,
    live: liveReducer,
    notifications: notificationsReducer,
    messages: messagesReducer,
    settings: settingsReducer,
    creatorDashboard: creatorDashboardReducer,
    myContent: myContentReducer,
    subscribers: subscribersReducer,
    postComments: postCommentsReducer,
    packages: packagesReducer,
    creatorAnalytics: creatorAnalyticsReducer,
    scheduledPosts: scheduledPostsReducer,
    checkout: checkoutReducer,
    goLive: goLiveReducer,
    withdrawals: withdrawalsReducer,
    promoCodes: promoCodesReducer,
    wallet: walletReducer,
    subscriptions: subscriptionsReducer,
    search: searchReducer,
    appSettings: appSettingsReducer,
    blockedUsers: blockedUsersReducer,
    leaderboard: leaderboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
