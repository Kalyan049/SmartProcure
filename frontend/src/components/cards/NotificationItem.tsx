import React from 'react';
import { clsx } from 'clsx';
import { Bell, Calendar, CheckCircle2, AlertTriangle, Info, Clock } from 'lucide-react';

export type NotificationType = 'booking' | 'queue' | 'procurement' | 'payment' | 'alert' | 'general';

export interface NotificationItemProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead?: boolean;
  onClick?: () => void;
  className?: string;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  type,
  title,
  message,
  timestamp,
  isRead = false,
  onClick,
  className,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-brand-primary" aria-hidden="true" />;
      case 'queue':
        return <Clock className="w-4 h-4 text-semantic-warning" aria-hidden="true" />;
      case 'procurement':
        return <CheckCircle2 className="w-4 h-4 text-brand-primary" aria-hidden="true" />;
      case 'payment':
        return <CheckCircle2 className="w-4 h-4 text-semantic-success" aria-hidden="true" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-semantic-error" aria-hidden="true" />;
      default:
        return <Bell className="w-4 h-4 text-semantic-info" aria-hidden="true" />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'booking':
      case 'procurement':
      case 'payment':
        return 'bg-brand-tint border-brand-mint';
      case 'queue':
        return 'bg-amber-50 border-amber-200';
      case 'alert':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'p-3.5 sm:p-4 rounded-sm border transition-colors flex items-start gap-3 text-left',
        isRead
          ? 'bg-white border-surface-border hover:bg-surface-page'
          : 'bg-brand-tint/30 border-brand-mint/80 hover:bg-brand-tint/50',
        onClick && 'cursor-pointer',
        className
      )}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div
        className={clsx(
          'w-8 h-8 rounded-full border flex items-center justify-center shrink-0 mt-0.5',
          getIconBg()
        )}
      >
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <h4
            className={clsx(
              'text-xs sm:text-sm font-bold truncate',
              isRead ? 'text-text-primary' : 'text-brand-dark'
            )}
          >
            {title}
          </h4>
          <span className="text-[11px] text-text-muted shrink-0 tabular-nums">
            {timestamp}
          </span>
        </div>
        <p className="text-xs text-text-secondary mt-0.5 leading-relaxed line-clamp-2">
          {message}
        </p>
      </div>

      {!isRead && (
        <span
          className="w-2 h-2 rounded-full bg-brand-primary shrink-0 self-center"
          aria-label="Unread notification"
        />
      )}
    </div>
  );
};
