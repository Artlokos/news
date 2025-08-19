import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { RootState } from '../../app/store';

interface ViewEvent {
  newsId: string;
  userId: string;
  timestamp: string;
  duration: number;
}

interface AnalyticsState {
  viewStats: Record<string, {
    views: number;
    averageDuration: number;
  }>;
}

const initialState: AnalyticsState = {
  viewStats: {},
};

export const trackView = createAsyncThunk(
  'analytics/trackView',
  async ({ newsId, duration }: { newsId: string; duration: number }, { getState }) => {
    const state = getState() as RootState;
    const userId = state.auth.user?.id || 'anonymous';
    await api.trackView({ newsId, userId, duration });
    return { newsId, duration };
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(trackView.fulfilled, (state, action) => {
      const { newsId, duration } = action.payload;
      if (!state.viewStats[newsId]) {
        state.viewStats[newsId] = { views: 0, averageDuration: 0 };
      }
      const stats = state.viewStats[newsId];
      const totalDuration = stats.averageDuration * stats.views + duration;
      stats.views += 1;
      stats.averageDuration = totalDuration / stats.views;
    });
  },
});

export default analyticsSlice.reducer;