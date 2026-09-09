import { ENV } from './env';

export const API_ENDPOINTS = {
  HEALTH: `${ENV.API_URL}/health`,
  AUTH: {
    SEND_OTP: `${ENV.API_URL}/auth/send-otp`,
    VERIFY_OTP: `${ENV.API_URL}/auth/verify-otp`,
    ME: `${ENV.API_URL}/auth/me`,
    REGISTER: `${ENV.API_URL}/auth/register`,
    UPDATE_PROFILE: `${ENV.API_URL}/auth/profile`,
  },
  FARMERS: {
    PROFILE: `${ENV.API_URL}/farmers/me`,
    UPDATE_PROFILE: `${ENV.API_URL}/farmers/me`,
    HISTORY_BOOKINGS: `${ENV.API_URL}/farmers/me/history/bookings`,
    HISTORY_PROCUREMENT: `${ENV.API_URL}/farmers/me/history/procurement`,
    HISTORY_PAYMENTS: `${ENV.API_URL}/farmers/me/history/payments`,
  },
  CENTERS: {
    LIST: `${ENV.API_URL}/centers`,
    DETAIL: (id: string) => `${ENV.API_URL}/centers/${id}`,
    CAPACITY: (id: string) => `${ENV.API_URL}/centers/${id}/capacity`,
  },
  SLOTS: {
    LIST: `${ENV.API_URL}/slots`,
  },
  BOOKINGS: {
    MY: `${ENV.API_URL}/bookings/my`,
    CREATE: `${ENV.API_URL}/bookings`,
    DETAIL: (id: string) => `${ENV.API_URL}/bookings/${id}`,
  },
  RECOMMENDATION: {
    CALCULATE: `${ENV.API_URL}/recommendation`,
  },
  QUEUE: {
    MY: `${ENV.API_URL}/queue/my`,
    SHOULD_I_GO: `${ENV.API_URL}/queue/should-i-go-now`,
    BY_CENTER: (centerId: string) => `${ENV.API_URL}/queue/center/${centerId}`,
  },
  PROCUREMENT: {
    MY: `${ENV.API_URL}/procurement/my`,
    DETAIL: (id: string) => `${ENV.API_URL}/procurement/${id}`,
  },
  PAYMENTS: {
    MY: `${ENV.API_URL}/payments/my`,
    DETAIL: (id: string) => `${ENV.API_URL}/payments/${id}`,
  },
  NOTIFICATIONS: {
    LIST: `${ENV.API_URL}/notifications`,
    MARK_READ: (id: string) => `${ENV.API_URL}/notifications/${id}/read`,
  },
  VOICE: {
    INTERACT: `${ENV.API_URL}/voice/interact`,
    OUTBOUND_SIMULATE: `${ENV.API_URL}/voice/outbound/simulate`,
  },
  GRIEVANCES: {
    MY: `${ENV.API_URL}/grievances/my`,
    CREATE: `${ENV.API_URL}/grievances`,
  },
  ANALYTICS: {
    CENTER: (id: string) => `${ENV.API_URL}/analytics/center/${id}`,
  },
};
