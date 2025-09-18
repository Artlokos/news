import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { RootState } from '@/app/store';

export interface Comment {
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

// Вспомогательная функция для обработки ошибок
const handleError = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const err = error as { response?: { data?: unknown } };
    return JSON.stringify(err.response?.data) || 'Unknown error';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error occurred';
};

// Добавляем fetchAllPendingComments
export const fetchAllPendingComments = createAsyncThunk<
    Comment[],
    void,
    { state: RootState }
>(
    'comments/fetchAllPending',
    async (_, { rejectWithValue }) => {
        try {
            // Используйте существующий метод API или добавьте новый
            const response = await api.getComments('pending');
            return response.data;
        } catch (err) {
            return rejectWithValue(handleError(err));
        }
    }
);

export const fetchComments = createAsyncThunk(
    'comments/fetch',
    async (newsId: string, { rejectWithValue }) => {
      try {
        const response = await api.getComments(newsId);
        return { newsId, comments: response.data };
      } catch (err) {
        return rejectWithValue(handleError(err));
      }
    }
);

export const addComment = createAsyncThunk(
    'comments/add',
    async ({ newsId, text }: { newsId: string; text: string }, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const user = state.auth.user;

            if (!user) {
                return rejectWithValue('User not authenticated');
            }

            // Явное приведение типа к Omit<Comment, "id">
            const commentData: Omit<Comment, "id"> = {
                text,
                newsId,
                userId: user.id,
                createdAt: new Date().toISOString(),
                status: user.role === 'admin' ? 'approved' : 'pending',
                reported: false
            };

            const response = await api.addComment(commentData);
            return response.data;
        } catch (err) {
            return rejectWithValue(handleError(err));
        }
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
        .addCase(fetchComments.rejected, (state) => {
          state.status = 'failed';
        })
        .addCase(addComment.fulfilled, (state, action) => {
          if (!state.byNewsId[action.payload.newsId]) {
            state.byNewsId[action.payload.newsId] = [];
          }
          state.byNewsId[action.payload.newsId].push(action.payload);
        })
        .addCase(addComment.rejected, (state) => {
          state.status = 'failed';
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