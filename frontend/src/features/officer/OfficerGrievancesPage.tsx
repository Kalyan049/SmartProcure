import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';

export const OfficerGrievancesPage: React.FC = () => {
  return (
    <PageContainer
      title="Farmer Grievances Review"
      subtitle="Operational dispute resolution for queue delays, quality grading challenges, and weighbridge concerns."
    >
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-page text-text-secondary text-xs uppercase font-bold border-y border-surface-border">
              <tr>
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Farmer</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Summary</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              <tr className="hover:bg-surface-page">
                <td className="py-3.5 px-4 font-mono font-bold text-text-primary">GRV-1042</td>
                <td className="py-3.5 px-4 font-medium text-text-primary">Ramesh Kumar</td>
                <td className="py-3.5 px-4 text-text-secondary">Queue Delay</td>
                <td className="py-3.5 px-4 text-text-primary">Moisture testing delay at Center B</td>
                <td className="py-3.5 px-4">
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    Under Review
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Button size="sm" variant="outline">
                    Resolve
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </PageContainer>
  );
};
