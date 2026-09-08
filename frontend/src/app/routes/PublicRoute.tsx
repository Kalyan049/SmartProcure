import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';

export interface PublicRouteProps {
  children?: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated) {
    const redirectPath = role === 'OFFICER' ? '/officer/dashboard' : '/farmer/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
