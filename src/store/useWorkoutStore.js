import { create } from 'zustand';

const useWorkoutStore = create((set, get) => ({
  isRunning: false,
  startTime: null,
  elapsed: 0,
  intervalId: null,
  exercises: [],

  startSession: () => {
    const now = Date.now();
    const intervalId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - get().startTime) / 1000);
      set({ elapsed });
    }, 1000);

    set({
      isRunning: true,
      startTime: now,
      elapsed: 0,
      exercises: [],
      intervalId,
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
    const { intervalId } = get();
    if (intervalId) clearInterval(intervalId);

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
}));

export default useWorkoutStore;