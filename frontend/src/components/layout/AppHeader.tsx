import React, { useState } from 'react';
import {
  Sprout,
  Bell,
  Globe,
  User as UserIcon,
  RefreshCw,
  Menu,
  X,
  Compass,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { LanguageCode, UserRole } from '@shared/types';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { ProfileEditModal } from '../ui/ProfileEditModal';

export interface AppHeaderProps {
  onToggleMobileMenu?: () => void;
  showMobileMenuButton?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onToggleMobileMenu,
  showMobileMenuButton = false,
}) => {
  const { user, role, language, setLanguage, loginAs, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleRoleToggle = () => {
    const nextRole: UserRole = role === 'FARMER' ? 'OFFICER' : 'FARMER';
    loginAs(nextRole);
    if (nextRole === 'OFFICER') {
      navigate('/officer/dashboard');
    } else {
      navigate('/farmer/dashboard');
    }
  };

  return (
    <>
      {/* Skip to Main Content link for WCAG Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-primary focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary text-xs font-bold"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 w-full bg-white border-b border-surface-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Left: Logo & Brand Name */}
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger if on mobile / tablet */}
            {showMobileMenuButton && (
              <button
                onClick={onToggleMobileMenu || (() => setIsDrawerOpen(!isDrawerOpen))}
                className="p-2 -ml-2 rounded-sm text-text-secondary hover:text-text-primary hover:bg-surface-page md:hidden"
                aria-label="Toggle navigation menu"
              >
                {isDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <div
              className="flex items-center gap-2.5 cursor-pointer select-none"
              onClick={() =>
                navigate(role === 'OFFICER' ? '/officer/dashboard' : '/farmer/dashboard')
              }
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-sm bg-brand-primary flex items-center justify-center text-white shadow-sm shrink-0">
                <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-brand-mint" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-bold text-brand-dark tracking-tight leading-none">
                    SmartProcure
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-brand-tint text-brand-primary px-1.5 py-0.5 rounded-sm border border-brand-mint">
                    {role}
                  </span>
                </div>
                <p className="text-[10px] text-text-muted hidden sm:block truncate max-w-[280px]">
                  Ministry of Consumer Affairs, Food & Public Distribution
                </p>
              </div>
            </div>
          </div>

          {/* Right: Persona Switcher, Language Selector, Notifications, User */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Quick Persona Switcher for Evaluation */}
            <button
              onClick={handleRoleToggle}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-sm bg-surface-page border border-surface-border text-text-secondary hover:text-brand-dark hover:border-brand-primary transition-colors"
              title="Toggle between Farmer and Officer portal for evaluation"
              aria-label={`Switch to ${role === 'FARMER' ? 'Officer' : 'Farmer'} Portal`}
            >
              <RefreshCw className="w-3.5 h-3.5 text-brand-primary shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Switch to</span>
              <span className="font-bold text-brand-dark">
                {role === 'FARMER' ? 'Officer' : 'Farmer'}
              </span>
            </button>

            {/* Language Selector */}
            <div className="relative flex items-center">
              <Globe
                className="w-3.5 h-3.5 text-text-muted absolute left-2.5 pointer-events-none"
                aria-hidden="true"
              />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="text-xs font-semibold pl-7 pr-3 py-1.5 rounded-sm bg-white border border-surface-border text-text-primary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary cursor-pointer min-h-[36px]"
                aria-label="Select Language"
              >
                <option value="en">EN</option>
                <option value="hi">हिन्दी</option>
                <option value="te">తెలుగు</option>
              </select>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() =>
                navigate(role === 'OFFICER' ? '/officer/alerts' : '/farmer/notifications')
              }
              className="relative p-2 rounded-full text-text-secondary hover:text-brand-dark hover:bg-brand-tint transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-semantic-error ring-2 ring-white" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <div
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-1 cursor-pointer select-none"
                role="button"
                tabIndex={0}
                aria-label="User Menu"
              >
                <div className="w-8 h-8 rounded-full bg-brand-tint border border-brand-mint flex items-center justify-center text-brand-primary font-bold text-xs shrink-0">
                  {user?.name ? user.name.charAt(0) : <UserIcon className="w-4 h-4" />}
                </div>
                <div className="hidden xl:block text-left">
                  <p className="text-xs font-bold text-text-primary leading-tight truncate max-w-[110px]">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-text-muted">{user?.mobile}</p>
                </div>
              </div>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-surface-border overflow-hidden z-50 animate-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-surface-border bg-surface-page xl:hidden">
                    <p className="text-sm font-bold text-text-primary truncate">{user?.name}</p>
                    <p className="text-xs text-text-secondary truncate">{user?.mobile}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface-page transition-colors flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-text-secondary" />
                      Edit Profile
                    </button>
                    <button
                      onClick={async () => {
                        setIsUserMenuOpen(false);
                        await logout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-status-error hover:bg-status-error/10 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <ProfileEditModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
    </>
  );
};
