import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { RootState } from '@/app/store';

interface Comment {
  id: string;
  newsId: string;
  userId: string;
  text: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'rejected';
  reported?: boolean;
}

interface CommentsState {
  byNewsId: Record<string, Comment[]>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: CommentsState = {
  byNewsId: {},
  status: 'idle',
};

// Добавляем fetchAllPendingComments
export const fetchAllPendingComments = createAsyncThunk<
Comment[],
void,
{state:RootState}
>(
  'comments/fetchAllPending',
  async (_, {rejectWithValue}) => {
    try{
    const response = await api.get('/comments/pending'); // Предполагаемый API endpoint
    return response.data;
    } catch(err) {
      return rejectWithValue(err.response.data);
    }
    
  }
);

export const fetchComments = createAsyncThunk(
  'comments/fetch',
  async (newsId: string) => {
    const response = await api.getComments(newsId);
    return { newsId, comments: response.data };
  }
);

export const addComment = createAsyncThunk(
  'comments/add',
  async ({ newsId, text }: { newsId: string; text: string }, { getState }) => {
    const state = getState() as RootState;
    const user = state.auth.user;
    if (!user) throw new Error('User not authenticated');
    
    const response = await api.addComment({
      newsId,
      text,
      userId: user.id,
      status: user.role === 'admin' ? 'approved' : 'pending',
    });
    return response.data;
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    moderateComment: (state, action: PayloadAction<{
      id: string;
      status: 'approved' | 'rejected';
    }>) => {
      for (const newsId in state.byNewsId) {
        state.byNewsId[newsId] = state.byNewsId[newsId].map(comment => {
          if (comment.id === action.payload.id) {
            return { ...comment, status: action.payload.status };
          }
          return comment;
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.byNewsId[action.payload.newsId] = action.payload.comments;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        if (!state.byNewsId[action.payload.newsId]) {
          state.byNewsId[action.payload.newsId] = [];
        }
        state.byNewsId[action.payload.newsId].push(action.payload);
      })
      // Добавляем обработку fetchAllPendingComments
      .addCase(fetchAllPendingComments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllPendingComments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Обрабатываем полученные pending-комментарии
        action.payload.forEach((comment: Comment) => {
          if (!state.byNewsId[comment.newsId]) {
            state.byNewsId[comment.newsId] = [];
          }
          // Добавляем только если комментария еще нет в state
          if (!state.byNewsId[comment.newsId].some(c => c.id === comment.id)) {
            state.byNewsId[comment.newsId].push(comment);
          }
        });
      })
      .addCase(fetchAllPendingComments.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { moderateComment } = commentsSlice.actions;
export default commentsSlice.reducer;