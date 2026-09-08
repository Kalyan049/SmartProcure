import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { FarmerLayout } from '@/components/layout/FarmerLayout';
import { OfficerLayout } from '@/components/layout/OfficerLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

// Public Auth Views
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';

// Farmer Views
import { FarmerDashboardPage } from '@/features/farmer/FarmerDashboardPage';
import { CenterDiscoveryPage } from '@/features/farmer/CenterDiscoveryPage';
import { BookingPage } from '@/features/farmer/BookingPage';
import { BookingConfirmationPage } from '@/features/farmer/BookingConfirmationPage';
import { RecommendationPage } from '@/features/farmer/RecommendationPage';
import { LiveQueuePage } from '@/features/farmer/LiveQueuePage';
import { ShouldIGoNowPage } from '@/features/farmer/ShouldIGoNowPage';
import { ProcurementTrackingPage } from '@/features/farmer/ProcurementTrackingPage';
import { PaymentsPage } from '@/features/farmer/PaymentsPage';
import { FarmerProfilePage } from '@/features/farmer/FarmerProfilePage';
import { NotificationsPage } from '@/features/farmer/NotificationsPage';
import { GrievancesPage } from '@/features/farmer/GrievancesPage';
import { FarmerAnalyticsPage } from '@/features/farmer/FarmerAnalyticsPage';

// Officer Views
import { OfficerDashboardPage } from '@/features/officer/OfficerDashboardPage';
import { OfficerQueuePage } from '@/features/officer/OfficerQueuePage';
import { OfficerCapacityPage } from '@/features/officer/OfficerCapacityPage';
import { OfficerProcurementPage } from '@/features/officer/OfficerProcurementPage';
import { OfficerAlertsPage } from '@/features/officer/OfficerAlertsPage';
import { OfficerAnalyticsPage } from '@/features/officer/OfficerAnalyticsPage';
import { OfficerGrievancesPage } from '@/features/officer/OfficerGrievancesPage';

// Design System Showcase
import { DesignSystemShowcase } from '@/features/design-system/DesignSystemShowcase';

export const AppRoutes: React.FC = () => {
  const { role } = useAuth();

  return (
    <Routes>
      {/* Root redirect: directs user to their role-specific dashboard */}
      <Route
        path="/"
        element={
          <Navigate
            to={role === 'OFFICER' ? '/officer/dashboard' : '/farmer/dashboard'}
            replace
          />
        }
      />

      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Farmer Portal (Protected for FARMER role) */}
      <Route element={<ProtectedRoute allowedRoles={['FARMER']} />}>
        <Route path="/farmer" element={<FarmerLayout />}>
          <Route index element={<Navigate to="/farmer/dashboard" replace />} />
          <Route path="dashboard" element={<FarmerDashboardPage />} />
          <Route path="centers" element={<CenterDiscoveryPage />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="booking/confirmation" element={<BookingConfirmationPage />} />
          <Route path="recommendation" element={<RecommendationPage />} />
          <Route path="queue" element={<LiveQueuePage />} />
          <Route path="should-i-go" element={<ShouldIGoNowPage />} />
          <Route path="procurement" element={<ProcurementTrackingPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="profile" element={<FarmerProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="grievances" element={<GrievancesPage />} />
          <Route path="analytics" element={<FarmerAnalyticsPage />} />
        </Route>
      </Route>

      {/* Officer Portal (Protected for OFFICER role) */}
      <Route element={<ProtectedRoute allowedRoles={['OFFICER']} />}>
        <Route path="/officer" element={<OfficerLayout />}>
          <Route index element={<Navigate to="/officer/dashboard" replace />} />
          <Route path="dashboard" element={<OfficerDashboardPage />} />
          <Route path="queue" element={<OfficerQueuePage />} />
          <Route path="capacity" element={<OfficerCapacityPage />} />
          <Route path="procurement" element={<OfficerProcurementPage />} />
          <Route path="alerts" element={<OfficerAlertsPage />} />
          <Route path="analytics" element={<OfficerAnalyticsPage />} />
          <Route path="grievances" element={<OfficerGrievancesPage />} />
        </Route>
      </Route>

      {/* Showcase & Testing Utility Route */}
      <Route path="/design-system" element={<DesignSystemShowcase />} />

      {/* Fallback 404 handler */}
      <Route
        path="*"
        element={
          <Navigate
            to={role === 'OFFICER' ? '/officer/dashboard' : '/farmer/dashboard'}
            replace
          />
        }
      />
    </Routes>
  );
};
