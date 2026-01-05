import { create } from 'zustand';
import { Application, ApplicationStatus } from '@/types';
import { apiClient } from '@/lib/api';

const MAX_APPLICATIONS = 3;

interface ApplicationState {
  applications: Application[];
  myApplications: Application[];
  isLoading: boolean;
  error: string | null;
  
  fetchApplications: () => Promise<void>;
  fetchMyApplications: () => Promise<void>;
  applyToVacancy: (vacancyId: number) => Promise<boolean>;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => Promise<void>;
  hasApplied: (vacancyId: string) => boolean;
  getApplicationCount: () => number;
  canApply: () => boolean;
  clearError: () => void;
}

// Transform backend application to frontend format
const transformApplication = (backendApp: any): Application => {
  const changes = JSON.parse(localStorage.getItem('appStatusChanges') || '{}');
  const savedStatus = changes[backendApp.id.toString()];
  
  return {
    id: backendApp.id.toString(),
    vacancyId: backendApp.vacancyId.toString(),
    userId: backendApp.userId.toString(),
    status: savedStatus || 'PENDING' as ApplicationStatus,
    appliedAt: backendApp.createdAt,
    vacancy: backendApp.vacancy ? {
      id: backendApp.vacancy.id.toString(),
      title: backendApp.vacancy.title,
      company: backendApp.vacancy.company,
      location: backendApp.vacancy.location,
    } : undefined,
    user: backendApp.user ? {
      id: backendApp.user.id.toString(),
      name: backendApp.user.name,
      email: backendApp.user.email,
    } : undefined,
  };
};

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  applications: [],
  myApplications: [],
  isLoading: false,
  error: null,

  fetchApplications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getAllApplications();
      const applications = Array.isArray(response) ? response.map(transformApplication) : [];
      set({ applications, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al cargar postulaciones',
        isLoading: false 
      });
    }
  },

  fetchMyApplications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getMyApplications();
      const myApplications = Array.isArray(response) ? response.map(transformApplication) : [];
      set({ myApplications, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al cargar mis postulaciones',
        isLoading: false 
      });
    }
  },

  applyToVacancy: async (vacancyId) => {
    const { hasApplied, canApply } = get();
    
    if (hasApplied(vacancyId.toString())) {
      set({ error: 'Ya has aplicado a esta vacante' });
      return false;
    }
    
    if (!canApply()) {
      set({ error: `Has alcanzado el límite de ${MAX_APPLICATIONS} postulaciones` });
      return false;
    }
    
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.applyToVacancy(vacancyId);
      const newApplication = transformApplication(response);
      
      set((state) => ({
        myApplications: [...state.myApplications, newApplication],
        isLoading: false,
      }));
      
      // Refrescar mis aplicaciones para tener datos actualizados
      get().fetchMyApplications();
      
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al postularse',
        isLoading: false 
      });
      return false;
    }
  },

  updateApplicationStatus: async (id, status) => {
    // Update local state and persist the change
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, status } : app
      ),
      myApplications: state.myApplications.map((app) =>
        app.id === id ? { ...app, status } : app
      ),
    }));
    
    // Store in localStorage to persist across refreshes
    const changes = JSON.parse(localStorage.getItem('appStatusChanges') || '{}');
    changes[id] = status;
    localStorage.setItem('appStatusChanges', JSON.stringify(changes));
  },

  hasApplied: (vacancyId) => {
    return get().myApplications.some(
      (app) => app.vacancyId === vacancyId
    );
  },

  getApplicationCount: () => {
    return get().myApplications.length;
  },

  canApply: () => {
    return get().getApplicationCount() < MAX_APPLICATIONS;
  },

  clearError: () => {
    set({ error: null });
  },
}));
