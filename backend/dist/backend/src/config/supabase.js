"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = exports.checkDatabaseConnectivity = exports.isDatabaseConfigured = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("./env");
let supabase = null;
exports.supabase = supabase;
const isDatabaseConfigured = () => {
    return Boolean(env_1.ENV.SUPABASE_URL && env_1.ENV.SUPABASE_ANON_KEY && !env_1.ENV.SUPABASE_URL.includes('your-project'));
};
exports.isDatabaseConfigured = isDatabaseConfigured;
if ((0, exports.isDatabaseConfigured)()) {
    exports.supabase = supabase = (0, supabase_js_1.createClient)(env_1.ENV.SUPABASE_URL, env_1.ENV.SUPABASE_ANON_KEY, {
        auth: {
            persistSession: false,
        },
    });
    console.log('✓ Supabase client connected to:', env_1.ENV.SUPABASE_URL);
}
else {
    console.log('ℹ Supabase credentials not configured in .env. Backend operating with high-fidelity in-memory seed dataset.');
}
const checkDatabaseConnectivity = async () => {
    const timestamp = new Date().toISOString();
    if (!(0, exports.isDatabaseConfigured)() || !supabase) {
        return {
            connected: true,
            mode: 'in_memory_mock',
            message: 'Operating in standalone mock mode with seeded architecture data',
            timestamp,
        };
    }
    try {
        const { data, error } = await supabase.from('procurement_centers').select('id, code, name').limit(1);
        if (error)
            throw error;
        return {
            connected: true,
            mode: 'supabase',
            message: `Successfully queried procurement_centers (${data?.length || 0} records found)`,
            timestamp,
        };
    }
    catch (err) {
        return {
            connected: false,
            mode: 'supabase',
            message: `Database connection error: ${err.message || String(err)}`,
            timestamp,
        };
    }
};
exports.checkDatabaseConnectivity = checkDatabaseConnectivity;
