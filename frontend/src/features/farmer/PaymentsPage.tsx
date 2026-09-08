import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { StatCard } from '@/components/cards/StatCard';
import { Card } from '@/components/cards/Card';
import { StatusBadge } from '@/components/status/StatusBadge';
import { Wallet, CheckCircle2, Clock, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const PaymentsPage: React.FC = () => {
  return (
    <PageContainer
      title="Payment & DBT Tracking"
      subtitle="Direct benefit transfer reconciliation and payment receipts for your procured agricultural produce."
    >
      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Total Procured This Season"
          value="78.4 Qtl"
          subtitle="2 Procurements completed"
          icon={<Wallet className="w-5 h-5" />}
          iconColor="green"
        />
        <StatCard
          title="Amount Credited via DBT"
          value="₹1,79,200"
          subtitle="Credited to SBI A/C ending 5892"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconColor="green"
        />
        <StatCard
          title="Amount in Processing"
          value="₹0.00"
          subtitle="All transactions settled"
          icon={<Clock className="w-5 h-5" />}
          iconColor="blue"
        />
      </div>

      {/* Payment Ledger Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-4">
          <h2 className="text-base font-bold text-text-primary">Payment History & Receipts</h2>
          <span className="text-xs text-text-secondary">Direct Bank Transfer (DBT)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-page text-text-secondary text-xs uppercase font-bold border-y border-surface-border">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Procurement Date</th>
                <th className="py-3 px-4">Crop & Quantity</th>
                <th className="py-3 px-4">Gross Amount</th>
                <th className="py-3 px-4">Net Credited</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              <tr className="hover:bg-surface-page transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-text-primary">
                  DBT-GOV-2026-99214
                </td>
                <td className="py-3.5 px-4 text-text-secondary">08 Sep 2026</td>
                <td className="py-3.5 px-4 font-medium text-text-primary">
                  Paddy Grade A • 39.2 Qtl
                </td>
                <td className="py-3.5 px-4 text-text-secondary">₹90,160</td>
                <td className="py-3.5 px-4 font-bold text-brand-dark">₹89,600</td>
                <td className="py-3.5 px-4">
                  <StatusBadge status="CREDITED" />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Button size="sm" variant="outline" leftIcon={<Download className="w-3.5 h-3.5" />}>
                    PDF
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
