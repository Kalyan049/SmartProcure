import React, { useState } from 'react';
import { PageContainer, Card, Button, Input, Select } from '@/components';
import { FileCheck, Scale, AlertTriangle, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useProcurementRealtime } from '../farmer/hooks/useProcurementRealtime';

const STAGES = [
  'BOOKED',
  'ARRIVED',
  'INSPECTION',
  'GRADING',
  'WEIGHING',
  'VERIFICATION',
  'COMPLETED',
  'PAYMENT'
];

export const OfficerProcurementPage: React.FC = () => {
  const { data, loading, error, advanceStage } = useProcurementRealtime('officer', 'pr-01');
  const [submitting, setSubmitting] = useState(false);
  const [payload, setPayload] = useState<any>({});

  if (loading) {
    return (
      <PageContainer title="Procurement Counter Workflow">
        <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-primary" />
          <p>Loading active procurement record...</p>
        </div>
      </PageContainer>
    );
  }

  if (error || !data) {
    return (
      <PageContainer title="Procurement Counter Workflow">
        <div className="p-4 bg-red-50 text-red-600 rounded flex items-center gap-2 max-w-lg mx-auto">
          <AlertTriangle className="w-5 h-5" />
          {error || 'No active procurement found.'}
        </div>
      </PageContainer>
    );
  }

  const proc = data.procurement;
  const currentStageIndex = STAGES.indexOf(proc.status);
  const nextStage = STAGES[currentStageIndex + 1];

  const handleAdvance = async () => {
    try {
      setSubmitting(true);
      await advanceStage(payload);
      setPayload({});
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isCompleted = proc.status === 'COMPLETED' || proc.status === 'PAYMENT';

  return (
    <PageContainer
      title="Procurement Counter Workflow"
      subtitle="Strict sequential verification: Check-in → Inspection → Grading → Weighbridge → Final Verification"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Active Token
            </span>
            <h2 className="text-3xl font-extrabold text-brand-dark mt-1">SP-1047</h2>
            <p className="text-xs text-text-secondary mt-1">Farmer ID: {proc.farmer_id}</p>

            <div className="mt-6 pt-4 border-t border-surface-border space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-text-secondary">Current Stage:</span>
                <span className="font-bold text-brand-primary uppercase">{proc.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Crop:</span>
                <span className="font-bold text-text-primary">{proc.crop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Declared Qty:</span>
                <span className="font-bold text-text-primary">{proc.estimated_quantity_quintals} Qtl</span>
              </div>
              {proc.grade && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Grade:</span>
                  <span className="font-bold text-text-primary">{proc.grade}</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6">
            {isCompleted ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-text-primary">Procurement Completed</h3>
                <p className="text-text-secondary">This transaction has been successfully verified and sent for payment.</p>
              </div>
            ) : (
              <>
                <h2 className="text-base font-bold text-text-primary mb-4 pb-2 border-b border-surface-border flex items-center gap-2 uppercase">
                  <Scale className="w-5 h-5 text-brand-primary" />
                  Stage Processing: {nextStage}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nextStage === 'INSPECTION' && (
                    <Input 
                      label="Inspection Notes" 
                      placeholder="e.g. Clean grain" 
                      onChange={(e) => setPayload({...payload, notes: e.target.value})}
                    />
                  )}

                  {nextStage === 'GRADING' && (
                    <>
                      <Select
                        label="Quality Grade"
                        options={[
                          { value: 'GRADE_A', label: 'Grade A (MSP ₹2,300 / Qtl)' },
                          { value: 'GRADE_B', label: 'Grade B (MSP ₹2,200 / Qtl)' },
                          { value: 'REJECTED', label: 'Rejected (Does not meet FAQ norms)' },
                        ]}
                        onChange={(e) => setPayload({...payload, grade: e.target.value})}
                      />
                      <Input 
                        label="Moisture Content (%)" 
                        type="number" step="0.1" 
                        onChange={(e) => setPayload({...payload, moisture_percent: parseFloat(e.target.value)})}
                        unitSuffix="%" 
                      />
                    </>
                  )}

                  {nextStage === 'WEIGHING' && (
                    <Input 
                      label="Weighed Gross Quantity" 
                      type="number" step="0.1" 
                      onChange={(e) => setPayload({...payload, accepted_quantity_quintals: parseFloat(e.target.value)})}
                      unitSuffix="Quintals" 
                    />
                  )}

                  {nextStage === 'VERIFICATION' && (
                    <div className="col-span-2 text-sm text-text-secondary">
                      Please verify all entered details. Submitting this stage will lock the procurement record.
                    </div>
                  )}

                  {nextStage === 'COMPLETED' && (
                    <div className="col-span-2 text-sm text-text-secondary">
                      Issue DBT Receipt.
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                  <Button 
                    variant="primary" 
                    disabled={submitting}
                    onClick={handleAdvance}
                    leftIcon={submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
                  >
                    COMPLETE STAGE: {nextStage}
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
