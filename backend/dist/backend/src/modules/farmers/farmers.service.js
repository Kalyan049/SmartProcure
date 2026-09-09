"use strict";
/**
 * SmartProcure Farmers Service — Module 6: Farmer Profile
 *
 * Handles fetching and updating farmer profiles, as well as providing mock
 * history data for bookings, procurement, and payments.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFarmerProfile = getFarmerProfile;
exports.updateFarmerProfile = updateFarmerProfile;
exports.getBookingHistory = getBookingHistory;
exports.getProcurementHistory = getProcurementHistory;
exports.getPaymentHistory = getPaymentHistory;
const supabase_1 = require("../../config/supabase");
const logger_1 = require("../../utils/logger");
// In-memory store for fields not in the current DB schema (for MVP)
const MOCK_EXTENDED_PROFILE = {
    'usr-farmer-demo-01': { expected_quantity: 50, harvest_date: '2026-10-15' },
};
// Mock history data for MVP
const MOCK_BOOKING_HISTORY = [
    { id: 'bk-prev-01', date: '2025-11-10', center: 'Kashi Mandi Center A', quantity: 40, status: 'COMPLETED' },
    { id: 'bk-prev-02', date: '2026-04-12', center: 'Sewapuri Farmer Hub C', quantity: 45, status: 'COMPLETED' }
];
const MOCK_PROCUREMENT_HISTORY = [
    { id: 'pr-prev-01', date: '2025-11-10', crop: 'Paddy', accepted_quantity: 38, grade: 'A', status: 'COMPLETED' },
    { id: 'pr-prev-02', date: '2026-04-12', crop: 'Wheat', accepted_quantity: 44, grade: 'B', status: 'COMPLETED' }
];
const MOCK_PAYMENT_HISTORY = [
    { id: 'py-prev-01', date: '2025-11-12', amount: 83600, status: 'CREDITED', ref: 'TXN892347291' },
    { id: 'py-prev-02', date: '2026-04-15', amount: 94600, status: 'CREDITED', ref: 'TXN234981238' }
];
async function getFarmerProfile(userId) {
    // Try Supabase first
    if ((0, supabase_1.isDatabaseConfigured)() && supabase_1.supabase) {
        const { data, error } = await supabase_1.supabase
            .from('farmer_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (!error && data) {
            const ext = MOCK_EXTENDED_PROFILE[userId] || { expected_quantity: 0, harvest_date: '' };
            return {
                ...data,
                aadhaar_masked: 'XXXXXXXX3421', // Mocked as PII is not stored plainly
                expected_quantity: ext.expected_quantity,
                harvest_date: ext.harvest_date,
            };
        }
    }
    // Fallback to mock profile if DB is not configured or user not found
    return {
        id: 'prof-mock-01',
        user_id: userId,
        farmer_id_code: 'SP-FARMER-1082',
        is_aadhaar_verified: true,
        aadhaar_masked: 'XXXXXXXX3421',
        land_size_acres: 4.5,
        land_village: 'Rampur',
        land_district: 'Varanasi',
        land_state: 'Uttar Pradesh',
        bank_account_number_masked: 'XXXXXX5892',
        bank_ifsc: 'SBIN0001234',
        bank_name: 'State Bank of India',
        crops_grown: ['Paddy', 'Wheat'],
        expected_quantity: MOCK_EXTENDED_PROFILE[userId]?.expected_quantity || 50,
        harvest_date: MOCK_EXTENDED_PROFILE[userId]?.harvest_date || '2026-10-15',
        created_at: new Date().toISOString(),
    };
}
async function updateFarmerProfile(userId, updates) {
    // Save extended fields to memory
    if (updates.expected_quantity !== undefined || updates.harvest_date !== undefined) {
        MOCK_EXTENDED_PROFILE[userId] = {
            expected_quantity: updates.expected_quantity || MOCK_EXTENDED_PROFILE[userId]?.expected_quantity || 0,
            harvest_date: updates.harvest_date || MOCK_EXTENDED_PROFILE[userId]?.harvest_date || '',
        };
    }
    // Supabase update
    if ((0, supabase_1.isDatabaseConfigured)() && supabase_1.supabase) {
        const dbUpdates = {};
        if (updates.land_size_acres !== undefined)
            dbUpdates.land_size_acres = updates.land_size_acres;
        if (updates.land_village !== undefined)
            dbUpdates.land_village = updates.land_village;
        if (updates.land_district !== undefined)
            dbUpdates.land_district = updates.land_district;
        if (updates.land_state !== undefined)
            dbUpdates.land_state = updates.land_state;
        if (updates.crops_grown !== undefined)
            dbUpdates.crops_grown = updates.crops_grown;
        if (Object.keys(dbUpdates).length > 0) {
            const { error } = await supabase_1.supabase
                .from('farmer_profiles')
                .update(dbUpdates)
                .eq('user_id', userId);
            if (error) {
                logger_1.logger.error('[Farmers Service] Failed to update profile in DB', error);
            }
        }
    }
    return getFarmerProfile(userId);
}
// Mock History Methods
async function getBookingHistory(userId) {
    return MOCK_BOOKING_HISTORY;
}
async function getProcurementHistory(userId) {
    return MOCK_PROCUREMENT_HISTORY;
}
async function getPaymentHistory(userId) {
    return MOCK_PAYMENT_HISTORY;
}
