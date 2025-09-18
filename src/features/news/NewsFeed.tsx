import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchNews, selectAllNews } from './newsSlice';
import NewsItem from './NewsItem';
import AddNewsForm from '../../components/AddNewsForm';
import type {RootState} from "../../app/store.ts";
import type {AnyAction} from "@reduxjs/toolkit";

const NewsFeed = () => {
  const dispatch = useAppDispatch();
  const news = useAppSelector(selectAllNews);
  const status = useAppSelector((state: RootState) => state.news.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchNews() as unknown as AnyAction);
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