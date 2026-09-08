import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/cards/Card';
import { Bell, CheckCircle2, Wallet, Calendar } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  return (
    <PageContainer
      title="Notifications & Advisories"
      subtitle="Real-time alerts regarding slot booking, queue position movements, and DBT credits."
    >
      <div className="max-w-3xl space-y-4">
        <Card className="p-4 border-l-4 border-l-brand-primary">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-tint text-brand-primary flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-text-primary">Slot Confirmed</h4>
                <span className="text-xs text-text-secondary">10 mins ago</span>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                Your slot for 40 Qtl Paddy at Rohania Center B is confirmed for tomorrow 10:30 AM.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-semantic-success">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-green-50 text-semantic-success flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-text-primary">Payment Credited</h4>
                <span className="text-xs text-text-secondary">2 hours ago</span>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                ₹89,600 has been credited via DBT to your registered State Bank account.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};
