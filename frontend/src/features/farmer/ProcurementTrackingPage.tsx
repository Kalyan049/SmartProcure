import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/cards/Card';
import { CheckCircle2, Circle, Clock, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { ProcurementStage } from '@shared/types';

export const ProcurementTrackingPage: React.FC = () => {
  const stages: { stage: ProcurementStage; label: string; status: 'completed' | 'current' | 'upcoming'; note: string }[] = [
    { stage: 'BOOKED', label: '1. Slot Booked', status: 'completed', note: 'Token SP-1047 confirmed for 40 Qtl' },
    { stage: 'ARRIVED', label: '2. Center Check-in', status: 'completed', note: 'Checked in at Gate 2, Token scanned' },
    { stage: 'INSPECTION', label: '3. Physical Inspection', status: 'completed', note: 'Passed - Clean grain, moisture 13.5%' },
    { stage: 'GRADING', label: '4. Quality Grading', status: 'completed', note: 'Certified Grade A' },
    { stage: 'WEIGHING', label: '5. Electronic Weighbridge', status: 'current', note: 'Gross Weight recorded: 39.2 Qtl accepted' },
    { stage: 'VERIFICATION', label: '6. Officer Final Sign-Off', status: 'upcoming', note: 'Pending digital verification signature' },
    { stage: 'COMPLETED', label: '7. Procurement Complete', status: 'upcoming', note: 'MSP DBT payment generation' },
  ];

  return (
    <PageContainer
      title="Produce Procurement Tracking"
      subtitle="End-to-end transparent visibility of your produce through inspection, grading, weighing, and verification."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-text-primary mb-6 pb-2 border-b border-surface-border">
              Live Stage Timeline (Token SP-1047)
            </h2>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-surface-border">
              {stages.map((item, index) => {
                const isCompleted = item.status === 'completed';
                const isCurrent = item.status === 'current';

                return (
                  <div key={index} className="relative flex items-start gap-4">
                    {/* Step Icon Indicator */}
                    <div
                      className={clsx(
                        'absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-white shrink-0',
                        isCompleted
                          ? 'bg-brand-primary text-white'
                          : isCurrent
                          ? 'bg-amber-500 text-white animate-pulse'
                          : 'bg-gray-100 text-gray-400 border border-surface-border'
                      )}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : index + 1}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 ml-4 p-4 rounded-sm bg-surface-page border border-surface-border">
                      <div className="flex items-center justify-between">
                        <h3 className={clsx('text-sm font-bold', isCurrent ? 'text-amber-700 font-extrabold' : 'text-text-primary')}>
                          {item.label}
                        </h3>
                        {isCompleted && (
                          <span className="text-[10px] uppercase font-bold text-brand-primary bg-brand-tint px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Done
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3 animate-spin" /> In Progress
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary mt-1">{item.note}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-3">
              Procurement Summary
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-surface-border">
                <span className="text-text-secondary">Crop:</span>
                <span className="font-bold text-text-primary">Paddy (Grade A)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-border">
                <span className="text-text-secondary">Declared Quantity:</span>
                <span className="font-bold text-text-primary">40.0 Quintals</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-border">
                <span className="text-text-secondary">Accepted Quantity:</span>
                <span className="font-bold text-brand-primary">39.2 Quintals</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-border">
                <span className="text-text-secondary">MSP Rate:</span>
                <span className="font-bold text-text-primary">₹2,300 / Quintal</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-secondary">Estimated Net Value:</span>
                <span className="font-bold text-brand-dark text-sm">₹89,600</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
