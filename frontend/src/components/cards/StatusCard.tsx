import React from 'react';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { clsx } from 'clsx';

export interface StatusCardProps {
  status: 'confirmed' | 'pending' | 'cancelled';
  title: string;
  description: string;
  centerPhotoUrl?: string;
  centerName?: string;
  children?: React.ReactNode;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  status,
  title,
  description,
  centerName,
  children,
}) => {
  const statusConfig = {
    confirmed: {
      bg: 'bg-brand-tint border-brand-mint text-brand-dark',
      icon: <CheckCircle2 className="w-8 h-8 text-brand-primary" />,
    },
    pending: {
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: <Clock className="w-8 h-8 text-semantic-warning" />,
    },
    cancelled: {
      bg: 'bg-red-50 border-red-200 text-red-900',
      icon: <AlertCircle className="w-8 h-8 text-semantic-error" />,
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={clsx(
        'rounded-md border p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-card',
        config.bg
      )}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
          {config.icon}
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          <p className="text-sm opacity-90 mt-1">{description}</p>
          {centerName && (
            <p className="text-xs font-semibold uppercase tracking-wider mt-2 opacity-75">
              Center: {centerName}
            </p>
          )}
        </div>
      </div>
      {children && <div className="shrink-0 w-full md:w-auto">{children}</div>}
    </div>
  );
};
