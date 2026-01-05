// User roles
export type UserRole = 'ADMIN' | 'GESTOR' | 'CODER';

// User type
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

// Vacancy status
export type VacancyStatus = 'ACTIVE' | 'INACTIVE' | 'CLOSED';

// Vacancy type
export interface Vacancy {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'remote' | 'hybrid' | 'onsite';
  salary: {
    min: number;
    max: number;
    currency: string;
    range?: string; // Backend salary range format
  };
  description: string;
  requirements: string[];
  benefits: string[];
  status: VacancyStatus;
  createdBy: string;
  createdAt: string;
  applicationsCount: number;
  seniority?: string; // Backend field
  maxApplicants?: number; // Backend field
}

// Application status
export type ApplicationStatus = 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED';

// Application type
export interface Application {
  id: string;
  vacancyId: string;
  vacancy?: {
    id: string;
    title: string;
    company: string;
    location: string;
  };
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  status: ApplicationStatus;
  coverLetter?: string;
  appliedAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role?: UserRole;
}

// API Response
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter types
export interface VacancyFilters {
  search?: string;
  type?: 'remote' | 'hybrid' | 'onsite' | '';
  status?: VacancyStatus | '';
  sortBy?: 'newest' | 'salary' | 'applications';
}
