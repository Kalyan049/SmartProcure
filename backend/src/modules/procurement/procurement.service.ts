import { Procurement, ProcurementEvent, ProcurementStage } from '../../../../shared/types';

export const PROCUREMENT_STAGES: ProcurementStage[] = [
  'BOOKED',
  'ARRIVED',
  'INSPECTION',
  'GRADING',
  'WEIGHING',
  'VERIFICATION',
  'COMPLETED',
  'PAYMENT'
];

// Initial mock data
let mockProcurements: Procurement[] = [
  {
    id: 'pr-01',
    booking_id: 'bk-1047',
    farmer_id: 'usr-farmer-01',
    center_id: 'ctr-02',
    crop: 'Paddy',
    estimated_quantity_quintals: 40,
    inspection_status: 'PENDING',
    weighing_status: 'PENDING',
    verification_status: 'PENDING',
    status: 'ARRIVED',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

let mockEvents: ProcurementEvent[] = [
  {
    id: 'ev-01',
    procurement_id: 'pr-01',
    stage: 'BOOKED',
    status: 'COMPLETED',
    actor_id: 'usr-farmer-01',
    actor_name: 'System',
    notes: 'Token SP-1047 confirmed for 40 Qtl',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'ev-02',
    procurement_id: 'pr-01',
    stage: 'ARRIVED',
    status: 'COMPLETED',
    actor_id: 'officer-01',
    actor_name: 'Officer Check-in',
    notes: 'Checked in at Gate 2',
    created_at: new Date().toISOString(),
  }
];

export async function getProcurement(id: string): Promise<Procurement | null> {
  return mockProcurements.find(p => p.id === id) || null;
}

export async function getMyProcurement(farmerId: string): Promise<Procurement | null> {
  // Return the first active one for demo
  return mockProcurements.find(p => p.farmer_id === farmerId) || mockProcurements[0] || null;
}

export async function getEvents(procurementId: string): Promise<ProcurementEvent[]> {
  return mockEvents.filter(e => e.procurement_id === procurementId).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export async function advanceStage(
  procurementId: string, 
  actorId: string, 
  actorName: string, 
  payload: any
): Promise<Procurement> {
  const proc = mockProcurements.find(p => p.id === procurementId);
  if (!proc) throw new Error('Procurement not found');

  const currentIndex = PROCUREMENT_STAGES.indexOf(proc.status);
  if (currentIndex === -1 || currentIndex >= PROCUREMENT_STAGES.length - 1) {
    throw new Error('Invalid current stage or already completed');
  }

  const nextStage = PROCUREMENT_STAGES[currentIndex + 1];
  
  // Validation and Data update based on transition
  let notes = payload.notes || `Advanced to ${nextStage}`;

  if (nextStage === 'INSPECTION') {
    proc.inspection_status = payload.inspection_status || 'PASSED';
    proc.inspection_notes = payload.notes;
    notes = `Inspection ${proc.inspection_status}. ${payload.notes || ''}`;
  } else if (nextStage === 'GRADING') {
    if (!payload.grade) throw new Error('Grade is required');
    proc.grade = payload.grade;
    proc.moisture_percent = payload.moisture_percent;
    notes = `Graded ${payload.grade}, Moisture: ${payload.moisture_percent}%`;
  } else if (nextStage === 'WEIGHING') {
    if (!payload.accepted_quantity_quintals) throw new Error('Accepted quantity is required');
    proc.accepted_quantity_quintals = payload.accepted_quantity_quintals;
    proc.weighing_status = 'PASSED';
    notes = `Weighed Gross Quantity: ${payload.accepted_quantity_quintals} Qtl`;
  } else if (nextStage === 'VERIFICATION') {
    proc.verification_status = 'PASSED';
    notes = `Officer signed off and verified.`;
  } else if (nextStage === 'COMPLETED') {
    notes = `Procurement officially completed. Generating payment...`;
  }

  // Update Procurement State
  proc.status = nextStage;
  proc.updated_at = new Date().toISOString();

  // Create Event Log
  const event: ProcurementEvent = {
    id: Math.random().toString(36).substring(7),
    procurement_id: procurementId,
    stage: nextStage,
    status: 'COMPLETED',
    actor_id: actorId,
    actor_name: actorName,
    notes,
    created_at: new Date().toISOString(),
  };
  mockEvents.push(event);

  // Notify Farmer of Stage Transition
  const { notificationService } = await import('../notifications/notifications.service');
  if (nextStage !== 'PAYMENT') { // Payment notifies on its own
    await notificationService.dispatch(
      proc.farmer_id,
      `Procurement Update: ${nextStage}`,
      notes,
      nextStage === 'COMPLETED' ? 'SUCCESS' : 'INFO'
    );
  }

  // Generate Payment if COMPLETED
  if (nextStage === 'COMPLETED') {
    const { generatePaymentForProcurement } = await import('../payments/payments.service');
    await generatePaymentForProcurement(proc);
  }

  return proc;
}

export function resetDemoState() {
  // Used for testing
  mockProcurements = [{
    id: 'pr-01',
    booking_id: 'bk-1047',
    farmer_id: 'usr-farmer-01',
    center_id: 'ctr-02',
    crop: 'Paddy',
    estimated_quantity_quintals: 40,
    inspection_status: 'PENDING',
    weighing_status: 'PENDING',
    verification_status: 'PENDING',
    status: 'ARRIVED',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }];
  mockEvents = [
    {
      id: 'ev-01',
      procurement_id: 'pr-01',
      stage: 'BOOKED',
      status: 'COMPLETED',
      actor_id: 'usr-farmer-01',
      actor_name: 'System',
      notes: 'Token SP-1047 confirmed for 40 Qtl',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'ev-02',
      procurement_id: 'pr-01',
      stage: 'ARRIVED',
      status: 'COMPLETED',
      actor_id: 'officer-01',
      actor_name: 'Officer Check-in',
      notes: 'Checked in at Gate 2',
      created_at: new Date().toISOString(),
    }
  ];
}
