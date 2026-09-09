/**
 * SmartProcure AuthProvider — Module 5: Authentication & Role-Based Access
 *
 * Replaces the previous mock-only provider with real Supabase auth.
 *
 * Features:
 * - Subscribes to supabase.auth.onAuthStateChange for session persistence
 * - Fetches user profile (role, name, language) from public.users after login
 * - isLoading = true during initial session check (prevents login flash)
 * - Exposes authError for UI error display
 * - Graceful mock fallback when Supabase is not configured
 * - Language preference persisted to localStorage
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import type { UserRole, LanguageCode } from '@shared/types';
import {
  sendOtp as svcSendOtp,
  verifyOtpAndLogin as svcVerifyOtpAndLogin,
  registerFarmer as svcRegisterFarmer,
  logout as svcLogout,
  fetchUserProfile,
  type FarmerRegistrationData,
  type UserProfileData,
} from '@/services/auth/authService';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthContextType {
  /** Application-level user profile (from public.users table) */
  user: UserProfileData | null;
  /** Shorthand role accessor */
  role: UserRole;
  /** Whether a valid session exists */
  isAuthenticated: boolean;
  /** True while the initial session check is in progress */
  isLoading: boolean;
  /** Auth error message, if any */
  authError: string | null;
  /** Preferred UI language */
  language: LanguageCode;

  /** Step 1 of login: send simulated OTP */
  sendOtp: (mobile: string) => Promise<{ success: boolean; error?: string }>;
  /** Step 2 of login: verify OTP and create session */
  verifyOtpAndLogin: (mobile: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  /** Register a new farmer account */
  registerFarmer: (
    data: FarmerRegistrationData
  ) => Promise<{ success: boolean; farmerIdCode?: string; error?: string }>;
  /** Sign out and clear session */
  logout: () => Promise<void>;
  /** Set the UI language preference */
  setLanguage: (lang: LanguageCode) => void;
  /** Clear any displayed auth error */
  clearError: () => void;

  /**
   * @deprecated Legacy mock-mode helper. Kept temporarily for backward
   * compatibility with any code that still calls loginAs(). Use
   * verifyOtpAndLogin() for real auth.
   */
  loginAs: (role: UserRole, name?: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Demo mock users (for backward compat in mock mode) ───────────────────────

const MOCK_USERS: Record<UserRole, UserProfileData> = {
  FARMER: {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'Ramesh Kumar',
    mobile: '9876543210',
    role: 'FARMER',
    language: 'en',
    created_at: new Date().toISOString(),
  },
  OFFICER: {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    name: 'Procurement Officer Rawat',
    mobile: '9999999999',
    role: 'OFFICER',
    language: 'en',
    created_at: new Date().toISOString(),
  },
  ADMIN: {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    name: 'System Administrator',
    mobile: '8888888888',
    role: 'ADMIN',
    language: 'en',
    created_at: new Date().toISOString(),
  },
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('smartprocure_lang') as LanguageCode) || 'en';
  });

  const role: UserRole = user?.role ?? 'FARMER';

  // ── Session handling ────────────────────────────────────────────────────────

  const loadProfileFromSession = useCallback(async (session: Session | null) => {
    if (!session?.user) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const profile = await fetchUserProfile(session.user.id);
      if (profile) {
        setUser(profile);
        // Restore persisted language preference
        const savedLang = localStorage.getItem('smartprocure_lang') as LanguageCode;
        if (savedLang) setLanguageState(savedLang);
      } else {
        // Auth user exists but no app profile — sign out to prevent inconsistent state
        console.warn('[Auth] No app profile found for auth user, signing out.');
        await supabase.auth.signOut();
        setUser(null);
      }
    } catch (err) {
      console.error('[Auth] Error loading profile from session:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Initial session check + subscription ───────────────────────────────────

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Mock mode: restore previously set role from localStorage
      const savedRole = localStorage.getItem('smartprocure_role') as UserRole | null;
      const savedMockUser =
        savedRole && MOCK_USERS[savedRole] ? MOCK_USERS[savedRole] : null;
      setUser(savedMockUser);
      setIsLoading(false);
      return;
    }

    // Get initial session synchronously from storage, then validate with server
    supabase.auth.getSession().then(({ data }) => {
      loadProfileFromSession(data.session);
    });

    // Subscribe to auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      loadProfileFromSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadProfileFromSession]);

  // ── Language persistence ────────────────────────────────────────────────────

  useEffect(() => {
    localStorage.setItem('smartprocure_lang', language);
  }, [language]);

  // ── Auth actions ────────────────────────────────────────────────────────────

  const sendOtp = useCallback(
    async (mobile: string): Promise<{ success: boolean; error?: string }> => {
      setAuthError(null);
      const result = await svcSendOtp(mobile);
      if (!result.success && result.error) setAuthError(result.error);
      return result;
    },
    []
  );

  const verifyOtpAndLogin = useCallback(
    async (mobile: string, otp: string): Promise<{ success: boolean; error?: string }> => {
      setAuthError(null);
      const result = await svcVerifyOtpAndLogin(mobile, otp);

      if (result.success && result.data) {
        setUser(result.data);
        if (!isSupabaseConfigured) {
          // In mock mode, persist role for session-restore on next load
          localStorage.setItem('smartprocure_role', result.data.role);
        }
      } else if (result.error) {
        setAuthError(result.error);
      }

      return { success: result.success, error: result.error };
    },
    []
  );

  const registerFarmer = useCallback(
    async (
      data: FarmerRegistrationData
    ): Promise<{ success: boolean; farmerIdCode?: string; error?: string }> => {
      setAuthError(null);
      const result = await svcRegisterFarmer(data);

      if (!result.success && result.error) {
        setAuthError(result.error);
      }

      return {
        success: result.success,
        farmerIdCode: result.data?.farmerIdCode,
        error: result.error,
      };
    },
    []
  );

  const logout = useCallback(async () => {
    setAuthError(null);
    await svcLogout();
    setUser(null);
    if (!isSupabaseConfigured) {
      localStorage.removeItem('smartprocure_role');
    }
  }, []);

  const setLanguage = useCallback(
    (lang: LanguageCode) => {
      setLanguageState(lang);
      if (user) {
        setUser({ ...user, language: lang });
      }
    },
    [user]
  );

  const clearError = useCallback(() => setAuthError(null), []);

  // ── Legacy loginAs (mock compat) ────────────────────────────────────────────

  const loginAs = useCallback((newRole: UserRole, name?: string) => {
    const baseUser = MOCK_USERS[newRole];
    const mockUser: UserProfileData = {
      ...baseUser,
      name: name || baseUser.name,
    };
    setUser(mockUser);
    localStorage.setItem('smartprocure_role', newRole);
  }, []);

  // ─── Context value ──────────────────────────────────────────────────────────

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        isLoading,
        authError,
        language,
        sendOtp,
        verifyOtpAndLogin,
        registerFarmer,
        logout,
        setLanguage,
        clearError,
        loginAs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ──────────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
