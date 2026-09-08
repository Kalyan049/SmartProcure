import { API_ENDPOINTS } from '@/app/config/api.config';
import { fetchApi } from './apiClient';

export interface HealthStatus {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  uptimeSeconds: number;
}

export const healthService = {
  check: async (): Promise<HealthStatus> => {
    return fetchApi<HealthStatus>(API_ENDPOINTS.HEALTH);
  },
};
