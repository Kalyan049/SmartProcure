import React from 'react';
import { PageContainer, Card, KpiCard, DataTable, ColumnDef, StatusBadge } from '@/components';
import { Wheat, CreditCard, Calendar, CheckCircle2 } from 'lucide-react';

interface PastProcurementRecord {
  id: string;
  season: string;
  crop: string;
  quantity: string;
  amount: string;
  date: string;
  status: string;
}

export const FarmerAnalyticsPage: React.FC = () => {
  const historyData: PastProcurementRecord[] = [
    {
      id: 'REC-2025-01',
      season: 'Rabi 2025–26',
      crop: 'Wheat (Sharbati)',
      quantity: '38.5 qtl',
      amount: '₹88,000',
      date: '12 Apr 2025',
      status: 'PAID',
    },
    {
      id: 'REC-2024-02',
      season: 'Kharif 2024–25',
      crop: 'Paddy (Basmati)',
      quantity: '42.0 qtl',
      amount: '₹92,400',
      date: '28 Oct 2024',
      status: 'PAID',
    },
    {
      id: 'REC-2024-01',
      season: 'Rabi 2024–25',
      crop: 'Wheat',
      quantity: '35.0 qtl',
      amount: '₹77,000',
      date: '15 Apr 2024',
      status: 'PAID',
    },
  ];

  const columns: ColumnDef<PastProcurementRecord>[] = [
    { key: 'season', header: 'Season' },
    { key: 'crop', header: 'Crop' },
    { key: 'quantity', header: 'Quantity', render: (r) => <span className="font-semibold tabular-nums">{r.quantity}</span> },
    { key: 'amount', header: 'DBT Amount', render: (r) => <span className="font-bold text-brand-primary tabular-nums">{r.amount}</span> },
    { key: 'date', header: 'Completed Date', render: (r) => <span className="text-text-muted">{r.date}</span> },
    { key: 'status', header: 'Payment Status', render: (r) => <StatusBadge status={r.status} size="sm" /> },
  ];

  return (
    <PageContainer
      title="Procurement History & Analytics"
      subtitle="Overview of your total verified crop sales, MSP payments, and mandi visits across seasons."
    >
      {/* KPI Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Total Procured"
          value="115.5"
          unit="quintals"
          subtitle="Across last 3 seasons"
          icon={<Wheat className="w-5 h-5" />}
          iconColor="green"
        />
        <KpiCard
          title="Total DBT Credited"
          value="₹2,57,400"
          subtitle="Direct to bank account"
          icon={<CreditCard className="w-5 h-5" />}
          iconColor="blue"
        />
        <KpiCard
          title="Successful Deliveries"
          value="3"
          unit="transactions"
          subtitle="100% verified MSP payments"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconColor="green"
        />
      </div>

      {/* History Table */}
      <Card className="p-0 overflow-hidden bg-white shadow-card">
        <div className="p-4 border-b border-surface-border">
          <h3 className="text-sm font-bold text-text-primary">Past Procurement Records</h3>
        </div>
        <DataTable
          columns={columns}
          data={historyData}
          keyExtractor={(r) => r.id}
        />
      </Card>
    </PageContainer>
  );
};
