/**
 * SmartProcure Domain Model & API Type Definitions
 * Source of Truth: ARCHITECTURE.md v3.0 & PRD.md v1.0
 */

// ==========================================
// 1. Core Enums & Status Literals
// ==========================================

export type UserRole = 'FARMER' | 'OFFICER' | 'ADMIN';

export type LanguageCode = 'en' | 'hi' | 'te';

export type CenterStatus = 'OPEN' | 'CLOSED' | 'MAINTENANCE';

export type CapacityStatus = 'NORMAL' | 'BUSY' | 'HIGH' | 'CRITICAL';

export type SlotStatus = 'AVAILABLE' | 'FULL' | 'CANCELLED';

export type BookingStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';

export type QueueStatus =
  | 'WAITING'
  | 'ARRIVED'
  | 'INSPECTION'
  | 'GRADING'
  | 'WEIGHING'
  | 'VERIFICATION'
  | 'COMPLETED'
  | 'CANCELLED';

export type ProcurementStage =
  | 'BOOKED'
  | 'ARRIVED'
  | 'INSPECTION'
  | 'GRADING'
  | 'WEIGHING'
  | 'VERIFICATION'
  | 'COMPLETED'
  | 'PAYMENT';

export type InspectionStatus = 'PENDING' | 'PASSED' | 'REJECTED' | 'CONDITIONAL';

export type CropGrade = 'GRADE_A' | 'GRADE_B' | 'GRADE_C' | 'REJECTED';

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'CREDITED' | 'FAILED';

export type ShouldIGoDecision = 'GO NOW' | 'PREPARE TO GO' | 'WAIT' | 'DO NOT GO';

export type NotificationType =
  | 'SLOT_CONFIRMED'
  | 'QUEUE_UPDATED'
  | 'DEPARTURE_ADVISORY'
  | 'PROCUREMENT_STAGE'
  | 'PAYMENT_CREDITED'
  | 'CENTER_ALERT'
  | 'GENERAL';

export type GrievanceCategory =
  | 'SLOT_BOOKING'
  | 'QUEUE_DELAY'
  | 'INSPECTION_GRADING'
  | 'WEIGHING_DISCREPANCY'
  | 'PAYMENT_DELAY'
  | 'STAFF_BEHAVIOR'
  | 'OTHER';

export type GrievanceStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';

// ==========================================
// 2. Database Entities
// ==========================================

export interface User {
  id: string;
  name: string;
  mobile: string;
  role: UserRole;
  language: LanguageCode;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface FarmerProfile {
  id: string;
  user_id: string;
  farmer_id_code: string; // E.g. "SP-FARMER-1082"
  aadhaar_masked?: string; // Last 4 digits visible
  is_aadhaar_verified: boolean;
  land_size_acres: number;
  land_village: string;
  land_district: string;
  land_state: string;
  land_document_url?: string;
  bank_account_number_masked?: string;
  bank_ifsc: string;
  bank_name: string;
  crops_grown: string[];
  created_at: string;
  updated_at?: string;
}

export interface ProcurementCenter {
  id: string;
  name: string;
  code: string; // E.g. "CTR-01"
  address: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  daily_capacity_quintals: number;
  current_load_percent: number;
  processing_rate_min_per_farmer: number;
  status: CenterStatus;
  load_status: CapacityStatus;
  operating_hours: {
    open: string; // E.g. "08:00 AM"
    close: string; // E.g. "06:00 PM"
  };
  supported_crops: string[];
  photo_url?: string;
  contact_phone?: string;
  created_at: string;
}

export interface Slot {
  id: string;
  center_id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // E.g. "10:00 AM"
  end_time: string; // E.g. "11:00 AM"
  capacity: number; // Max farmers
  booked_count: number;
  status: SlotStatus;
  created_at: string;
}

export interface Booking {
  id: string;
  farmer_id: string;
  center_id: string;
  slot_id: string;
  crop: string;
  quantity_quintals: number;
  token_number: string; // E.g. "SP-1047"
  qr_code_payload?: string;
  status: BookingStatus;
  created_at: string;
  updated_at?: string;
}

export interface QueueEntry {
  id: string;
  booking_id: string;
  center_id: string;
  token_number: string;
  position: number;
  farmers_ahead: number;
  estimated_wait_minutes: number;
  status: QueueStatus;
  checked_in_at?: string;
  updated_at: string;
}

export interface Procurement {
  id: string;
  booking_id: string;
  farmer_id: string;
  center_id: string;
  crop: string;
  estimated_quantity_quintals: number;
  accepted_quantity_quintals?: number;
  inspection_status: InspectionStatus;
  inspection_notes?: string;
  grade?: CropGrade;
  moisture_percent?: number;
  weighing_status: InspectionStatus;
  verification_status: InspectionStatus;
  status: ProcurementStage;
  created_at: string;
  updated_at: string;
}

export interface ProcurementEvent {
  id: string;
  procurement_id: string;
  stage: ProcurementStage;
  status: string;
  actor_id: string;
  actor_name: string;
  notes?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  procurement_id: string;
  farmer_id: string;
  crop: string;
  accepted_quantity_quintals: number;
  rate_per_quintal: number;
  gross_amount: number;
  deductions_amount: number;
  net_amount: number;
  status: PaymentStatus;
  transaction_reference?: string;
  bank_account_masked?: string;
  credited_date?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  action_target?: string;
  created_at: string;
}

export interface Grievance {
  id: string;
  farmer_id: string;
  booking_id?: string;
  category: GrievanceCategory;
  title: string;
  description: string;
  document_url?: string;
  status: GrievanceStatus;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_role: UserRole;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ==========================================
// 3. Smart Coordination & Engine Models
// ==========================================

export interface RecommendationScoreFactors {
  queue_score: number;
  capacity_score: number;
  eta_score: number;
  distance_score: number;
  preference_score: number;
  total_score: number;
}

export interface SlotRecommendation {
  center: ProcurementCenter;
  slot: Slot;
  score_factors: RecommendationScoreFactors;
  queue_level: 'LOW' | 'MEDIUM' | 'HIGH';
  expected_queue_count: number;
  center_load_percent: number;
  estimated_wait_minutes: number;
  distance_km: number;
  travel_time_minutes: number;
  reason: string;
}

export interface RecommendationResult {
  best_option: SlotRecommendation;
  alternatives: SlotRecommendation[];
  generated_at: string;
}

export interface ShouldIGoNowResult {
  decision: ShouldIGoDecision;
  reason: string;
  token_number: string;
  current_position: number;
  farmers_ahead: number;
  estimated_wait_minutes: number;
  center_load_percent: number;
  recommended_departure_time: string;
  estimated_arrival_time: string;
  center_name: string;
  center_location: {
    lat: number;
    lng: number;
  };
  last_updated: string;
}

// ==========================================
// 4. Voice Agent & Outbound Models
// ==========================================

export interface VoiceSession {
  id: string;
  farmer_id?: string;
  call_id: string;
  language: LanguageCode;
  channel: 'INBOUND_WEB' | 'INBOUND_PHONE' | 'OUTBOUND_PHONE';
  started_at: string;
  ended_at?: string;
  last_intent?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'FAILED';
}

export interface OutboundCallTrigger {
  id: string;
  event_type: 'QUEUE_SURGE' | 'SLOT_RESCHEDULE' | 'CAPACITY_CRITICAL' | 'STAGE_UPDATE';
  farmer_id: string;
  booking_id: string;
  title: string;
  message_script: string;
  language: LanguageCode;
  delivery_status: 'PENDING' | 'CALLING' | 'COMPLETED' | 'SMS_FALLBACK' | 'FAILED';
  attempt_count: number;
  created_at: string;
}

// ==========================================
// 5. Standard API Response Structure
// ==========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
  timestamp: string;
}
