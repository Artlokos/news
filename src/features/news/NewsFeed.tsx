import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNews, selectAllNews } from '../news/newsSlice';
import NewsItem from './NewsItem';
import AddNewsForm from '../../components/AddNewsForm';

const NewsFeed = () => {
  const dispatch = useDispatch();
  const news = useSelector(selectAllNews);
  const status = useSelector((state: RootState) => state.news.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchNews());
    }
  }, [status, dispatch]);

  return (
    <div className="news-feed">
      <AddNewsForm />
      {status === 'loading' ? (
        <div>Загрузка...</div>
      ) : status === 'failed' ? (
        <div>Ошибка загрузки новостей</div>
      ) : (
        <div className="news-list">
          {news.map(newsItem => (
            <NewsItem key={newsItem.id} item={newsItem} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;