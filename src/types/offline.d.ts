// types/offline.d.ts
import type { AnyAction } from '@reduxjs/toolkit';

declare module '../features/offline/offlineSlice' {
    interface OfflineState {
        queue: AnyAction[];
    }
}