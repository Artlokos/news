import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  // News
  getNews: () => api.get('/news'),
  createNews: (newsItem: Omit<NewsItem, 'id'>) => api.post('/news', newsItem),
  
  // Comments
  getComments: (newsId: string) => api.get(`/comments?newsId=${newsId}`),
  addComment: (comment: Omit<Comment, 'id'>) => api.post('/comments', comment),
  moderateComment: (id: string, status: string) => 
    api.patch(`/comments/${id}`, { status }),
  
  // Analytics
  trackView: (data: { newsId: string; userId: string; duration: number }) =>
    api.post('/analytics/views', data),
  
  // Notifications
  getNotifications: (userId: string) => api.get(`/notifications?userId=${userId}`),
};