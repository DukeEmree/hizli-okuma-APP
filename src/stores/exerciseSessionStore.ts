import { create } from 'zustand';

export interface SessionMetrics {
  wpm: number;
  accuracy: number;
  comprehension: number;
}

export interface ExerciseSessionState {
  activeExerciseId: string | null;
  startedAt: number | null;
  currentStep: number;
  currentIndex: number;
  isPaused: boolean;
  currentMetrics: SessionMetrics;

  startSession: (exerciseId: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  setStep: (step: number) => void;
  setIndex: (index: number) => void;
  updateMetrics: (metrics: Partial<SessionMetrics>) => void;
  endSession: () => void;
}

const initialMetrics: SessionMetrics = {
  wpm: 0,
  accuracy: 0,
  comprehension: 0,
};

const initialState = {
  activeExerciseId: null,
  startedAt: null,
  currentStep: 0,
  currentIndex: 0,
  isPaused: false,
  currentMetrics: { ...initialMetrics },
};

export const useExerciseSessionStore = create<ExerciseSessionState>((set) => ({
  ...initialState,

  startSession: (exerciseId) =>
    set({
      activeExerciseId: exerciseId,
      startedAt: Date.now(),
      currentStep: 0,
      currentIndex: 0,
      isPaused: false,
      currentMetrics: { ...initialMetrics },
    }),

  pauseSession: () => set({ isPaused: true }),
  
  resumeSession: () => set({ isPaused: false }),
  
  setStep: (step) => set({ currentStep: step }),
  
  setIndex: (index) => set({ currentIndex: index }),
  
  updateMetrics: (metrics) =>
    set((state) => ({
      currentMetrics: { ...state.currentMetrics, ...metrics },
    })),
    
  endSession: () => set(initialState),
}));
