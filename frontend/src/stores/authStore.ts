import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginCredentials, RegisterData } from '@/types';
import { apiClient } from '@/lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiClient.login(credentials);
          
          if (response.user) {
            // Transform backend user format to frontend format
            const user: User = {
              id: response.user.id.toString(),
              email: response.user.email,
              name: response.user.name,
              role: response.user.role.toUpperCase() as 'ADMIN' | 'GESTOR' | 'CODER',
              avatar: response.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
              createdAt: new Date().toISOString(),
            };
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            
            // Inicializar aplicaciones del usuario si es CODER
            if (user.role === 'CODER') {
              // Importar dinámicamente para evitar dependencias circulares
              import('@/stores/applicationStore').then(({ useApplicationStore }) => {
                useApplicationStore.getState().fetchMyApplications();
              });
            }
            
            return true;
          }
          
          set({
            isLoading: false,
            error: 'Error en la respuesta del servidor',
          });
          return false;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Error de conexión',
          });
          return false;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiClient.register({
            name: data.name,
            email: data.email,
            password: data.password,
          });
          
          if (response.user) {
            // Transform backend user format to frontend format
            const user: User = {
              id: response.user.id.toString(),
              email: response.user.email,
              name: response.user.name,
              role: response.user.role.toUpperCase() as 'ADMIN' | 'GESTOR' | 'CODER',
              avatar: response.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
              createdAt: new Date().toISOString(),
            };
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return true;
          }
          
          set({
            isLoading: false,
            error: 'Error en el registro',
          });
          return false;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Error de conexión',
          });
          return false;
        }
      },

      logout: async () => {
        try {
          await apiClient.logout();
        } catch (error) {
          console.error('Error during logout:', error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
