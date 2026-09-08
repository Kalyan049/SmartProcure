"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmersService = void 0;
const express_1 = require("express");
const apiResponse_1 = require("../../utils/apiResponse");
class FarmersService {
    async getProfile(userId) {
        return {
            id: 'prof-01',
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
            created_at: new Date().toISOString(),
        };
    }
    async updateProfile(userId, data) {
        return {
            user_id: userId,
            ...data,
            updated_at: new Date().toISOString(),
        };
    }
}
exports.FarmersService = FarmersService;
const farmersService = new FarmersService();
const router = (0, express_1.Router)();
router.get('/me', async (req, res) => {
    const profile = await farmersService.getProfile('usr-farmer-01');
    return apiResponse_1.ApiResponseHandler.success(res, profile);
});
router.put('/me', async (req, res) => {
    const updated = await farmersService.updateProfile('usr-farmer-01', req.body);
    return apiResponse_1.ApiResponseHandler.success(res, updated, 'Profile updated successfully');
});
exports.default = router;
