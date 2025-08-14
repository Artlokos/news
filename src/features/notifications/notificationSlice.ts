import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}

interface NotificationsState {
  items: Notification[];
  permission: NotificationPermission;
}

const initialState: NotificationsState = {
  items: [],
  permission: 'default',
};

export const requestNotificationPermission = createAsyncThunk(
  'notifications/requestPermission',
  async () => {
    const permission = await Notification.requestPermission();
    return permission;
  }
);

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (_, { getState }) => {
    const state = getState() as RootState;
    if (!state.auth.user) return [];
    const response = await api.getNotifications(state.auth.user.id);
    return response.data;
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find(n => n.id === action.payload);
      if (notification) notification.read = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestNotificationPermission.fulfilled, (state, action) => {
        state.permission = action.payload;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { markAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;