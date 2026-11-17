import {
  getSubjectsPage,
  SUBJECTS_PAGE_SIZE,
  Subject,
} from '@/core';
import { create } from 'zustand';

interface SubjectsState {
  subjects: Subject[];
  page: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

interface SubjectsActions {
  loadSubjects: (page?: number) => Promise<void>;
  clearError: () => void;
}

type SubjectsStore = SubjectsState & SubjectsActions;

export const useSubjectsStore = create<SubjectsStore>()((set) => ({
  subjects: [],
  page: 1,
  totalPages: 0,
  isLoading: false,
  error: null,

  loadSubjects: async (page = 1) => {
    set({ isLoading: true, error: null });

    try {
      const response = await getSubjectsPage(page);
      const totalPages = Math.ceil(response.count / SUBJECTS_PAGE_SIZE);

      set({
        subjects: response.data,
        page,
        totalPages,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar los subjects.',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
