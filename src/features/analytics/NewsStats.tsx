import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

const NewsStats = ({ newsId }) => {
  const stats = useSelector((state: RootState) => 
    state.analytics.viewStats[newsId] || { views: 0, averageDuration: 0 });
  const rating = useSelector((state: RootState) => 
    state.news.entities[newsId]?.rating || 0);

  return (
    <div className="news-stats">
      <div>Просмотры: {stats.views}</div>
      <div>Среднее время чтения: {Math.round(stats.averageDuration)} сек.</div>
      <div>Рейтинг: {rating}</div>
    </div>
  );
};

export default NewsStats;