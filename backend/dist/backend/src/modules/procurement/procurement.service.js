"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROCUREMENT_STAGES = void 0;
exports.getProcurement = getProcurement;
exports.getMyProcurement = getMyProcurement;
exports.getEvents = getEvents;
exports.advanceStage = advanceStage;
exports.resetDemoState = resetDemoState;
const crypto_1 = __importDefault(require("crypto"));
exports.PROCUREMENT_STAGES = [
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
let mockProcurements = [
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
let mockEvents = [
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
async function getProcurement(id) {
    return mockProcurements.find(p => p.id === id) || null;
}
async function getMyProcurement(farmerId) {
    // Return the first active one for demo
    return mockProcurements.find(p => p.farmer_id === farmerId) || mockProcurements[0] || null;
}
async function getEvents(procurementId) {
    return mockEvents.filter(e => e.procurement_id === procurementId).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}
async function advanceStage(procurementId, actorId, actorName, payload) {
    const proc = mockProcurements.find(p => p.id === procurementId);
    if (!proc)
        throw new Error('Procurement not found');
    const currentIndex = exports.PROCUREMENT_STAGES.indexOf(proc.status);
    if (currentIndex === -1 || currentIndex >= exports.PROCUREMENT_STAGES.length - 1) {
        throw new Error('Invalid current stage or already completed');
    }
    const nextStage = exports.PROCUREMENT_STAGES[currentIndex + 1];
    // Validation and Data update based on transition
    let notes = payload.notes || `Advanced to ${nextStage}`;
    if (nextStage === 'INSPECTION') {
        proc.inspection_status = payload.inspection_status || 'PASSED';
        proc.inspection_notes = payload.notes;
        notes = `Inspection ${proc.inspection_status}. ${payload.notes || ''}`;
    }
    else if (nextStage === 'GRADING') {
        if (!payload.grade)
            throw new Error('Grade is required');
        proc.grade = payload.grade;
        proc.moisture_percent = payload.moisture_percent;
        notes = `Graded ${payload.grade}, Moisture: ${payload.moisture_percent}%`;
    }
    else if (nextStage === 'WEIGHING') {
        if (!payload.accepted_quantity_quintals)
            throw new Error('Accepted quantity is required');
        proc.accepted_quantity_quintals = payload.accepted_quantity_quintals;
        proc.weighing_status = 'PASSED';
        notes = `Weighed Gross Quantity: ${payload.accepted_quantity_quintals} Qtl`;
    }
    else if (nextStage === 'VERIFICATION') {
        proc.verification_status = 'PASSED';
        notes = `Officer signed off and verified.`;
    }
    else if (nextStage === 'COMPLETED') {
        notes = `Procurement officially completed. Generating payment...`;
    }
    // Update Procurement State
    proc.status = nextStage;
    proc.updated_at = new Date().toISOString();
    // Create Event Log
    const event = {
        id: crypto_1.default.randomUUID(),
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
    const { notificationService } = await Promise.resolve().then(() => __importStar(require('../notifications/notifications.service')));
    if (nextStage !== 'PAYMENT') { // Payment notifies on its own
        await notificationService.dispatch(proc.farmer_id, `Procurement Update: ${nextStage}`, notes, nextStage === 'COMPLETED' ? 'SUCCESS' : 'INFO');
    }
    // Generate Payment if COMPLETED
    if (nextStage === 'COMPLETED') {
        const { generatePaymentForProcurement } = await Promise.resolve().then(() => __importStar(require('../payments/payments.service')));
        await generatePaymentForProcurement(proc);
    }
    return proc;
}
function resetDemoState() {
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
