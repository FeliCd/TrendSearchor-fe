export type UserRole = 'ADMIN' | 'RESEARCHER' | 'LECTURER_STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'LOCKED';
  createdAt: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  year: number;
  doi?: string;
  sourceUrl?: string;
  journalId: string;
  authors: Author[];
  keywords: Keyword[];
}

export interface Author {
  id: string;
  name: string;
  affiliationName?: string;
}

export interface Journal {
  id: string;
  name: string;
  issn?: string;
  publisher?: string;
  field?: string;
}

export interface Keyword {
  id: string;
  name: string;
  normalizedName: string;
}

export interface TrendData {
  year: number;
  paperCount: number;
  growthRate?: number;
}

export interface TrendingTopic {
  keyword: Keyword;
  trend: TrendData[];
  growthRate: number;
}

export interface SearchFilters {
  query?: string;
  author?: string;
  journal?: string;
  yearFrom?: number;
  yearTo?: number;
  sortBy?: 'relevance' | 'newest' | 'citations';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
