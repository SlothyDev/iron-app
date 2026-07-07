import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useWorkoutStore = create(
  persist((set, get) => ({
  isRunning: false,
  startTime: null,
  elapsed: 0,
  hasRestoredSession: false,
  intervalId: null,
  exercises: [],

  startSession: () => {
    const now = Date.now();

    set({
      isRunning: true,
      startTime: now,
      elapsed: 0,
      hasRestoredSession: false,
    });
  },


  startTimer: () => {
    const { startTime, intervalId: existingInterval } = get();

    if (!startTime || existingInterval) return;

    const updateTimer = () => {
      set({
        elapsed: Math.floor(
          (Date.now() - startTime) / 1000
        ),
      });
    };

    updateTimer();

    const newIntervalId = setInterval(updateTimer, 1000);

    set({ intervalId: newIntervalId });
  },

  stopTimer: () => {
    const { intervalId } = get();

    if (intervalId) {
      clearInterval(intervalId);
    }

    set({
      intervalId: null,
    });
  },

  addExercise: (exercise) =>
    set((state) => ({
      exercises: [...state.exercises, exercise],
    })),

  updateExercise: (updatedExercise) =>
  set((state) => ({
    exercises: state.exercises.map((ex) =>
      ex.id === updatedExercise.id ? updatedExercise : ex
    ),
  })),

  deleteExercise: (exerciseId) =>
    set((state) => ({
      exercises: state.exercises.filter((ex) => ex.id !== exerciseId),
    })),  

  endSession: () => {
    get().stopTimer();

    set({
      isRunning: false,
      startTime: null,
      elapsed: 0,
      intervalId: null,
      exercises: [],
    });
  },

  resetTimer: () => {
    const { intervalId } = get();
    if (intervalId) clearInterval(intervalId);

    set({
      startTime: null,
      elapsed: 0,
      intervalId: null,
    });
  }
}),
{
  name: 'workout-session',
  storage: createJSONStorage(() => AsyncStorage),

  partialize: (state) => ({
    isRunning: state.isRunning,
    startTime: state.startTime,
    elapsed: state.elapsed,
    exercises: state.exercises,
  }),

  onRehydrateStorage: () => (state) => {
    if (state?.isRunning) {
      state.hasRestoredSession = true;
    }
  },
}
)
);

export default useWorkoutStore;