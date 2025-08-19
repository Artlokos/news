import authReducer from '../features/auth/authSlice';
import newsReducer from '../features/news/newsSlice';
import commentsReducer from '../features/comments/commentsSlice';
import analyticsReducer from '../features/analytics/analyticsSlice';
import notificationsReducer from '../features/notifications/notificationSlice';
import achievementsReducer from '../features/gamification/achievementsSlice';
import userPreferencesReducer from '../features/user/userSlice';
// import { offline } from '@redux-offline/redux-offline';
// import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import { configureStore, Tuple } from '@reduxjs/toolkit';
import offlineReducer from '../features/offline/offlineSlice';
import type { Middleware } from '@reduxjs/toolkit';

const customMiddleware: Middleware = (store) => (next) => (action) => {
  // Ваша логика middleware
  store.getState();
  return next(action);
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    news: newsReducer,
    comments: commentsReducer,
    analytics: analyticsReducer,
    notifications: notificationsReducer,
    achievements: achievementsReducer,
    userPreferences: userPreferencesReducer,
    offline: offlineReducer,
  },
  middleware: (getDefaultMiddleware) =>
    new Tuple(...getDefaultMiddleware(), customMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;