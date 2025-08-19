import {AnyAction, Middleware} from '@reduxjs/toolkit';
import { addToQueue, flushQueue } from '../features/offline/offlineSlice';
import type { RootState, AppDispatch } from './store.ts';

const offlineMiddleware: Middleware<
    {}, // Дополнительные параметры middleware
    RootState, // Тип состояния хранилища
    AppDispatch // Тип dispatch
> = (store) => (next) => (action) => {
  // 1. Проверяем, что action имеет правильный тип
  if (typeof action !== 'object' || action === null || !('type' in action)) {
    return next(action as AnyAction);
  }

  // 2. Приводим action к типу AnyAction
  const typedAction = action as AnyAction;

  // 3. Оффлайн-логика
  if (!navigator.onLine && typedAction.type.startsWith('news/')) {
    store.dispatch(addToQueue(typedAction));
    return;
  }

  // 4. Онлайн-логика
  if (navigator.onLine) {
    const queue = store.getState().offline.queue;
    if (queue.length > 0) {
      queue.forEach((queuedAction: AnyAction) => {
        store.dispatch(queuedAction);
      });
      store.dispatch(flushQueue());
    }
  }

  return next(typedAction);
};

export default offlineMiddleware;