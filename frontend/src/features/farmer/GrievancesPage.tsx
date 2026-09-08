import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { HelpCircle } from 'lucide-react';

export const GrievancesPage: React.FC = () => {
  return (
    <PageContainer
      title="Farmer Grievance Redressal"
      subtitle="Submit and track complaints regarding slot delays, grading discrepancies, or payment issues."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6">
            <h2 className="text-base font-bold text-text-primary mb-4 pb-2 border-b border-surface-border flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-primary" />
              Raise a New Grievance
            </h2>

            <div className="space-y-4">
              <Select
                label="Grievance Category"
                options={[
                  { value: 'QUEUE_DELAY', label: 'Queue / Excessive Center Delay' },
                  { value: 'INSPECTION_GRADING', label: 'Inspection or Quality Grading Dispute' },
                  { value: 'WEIGHING_DISCREPANCY', label: 'Weighbridge Quantity Discrepancy' },
                  { value: 'PAYMENT_DELAY', label: 'DBT Payment Delay' },
                  { value: 'STAFF_BEHAVIOR', label: 'Center Staff Assistance' },
                  { value: 'OTHER', label: 'Other Operational Issue' },
                ]}
              />

              <Input label="Subject / Brief Summary" placeholder="E.g. Delay in moisture testing at Counter 2" />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Detailed Description</label>
                <textarea
                  rows={4}
                  className="w-full bg-white text-text-primary text-sm rounded-sm border border-surface-input p-3 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  placeholder="Explain the issue in detail..."
                />
              </div>

              <Button variant="primary" size="md" className="w-full">
                SUBMIT GRIEVANCE
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-4">
              Active Grievance Tickets
            </h3>
            <div className="p-4 rounded-sm bg-surface-page border border-surface-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-text-primary">GRV-1042</span>
                <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  Under Review
                </span>
              </div>
              <p className="text-sm font-bold text-text-primary mt-2">Moisture testing delay at Center B</p>
              <p className="text-xs text-text-secondary mt-1">Submitted on 08 Sep 2026</p>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
