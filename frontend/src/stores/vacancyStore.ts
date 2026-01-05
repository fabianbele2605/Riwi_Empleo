import { create } from 'zustand';
import { Vacancy, VacancyFilters } from '@/types';
import { apiClient } from '@/lib/api';

interface VacancyState {
  vacancies: Vacancy[];
  selectedVacancy: Vacancy | null;
  filters: VacancyFilters;
  isLoading: boolean;
  error: string | null;
  
  fetchVacancies: () => Promise<void>;
  fetchVacanciesPublic: () => Promise<void>;
  fetchVacancyById: (id: string) => Promise<Vacancy | null>;
  createVacancy: (vacancy: any) => Promise<Vacancy>;
  updateVacancy: (id: string, data: any) => Promise<void>;
  toggleVacancyStatus: (id: string) => Promise<void>;
  deleteVacancy: (id: string) => Promise<void>;
  setFilters: (filters: VacancyFilters) => void;
  getFilteredVacancies: () => Vacancy[];
  clearError: () => void;
}

// Transform backend vacancy to frontend format
const transformVacancy = (backendVacancy: any): Vacancy => {
  return {
    id: backendVacancy.id.toString(),
    title: backendVacancy.title,
    company: backendVacancy.company,
    location: backendVacancy.location,
    type: backendVacancy.modality || 'remote',
    salary: {
      min: 0,
      max: 0,
      currency: 'COP',
      range: backendVacancy.salaryRange
    },
    description: backendVacancy.description,
    requirements: backendVacancy.technologies ? backendVacancy.technologies.split(', ') : [],
    benefits: backendVacancy.softSkills ? backendVacancy.softSkills.split(', ') : [],
    status: backendVacancy.isActive ? 'ACTIVE' : 'INACTIVE',
    createdBy: '1',
    createdAt: backendVacancy.createdAt,
    applicationsCount: 0, // El backend no devuelve este campo por ahora
    seniority: backendVacancy.seniority,
    maxApplicants: backendVacancy.maxApplicants,
  };
};

export const useVacancyStore = create<VacancyState>((set, get) => ({
  vacancies: [],
  selectedVacancy: null,
  filters: {},
  isLoading: false,
  error: null,

  fetchVacancies: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getVacancies();
      const vacancies = Array.isArray(response) ? response.map(transformVacancy) : [];
      set({ vacancies, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al cargar vacantes',
        isLoading: false 
      });
    }
  },

  fetchVacanciesPublic: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getVacanciesPublic();
      const vacancies = Array.isArray(response) ? response.map(transformVacancy) : [];
      set({ vacancies, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al cargar vacantes',
        isLoading: false 
      });
    }
  },

  fetchVacancyById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getVacancy(id);
      const vacancy = transformVacancy(response);
      set({ selectedVacancy: vacancy, isLoading: false });
      return vacancy;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al cargar vacante',
        isLoading: false 
      });
      return null;
    }
  },

  createVacancy: async (vacancyData) => {
    set({ isLoading: true, error: null });
    try {
      // Transform frontend data to backend format
      const backendData = {
        title: vacancyData.title,
        description: vacancyData.description,
        technologies: Array.isArray(vacancyData.requirements) 
          ? vacancyData.requirements.join(', ') 
          : vacancyData.technologies || '',
        seniority: vacancyData.seniority || 'Semi Senior',
        softSkills: Array.isArray(vacancyData.benefits) 
          ? vacancyData.benefits.join(', ') 
          : vacancyData.softSkills || '',
        location: vacancyData.location,
        modality: vacancyData.type?.toLowerCase() || 'remote',
        salaryRange: vacancyData.salary?.range || '$0 - $0',
        company: vacancyData.company,
        maxApplicants: vacancyData.maxApplicants || 10,
      };
      
      const response = await apiClient.createVacancy(backendData);
      const newVacancy = transformVacancy(response);
      
      set((state) => ({
        vacancies: [newVacancy, ...state.vacancies],
        isLoading: false,
      }));
      
      return newVacancy;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al crear vacante',
        isLoading: false 
      });
      throw error;
    }
  },

  updateVacancy: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.updateVacancy(id, data);
      const updatedVacancy = transformVacancy(response);
      
      set((state) => ({
        vacancies: state.vacancies.map((v) =>
          v.id === id ? updatedVacancy : v
        ),
        selectedVacancy: state.selectedVacancy?.id === id 
          ? updatedVacancy 
          : state.selectedVacancy,
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al actualizar vacante',
        isLoading: false 
      });
    }
  },

  toggleVacancyStatus: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.toggleVacancyActive(id);
      const updatedVacancy = transformVacancy(response);
      
      set((state) => ({
        vacancies: state.vacancies.map((v) =>
          v.id === id ? updatedVacancy : v
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al cambiar estado',
        isLoading: false 
      });
    }
  },

  deleteVacancy: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.deleteVacancy(id);
      
      set((state) => ({
        vacancies: state.vacancies.filter((v) => v.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al eliminar vacante',
        isLoading: false 
      });
    }
  },

  setFilters: (filters) => {
    set({ filters });
  },

  getFilteredVacancies: () => {
    const { vacancies, filters } = get();
    
    return vacancies.filter((vacancy) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !vacancy.title.toLowerCase().includes(searchLower) &&
          !vacancy.company.toLowerCase().includes(searchLower) &&
          !vacancy.location.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }
      
      if (filters.type && vacancy.type !== filters.type) {
        return false;
      }
      
      if (filters.status && vacancy.status !== filters.status) {
        return false;
      }
      
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'salary') {
        return (b.salary?.max || 0) - (a.salary?.max || 0);
      }
      if (filters.sortBy === 'applications') {
        return b.applicationsCount - a.applicationsCount;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));
