import { useEffect } from 'react';
import { useAppDispatch } from '../app/hooks'; // Используем кастомный хук
import { trackView } from '../features/analytics/analyticsSlice';
import type {AnyAction} from "@reduxjs/toolkit";

export const useViewTracking = (newsId: string) => {
  const dispatch = useAppDispatch(); // Используем типизированный dispatch

  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      dispatch(trackView({ newsId, duration }) as unknown as AnyAction);
    };
  }, [newsId, dispatch]);
};