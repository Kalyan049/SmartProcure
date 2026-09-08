import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CheckCircle2, FileCheck, Scale, ArrowRight } from 'lucide-react';

export const OfficerProcurementPage: React.FC = () => {
  return (
    <PageContainer
      title="Procurement Counter Workflow"
      subtitle="Strict sequential verification: Check-in → Inspection → Grading → Weighbridge → Final Verification"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Processing Token Details */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Active Processing Token
            </span>
            <h2 className="text-3xl font-extrabold text-brand-dark mt-1">SP-1047</h2>
            <p className="text-xs text-text-secondary mt-1">Farmer: Ramesh Kumar (SP-FARMER-1082)</p>

            <div className="mt-6 pt-4 border-t border-surface-border space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-text-secondary">Crop:</span>
                <span className="font-bold text-text-primary">Paddy</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Declared Quantity:</span>
                <span className="font-bold text-text-primary">40.0 Quintals</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Aadhaar Status:</span>
                <span className="font-bold text-brand-primary">Verified (eKYC)</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Counter Form */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6">
            <h2 className="text-base font-bold text-text-primary mb-4 pb-2 border-b border-surface-border flex items-center gap-2">
              <Scale className="w-5 h-5 text-brand-primary" />
              Stage Processing: Inspection & Electronic Weighbridge
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Quality Grade"
                options={[
                  { value: 'GRADE_A', label: 'Grade A (MSP ₹2,300 / Qtl)' },
                  { value: 'GRADE_B', label: 'Grade B (MSP ₹2,200 / Qtl)' },
                  { value: 'REJECTED', label: 'Rejected (Does not meet FAQ norms)' },
                ]}
              />

              <Input label="Moisture Content (%)" type="number" step="0.1" defaultValue={13.5} unitSuffix="%" />

              <Input label="Weighed Gross Quantity" type="number" step="0.1" defaultValue={39.2} unitSuffix="Quintals" />

              <Input label="Calculated Net Amount" value="₹89,600" disabled />
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
              <Button variant="outline">Flag Discrepancy</Button>
              <Button variant="primary" leftIcon={<FileCheck className="w-4 h-4" />}>
                COMPLETE STAGE & ISSUE DBT RECEIPT
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
