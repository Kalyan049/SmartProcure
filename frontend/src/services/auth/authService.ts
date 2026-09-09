/**
 * SmartProcure Authentication Service
 * Module 5: Authentication & Role-Based Access
 *
 * All Supabase auth calls are centralised here.
 * Emails follow the convention: <mobile>@smartprocure.local so the mobile
 * number is the user-facing identifier and real emails are never required.
 *
 * OTP is SIMULATED for MVP — the demo OTP "123456" always passes.
 * Aadhaar verification is MOCKED — flag is set without real UIDAI call.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { UserRole, LanguageCode } from '@shared/types';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Demo OTP that always passes for any mobile number in MVP */
const DEMO_OTP = '123456';

/** Internal email domain — keeps mobile as the public identifier */
const EMAIL_DOMAIN = 'smartprocure.local';

/** Demo credentials map: mobile → password (used when Supabase is configured) */
const DEMO_CREDENTIALS: Record<string, string> = {
  '9876543210': 'DemoFarmer@123',
  '9999999999': 'DemoOfficer@123',
  '8888888888': 'DemoAdmin@123',
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FarmerRegistrationData {
  fullName: string;
  mobile: string;
  preferredLanguage: LanguageCode;
  landSizeAcres: number;
  landVillage: string;
  landDistrict: string;
  landState: string;
  primaryCrop: string;
  allCropsGrown: string[];
  /** Aadhaar last 4 digits — stored masked, not verified in MVP */
  aadhaarLast4?: string;
}

export interface AuthServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
}

export interface UserProfileData {
  id: string;
  name: string;
  mobile: string;
  role: UserRole;
  language: LanguageCode;
  avatar_url?: string | null;
  created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mobileToEmail(mobile: string): string {
  return `${mobile.trim()}@${EMAIL_DOMAIN}`;
}

function generateFarmerIdCode(): string {
  const num = 1000 + Math.floor(Math.random() * 8999);
  return `SP-FARMER-${num}`;
}

function generateStrongPassword(mobile: string): string {
  // Deterministic per mobile for demo accounts, random for real registrations
  if (DEMO_CREDENTIALS[mobile]) return DEMO_CREDENTIALS[mobile];
  return `SP@${mobile}#${Date.now().toString(36).toUpperCase()}`;
}

// ─── Mock data for offline/unconfigured mode ──────────────────────────────────

const MOCK_USERS: Record<string, UserProfileData & { password: string }> = {
  '9876543210': {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'Ramesh Kumar',
    mobile: '9876543210',
    role: 'FARMER',
    language: 'en',
    created_at: new Date().toISOString(),
    password: 'any', // OTP mode — password not checked
  },
  '9999999999': {
    id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    name: 'Procurement Officer Rawat',
    mobile: '9999999999',
    role: 'OFFICER',
    language: 'en',
    created_at: new Date().toISOString(),
    password: 'any',
  },
  '8888888888': {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    name: 'System Administrator',
    mobile: '8888888888',
    role: 'ADMIN',
    language: 'en',
    created_at: new Date().toISOString(),
    password: 'any',
  },
};

// ─── Auth Service ─────────────────────────────────────────────────────────────

/**
 * Step 1 of login: Send OTP to mobile number.
 *
 * In MVP, this is simulated — always returns success.
 * In production, this would call an SMS gateway.
 */
export async function sendOtp(mobile: string): Promise<AuthServiceResult> {
  const trimmed = mobile.trim();

  if (!trimmed || trimmed.length !== 10 || !/^\d{10}$/.test(trimmed)) {
    return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
  }

  // Simulate OTP sending delay
  await new Promise((r) => setTimeout(r, 800));

  console.log(`[SmartProcure Auth] OTP simulated for ${trimmed}. Use "${DEMO_OTP}" to verify.`);
  return { success: true };
}

/**
 * Step 2 of login: Verify OTP and sign in.
 *
 * Checks OTP (always 123456 in MVP), then signs in via Supabase email/password.
 * Falls back to mock mode when Supabase is not configured.
 */
export async function verifyOtpAndLogin(
  mobile: string,
  otp: string
): Promise<AuthServiceResult<UserProfileData>> {
  const trimmed = mobile.trim();

  // MVP: Accept only the demo OTP
  if (otp.trim() !== DEMO_OTP) {
    return {
      success: false,
      error: `Invalid OTP. For demo, use: ${DEMO_OTP}`,
      errorCode: 'INVALID_OTP',
    };
  }

  // ── Mock mode (no Supabase credentials) ──────────────────────────────────
  if (!isSupabaseConfigured) {
    const mockUser = MOCK_USERS[trimmed];
    if (!mockUser) {
      return {
        success: false,
        error: 'Mobile number not registered. Please register first.',
        errorCode: 'USER_NOT_FOUND',
      };
    }
    const { password: _p, ...profile } = mockUser;
    return { success: true, data: profile };
  }

  // ── Supabase mode ─────────────────────────────────────────────────────────
  const email = mobileToEmail(trimmed);
  const password = generateStrongPassword(trimmed);

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    // Provide friendly message for common errors
    if (authError?.message?.toLowerCase().includes('invalid login')) {
      return {
        success: false,
        error: 'Mobile number not registered or account not set up. Please register.',
        errorCode: 'USER_NOT_FOUND',
      };
    }
    return {
      success: false,
      error: authError?.message || 'Login failed. Please try again.',
      errorCode: 'AUTH_ERROR',
    };
  }

  // Fetch role and profile from app users table
  const profile = await fetchUserProfile(authData.user.id);
  if (!profile) {
    return {
      success: false,
      error: 'Account profile not found. Please contact support.',
      errorCode: 'PROFILE_NOT_FOUND',
    };
  }

  return { success: true, data: profile };
}

/**
 * Register a new farmer account.
 *
 * Flow:
 * 1. Create Supabase auth user (email = mobile@smartprocure.local)
 * 2. Insert row into public.users
 * 3. Insert row into public.farmer_profiles
 * 4. Return generated Farmer ID code
 *
 * In mock mode, simulates success without DB writes.
 */
export async function registerFarmer(
  data: FarmerRegistrationData
): Promise<AuthServiceResult<{ farmerIdCode: string; userId: string }>> {
  const mobile = data.mobile.trim();

  if (!mobile || mobile.length !== 10) {
    return { success: false, error: 'Invalid mobile number.' };
  }
  if (!data.fullName.trim()) {
    return { success: false, error: 'Full name is required.' };
  }

  const farmerIdCode = generateFarmerIdCode();

  // ── Mock mode ─────────────────────────────────────────────────────────────
  if (!isSupabaseConfigured) {
    await new Promise((r) => setTimeout(r, 1200));
    const mockId = `mock-${Date.now()}`;
    return { success: true, data: { farmerIdCode, userId: mockId } };
  }

  // ── Supabase mode ─────────────────────────────────────────────────────────
  const email = mobileToEmail(mobile);
  const password = generateStrongPassword(mobile);

  // 1. Create auth user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        mobile,
        name: data.fullName,
        role: 'FARMER',
      },
    },
  });

  if (signUpError || !signUpData.user) {
    if (signUpError?.message?.toLowerCase().includes('already registered')) {
      return {
        success: false,
        error: 'This mobile number is already registered. Please login instead.',
        errorCode: 'ALREADY_REGISTERED',
      };
    }
    return {
      success: false,
      error: signUpError?.message || 'Registration failed. Please try again.',
      errorCode: 'SIGNUP_ERROR',
    };
  }

  const userId = signUpData.user.id;

  // 2. Insert into public.users
  const { error: userInsertError } = await supabase.from('users').insert({
    id: userId,
    name: data.fullName.trim(),
    mobile,
    role: 'FARMER' as const,
    language: data.preferredLanguage,
  });

  if (userInsertError) {
    console.error('[Auth] Failed to insert user profile:', userInsertError);
    return {
      success: false,
      error: 'Failed to create user profile. Please try again.',
      errorCode: 'PROFILE_INSERT_ERROR',
    };
  }

  // 3. Insert into farmer_profiles (simulated Aadhaar verification = true for MVP)
  const { error: profileInsertError } = await supabase.from('farmer_profiles').insert({
    user_id: userId,
    farmer_id_code: farmerIdCode,
    is_aadhaar_verified: true, // MVP: simulated — no real UIDAI call
    land_size_acres: data.landSizeAcres || 0,
    land_village: data.landVillage || '',
    land_district: data.landDistrict || '',
    land_state: data.landState || '',
    crops_grown: data.allCropsGrown.length > 0 ? data.allCropsGrown : [data.primaryCrop],
  });

  if (profileInsertError) {
    console.error('[Auth] Failed to insert farmer profile:', profileInsertError);
    // Non-fatal — user can update profile later
  }

  return { success: true, data: { farmerIdCode, userId } };
}

/**
 * Sign out the current user and clear the Supabase session.
 */
export async function logout(): Promise<void> {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  }
  // Clear any cached role/session data
  localStorage.removeItem('smartprocure_role');
  localStorage.removeItem('smartprocure_lang');
}

/**
 * Fetch the application-level user profile (role, name, language) from the
 * public.users table using the Supabase auth UID.
 */
export async function fetchUserProfile(userId: string): Promise<UserProfileData | null> {
  if (!isSupabaseConfigured) {
    // Find by ID in mock data
    const mockUser = Object.values(MOCK_USERS).find((u) => u.id === userId);
    if (!mockUser) return null;
    const { password: _p, ...profile } = mockUser;
    return profile;
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, name, mobile, role, language, avatar_url, created_at')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    mobile: data.mobile,
    role: data.role as UserRole,
    language: (data.language as LanguageCode) || 'en',
    avatar_url: data.avatar_url,
    created_at: data.created_at,
  };
}

/**
 * Get the current active Supabase session (for session persistence on page load).
 * Returns null when in mock mode.
 */
export async function getCurrentSession() {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}
