/**
 * UnauthorizedPage — Module 5: Authentication & Role-Based Access
 *
 * Shown when an authenticated user tries to access a route their role
 * does not have permission for (e.g. a farmer accessing /officer/dashboard).
 *
 * Provides a clear message and a direct link back to their correct dashboard.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldOff, ArrowRight, LogOut } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';

export const UnauthorizedPage: React.FC = () => {
  const { role, logout, user } = useAuth();
  const navigate = useNavigate();

  const dashboardPath =
    role === 'OFFICER'
      ? '/officer/dashboard'
      : role === 'ADMIN'
        ? '/admin/dashboard'
        : '/farmer/dashboard';

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface-page flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center space-y-6">

        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-status-error/10 flex items-center justify-center mx-auto">
          <ShieldOff className="w-10 h-10 text-status-error" aria-hidden="true" />
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">Access Denied</h1>
          <p className="text-sm text-text-secondary mt-2">
            You don&apos;t have permission to view this page.
            {user?.name && (
              <> Your account (<span className="font-semibold text-text-primary">{user.name}</span>)
                is registered as a <span className="font-semibold text-brand-primary">{role}</span>.
              </>
            )}
          </p>
        </div>

        {/* Info card */}
        <div className="p-4 rounded-xl bg-white border border-surface-border shadow-card text-left space-y-2 text-sm">
          <p className="font-semibold text-text-primary">What happened?</p>
          <ul className="text-xs text-text-secondary space-y-1 list-disc list-inside">
            <li>You tried to access a section restricted to a different role.</li>
            <li>Each role has its own dedicated portal in SmartProcure.</li>
            <li>If you believe this is a mistake, contact your administrator.</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            id="go-to-dashboard-btn"
            onClick={() => navigate(dashboardPath, { replace: true })}
            className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold text-sm uppercase tracking-wide py-3 rounded-xl hover:bg-brand-dark transition-colors"
          >
            Go to My Dashboard
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            id="logout-from-unauthorized-btn"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 border border-surface-border text-text-secondary text-sm py-2.5 rounded-xl hover:bg-surface-page hover:text-text-primary transition-colors"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            Sign Out &amp; Switch Account
          </button>
        </div>

        {/* Ministry footer */}
        <p className="text-xs text-text-secondary opacity-60">
          SmartProcure — Ministry of Consumer Affairs, Food &amp; Public Distribution
        </p>
      </div>
    </div>
  );
};
