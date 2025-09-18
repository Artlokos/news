import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { moderateComment, fetchAllPendingComments } from './commentsSlice';
import type {AnyAction} from "@reduxjs/toolkit";

const ModerationPanel = () => {
  const dispatch = useAppDispatch();

  // Используем useAppSelector без явного указания RootState
  const pendingComments = useAppSelector((state) => {
    return Object.values(state.comments.byNewsId)
        .flat()
        .filter(c => c.status === 'pending');
  });

  useEffect(() => {
    dispatch(fetchAllPendingComments() as unknown as AnyAction);
  }, [dispatch]);

  const handleModerate = (commentId: string, status: 'approved' | 'rejected') => {
    dispatch(moderateComment({ id: commentId, status }));
  };

  return (
      <div className="moderation-panel">
        <h3>Комментарии на модерации</h3>
        {pendingComments.length === 0 ? (
            <p>Нет комментариев для модерации</p>
        ) : (
            <ul>
              {pendingComments.map(comment => (
                  <li key={comment.id}>
                    <p>{comment.text}</p>
                    <div>
                      <button onClick={() => handleModerate(comment.id, 'approved')}>
                        Одобрить
                      </button>
                      <button onClick={() => handleModerate(comment.id, 'rejected')}>
                        Отклонить
                      </button>
                    </div>
                  </li>
              ))}
            </ul>
        )}
      </div>
  );
};

export default ModerationPanel;