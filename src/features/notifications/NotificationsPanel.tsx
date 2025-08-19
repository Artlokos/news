import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications, markAsRead } from './notificationSlice';
import { RootState } from '../../app/store';

const NotificationsPanel = () => {
  const dispatch = useDispatch();
  const { items, permission } = useSelector((state: RootState) => state.notifications);
  const unreadCount = items.filter(n => !n.read).length;

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  return (
    <div className="notifications-panel">
      <h3>Уведомления ({unreadCount})</h3>
      {permission === 'denied' ? (
        <p>Разрешите уведомления в настройках браузера</p>
      ) : (
        <ul>
          {items.map(notification => (
            <li 
              key={notification.id} 
              className={notification.read ? 'read' : 'unread'}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <strong>{notification.title}</strong>
              <p>{notification.message}</p>
              <small>{new Date(notification.timestamp).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPanel;