import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserPreferences {
  preferredCategories: string[];
  dislikedTags: string[];
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
}

const initialState: UserPreferences = {
  preferredCategories: [],
  dislikedTags: [],
  theme: 'light',
  notificationsEnabled: true,
};

const userSlice = createSlice({
  name: 'userPreferences',
  initialState,
  reducers: {
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      return { ...state, ...action.payload };
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const { updatePreferences, toggleTheme } = userSlice.actions;
export default userSlice.reducer;