import React from 'react';
import { PageContainer, Card } from '@/components';
import { CheckCircle2, Clock, Check, Loader2, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { useProcurementRealtime } from './hooks/useProcurementRealtime';

const ALL_STAGES = [
  { id: 'BOOKED', label: '1. Slot Booked' },
  { id: 'ARRIVED', label: '2. Center Check-in' },
  { id: 'INSPECTION', label: '3. Physical Inspection' },
  { id: 'GRADING', label: '4. Quality Grading' },
  { id: 'WEIGHING', label: '5. Electronic Weighbridge' },
  { id: 'VERIFICATION', label: '6. Officer Final Sign-Off' },
  { id: 'COMPLETED', label: '7. Procurement Complete' },
];

export const ProcurementTrackingPage: React.FC = () => {
  const { data, loading, error } = useProcurementRealtime('my');

  if (loading) {
    return (
      <PageContainer title="Produce Procurement Tracking">
        <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-primary" />
          <p>Syncing tracking timeline...</p>
        </div>
      </PageContainer>
    );
  }

  if (error || !data) {
    return (
      <PageContainer title="Produce Procurement Tracking">
        <div className="p-4 bg-red-50 text-red-600 rounded flex items-center gap-2 max-w-lg mx-auto">
          <AlertTriangle className="w-5 h-5" />
          {error || 'No active procurement found.'}
        </div>
      </PageContainer>
    );
  }

  const { procurement, events } = data;
  const currentStageIndex = ALL_STAGES.findIndex(s => s.id === procurement.status);

  return (
    <PageContainer
      title="Produce Procurement Tracking"
      subtitle="End-to-end transparent visibility of your produce through inspection, grading, weighing, and verification."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-text-primary mb-6 pb-2 border-b border-surface-border">
              Live Stage Timeline (Token {procurement.booking_id})
            </h2>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-surface-border">
              {ALL_STAGES.map((item, index) => {
                const isCompleted = index <= currentStageIndex && procurement.status !== item.id;
                const isCurrent = index === currentStageIndex;
                const event = events.find(e => e.stage === item.id);

                return (
                  <div key={item.id} className="relative flex items-start gap-4">
                    {/* Step Icon Indicator */}
                    <div
                      className={clsx(
                        'absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-white shrink-0',
                        isCompleted || item.id === 'COMPLETED' && procurement.status === 'PAYMENT'
                          ? 'bg-brand-primary text-white'
                          : isCurrent
                          ? 'bg-amber-500 text-white animate-pulse'
                          : 'bg-gray-100 text-gray-400 border border-surface-border'
                      )}
                    >
                      {isCompleted || (item.id === 'COMPLETED' && procurement.status === 'PAYMENT') ? <Check className="w-3.5 h-3.5" /> : index + 1}
                    </div>

                    {/* Step Content */}
                    <div className={clsx(
                      "flex-1 ml-4 p-4 rounded-sm border",
                      isCurrent ? "bg-surface-page border-amber-300" : "bg-surface-page border-surface-border",
                      !isCompleted && !isCurrent && "opacity-50"
                    )}>
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
                      
                      <p className="text-xs text-text-secondary mt-1">
                        {event ? event.notes : (isCurrent ? 'Pending officer action...' : 'Awaiting previous stage completion')}
                      </p>
                      
                      {event && (
                        <p className="text-[10px] text-gray-400 mt-2 flex items-center justify-between">
                          <span>By: {event.actor_name}</span>
                          <span>{new Date(event.created_at).toLocaleTimeString()}</span>
                        </p>
                      )}
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
                <span className="font-bold text-text-primary">{procurement.crop} {procurement.grade ? `(${procurement.grade})` : ''}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-border">
                <span className="text-text-secondary">Declared Quantity:</span>
                <span className="font-bold text-text-primary">{procurement.estimated_quantity_quintals} Quintals</span>
              </div>
              {procurement.accepted_quantity_quintals && (
                <div className="flex justify-between py-1 border-b border-surface-border">
                  <span className="text-text-secondary">Accepted Quantity:</span>
                  <span className="font-bold text-brand-primary">{procurement.accepted_quantity_quintals} Quintals</span>
                </div>
              )}
              {procurement.grade && (
                <div className="flex justify-between py-1 border-b border-surface-border">
                  <span className="text-text-secondary">MSP Rate:</span>
                  <span className="font-bold text-text-primary">
                    {procurement.grade === 'GRADE_A' ? '₹2,300' : '₹2,200'} / Quintal
                  </span>
                </div>
              )}
              {procurement.accepted_quantity_quintals && procurement.grade && (
                <div className="flex justify-between py-1 mt-2">
                  <span className="text-text-secondary">Estimated Net Value:</span>
                  <span className="font-bold text-brand-dark text-sm">
                    ₹{((procurement.grade === 'GRADE_A' ? 2300 : 2200) * procurement.accepted_quantity_quintals).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
