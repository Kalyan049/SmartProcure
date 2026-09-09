/**
 * AdminDashboardPage — Module 5: Authentication & Role-Based Access
 *
 * Placeholder admin dashboard proving the ADMIN role-based route works.
 * Full admin functionality (center management, user management, audit logs)
 * is out of scope for the SIH MVP but the route and role guard are in place.
 */
import React from 'react';
import {
  ShieldCheck,
  Users,
  Building2,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Activity,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';

interface StatTile {
  label: string;
  value: string;
  icon: React.FC<{ className?: string }>;
  color: string;
}

const STAT_TILES: StatTile[] = [
  { label: 'Procurement Centers', value: '3', icon: Building2, color: 'text-status-info' },
  { label: 'Registered Farmers', value: '4', icon: Users, color: 'text-status-success' },
  { label: 'Active Officers', value: '1', icon: ShieldCheck, color: 'text-brand-primary' },
  { label: 'Today\'s Bookings', value: '4', icon: Activity, color: 'text-status-warning' },
];

const QUICK_LINKS = [
  { label: 'Center Management', icon: Building2, desc: 'Add, edit, or deactivate procurement centers' },
  { label: 'User Management', icon: Users, desc: 'Manage farmer and officer accounts' },
  { label: 'Analytics', icon: BarChart3, desc: 'System-wide procurement analytics' },
  { label: 'Audit Logs', icon: FileText, desc: 'Review all system actions and changes' },
  { label: 'Configuration', icon: Settings, desc: 'System settings and MSP rates' },
];

export const AdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface-page">
      {/* Header */}
      <header className="bg-brand-dark text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-brand-mint" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-medium opacity-70">SmartProcure</p>
            <h1 className="text-base font-bold leading-tight">Administrator Portal</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs opacity-70">Logged in as</p>
            <p className="text-sm font-semibold">{user?.name || 'Administrator'}</p>
          </div>
          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome */}
        <div>
          <h2 className="text-xl font-bold text-text-primary">
            Welcome, {user?.name?.split(' ')[0] || 'Admin'} 👋
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            System overview for SmartProcure — SIH26032 prototype.
          </p>
        </div>

        {/* Role badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-light border border-brand-mint text-xs font-bold text-brand-dark">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
          ADMINISTRATOR · Full System Access
        </div>

        {/* Stat tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STAT_TILES.map((tile) => (
            <div
              key={tile.label}
              className="bg-white rounded-xl border border-surface-border shadow-card p-4 space-y-2"
            >
              <div className={`w-8 h-8 rounded-lg bg-surface-page flex items-center justify-center ${tile.color}`}>
                <tile.icon className="w-4 h-4" aria-hidden="true" />
              </div>
              <p className="text-2xl font-extrabold text-text-primary">{tile.value}</p>
              <p className="text-xs text-text-secondary">{tile.label}</p>
            </div>
          ))}
        </div>

        {/* Quick links grid */}
        <div>
          <h3 className="text-sm font-bold text-text-primary mb-3">Admin Modules</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {QUICK_LINKS.map((link) => (
              <div
                key={link.label}
                className="bg-white rounded-xl border border-surface-border shadow-card p-4 flex items-start gap-3 opacity-60 cursor-not-allowed"
                title="Coming in a future sprint"
              >
                <div className="w-9 h-9 rounded-lg bg-surface-page flex items-center justify-center text-brand-primary shrink-0">
                  <link.icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{link.label}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{link.desc}</p>
                  <span className="inline-block mt-1 text-[10px] bg-surface-border text-text-secondary px-1.5 py-0.5 rounded-full">
                    Coming Soon
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Auth verification note */}
        <div className="p-4 rounded-xl bg-brand-light border border-brand-mint text-sm">
          <p className="font-bold text-brand-dark mb-1">✅ Role-Based Access Working</p>
          <p className="text-xs text-text-secondary">
            You are viewing this page because your account has the <code className="font-bold text-brand-primary">ADMIN</code> role.
            Farmers and Officers cannot access this URL — they are redirected to <code>/unauthorized</code> instead.
          </p>
        </div>
      </main>
    </div>
  );
};
