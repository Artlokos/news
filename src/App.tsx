import { Provider } from 'react-redux';
import { store } from './app/store';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import NewsFeed from './features/news/NewsFeed';
import ProfilePage from './features/gamification/ProfilePage';
import ModerationPanel from './features/comments/ModerationPanel';
import LoginPage from './features/auth/LoginPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<NewsFeed />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/moderation" element={
            <ProtectedRoute roles={['admin', 'moderator']}>
              <ModerationPanel />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
