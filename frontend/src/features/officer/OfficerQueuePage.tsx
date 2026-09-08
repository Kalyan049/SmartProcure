import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/cards/Card';
import { StatusBadge } from '@/components/status/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Search, Eye, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OfficerQueuePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer
      title="Live Center Queue Table"
      subtitle="Comprehensive intake roster with real-time token tracking, check-in, and stage status."
    >
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search token, farmer name, mobile or crop..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-sm border border-surface-input focus:border-brand-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              Filter by Crop
            </Button>
            <Button size="sm" variant="primary">
              Call Next Token
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-page text-text-secondary text-xs uppercase font-bold border-y border-surface-border">
              <tr>
                <th className="py-3 px-4">Token</th>
                <th className="py-3 px-4">Farmer Name</th>
                <th className="py-3 px-4">Crop</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Slot Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              <tr className="hover:bg-surface-page">
                <td className="py-3.5 px-4 font-mono font-bold text-brand-dark">SP-1047</td>
                <td className="py-3.5 px-4 font-semibold text-text-primary">Ramesh Kumar</td>
                <td className="py-3.5 px-4 text-text-secondary">Paddy</td>
                <td className="py-3.5 px-4 font-bold text-text-primary">40.0 Qtl</td>
                <td className="py-3.5 px-4 text-text-secondary">10:30 AM</td>
                <td className="py-3.5 px-4">
                  <StatusBadge status="WAITING" />
                </td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <Button
                    size="sm"
                    variant="primary"
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => navigate('/officer/procurement')}
                  >
                    Process
                  </Button>
                </td>
              </tr>
              <tr className="hover:bg-surface-page">
                <td className="py-3.5 px-4 font-mono font-bold text-text-primary">SP-1048</td>
                <td className="py-3.5 px-4 font-semibold text-text-primary">Suresh Singh</td>
                <td className="py-3.5 px-4 text-text-secondary">Paddy</td>
                <td className="py-3.5 px-4 font-bold text-text-primary">35.0 Qtl</td>
                <td className="py-3.5 px-4 text-text-secondary">10:45 AM</td>
                <td className="py-3.5 px-4">
                  <StatusBadge status="WAITING" />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Button size="sm" variant="outline">
                    View
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
