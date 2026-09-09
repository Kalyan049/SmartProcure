import React from 'react';
import { PageContainer, StatCard, Card, StatusBadge, Button } from '@/components';
import { Wallet, CheckCircle2, Clock, Download, Loader2 } from 'lucide-react';
import { usePayments } from './hooks/usePayments';

export const PaymentsPage: React.FC = () => {
  const { payments, loading } = usePayments();

  if (loading && payments.length === 0) {
    return (
      <PageContainer title="Payment & DBT Tracking">
        <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-primary" />
          <p>Loading payment ledger...</p>
        </div>
      </PageContainer>
    );
  }

  const totalProcuredQtl = payments.reduce((acc, p) => acc + p.quantity_quintals, 0);
  const amountCredited = payments.filter(p => p.status === 'CREDITED').reduce((acc, p) => acc + p.net_amount, 0);
  const amountProcessing = payments.filter(p => p.status === 'PROCESSING').reduce((acc, p) => acc + p.net_amount, 0);

  return (
    <PageContainer
      title="Payment & DBT Tracking"
      subtitle="Direct benefit transfer reconciliation and payment receipts for your procured agricultural produce."
    >
      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Total Procured This Season"
          value={`${totalProcuredQtl.toLocaleString()} Qtl`}
          subtitle={`${payments.length} Procurements completed`}
          icon={<Wallet className="w-5 h-5" />}
          iconColor="green"
        />
        <StatCard
          title="Amount Credited via DBT"
          value={`₹${amountCredited.toLocaleString()}`}
          subtitle="Credited to registered A/C"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconColor="green"
        />
        <StatCard
          title="Amount in Processing"
          value={`₹${amountProcessing.toLocaleString()}`}
          subtitle={amountProcessing > 0 ? "Bank settlement pending" : "All transactions settled"}
          icon={<Clock className="w-5 h-5" />}
          iconColor="blue"
        />
      </div>

      {/* Payment Ledger Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-4">
          <h2 className="text-base font-bold text-text-primary">Payment History & Receipts</h2>
          <span className="text-xs font-bold text-brand-primary bg-brand-tint px-2 py-1 rounded">SIMULATED DBT DEMO</span>
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
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-text-secondary">
                    No payment history found. Complete a procurement workflow to see payments.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-page transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-text-primary text-xs">
                      {p.transaction_ref}
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary text-xs">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-text-primary text-xs">
                      {p.crop} {p.grade} • {p.quantity_quintals} Qtl
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary text-xs">₹{p.gross_amount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-bold text-brand-dark text-xs">₹{p.net_amount.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {p.status === 'CREDITED' ? (
                        <Button size="sm" variant="outline" leftIcon={<Download className="w-3.5 h-3.5" />}>
                          PDF
                        </Button>
                      ) : (
                        <span className="text-xs text-text-secondary">Pending</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </PageContainer>
  );
};
