/**
 * SmartProcure Auth Service — Module 5: Authentication & Role-Based Access
 *
 * Centralised service layer for all authentication and user-profile operations.
 * Dual-mode:
 *   - Supabase mode: reads/writes via the Supabase client
 *   - Mock mode: uses in-memory seed data when Supabase is not configured
 *
 * OTP is SIMULATED for MVP — the demo OTP "123456" always passes.
 */

import { supabase, isDatabaseConfigured } from '../../config/supabase';
import type { UserRole, LanguageCode, User, FarmerProfile } from '../../../../shared/types';
import { logger } from '../../utils/logger';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Demo OTP that always passes in MVP */
const DEMO_OTP = '123456';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProfileData {
  id: string;
  name: string;
  mobile: string;
  role: UserRole;
  language: LanguageCode;
  avatar_url?: string | null;
  created_at: string;
}

export interface FarmerRegistrationInput {
  fullName: string;
  mobile: string;
  preferredLanguage: LanguageCode;
  landSizeAcres: number;
  landVillage: string;
  landDistrict: string;
  landState: string;
  primaryCrop: string;
  allCropsGrown: string[];
  aadhaarLast4?: string;
}

export interface ProfileUpdateInput {
  name?: string;
  language?: LanguageCode;
  avatar_url?: string;
}

export interface AuthResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
}

// ─── In-memory Mock Data ──────────────────────────────────────────────────────

const MOCK_USERS: Map<string, UserProfileData> = new Map([
  [
    '9876543210',
    {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      name: 'Ramesh Kumar',
      mobile: '9876543210',
      role: 'FARMER',
      language: 'en',
      created_at: '2026-01-15T10:00:00.000Z',
    },
  ],
  [
    '9999999999',
    {
      id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
      name: 'Procurement Officer Rawat',
      mobile: '9999999999',
      role: 'OFFICER',
      language: 'en',
      created_at: '2026-01-10T08:00:00.000Z',
    },
  ],
  [
    '8888888888',
    {
      id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
      name: 'System Administrator',
      mobile: '8888888888',
      role: 'ADMIN',
      language: 'en',
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ],
]);

/** Index by ID for quick lookups */
const MOCK_USERS_BY_ID: Map<string, UserProfileData> = new Map(
  Array.from(MOCK_USERS.values()).map((u) => [u.id, u])
);

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Step 1: Send OTP to mobile number.
 * In MVP, this is always simulated — returns success.
 */
export async function sendOtp(mobile: string): Promise<AuthResult> {
  if (!mobile || mobile.length !== 10 || !/^\d{10}$/.test(mobile)) {
    return { success: false, error: 'Please enter a valid 10-digit mobile number.', errorCode: 'INVALID_MOBILE' };
  }

  // Simulate network delay
  await new Promise((r) => setTimeout(r, 300));

  logger.info(`[Auth] OTP simulated for ${mobile}. Use "${DEMO_OTP}" to verify.`);
  return { success: true, data: { mobile, otpSent: true, expiresInSec: 300, demoOtp: DEMO_OTP } as any };
}

/**
 * Step 2: Verify OTP and return user profile.
 * MVP: accepts only the demo OTP "123456".
 */
export async function verifyOtp(
  mobile: string,
  otp: string
): Promise<AuthResult<{ user: UserProfileData; token: string }>> {
  if (otp.trim() !== DEMO_OTP) {
    return { success: false, error: `Invalid OTP. For demo, use: ${DEMO_OTP}`, errorCode: 'INVALID_OTP' };
  }

  // ── Mock mode ─────────────────────────────────────────────────────────────
  if (!isDatabaseConfigured()) {
    const mockUser = MOCK_USERS.get(mobile);
    if (!mockUser) {
      return {
        success: false,
        error: 'Mobile number not registered. Please register first.',
        errorCode: 'USER_NOT_FOUND',
      };
    }
    return {
      success: true,
      data: { user: mockUser, token: `mock-jwt-${mockUser.id}-${Date.now()}` },
    };
  }

  // ── Supabase mode ─────────────────────────────────────────────────────────
  if (!supabase) {
    return { success: false, error: 'Database not configured.', errorCode: 'DB_ERROR' };
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, name, mobile, role, language, avatar_url, created_at')
    .eq('mobile', mobile)
    .single();

  if (error || !data) {
    return {
      success: false,
      error: 'Mobile number not registered. Please register first.',
      errorCode: 'USER_NOT_FOUND',
    };
  }

  const profile: UserProfileData = {
    id: data.id,
    name: data.name,
    mobile: data.mobile,
    role: data.role as UserRole,
    language: (data.language as LanguageCode) || 'en',
    avatar_url: data.avatar_url,
    created_at: data.created_at,
  };

  // Generate a mock JWT token for the backend (real Supabase JWT comes from
  // the frontend SDK — this token is used when the frontend calls the backend API)
  const token = `mock-jwt-${profile.id}-${Date.now()}`;

  return { success: true, data: { user: profile, token } };
}

/**
 * Register a new farmer account.
 *
 * Creates a record in `users` and `farmer_profiles`.
 */
export async function registerFarmer(
  input: FarmerRegistrationInput
): Promise<AuthResult<{ farmerIdCode: string; userId: string }>> {
  const mobile = input.mobile.trim();

  if (!mobile || mobile.length !== 10) {
    return { success: false, error: 'Invalid mobile number.', errorCode: 'INVALID_MOBILE' };
  }
  if (!input.fullName.trim()) {
    return { success: false, error: 'Full name is required.', errorCode: 'MISSING_NAME' };
  }

  const farmerIdCode = `SP-FARMER-${1000 + Math.floor(Math.random() * 8999)}`;

  // ── Mock mode ─────────────────────────────────────────────────────────────
  if (!isDatabaseConfigured()) {
    if (MOCK_USERS.has(mobile)) {
      return {
        success: false,
        error: 'This mobile number is already registered.',
        errorCode: 'ALREADY_REGISTERED',
      };
    }

    const newId = `mock-user-${Date.now()}`;
    const newUser: UserProfileData = {
      id: newId,
      name: input.fullName.trim(),
      mobile,
      role: 'FARMER',
      language: input.preferredLanguage || 'en',
      created_at: new Date().toISOString(),
    };

    MOCK_USERS.set(mobile, newUser);
    MOCK_USERS_BY_ID.set(newId, newUser);

    logger.info(`[Auth] Mock farmer registered: ${farmerIdCode} (${mobile})`);
    return { success: true, data: { farmerIdCode, userId: newId } };
  }

  // ── Supabase mode ─────────────────────────────────────────────────────────
  if (!supabase) {
    return { success: false, error: 'Database not configured.', errorCode: 'DB_ERROR' };
  }

  // Check for existing user
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('mobile', mobile)
    .single();

  if (existing) {
    return {
      success: false,
      error: 'This mobile number is already registered. Please login instead.',
      errorCode: 'ALREADY_REGISTERED',
    };
  }

  // Insert into users table
  const { data: newUser, error: userError } = await supabase
    .from('users')
    .insert({
      name: input.fullName.trim(),
      mobile,
      role: 'FARMER' as const,
      language: input.preferredLanguage || 'en',
    })
    .select('id')
    .single();

  if (userError || !newUser) {
    logger.error('[Auth] Failed to create user:', userError);
    return { success: false, error: 'Registration failed. Please try again.', errorCode: 'DB_INSERT_ERROR' };
  }

  // Insert into farmer_profiles
  const { error: profileError } = await supabase.from('farmer_profiles').insert({
    user_id: newUser.id,
    farmer_id_code: farmerIdCode,
    is_aadhaar_verified: true, // MVP: simulated
    land_size_acres: input.landSizeAcres || 0,
    land_village: input.landVillage || '',
    land_district: input.landDistrict || '',
    land_state: input.landState || '',
    crops_grown: input.allCropsGrown.length > 0 ? input.allCropsGrown : [input.primaryCrop],
  });

  if (profileError) {
    logger.error('[Auth] Failed to create farmer profile (non-fatal):', profileError);
  }

  logger.info(`[Auth] Farmer registered: ${farmerIdCode} (${mobile})`);
  return { success: true, data: { farmerIdCode, userId: newUser.id } };
}

/**
 * Get user profile by ID.
 */
export async function getUserProfile(userId: string): Promise<AuthResult<UserProfileData>> {
  // ── Mock mode ─────────────────────────────────────────────────────────────
  if (!isDatabaseConfigured()) {
    const user = MOCK_USERS_BY_ID.get(userId);
    if (!user) {
      return { success: false, error: 'User not found.', errorCode: 'USER_NOT_FOUND' };
    }
    return { success: true, data: user };
  }

  // ── Supabase mode ─────────────────────────────────────────────────────────
  if (!supabase) {
    return { success: false, error: 'Database not configured.', errorCode: 'DB_ERROR' };
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, name, mobile, role, language, avatar_url, created_at')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return { success: false, error: 'User not found.', errorCode: 'USER_NOT_FOUND' };
  }

  return {
    success: true,
    data: {
      id: data.id,
      name: data.name,
      mobile: data.mobile,
      role: data.role as UserRole,
      language: (data.language as LanguageCode) || 'en',
      avatar_url: data.avatar_url,
      created_at: data.created_at,
    },
  };
}

/**
 * Update user profile (name, language, avatar).
 */
export async function updateUserProfile(
  userId: string,
  updates: ProfileUpdateInput
): Promise<AuthResult<UserProfileData>> {
  // ── Mock mode ─────────────────────────────────────────────────────────────
  if (!isDatabaseConfigured()) {
    const user = MOCK_USERS_BY_ID.get(userId);
    if (!user) {
      return { success: false, error: 'User not found.', errorCode: 'USER_NOT_FOUND' };
    }

    const updated: UserProfileData = {
      ...user,
      ...(updates.name && { name: updates.name }),
      ...(updates.language && { language: updates.language }),
      ...(updates.avatar_url !== undefined && { avatar_url: updates.avatar_url }),
    };

    MOCK_USERS_BY_ID.set(userId, updated);
    MOCK_USERS.set(updated.mobile, updated);

    return { success: true, data: updated };
  }

  // ── Supabase mode ─────────────────────────────────────────────────────────
  if (!supabase) {
    return { success: false, error: 'Database not configured.', errorCode: 'DB_ERROR' };
  }

  const updatePayload: Record<string, unknown> = {};
  if (updates.name) updatePayload.name = updates.name;
  if (updates.language) updatePayload.language = updates.language;
  if (updates.avatar_url !== undefined) updatePayload.avatar_url = updates.avatar_url;

  if (Object.keys(updatePayload).length === 0) {
    return { success: false, error: 'No fields to update.', errorCode: 'EMPTY_UPDATE' };
  }

  const { data, error } = await supabase
    .from('users')
    .update(updatePayload)
    .eq('id', userId)
    .select('id, name, mobile, role, language, avatar_url, created_at')
    .single();

  if (error || !data) {
    logger.error('[Auth] Failed to update user profile:', error);
    return { success: false, error: 'Failed to update profile.', errorCode: 'DB_UPDATE_ERROR' };
  }

  return {
    success: true,
    data: {
      id: data.id,
      name: data.name,
      mobile: data.mobile,
      role: data.role as UserRole,
      language: (data.language as LanguageCode) || 'en',
      avatar_url: data.avatar_url,
      created_at: data.created_at,
    },
  };
}
