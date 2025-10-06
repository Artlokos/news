import { Provider } from 'react-redux';
import { store } from './app/store';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import NewsFeed from './features/news/NewsFeed';
import ProfilePage from './features/gamification/ProfilePage';
import ModerationPanel from './features/comments/ModerationPanel';
import LoginPage from './features/auth/LoginPage';
import MainPage from "./features/main/MainPage";
import Navbar from "./components/Navbar";
import AppRouter from "./components/AppRouter";
import Header from "./components/Header";

function App() {
  return (
    <Provider store={store}>
      <Router>
      {/*  <Routes>*/}
      {/*    <Route path="/" element={<MainPage/>} />*/}
      {/*    <Route path="/login" element={< LoginPage/>} />*/}
      {/*    <Route path="/profile" element={*/}
      {/*      <ProtectedRoute>*/}
      {/*        <ProfilePage />*/}
      {/*      </ProtectedRoute>*/}
      {/*    } />*/}
      {/*    <Route path="/moderation" element={*/}
      {/*      <ProtectedRoute roles={['admin', 'moderator']}>*/}
      {/*        <ModerationPanel />*/}
      {/*      </ProtectedRoute>*/}
      {/*    } />*/}
      {/*  </Routes>*/}

        <Navbar
            items={[
              { name: 'Новости', path: '/news' },
              { name: 'Афиша', path: '/posters' },
              { name: 'Справочник', path: '/consult' },
              { name: 'Погода', path: '/weather' },
              { name: 'Места', path: '/places' },
            ]}
        />
          <Header label="Pulsar" />
          <AppRouter />

      </Router>
    </Provider>
  );
}

export default App;
