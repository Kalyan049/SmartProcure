import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  CheckSquare,
  AlertTriangle,
  LineChart,
  HelpCircle,
  X,
  Radio,
} from 'lucide-react';
import { AppHeader } from './AppHeader';
import { SideNav, NavItem } from './SideNav';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingBoundary } from './LoadingBoundary';
import { clsx } from 'clsx';

export const OfficerLayout: React.FC = () => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const navItems: NavItem[] = [
    { to: '/officer/dashboard', label: 'Center Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/officer/queue', label: 'Live Queue Table', icon: <Users className="w-5 h-5" /> },
    { to: '/officer/capacity', label: 'Capacity & Intake', icon: <BarChart3 className="w-5 h-5" /> },
    { to: '/officer/procurement', label: 'Procurement Workflow', icon: <CheckSquare className="w-5 h-5" /> },
    { to: '/officer/alerts', label: 'Overload Alerts', icon: <AlertTriangle className="w-5 h-5" />, badge: '2' },
    { to: '/officer/analytics', label: 'Intake Analytics', icon: <LineChart className="w-5 h-5" /> },
    { to: '/officer/grievances', label: 'Farmer Grievances', icon: <HelpCircle className="w-5 h-5" /> },
  ];

  const officerFooter = (
    <div className="text-[11px] text-text-secondary leading-relaxed text-left">
      <p className="font-bold text-brand-dark">Rohania Center (CTR-02)</p>
      <p className="text-text-muted">Capacity: 600 Qtl • Rate: 6m/farmer</p>
      <div className="flex items-center gap-1.5 text-[10px] text-brand-primary font-bold mt-1.5">
        <span className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
        <span>Realtime Coordination Active</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-page flex flex-col">
      <AppHeader
        showMobileMenuButton={true}
        onToggleMobileMenu={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
      />

      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        <SideNav items={navItems} footerContent={officerFooter} />

        {/* Mobile / Tablet Slide-over Drawer for Officers */}
        {isMobileDrawerOpen && (
          <div
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm md:hidden animate-in fade-in"
            onClick={() => setIsMobileDrawerOpen(false)}
          >
            <div
              className="w-72 max-w-[80vw] h-full bg-white shadow-2xl flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="p-4 border-b border-surface-border flex items-center justify-between">
                  <span className="text-sm font-bold text-brand-dark uppercase tracking-wider">
                    Officer Menu
                  </span>
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-1 rounded-sm text-text-muted hover:text-text-primary"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-3 space-y-1 overflow-y-auto">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center justify-between px-3 py-2.5 rounded-sm text-sm font-medium transition-colors border-l-4',
                          isActive
                            ? 'bg-brand-tint text-brand-dark font-bold border-brand-primary'
                            : 'text-text-secondary hover:text-brand-dark hover:bg-surface-page border-transparent'
                        )
                      }
                    >
                      <div className="flex items-center gap-3">
                        <span className="shrink-0">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-primary text-white">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t border-surface-border bg-surface-page">
                {officerFooter}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main
          id="main-content"
          className="flex-1 overflow-x-hidden min-w-0"
          tabIndex={-1}
        >
          <ErrorBoundary>
            <LoadingBoundary>
              <Outlet />
            </LoadingBoundary>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};
