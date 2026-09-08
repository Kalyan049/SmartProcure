"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("./env");
let supabase = null;
exports.supabase = supabase;
if (env_1.ENV.SUPABASE_URL && env_1.ENV.SUPABASE_ANON_KEY) {
    exports.supabase = supabase = (0, supabase_js_1.createClient)(env_1.ENV.SUPABASE_URL, env_1.ENV.SUPABASE_ANON_KEY);
    console.log('✓ Supabase client initialized');
}
else {
    console.log('ℹ Supabase credentials not provided. Backend operating in Standalone/Mock Mode.');
}
