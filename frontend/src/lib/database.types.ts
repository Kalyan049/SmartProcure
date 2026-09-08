/**
 * SmartProcure Database Type Definitions
 * Auto-generated from: supabase/schema.sql
 * DO NOT edit manually - regenerate with: npx supabase gen types typescript
 *
 * Source of Truth: ARCHITECTURE.md Section 18 (Data Schema)
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          mobile: string;
          role: 'FARMER' | 'OFFICER' | 'ADMIN';
          language: 'en' | 'hi' | 'te';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          mobile: string;
          role: 'FARMER' | 'OFFICER' | 'ADMIN';
          language?: 'en' | 'hi' | 'te';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          mobile?: string;
          role?: 'FARMER' | 'OFFICER' | 'ADMIN';
          language?: 'en' | 'hi' | 'te';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      farmer_profiles: {
        Row: {
          id: string;
          user_id: string;
          farmer_id_code: string;
          is_aadhaar_verified: boolean;
          land_size_acres: number;
          land_village: string | null;
          land_district: string | null;
          land_state: string | null;
          land_document_url: string | null;
          bank_account_number_masked: string | null;
          bank_ifsc: string | null;
          bank_name: string | null;
          crops_grown: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          farmer_id_code: string;
          is_aadhaar_verified?: boolean;
          land_size_acres?: number;
          land_village?: string | null;
          land_district?: string | null;
          land_state?: string | null;
          land_document_url?: string | null;
          bank_account_number_masked?: string | null;
          bank_ifsc?: string | null;
          bank_name?: string | null;
          crops_grown?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          farmer_id_code?: string;
          is_aadhaar_verified?: boolean;
          land_size_acres?: number;
          land_village?: string | null;
          land_district?: string | null;
          land_state?: string | null;
          land_document_url?: string | null;
          bank_account_number_masked?: string | null;
          bank_ifsc?: string | null;
          bank_name?: string | null;
          crops_grown?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: 'farmer_profiles_user_id_fkey'; columns: ['user_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ];
      };
      procurement_centers: {
        Row: {
          id: string;
          name: string;
          code: string;
          address: string;
          district: string;
          state: string;
          latitude: number;
          longitude: number;
          daily_capacity_quintals: number;
          current_load_percent: number;
          processing_rate_min_per_farmer: number;
          status: 'OPEN' | 'CLOSED' | 'MAINTENANCE';
          load_status: 'NORMAL' | 'BUSY' | 'HIGH' | 'CRITICAL';
          operating_hours: Json;
          supported_crops: string[];
          photo_url: string | null;
          contact_phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          address: string;
          district: string;
          state: string;
          latitude: number;
          longitude: number;
          daily_capacity_quintals?: number;
          current_load_percent?: number;
          processing_rate_min_per_farmer?: number;
          status?: 'OPEN' | 'CLOSED' | 'MAINTENANCE';
          load_status?: 'NORMAL' | 'BUSY' | 'HIGH' | 'CRITICAL';
          operating_hours?: Json;
          supported_crops?: string[];
          photo_url?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          address?: string;
          district?: string;
          state?: string;
          latitude?: number;
          longitude?: number;
          daily_capacity_quintals?: number;
          current_load_percent?: number;
          processing_rate_min_per_farmer?: number;
          status?: 'OPEN' | 'CLOSED' | 'MAINTENANCE';
          load_status?: 'NORMAL' | 'BUSY' | 'HIGH' | 'CRITICAL';
          operating_hours?: Json;
          supported_crops?: string[];
          photo_url?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      slots: {
        Row: {
          id: string;
          center_id: string;
          date: string;
          start_time: string;
          end_time: string;
          capacity: number;
          booked_count: number;
          status: 'AVAILABLE' | 'FULL' | 'CANCELLED';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          center_id: string;
          date: string;
          start_time: string;
          end_time: string;
          capacity?: number;
          booked_count?: number;
          status?: 'AVAILABLE' | 'FULL' | 'CANCELLED';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          center_id?: string;
          date?: string;
          start_time?: string;
          end_time?: string;
          capacity?: number;
          booked_count?: number;
          status?: 'AVAILABLE' | 'FULL' | 'CANCELLED';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: 'slots_center_id_fkey'; columns: ['center_id']; referencedRelation: 'procurement_centers'; referencedColumns: ['id'] }
        ];
      };
      bookings: {
        Row: {
          id: string;
          farmer_id: string;
          center_id: string;
          slot_id: string | null;
          crop: string;
          quantity_quintals: number;
          token_number: string;
          qr_code_payload: string | null;
          status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farmer_id: string;
          center_id: string;
          slot_id?: string | null;
          crop: string;
          quantity_quintals: number;
          token_number: string;
          qr_code_payload?: string | null;
          status?: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          farmer_id?: string;
          center_id?: string;
          slot_id?: string | null;
          crop?: string;
          quantity_quintals?: number;
          token_number?: string;
          qr_code_payload?: string | null;
          status?: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: 'bookings_farmer_id_fkey'; columns: ['farmer_id']; referencedRelation: 'users'; referencedColumns: ['id'] },
          { foreignKeyName: 'bookings_center_id_fkey'; columns: ['center_id']; referencedRelation: 'procurement_centers'; referencedColumns: ['id'] },
          { foreignKeyName: 'bookings_slot_id_fkey'; columns: ['slot_id']; referencedRelation: 'slots'; referencedColumns: ['id'] }
        ];
      };
      queue_entries: {
        Row: {
          id: string;
          booking_id: string;
          center_id: string;
          token_number: string;
          position: number;
          farmers_ahead: number;
          estimated_wait_minutes: number;
          status: 'WAITING' | 'ARRIVED' | 'INSPECTION' | 'GRADING' | 'WEIGHING' | 'VERIFICATION' | 'COMPLETED' | 'CANCELLED';
          checked_in_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          center_id: string;
          token_number: string;
          position: number;
          farmers_ahead?: number;
          estimated_wait_minutes?: number;
          status?: 'WAITING' | 'ARRIVED' | 'INSPECTION' | 'GRADING' | 'WEIGHING' | 'VERIFICATION' | 'COMPLETED' | 'CANCELLED';
          checked_in_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          center_id?: string;
          token_number?: string;
          position?: number;
          farmers_ahead?: number;
          estimated_wait_minutes?: number;
          status?: 'WAITING' | 'ARRIVED' | 'INSPECTION' | 'GRADING' | 'WEIGHING' | 'VERIFICATION' | 'COMPLETED' | 'CANCELLED';
          checked_in_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: 'queue_entries_booking_id_fkey'; columns: ['booking_id']; referencedRelation: 'bookings'; referencedColumns: ['id'] },
          { foreignKeyName: 'queue_entries_center_id_fkey'; columns: ['center_id']; referencedRelation: 'procurement_centers'; referencedColumns: ['id'] }
        ];
      };
      procurements: {
        Row: {
          id: string;
          booking_id: string;
          farmer_id: string;
          center_id: string;
          crop: string;
          estimated_quantity_quintals: number;
          accepted_quantity_quintals: number | null;
          inspection_status: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED';
          inspection_notes: string | null;
          grade: string | null;
          moisture_percent: number | null;
          weighing_status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
          verification_status: 'PENDING' | 'VERIFIED' | 'FLAGGED';
          status: 'BOOKED' | 'ARRIVED' | 'INSPECTION' | 'GRADING' | 'WEIGHING' | 'VERIFICATION' | 'COMPLETED' | 'PAYMENT';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          farmer_id: string;
          center_id: string;
          crop: string;
          estimated_quantity_quintals: number;
          accepted_quantity_quintals?: number | null;
          inspection_status?: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED';
          inspection_notes?: string | null;
          grade?: string | null;
          moisture_percent?: number | null;
          weighing_status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
          verification_status?: 'PENDING' | 'VERIFIED' | 'FLAGGED';
          status?: 'BOOKED' | 'ARRIVED' | 'INSPECTION' | 'GRADING' | 'WEIGHING' | 'VERIFICATION' | 'COMPLETED' | 'PAYMENT';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          farmer_id?: string;
          center_id?: string;
          crop?: string;
          estimated_quantity_quintals?: number;
          accepted_quantity_quintals?: number | null;
          inspection_status?: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED';
          inspection_notes?: string | null;
          grade?: string | null;
          moisture_percent?: number | null;
          weighing_status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
          verification_status?: 'PENDING' | 'VERIFIED' | 'FLAGGED';
          status?: 'BOOKED' | 'ARRIVED' | 'INSPECTION' | 'GRADING' | 'WEIGHING' | 'VERIFICATION' | 'COMPLETED' | 'PAYMENT';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: 'procurements_booking_id_fkey'; columns: ['booking_id']; referencedRelation: 'bookings'; referencedColumns: ['id'] },
          { foreignKeyName: 'procurements_farmer_id_fkey'; columns: ['farmer_id']; referencedRelation: 'users'; referencedColumns: ['id'] },
          { foreignKeyName: 'procurements_center_id_fkey'; columns: ['center_id']; referencedRelation: 'procurement_centers'; referencedColumns: ['id'] }
        ];
      };
      procurement_events: {
        Row: {
          id: string;
          procurement_id: string;
          stage: 'BOOKED' | 'ARRIVED' | 'INSPECTION' | 'GRADING' | 'WEIGHING' | 'VERIFICATION' | 'COMPLETED' | 'PAYMENT';
          status: string;
          actor_id: string | null;
          actor_name: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          procurement_id: string;
          stage: 'BOOKED' | 'ARRIVED' | 'INSPECTION' | 'GRADING' | 'WEIGHING' | 'VERIFICATION' | 'COMPLETED' | 'PAYMENT';
          status: string;
          actor_id?: string | null;
          actor_name?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          procurement_id?: string;
          stage?: 'BOOKED' | 'ARRIVED' | 'INSPECTION' | 'GRADING' | 'WEIGHING' | 'VERIFICATION' | 'COMPLETED' | 'PAYMENT';
          status?: string;
          actor_id?: string | null;
          actor_name?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: 'procurement_events_procurement_id_fkey'; columns: ['procurement_id']; referencedRelation: 'procurements'; referencedColumns: ['id'] },
          { foreignKeyName: 'procurement_events_actor_id_fkey'; columns: ['actor_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ];
      };
      payments: {
        Row: {
          id: string;
          procurement_id: string;
          farmer_id: string;
          crop: string;
          accepted_quantity_quintals: number;
          rate_per_quintal: number;
          gross_amount: number;
          deductions_amount: number;
          net_amount: number;
          status: 'PENDING' | 'PROCESSING' | 'CREDITED' | 'FAILED';
          transaction_reference: string | null;
          bank_account_masked: string | null;
          credited_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          procurement_id: string;
          farmer_id: string;
          crop: string;
          accepted_quantity_quintals: number;
          rate_per_quintal: number;
          gross_amount: number;
          deductions_amount?: number;
          net_amount: number;
          status?: 'PENDING' | 'PROCESSING' | 'CREDITED' | 'FAILED';
          transaction_reference?: string | null;
          bank_account_masked?: string | null;
          credited_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          procurement_id?: string;
          farmer_id?: string;
          crop?: string;
          accepted_quantity_quintals?: number;
          rate_per_quintal?: number;
          gross_amount?: number;
          deductions_amount?: number;
          net_amount?: number;
          status?: 'PENDING' | 'PROCESSING' | 'CREDITED' | 'FAILED';
          transaction_reference?: string | null;
          bank_account_masked?: string | null;
          credited_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: 'payments_procurement_id_fkey'; columns: ['procurement_id']; referencedRelation: 'procurements'; referencedColumns: ['id'] },
          { foreignKeyName: 'payments_farmer_id_fkey'; columns: ['farmer_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'booking' | 'queue' | 'procurement' | 'payment' | 'alert' | 'general';
          title: string;
          message: string;
          is_read: boolean;
          action_target: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'booking' | 'queue' | 'procurement' | 'payment' | 'alert' | 'general';
          title: string;
          message: string;
          is_read?: boolean;
          action_target?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'booking' | 'queue' | 'procurement' | 'payment' | 'alert' | 'general';
          title?: string;
          message?: string;
          is_read?: boolean;
          action_target?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: 'notifications_user_id_fkey'; columns: ['user_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ];
      };
      grievances: {
        Row: {
          id: string;
          farmer_id: string;
          booking_id: string | null;
          category: 'DELAY' | 'QUALITY_DISPUTE' | 'PAYMENT' | 'FACILITY' | 'OTHER';
          title: string;
          description: string;
          document_url: string | null;
          status: 'SUBMITTED' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
          resolution_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farmer_id: string;
          booking_id?: string | null;
          category: 'DELAY' | 'QUALITY_DISPUTE' | 'PAYMENT' | 'FACILITY' | 'OTHER';
          title: string;
          description: string;
          document_url?: string | null;
          status?: 'SUBMITTED' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
          resolution_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          farmer_id?: string;
          booking_id?: string | null;
          category?: 'DELAY' | 'QUALITY_DISPUTE' | 'PAYMENT' | 'FACILITY' | 'OTHER';
          title?: string;
          description?: string;
          document_url?: string | null;
          status?: 'SUBMITTED' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
          resolution_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: 'grievances_farmer_id_fkey'; columns: ['farmer_id']; referencedRelation: 'users'; referencedColumns: ['id'] },
          { foreignKeyName: 'grievances_booking_id_fkey'; columns: ['booking_id']; referencedRelation: 'bookings'; referencedColumns: ['id'] }
        ];
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          actor_role: string;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          actor_role: string;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          actor_role?: string;
          action?: string;
          entity_type?: string;
          entity_id?: string;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: 'audit_logs_actor_id_fkey'; columns: ['actor_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ];
      };
      voice_sessions: {
        Row: {
          id: string;
          farmer_id: string | null;
          call_id: string;
          language: 'en' | 'hi' | 'te';
          channel: string;
          started_at: string;
          ended_at: string | null;
          last_intent: string | null;
          status: 'ACTIVE' | 'COMPLETED' | 'DISCONNECTED' | 'FAILED';
        };
        Insert: {
          id?: string;
          farmer_id?: string | null;
          call_id: string;
          language?: 'en' | 'hi' | 'te';
          channel?: string;
          started_at?: string;
          ended_at?: string | null;
          last_intent?: string | null;
          status?: 'ACTIVE' | 'COMPLETED' | 'DISCONNECTED' | 'FAILED';
        };
        Update: {
          id?: string;
          farmer_id?: string | null;
          call_id?: string;
          language?: 'en' | 'hi' | 'te';
          channel?: string;
          started_at?: string;
          ended_at?: string | null;
          last_intent?: string | null;
          status?: 'ACTIVE' | 'COMPLETED' | 'DISCONNECTED' | 'FAILED';
        };
        Relationships: [
          { foreignKeyName: 'voice_sessions_farmer_id_fkey'; columns: ['farmer_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ];
      };
      voice_outbound_triggers: {
        Row: {
          id: string;
          event_type: string;
          farmer_id: string;
          booking_id: string;
          title: string;
          message_script: string;
          language: 'en' | 'hi' | 'te';
          delivery_status: 'PENDING' | 'CALLING' | 'COMPLETED' | 'DECLINED' | 'FAILED';
          attempt_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_type: string;
          farmer_id: string;
          booking_id: string;
          title: string;
          message_script: string;
          language?: 'en' | 'hi' | 'te';
          delivery_status?: 'PENDING' | 'CALLING' | 'COMPLETED' | 'DECLINED' | 'FAILED';
          attempt_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_type?: string;
          farmer_id?: string;
          booking_id?: string;
          title?: string;
          message_script?: string;
          language?: 'en' | 'hi' | 'te';
          delivery_status?: 'PENDING' | 'CALLING' | 'COMPLETED' | 'DECLINED' | 'FAILED';
          attempt_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: 'voice_outbound_triggers_farmer_id_fkey'; columns: ['farmer_id']; referencedRelation: 'users'; referencedColumns: ['id'] },
          { foreignKeyName: 'voice_outbound_triggers_booking_id_fkey'; columns: ['booking_id']; referencedRelation: 'bookings'; referencedColumns: ['id'] }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
