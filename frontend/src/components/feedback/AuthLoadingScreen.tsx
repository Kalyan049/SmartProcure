/**
 * AuthLoadingScreen
 * Full-page branded loading state shown while the Supabase session is being
 * resolved on initial page load. Prevents a flash of the login page for
 * already-authenticated users.
 */
import React from 'react';
import { Sprout } from 'lucide-react';

interface AuthLoadingScreenProps {
  message?: string;
}

export const AuthLoadingScreen: React.FC<AuthLoadingScreenProps> = ({
  message = 'Checking your session…',
}) => {
  return (
    <div
      className="min-h-screen bg-surface-page flex flex-col items-center justify-center gap-6"
      role="status"
      aria-label="Loading SmartProcure"
    >
      {/* Animated logo */}
      <div className="relative">
        {/* Outer ring pulse */}
        <span className="absolute inset-0 rounded-full bg-brand-primary opacity-20 animate-ping" />
        <div className="relative w-16 h-16 rounded-2xl bg-brand-dark flex items-center justify-center shadow-lg">
          <Sprout className="w-9 h-9 text-brand-mint" aria-hidden="true" />
        </div>
      </div>

      {/* Wordmark */}
      <div className="text-center">
        <p className="text-xl font-extrabold text-brand-dark tracking-tight">SmartProcure</p>
        <p className="text-xs text-text-secondary mt-1">
          Right Information. Less Waiting. Brighter Tomorrows.
        </p>
      </div>

      {/* Spinner */}
      <div className="flex flex-col items-center gap-3">
        <svg
          className="w-6 h-6 animate-spin text-brand-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <p className="text-sm text-text-secondary">{message}</p>
      </div>

      {/* Footer branding */}
      <p className="absolute bottom-6 text-xs text-text-secondary opacity-60">
        Ministry of Consumer Affairs, Food &amp; Public Distribution
      </p>
    </div>
  );
};
