import { useSelector } from 'react-redux';
import NewsFeed from '../features/news/NewsFeed';
import NotificationsPanel from '../features/notifications/NotificationsPanel';
import UserSettings from '../features/user/UserSettings';

const MainPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  return (
    <div className="main-page">
      <header>
        <h1>Новостная лента</h1>
        {user && <span>Привет, {user.name}!</span>}
      </header>
      
      <div className="content">
        <aside>
          <UserSettings />
          <NotificationsPanel />
        </aside>
        
        <main>
          <NewsFeed />
        </main>
      </div>
    </div>
  );
};

export default MainPage;