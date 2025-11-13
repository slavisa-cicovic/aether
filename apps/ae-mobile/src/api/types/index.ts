// src/types/index.ts
export interface ApiEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  description?: string;
  requiresAuth?: boolean;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  headers?: Record<string, string>;
}
