import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { NavItem } from './SideNav';

export interface BottomTabBarProps {
  items: NavItem[];
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ items }) => {
  // Show the primary 5 core destinations on mobile bottom bar
  const mobileItems = items.slice(0, 5);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-surface-border flex items-center justify-around px-1 py-1 md:hidden shadow-lg pb-safe select-none"
      aria-label="Mobile Navigation"
    >
      {mobileItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            clsx(
              'flex flex-col items-center justify-center py-1.5 px-1 rounded-sm text-[10px] font-semibold transition-colors flex-1 text-center min-h-[48px]',
              isActive
                ? 'text-brand-primary'
                : 'text-text-muted hover:text-text-primary'
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={clsx(
                  'shrink-0 mb-0.5',
                  isActive ? 'text-brand-primary' : 'text-text-muted'
                )}
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span className="truncate max-w-[68px] leading-tight">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
