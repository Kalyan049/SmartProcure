/**
 * PublicRoute — Module 5: Authentication & Role-Based Access
 *
 * Wraps public pages (login, register) and redirects authenticated users to
 * their role-specific dashboard.
 *
 * Shows a loading screen while session is being resolved to prevent an
 * incorrect flash of the login page for already-authenticated users.
 */
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { AuthLoadingScreen } from '@/components/feedback/AuthLoadingScreen';

export interface PublicRouteProps {
  children?: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, role } = useAuth();

  // Wait for session resolution before deciding to redirect
  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  // Already logged in → send to their portal
  if (isAuthenticated) {
    const redirectPath =
      role === 'OFFICER'
        ? '/officer/dashboard'
        : role === 'ADMIN'
          ? '/admin/dashboard'
          : '/farmer/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
