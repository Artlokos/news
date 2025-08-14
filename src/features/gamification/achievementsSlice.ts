import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  progress: number;
  target: number;
}

interface GamificationState {
  achievements: Achievement[];
  points: number;
  level: number;
}

const initialState: GamificationState = {
  achievements: [
    {
      id: 'reader',
      name: 'Читатель',
      description: 'Прочитайте 10 новостей',
      icon: '📖',
      earned: false,
      progress: 0,
      target: 10,
    },
    {
      id: 'commentator',
      name: 'Комментатор',
      description: 'Оставьте 5 комментариев',
      icon: '💬',
      earned: false,
      progress: 0,
      target: 5,
    },
  ],
  points: 0,
  level: 1,
};

const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    incrementProgress: (state, action: PayloadAction<{id: string; amount?: number}>) => {
      const achievement = state.achievements.find(a => a.id === action.payload.id);
      if (achievement && !achievement.earned) {
        achievement.progress += action.payload.amount || 1;
        if (achievement.progress >= achievement.target) {
          achievement.earned = true;
          state.points += 100;
          state.level = Math.floor(state.points / 500) + 1;
        }
      }
    },
  },
});

export const { incrementProgress } = achievementsSlice.actions;
export default achievementsSlice.reducer;