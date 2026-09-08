import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Compass,
  FileText,
  CreditCard,
  User,
  Mic,
  MapPin,
  Bell,
  HelpCircle,
  BarChart2,
} from 'lucide-react';
import { AppHeader } from './AppHeader';
import { SideNav, NavItem } from './SideNav';
import { BottomTabBar } from './BottomTabBar';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingBoundary } from './LoadingBoundary';

export const FarmerLayout: React.FC = () => {
  // Desktop sidebar navigation: complete set of farmer destinations
  const sideNavItems: NavItem[] = [
    { to: '/farmer/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/farmer/centers', label: 'Find Centers', icon: <MapPin className="w-5 h-5" /> },
    { to: '/farmer/booking', label: 'Book Slot', icon: <CalendarCheck className="w-5 h-5" /> },
    { to: '/farmer/queue', label: 'Live Queue', icon: <Users className="w-5 h-5" /> },
    { to: '/farmer/should-i-go', label: 'Should I Go?', icon: <Compass className="w-5 h-5" /> },
    { to: '/farmer/procurement', label: 'Produce Tracking', icon: <FileText className="w-5 h-5" /> },
    { to: '/farmer/payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
    { to: '/farmer/analytics', label: 'Procurement History', icon: <BarChart2 className="w-5 h-5" /> },
    { to: '/farmer/notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { to: '/farmer/grievances', label: 'Grievance Redressal', icon: <HelpCircle className="w-5 h-5" /> },
    { to: '/farmer/profile', label: 'My Profile', icon: <User className="w-5 h-5" /> },
  ];

  // Mobile bottom tab bar: 5 dominant, touch-friendly destinations
  const bottomTabItems: NavItem[] = [
    { to: '/farmer/dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/farmer/booking', label: 'Book', icon: <CalendarCheck className="w-5 h-5" /> },
    { to: '/farmer/queue', label: 'Queue', icon: <Users className="w-5 h-5" /> },
    { to: '/farmer/procurement', label: 'Produce', icon: <FileText className="w-5 h-5" /> },
    { to: '/farmer/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-surface-page flex flex-col">
      <AppHeader />
      <div className="flex flex-1">
        <SideNav
          items={sideNavItems}
          footerContent={
            <div className="p-3 bg-brand-tint rounded-sm border border-brand-mint text-xs text-left">
              <div className="flex items-center gap-2 text-brand-dark font-bold mb-1">
                <Mic className="w-4 h-4 text-brand-primary shrink-0" aria-hidden="true" />
                <span>Voice Assistant</span>
              </div>
              <p className="text-text-secondary leading-snug">
                Need assistance? Access multilingual voice guidance anytime.
              </p>
            </div>
          }
        />
        <main id="main-content" className="flex-1 overflow-x-hidden min-w-0" tabIndex={-1}>
          <ErrorBoundary>
            <LoadingBoundary>
              <Outlet />
            </LoadingBoundary>
          </ErrorBoundary>
        </main>
      </div>
      <BottomTabBar items={bottomTabItems} />
    </div>
  );
};
