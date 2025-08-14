import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { trackView } from '../features/analytics/analyticsSlice';

export const useViewTracking = (newsId: string) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const startTime = Date.now();
    
    return () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      dispatch(trackView({ newsId, duration }));
    };
  }, [newsId, dispatch]);
};