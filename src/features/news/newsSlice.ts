import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { RootState } from '../../app/store';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  tags: string[];
  authorId: string;
  rating: number;
  views: number;
}

interface NewsState {
  entities: Record<string, NewsItem>;
  ids: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: NewsState = {
  entities: {},
  ids: [],
  status: 'idle',
  error: null,
};

export const fetchNews = createAsyncThunk('news/fetchAll', async () => {
  const response = await api.getNews();
  return response.data;
});

export const addNews = createAsyncThunk('news/add', async (newsItem: Omit<NewsItem, 'id'>) => {
  const response = await api.createNews(newsItem);
  return response.data;
});

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    rateNews: (state, action: PayloadAction<{id: string; value: number}>) => {
      const newsItem = state.entities[action.payload.id];
      if (newsItem) {
        newsItem.rating += action.payload.value;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        action.payload.forEach(newsItem => {
          state.entities[newsItem.id] = newsItem;
          if (!state.ids.includes(newsItem.id)) {
            state.ids.push(newsItem.id);
          }
        });
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(addNews.fulfilled, (state, action) => {
        state.entities[action.payload.id] = action.payload;
        state.ids.unshift(action.payload.id);
      });
  },
});

export const { rateNews } = newsSlice.actions;
export default newsSlice.reducer;
export const selectAllNews = (state: RootState) => 
  state.news.ids.map(id => state.news.entities[id]);