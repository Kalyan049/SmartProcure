import { ApiResponse } from '@shared/types';

import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export class ApiError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export async function fetchApi<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (isSupabaseConfigured) {
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) {
      defaultHeaders['Authorization'] = `Bearer ${data.session.access_token}`;
    }
  }

  // Fallback for mock testing
  const mockUserId = localStorage.getItem('smartprocure_mock_user_id');
  if (mockUserId) {
    defaultHeaders['x-mock-user-id'] = mockUserId;
  }

  const role = localStorage.getItem('smartprocure_role') || 'FARMER';
  defaultHeaders['x-mock-role'] = role;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
      throw new ApiError(
        data.message || `Request failed with status ${response.status}`,
        response.status,
        data.code
      );
    }

    return data.data as T;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }
    const message = error instanceof Error ? error.message : 'Network error';
    throw new ApiError(message, 0, 'NETWORK_ERROR');
  }
}
