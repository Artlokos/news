import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addComment, fetchComments } from '../comments/commentsSlice';

const CommentsSection = ({ newsId }) => {
  const dispatch = useDispatch();
  const comments = useSelector((state: RootState) => 
    state.comments.byNewsId[newsId] || []);
  const [commentText, setCommentText] = useState('');
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchComments(newsId));
  }, [newsId, dispatch]);

  const handleSubmit = () => {
    if (commentText.trim() && user) {
      dispatch(addComment({ newsId, text: commentText }));
      setCommentText('');
    }
  };

  return (
    <div className="comments-section">
      <h4>Комментарии ({comments.length})</h4>
      {user ? (
        <>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Оставьте комментарий..."
          />
          <button onClick={handleSubmit}>Отправить</button>
        </>
      ) : (
        <p>Войдите, чтобы оставить комментарий</p>
      )}
      <div className="comments-list">
        {comments
          .filter(c => c.status === 'approved')
          .map(comment => (
            <div key={comment.id} className="comment">
              <p>{comment.text}</p>
              <small>{new Date(comment.createdAt).toLocaleString()}</small>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CommentsSection;