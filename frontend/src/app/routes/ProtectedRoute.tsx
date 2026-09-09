/**
 * ProtectedRoute — Module 5: Authentication & Role-Based Access
 *
 * Guards routes that require authentication and/or specific roles.
 *
 * Behaviour:
 * - Shows AuthLoadingScreen while session resolves (isLoading = true)
 * - Redirects to /login if not authenticated
 * - Redirects to /unauthorized if role is not in allowedRoles
 * - Renders Outlet (or children) when all checks pass
 */
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { AuthLoadingScreen } from '@/components/feedback/AuthLoadingScreen';
import type { UserRole } from '@shared/types';

export interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  // Wait for initial session check to complete
  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  // Not authenticated → send to login, preserving intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check: user is authenticated but lacks permission for this section
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
