import React from 'react';
import { PageContainer, Card } from '@/components';
import { Bell, Wallet, Calendar, Loader2, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNotifications } from './hooks/useNotifications';
import { clsx } from 'clsx';

export const NotificationsPage: React.FC = () => {
  const { notifications, loading, markAsRead } = useNotifications();

  if (loading && notifications.length === 0) {
    return (
      <PageContainer title="Notifications & Advisories">
        <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-primary" />
          <p>Loading notifications...</p>
        </div>
      </PageContainer>
    );
  }

  const getIcon = (type: string, title: string) => {
    if (title.toLowerCase().includes('payment')) return <Wallet className="w-5 h-5" />;
    if (title.toLowerCase().includes('slot') || title.toLowerCase().includes('booking')) return <Calendar className="w-5 h-5" />;
    if (type === 'SUCCESS') return <CheckCircle className="w-5 h-5" />;
    if (type === 'WARNING' || type === 'ERROR') return <AlertTriangle className="w-5 h-5" />;
    return <Info className="w-5 h-5" />;
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'SUCCESS': return 'border-l-semantic-success bg-green-50 text-semantic-success';
      case 'WARNING': return 'border-l-amber-500 bg-amber-50 text-amber-600';
      case 'ERROR': return 'border-l-red-500 bg-red-50 text-red-600';
      case 'INFO':
      default: return 'border-l-brand-primary bg-brand-tint text-brand-primary';
    }
  };

  return (
    <PageContainer
      title="Notifications & Advisories"
      subtitle="Real-time alerts regarding slot booking, queue position movements, and DBT credits."
    >
      <div className="max-w-3xl space-y-4">
        {notifications.length === 0 ? (
          <Card className="p-12 text-center text-text-secondary">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>You have no notifications yet.</p>
          </Card>
        ) : (
          notifications.map((n) => {
            const colorClass = getColorClass(n.type);
            return (
              <Card 
                key={n.id} 
                className={clsx("p-4 border-l-4 cursor-pointer transition-colors", colorClass.split(' ')[0], n.read ? 'opacity-75' : 'hover:bg-gray-50')}
                onClick={() => !n.read && markAsRead(n.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={clsx("w-9 h-9 rounded-full flex items-center justify-center shrink-0", colorClass.replace(colorClass.split(' ')[0], ''))}>
                    {getIcon(n.type, n.title)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={clsx("text-sm font-bold", !n.read ? 'text-text-primary' : 'text-text-secondary')}>{n.title}</h4>
                      <span className="text-xs text-text-secondary">
                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={clsx("text-xs mt-1", !n.read ? 'text-text-primary font-medium' : 'text-text-secondary')}>
                      {n.message}
                    </p>
                  </div>
                  {!n.read && (
                    <div className="w-2 h-2 bg-brand-primary rounded-full mt-2 shrink-0"></div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </PageContainer>
  );
};
