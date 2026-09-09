-- ==============================================================================
-- SmartProcure (SIH26032) - Database Schema DDL & Row Level Security (RLS)
-- Source of Truth: docs/ARCHITECTURE.md Section 18 & docs/PRD.md
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to automatically update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==============================================================================
-- 1. Users Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('FARMER', 'OFFICER', 'ADMIN')),
    language VARCHAR(10) DEFAULT 'en' CHECK (language IN ('en', 'hi', 'te')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 2. Farmer Profiles Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS farmer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farmer_id_code VARCHAR(50) UNIQUE NOT NULL,
    is_aadhaar_verified BOOLEAN DEFAULT FALSE,
    land_size_acres NUMERIC(8, 2) NOT NULL DEFAULT 0 CHECK (land_size_acres >= 0),
    land_village VARCHAR(255),
    land_district VARCHAR(255),
    land_state VARCHAR(255),
    land_document_url TEXT,
    bank_account_number_masked VARCHAR(50),
    bank_ifsc VARCHAR(20),
    bank_name VARCHAR(255),
    crops_grown TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. Procurement Centers Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS procurement_centers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    daily_capacity_quintals NUMERIC(10, 2) NOT NULL DEFAULT 500 CHECK (daily_capacity_quintals > 0),
    current_load_percent INT NOT NULL DEFAULT 0 CHECK (current_load_percent >= 0 AND current_load_percent <= 100),
    processing_rate_min_per_farmer INT NOT NULL DEFAULT 6 CHECK (processing_rate_min_per_farmer > 0),
    status VARCHAR(50) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'MAINTENANCE')),
    load_status VARCHAR(50) DEFAULT 'NORMAL' CHECK (load_status IN ('NORMAL', 'BUSY', 'HIGH', 'CRITICAL')),
    operating_hours JSONB DEFAULT '{"open": "08:00 AM", "close": "06:00 PM"}',
    supported_crops TEXT[] DEFAULT '{"Paddy", "Wheat"}',
    photo_url TEXT,
    contact_phone VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. Slots Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    center_id UUID NOT NULL REFERENCES procurement_centers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time VARCHAR(20) NOT NULL,
    end_time VARCHAR(20) NOT NULL,
    capacity INT NOT NULL DEFAULT 15 CHECK (capacity > 0),
    booked_count INT NOT NULL DEFAULT 0 CHECK (booked_count >= 0 AND booked_count <= capacity),
    status VARCHAR(50) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'FULL', 'CANCELLED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_center_slot UNIQUE (center_id, date, start_time, end_time)
);

-- ==============================================================================
-- 5. Bookings Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    center_id UUID NOT NULL REFERENCES procurement_centers(id) ON DELETE CASCADE,
    slot_id UUID REFERENCES slots(id) ON DELETE SET NULL,
    crop VARCHAR(100) NOT NULL,
    quantity_quintals NUMERIC(10, 2) NOT NULL CHECK (quantity_quintals > 0),
    token_number VARCHAR(50) UNIQUE NOT NULL,
    qr_code_payload TEXT,
    status VARCHAR(50) DEFAULT 'CONFIRMED' CHECK (status IN ('CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. Queue Entries Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS queue_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    center_id UUID NOT NULL REFERENCES procurement_centers(id) ON DELETE CASCADE,
    token_number VARCHAR(50) NOT NULL,
    position INT NOT NULL CHECK (position >= 1),
    farmers_ahead INT NOT NULL DEFAULT 0 CHECK (farmers_ahead >= 0),
    estimated_wait_minutes INT NOT NULL DEFAULT 0 CHECK (estimated_wait_minutes >= 0),
    status VARCHAR(50) DEFAULT 'WAITING' CHECK (status IN ('WAITING', 'ARRIVED', 'INSPECTION', 'GRADING', 'WEIGHING', 'VERIFICATION', 'COMPLETED', 'CANCELLED')),
    checked_in_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. Procurements Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS procurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    center_id UUID NOT NULL REFERENCES procurement_centers(id) ON DELETE CASCADE,
    crop VARCHAR(100) NOT NULL,
    estimated_quantity_quintals NUMERIC(10, 2) NOT NULL CHECK (estimated_quantity_quintals > 0),
    accepted_quantity_quintals NUMERIC(10, 2) CHECK (accepted_quantity_quintals >= 0),
    inspection_status VARCHAR(50) DEFAULT 'PENDING' CHECK (inspection_status IN ('PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED')),
    inspection_notes TEXT,
    grade VARCHAR(50),
    moisture_percent NUMERIC(5, 2) CHECK (moisture_percent >= 0 AND moisture_percent <= 100),
    weighing_status VARCHAR(50) DEFAULT 'PENDING' CHECK (weighing_status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED')),
    verification_status VARCHAR(50) DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'FLAGGED')),
    status VARCHAR(50) DEFAULT 'BOOKED' CHECK (status IN ('BOOKED', 'ARRIVED', 'INSPECTION', 'GRADING', 'WEIGHING', 'VERIFICATION', 'COMPLETED', 'PAYMENT')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 8. Procurement Events Table (Audit State Machine)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS procurement_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    procurement_id UUID NOT NULL REFERENCES procurements(id) ON DELETE CASCADE,
    stage VARCHAR(50) NOT NULL CHECK (stage IN ('BOOKED', 'ARRIVED', 'INSPECTION', 'GRADING', 'WEIGHING', 'VERIFICATION', 'COMPLETED', 'PAYMENT')),
    status VARCHAR(50) NOT NULL,
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_name VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 9. Payments Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    procurement_id UUID NOT NULL REFERENCES procurements(id) ON DELETE CASCADE,
    farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crop VARCHAR(100) NOT NULL,
    accepted_quantity_quintals NUMERIC(10, 2) NOT NULL CHECK (accepted_quantity_quintals > 0),
    rate_per_quintal NUMERIC(10, 2) NOT NULL CHECK (rate_per_quintal > 0),
    gross_amount NUMERIC(12, 2) NOT NULL CHECK (gross_amount >= 0),
    deductions_amount NUMERIC(10, 2) DEFAULT 0 CHECK (deductions_amount >= 0),
    net_amount NUMERIC(12, 2) NOT NULL CHECK (net_amount >= 0),
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'CREDITED', 'FAILED')),
    transaction_reference VARCHAR(100),
    bank_account_masked VARCHAR(50),
    credited_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 10. Notifications Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('booking', 'queue', 'procurement', 'payment', 'alert', 'general')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_target TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 11. Grievances Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS grievances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('DELAY', 'QUALITY_DISPUTE', 'PAYMENT', 'FACILITY', 'OTHER')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    document_url TEXT,
    status VARCHAR(50) DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED')),
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 12. Audit Logs Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 13. Voice Sessions Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS voice_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    call_id VARCHAR(100) UNIQUE NOT NULL,
    language VARCHAR(10) DEFAULT 'en' CHECK (language IN ('en', 'hi', 'te')),
    channel VARCHAR(50) NOT NULL DEFAULT 'web',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    last_intent VARCHAR(100),
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'DISCONNECTED', 'FAILED'))
);

-- ==============================================================================
-- 14. Voice Outbound Triggers Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS voice_outbound_triggers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message_script TEXT NOT NULL,
    language VARCHAR(10) DEFAULT 'en' CHECK (language IN ('en', 'hi', 'te')),
    delivery_status VARCHAR(50) DEFAULT 'PENDING' CHECK (delivery_status IN ('PENDING', 'CALLING', 'COMPLETED', 'DECLINED', 'FAILED')),
    attempt_count INT DEFAULT 0 CHECK (attempt_count >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- Timestamps Triggers
-- ==============================================================================
CREATE OR REPLACE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_farmer_profiles_updated BEFORE UPDATE ON farmer_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_procurement_centers_updated BEFORE UPDATE ON procurement_centers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_slots_updated BEFORE UPDATE ON slots FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_bookings_updated BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_queue_entries_updated BEFORE UPDATE ON queue_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_procurements_updated BEFORE UPDATE ON procurements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_payments_updated BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_grievances_updated BEFORE UPDATE ON grievances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_voice_triggers_updated BEFORE UPDATE ON voice_outbound_triggers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- Indexes for Fast Realtime & Analytics Queries
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile);
CREATE INDEX IF NOT EXISTS idx_farmer_profiles_user ON farmer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_centers_status ON procurement_centers(status, district);
CREATE INDEX IF NOT EXISTS idx_slots_center_date ON slots(center_id, date, status);
CREATE INDEX IF NOT EXISTS idx_bookings_farmer ON bookings(farmer_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_token ON bookings(token_number);
CREATE INDEX IF NOT EXISTS idx_queue_center ON queue_entries(center_id, status, position);
CREATE INDEX IF NOT EXISTS idx_queue_booking ON queue_entries(booking_id);
CREATE INDEX IF NOT EXISTS idx_procurements_booking ON procurements(booking_id);
CREATE INDEX IF NOT EXISTS idx_procurements_farmer ON procurements(farmer_id, status);
CREATE INDEX IF NOT EXISTS idx_procurement_events_procurement ON procurement_events(procurement_id, created_at);
CREATE INDEX IF NOT EXISTS idx_payments_farmer ON payments(farmer_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read, created_at);
CREATE INDEX IF NOT EXISTS idx_grievances_farmer ON grievances(farmer_id, status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id, created_at);

-- ==============================================================================
-- Supabase Row Level Security (RLS) Policies
-- ==============================================================================

-- Enable RLS on all 14 tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_outbound_triggers ENABLE ROW LEVEL SECURITY;

-- NOTE: users.id MUST equal the Supabase auth.uid() for RLS to resolve correctly.
-- When creating auth.users via seed, use the same UUIDs as the users table entries.

-- 1. users: users can read/update their own record; officers/admins can read all users
CREATE POLICY users_select_policy ON users
    FOR SELECT USING (auth.uid() = id OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('OFFICER', 'ADMIN')));
CREATE POLICY users_insert_policy ON users
    FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY users_update_policy ON users
    FOR UPDATE USING (auth.uid() = id);

-- 2. farmer_profiles: farmers view/update own; officers can view; farmers can insert own
CREATE POLICY farmer_profiles_select_policy ON farmer_profiles
    FOR SELECT USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('OFFICER', 'ADMIN')));
CREATE POLICY farmer_profiles_insert_policy ON farmer_profiles
    FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY farmer_profiles_update_policy ON farmer_profiles
    FOR UPDATE USING (user_id = auth.uid());

-- 3. procurement_centers: public read for discovery; officers/admins can update
CREATE POLICY centers_public_read ON procurement_centers
    FOR SELECT USING (true);
CREATE POLICY centers_officer_update ON procurement_centers
    FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('OFFICER', 'ADMIN')));

-- 4. slots: public read for slot booking; officers can manage
CREATE POLICY slots_public_read ON slots
    FOR SELECT USING (true);
CREATE POLICY slots_officer_manage ON slots
    FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('OFFICER', 'ADMIN')));

-- 5. bookings: farmers can read/create own; officers can view and update center bookings
CREATE POLICY bookings_farmer_read ON bookings
    FOR SELECT USING (farmer_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('OFFICER', 'ADMIN')));
CREATE POLICY bookings_farmer_insert ON bookings
    FOR INSERT WITH CHECK (farmer_id = auth.uid());
CREATE POLICY bookings_officer_update ON bookings
    FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('OFFICER', 'ADMIN')));

-- 6. queue_entries: public/farmers can read; officers can manage
CREATE POLICY queue_public_read ON queue_entries
    FOR SELECT USING (true);
CREATE POLICY queue_officer_manage ON queue_entries
    FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('OFFICER', 'ADMIN')));

-- 7. procurements: farmers read own; officers manage
CREATE POLICY procurements_farmer_read ON procurements
    FOR SELECT USING (farmer_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('OFFICER', 'ADMIN')));
CREATE POLICY procurements_officer_manage ON procurements
    FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('OFFICER', 'ADMIN')));

-- 8. procurement_events: farmers read own procurement events; officers insert
CREATE POLICY events_read_policy ON procurement_events
    FOR SELECT USING (EXISTS (SELECT 1 FROM procurements WHERE id = procurement_events.procurement_id AND (farmer_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('OFFICER', 'ADMIN')))));
CREATE POLICY events_officer_insert ON procurement_events
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('OFFICER', 'ADMIN')));

-- 9. payments: farmers view own; officers view/manage
CREATE POLICY payments_farmer_read ON payments
    FOR SELECT USING (farmer_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('OFFICER', 'ADMIN')));
CREATE POLICY payments_officer_manage ON payments
    FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('OFFICER', 'ADMIN')));

-- 10. notifications: users access own notifications only
CREATE POLICY notifications_user_policy ON notifications
    FOR ALL USING (user_id = auth.uid());

-- 11. grievances: farmers read/insert own; officers manage
CREATE POLICY grievances_farmer_read ON grievances
    FOR SELECT USING (farmer_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('OFFICER', 'ADMIN')));
CREATE POLICY grievances_farmer_insert ON grievances
    FOR INSERT WITH CHECK (farmer_id = auth.uid());
CREATE POLICY grievances_officer_update ON grievances
    FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('OFFICER', 'ADMIN')));

-- 12. audit_logs: admin and officer read only
CREATE POLICY audit_logs_read ON audit_logs
    FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('OFFICER', 'ADMIN')));

-- 13. voice_sessions & voice_outbound_triggers: user access own
CREATE POLICY voice_sessions_user ON voice_sessions
    FOR SELECT USING (farmer_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('OFFICER', 'ADMIN')));
CREATE POLICY voice_triggers_user ON voice_outbound_triggers
    FOR SELECT USING (farmer_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('OFFICER', 'ADMIN')));
