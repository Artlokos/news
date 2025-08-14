import { MiddlewareAPI, Dispatch, AnyAction } from '@reduxjs/toolkit';
import { addToQueue, flushQueue } from '../features/offline/offlineSlice';

const offlineMiddleware = (store: MiddlewareAPI) => (next: Dispatch) => (action: AnyAction) => {
  if (!navigator.onLine && action.type.startsWith('news/')) {
    store.dispatch(addToQueue(action));
    return;
  }
  
  if (navigator.onLine) {
    const queue = store.getState().offline.queue;
    if (queue.length > 0) {
      queue.forEach(queuedAction => store.dispatch(queuedAction));
      store.dispatch(flushQueue());
    }
  }
  
  return next(action);
};

export default offlineMiddleware;