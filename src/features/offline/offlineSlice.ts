// features/offline/offlineSlice.ts
import {AnyAction, createSlice, PayloadAction} from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

interface OfflineState {
    queue: AnyAction[];
}

const initialState: OfflineState = {
    queue: [],
};

export const offlineSlice = createSlice({
    name: 'offline',
    initialState,
    reducers: {
        addToQueue: (state, action: PayloadAction<AnyAction>) => {
            state.queue.push(action.payload);
        },
        flushQueue: (state) => {
            state.queue = [];
        },
    },
});

export const { addToQueue, flushQueue } = offlineSlice.actions;
export const selectOfflineQueue = (state: RootState) => state.offline.queue;

export default offlineSlice.reducer;