-- ==============================================================================
-- SmartProcure (SIH26032) - Comprehensive Demo Seed Data Script
-- Source of Truth: docs/ARCHITECTURE.md Section 18 & docs/DESIGN_STYLE (1).md
-- ==============================================================================

-- ==============================================================================
-- 0. Supabase Auth Users (run ONCE per project setup)
-- Creates auth.users entries so Supabase login works.
-- UUIDs match users table so auth.uid() = users.id for RLS.
-- Emails follow convention: <mobile>@smartprocure.local
-- IMPORTANT: Run this in the Supabase SQL editor AFTER enabling Email Auth
--            and disabling email confirmation in Auth > Settings.
-- ==============================================================================

-- Farmer demo account: mobile 9876543210, password DemoFarmer@123
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, confirmation_token
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  '9876543210@smartprocure.local',
  crypt('DemoFarmer@123', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"mobile":"9876543210","role":"FARMER","name":"Ramesh Kumar"}'::jsonb,
  FALSE, ''
) ON CONFLICT (id) DO UPDATE SET encrypted_password = EXCLUDED.encrypted_password, email = EXCLUDED.email;

-- Officer demo account: mobile 9999999999, password DemoOfficer@123
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, confirmation_token
) VALUES (
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  '9999999999@smartprocure.local',
  crypt('DemoOfficer@123', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"mobile":"9999999999","role":"OFFICER","name":"Procurement Officer Rawat"}'::jsonb,
  FALSE, ''
) ON CONFLICT (id) DO UPDATE SET encrypted_password = EXCLUDED.encrypted_password, email = EXCLUDED.email;

-- Admin demo account: mobile 8888888888, password DemoAdmin@123
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, confirmation_token
) VALUES (
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  '8888888888@smartprocure.local',
  crypt('DemoAdmin@123', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"mobile":"8888888888","role":"ADMIN","name":"System Administrator"}'::jsonb,
  FALSE, ''
) ON CONFLICT (id) DO UPDATE SET encrypted_password = EXCLUDED.encrypted_password, email = EXCLUDED.email;

-- Create matching identity records (required for email provider)
INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '9876543210@smartprocure.local',
   '{"sub":"a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11","email":"9876543210@smartprocure.local"}'::jsonb, 'email', NOW(), NOW(), NOW()),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '9999999999@smartprocure.local',
   '{"sub":"b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22","email":"9999999999@smartprocure.local"}'::jsonb, 'email', NOW(), NOW(), NOW()),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '8888888888@smartprocure.local',
   '{"sub":"c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33","email":"8888888888@smartprocure.local"}'::jsonb, 'email', NOW(), NOW(), NOW())
ON CONFLICT (provider, provider_id) DO NOTHING;

-- 1. Demo Users
INSERT INTO users (id, name, mobile, role, language) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Ramesh Kumar', '9876543210', 'FARMER', 'en'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Sunita Devi', '9876543211', 'FARMER', 'hi'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Harpreet Singh', '9876543212', 'FARMER', 'en'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Baldev Prasad', '9876543213', 'FARMER', 'te'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Procurement Officer Rawat', '9999999999', 'OFFICER', 'en'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'System Administrator', '8888888888', 'ADMIN', 'en')
ON CONFLICT (mobile) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role;

-- 2. Demo Farmer Profiles
INSERT INTO farmer_profiles (id, user_id, farmer_id_code, is_aadhaar_verified, land_size_acres, land_village, land_district, land_state, bank_account_number_masked, bank_ifsc, bank_name, crops_grown) VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a41', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SP-FARMER-1082', TRUE, 4.5, 'Rampur', 'Varanasi', 'Uttar Pradesh', 'XXXX-XXXX-4812', 'SBIN0001234', 'State Bank of India', '{"Wheat", "Paddy"}'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a42', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'SP-FARMER-1083', TRUE, 3.2, 'Shivpur', 'Varanasi', 'Uttar Pradesh', 'XXXX-XXXX-9123', 'PUNB0005678', 'Punjab National Bank', '{"Paddy", "Mustard"}'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a43', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'SP-FARMER-1084', TRUE, 6.0, 'Bhadohi', 'Varanasi', 'Uttar Pradesh', 'XXXX-XXXX-3341', 'BARB0VAPURX', 'Bank of Baroda', '{"Wheat", "Gram"}'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'SP-FARMER-1085', TRUE, 2.8, 'Kashi Puram', 'Varanasi', 'Uttar Pradesh', 'XXXX-XXXX-7721', 'CNRB0002341', 'Canara Bank', '{"Gram", "Paddy"}')
ON CONFLICT (farmer_id_code) DO NOTHING;

-- 3. Demo Procurement Centers (A, B, C matching ARCHITECTURE & DESIGN_STYLE)
INSERT INTO procurement_centers (id, name, code, address, district, state, latitude, longitude, daily_capacity_quintals, current_load_percent, processing_rate_min_per_farmer, status, load_status, supported_crops, contact_phone) VALUES
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Kashi Mandi Center A', 'CTR-01', 'Near NH-19, Industrial Area, Varanasi', 'Varanasi', 'Uttar Pradesh', 25.3176, 82.9739, 500, 90, 8, 'OPEN', 'HIGH', '{"Paddy", "Wheat", "Maize"}', '+91 542 2221111'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Rohania Agribusiness Center B', 'CTR-02', 'GT Road, Rohania, Varanasi', 'Varanasi', 'Uttar Pradesh', 25.2677, 82.9234, 600, 45, 6, 'OPEN', 'NORMAL', '{"Paddy", "Wheat", "Mustard"}', '+91 542 2222222'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'Sewapuri Farmer Hub C', 'CTR-03', 'Main Market, Sewapuri, Varanasi', 'Varanasi', 'Uttar Pradesh', 25.3501, 82.7832, 400, 30, 5, 'OPEN', 'NORMAL', '{"Paddy", "Wheat"}', '+91 542 2223333')
ON CONFLICT (code) DO UPDATE SET 
    daily_capacity_quintals = EXCLUDED.daily_capacity_quintals,
    current_load_percent = EXCLUDED.current_load_percent,
    load_status = EXCLUDED.load_status;

-- 4. Demo Slots for Today
INSERT INTO slots (id, center_id, date, start_time, end_time, capacity, booked_count, status) VALUES
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', CURRENT_DATE, '08:00 AM', '10:00 AM', 20, 20, 'FULL'),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', CURRENT_DATE, '10:00 AM', '12:00 PM', 20, 12, 'AVAILABLE'),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', CURRENT_DATE, '12:00 PM', '02:00 PM', 20, 8, 'AVAILABLE'),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', CURRENT_DATE, '02:00 PM', '04:00 PM', 20, 4, 'AVAILABLE'),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', CURRENT_DATE, '10:00 AM', '12:00 PM', 20, 19, 'AVAILABLE'),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', CURRENT_DATE, '10:00 AM', '12:00 PM', 15, 5, 'AVAILABLE')
ON CONFLICT (center_id, date, start_time, end_time) DO NOTHING;

-- 5. Demo Bookings
INSERT INTO bookings (id, farmer_id, center_id, slot_id, crop, quantity_quintals, token_number, qr_code_payload, status) VALUES
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Wheat', 45.00, 'SP-1042', 'SP-TOKEN-1042|CTR-02|45QTL', 'COMPLETED'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Paddy', 30.00, 'SP-1045', 'SP-TOKEN-1045|CTR-02|30QTL', 'CONFIRMED'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Wheat', 55.00, 'SP-1047', 'SP-TOKEN-1047|CTR-02|55QTL', 'CONFIRMED'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Gram', 25.00, 'SP-1049', 'SP-TOKEN-1049|CTR-02|25QTL', 'CONFIRMED')
ON CONFLICT (token_number) DO NOTHING;

-- 6. Demo Queue Entries
INSERT INTO queue_entries (id, booking_id, center_id, token_number, position, farmers_ahead, estimated_wait_minutes, status, checked_in_at) VALUES
('q1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'SP-1042', 1, 0, 0, 'COMPLETED', NOW() - INTERVAL '2 hours'),
('q1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'SP-1045', 2, 1, 10, 'WEIGHING', NOW() - INTERVAL '45 minutes'),
('q1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'SP-1047', 12, 11, 35, 'INSPECTION', NOW() - INTERVAL '15 minutes'),
('q1eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'SP-1049', 18, 17, 55, 'WAITING', NULL)
ON CONFLICT (id) DO NOTHING;

-- 7. Demo Procurements
INSERT INTO procurements (id, booking_id, farmer_id, center_id, crop, estimated_quantity_quintals, accepted_quantity_quintals, inspection_status, inspection_notes, grade, moisture_percent, weighing_status, verification_status, status) VALUES
('p1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Wheat', 45.00, 44.80, 'APPROVED', 'Clean golden grain, low foreign matter.', 'Grade A', 11.2, 'COMPLETED', 'VERIFIED', 'PAYMENT'),
('p1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Wheat', 55.00, 54.50, 'APPROVED', 'Moisture 11.8%, meets FCI standards.', 'Grade A', 11.8, 'PENDING', 'PENDING', 'GRADING')
ON CONFLICT (id) DO NOTHING;

-- 8. Demo Procurement Events
INSERT INTO procurement_events (id, procurement_id, stage, status, actor_name, notes, created_at) VALUES
('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'p1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'BOOKED', 'SUCCESS', 'Ramesh Kumar', 'Online appointment booking.', NOW() - INTERVAL '4 hours'),
('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'p1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'ARRIVED', 'SUCCESS', 'Gate Attendant', 'Vehicle UP65-AB-1234 checked in.', NOW() - INTERVAL '2 hours'),
('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'p1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'INSPECTION', 'APPROVED', 'Quality Inspector', 'Moisture: 11.2%. Standard limit: 12%.', NOW() - INTERVAL '90 minutes'),
('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'p1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'WEIGHING', 'COMPLETED', 'Weighbridge Operator', 'Gross: 62.4 qtl, Tare: 17.6 qtl, Net: 44.8 qtl.', NOW() - INTERVAL '60 minutes'),
('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'p1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'VERIFICATION', 'VERIFIED', 'Procurement Officer Rawat', 'Warehouse receipt generated.', NOW() - INTERVAL '30 minutes')
ON CONFLICT (id) DO NOTHING;

-- 9. Demo Payments
INSERT INTO payments (id, procurement_id, farmer_id, crop, accepted_quantity_quintals, rate_per_quintal, gross_amount, deductions_amount, net_amount, status, transaction_reference, bank_account_masked, credited_date) VALUES
('m1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'p1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Wheat', 44.80, 2300.00, 103040.00, 640.00, 102400.00, 'CREDITED', 'SP-PAY-1042-DBT', 'XXXX-XXXX-4812', CURRENT_DATE),
('m1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'p1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Paddy', 30.00, 2320.00, 69600.00, 400.00, 69200.00, 'PROCESSING', 'SP-PAY-1045-DBT', 'XXXX-XXXX-9123', NULL)
ON CONFLICT (id) DO NOTHING;

-- 10. Demo Notifications
INSERT INTO notifications (id, user_id, type, title, message, is_read, action_target) VALUES
('n1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'booking', 'Slot Confirmed (SP-1042)', 'Your procurement slot at Rohania Center B is confirmed.', TRUE, '/farmer/booking/confirmation'),
('n1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'payment', 'Payment Credited ₹1,02,400', 'Direct Benefit Transfer for 44.8 qtl Wheat credited to your SBI account.', FALSE, '/farmer/payments'),
('n1eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'queue', 'Turn Approaching (SP-1047)', 'You are #12 in queue. Estimated wait is ~35 minutes. Please prepare to enter.', FALSE, '/farmer/queue')
ON CONFLICT (id) DO NOTHING;

-- 11. Demo Grievances
INSERT INTO grievances (id, farmer_id, booking_id, category, title, description, status, resolution_notes) VALUES
('g1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'DELAY', 'Moisture meter recalibration delay', 'Waited 20 minutes while the moisture meter was undergoing routine calibration.', 'RESOLVED', 'Meter recalibrated within 15 minutes and inspection was expedited.')
ON CONFLICT (id) DO NOTHING;

-- 12. Demo Audit Logs
INSERT INTO audit_logs (id, actor_id, actor_role, action, entity_type, entity_id, metadata) VALUES
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'OFFICER', 'UPDATE_CAPACITY', 'procurement_centers', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', '{"old_load": 40, "new_load": 45}')
ON CONFLICT (id) DO NOTHING;

-- 13. Demo Voice Sessions & Outbound Triggers
INSERT INTO voice_sessions (id, farmer_id, call_id, language, channel, started_at, ended_at, last_intent, status) VALUES
('v1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'CALL-VOICE-1001', 'hi', 'web', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '55 minutes', 'check_queue_status', 'COMPLETED')
ON CONFLICT (call_id) DO NOTHING;

INSERT INTO voice_outbound_triggers (id, event_type, farmer_id, booking_id, title, message_script, language, delivery_status, attempt_count) VALUES
('t1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'QUEUE_SURGE', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Arrival Window Update', 'Namaskaram Harpreet Singh. Queue at Center B has moved faster. Your recommended arrival is 10:40 AM.', 'en', 'COMPLETED', 1)
ON CONFLICT (id) DO NOTHING;
