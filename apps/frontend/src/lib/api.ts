// API configuration
const API_BASE_URL = 'http://localhost:3000';
const API_KEY = 'riwi_api_key_2024_empleo_vacantes';

// API client with default configuration
class ApiClient {
  private baseURL: string;
  private apiKey: string;

  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        ...options.headers,
      },
      credentials: 'include', // Important for HttpOnly cookies
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data; // Handle standardized response format
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: { name: string; email: string; password: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Vacancies endpoints
  async getVacancies() {
    return this.request('/vacancies');
  }

  async getVacanciesPublic() {
    const url = `${this.baseURL}/vacancies/public`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getVacancy(id: string) {
    return this.request(`/vacancies/${id}`);
  }

  async createVacancy(vacancyData: any) {
    return this.request('/vacancies', {
      method: 'POST',
      body: JSON.stringify(vacancyData),
    });
  }

  async updateVacancy(id: string, vacancyData: any) {
    return this.request(`/vacancies/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(vacancyData),
    });
  }

  async toggleVacancyActive(id: string) {
    return this.request(`/vacancies/${id}/toggle-active`, {
      method: 'PATCH',
    });
  }

  async deleteVacancy(id: string) {
    return this.request(`/vacancies/${id}`, {
      method: 'DELETE',
    });
  }

  // Applications endpoints
  async applyToVacancy(vacancyId: number) {
    return this.request('/applications/apply', {
      method: 'POST',
      body: JSON.stringify({ vacancyId }),
    });
  }

  async getMyApplications() {
    return this.request('/applications/my-applications');
  }

  async getAllApplications() {
    return this.request('/applications');
  }

  async getVacancyApplications(vacancyId: string) {
    return this.request(`/applications/vacancy/${vacancyId}`);
  }

  async deleteApplication(id: string) {
    return this.request(`/applications/${id}`, {
      method: 'DELETE',
    });
  }

  // Users endpoints (Admin only)
  async getUsers() {
    return this.request('/users');
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL, API_KEY);

// Export types for better TypeScript support
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp?: string;
  path?: string;
  method?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
}