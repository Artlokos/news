import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { rateNews } from '../news/newsSlice';
import CommentsSection from '../comments/CommentsSection';

const NewsItem = ({ item }) => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);

  const handleRate = (value: number) => {
    dispatch(rateNews({ id: item.id, value }));
  };

  return (
    <article className="news-item">
      <h3>{item.title}</h3>
      <p>{expanded ? item.content : `${item.content.substring(0, 100)}...`}</p>
      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Свернуть' : 'Читать далее'}
      </button>
      <div className="news-meta">
        <span>Рейтинг: {item.rating}</span>
        <button onClick={() => handleRate(1)}>👍</button>
        <button onClick={() => handleRate(-1)}>👎</button>
      </div>
      {expanded && <CommentsSection newsId={item.id} />}
    </article>
  );
};

export default NewsItem;