import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

export interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
}

export interface SideNavProps {
  items: NavItem[];
  footerContent?: React.ReactNode;
  className?: string;
}

export const SideNav: React.FC<SideNavProps> = ({ items, footerContent, className }) => {
  return (
    <aside
      className={clsx(
        'w-64 bg-white border-r border-surface-border flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-4rem)] select-none',
        className
      )}
      aria-label="Sidebar Navigation"
    >
      <div className="p-4 space-y-1.5 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex items-center justify-between px-3.5 py-2.5 rounded-sm text-sm font-medium transition-colors border-l-4',
                isActive
                  ? 'bg-brand-tint text-brand-dark font-bold border-brand-primary'
                  : 'text-text-secondary hover:text-brand-dark hover:bg-surface-page border-transparent'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={clsx(
                      'shrink-0',
                      isActive ? 'text-brand-primary' : 'text-text-muted'
                    )}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-primary text-white shrink-0">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {footerContent && (
        <div className="p-4 border-t border-surface-border bg-surface-page/50">
          {footerContent}
        </div>
      )}
    </aside>
  );
};
