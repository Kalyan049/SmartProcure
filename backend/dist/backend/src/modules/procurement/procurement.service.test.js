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
Object.defineProperty(exports, "__esModule", { value: true });
const procService = __importStar(require("./procurement.service"));
let passed = 0;
let failed = 0;
function assert(condition, label) {
    if (condition) {
        console.log(`  ✓ PASS: ${label}`);
        passed++;
    }
    else {
        console.error(`  ✗ FAIL: ${label}`);
        failed++;
    }
}
async function runTests() {
    console.log('\n=== SmartProcure Module 12 — Procurement State Machine ===\n');
    procService.resetDemoState();
    const startState = await procService.getProcurement('pr-01');
    assert(startState?.status === 'ARRIVED', 'Initial state is ARRIVED');
    try {
        const s1 = await procService.advanceStage('pr-01', 'officer', 'Test', { notes: 'Looks good' });
        assert(s1.status === 'INSPECTION', 'Advanced ARRIVED -> INSPECTION');
        const s2 = await procService.advanceStage('pr-01', 'officer', 'Test', { grade: 'GRADE_A', moisture_percent: 13.5 });
        assert(s2.status === 'GRADING' && s2.grade === 'GRADE_A', 'Advanced INSPECTION -> GRADING with Grade A');
        const s3 = await procService.advanceStage('pr-01', 'officer', 'Test', { accepted_quantity_quintals: 39 });
        assert(s3.status === 'WEIGHING' && s3.accepted_quantity_quintals === 39, 'Advanced GRADING -> WEIGHING with Qty');
        const s4 = await procService.advanceStage('pr-01', 'officer', 'Test', {});
        assert(s4.status === 'VERIFICATION', 'Advanced WEIGHING -> VERIFICATION');
        const s5 = await procService.advanceStage('pr-01', 'officer', 'Test', {});
        assert(s5.status === 'COMPLETED', 'Advanced VERIFICATION -> COMPLETED');
        const events = await procService.getEvents('pr-01');
        assert(events.length === 7, 'Event log captured 7 total events (2 initial + 5 transitions)');
    }
    catch (err) {
        console.error(err);
        failed++;
    }
    console.log('\n═══════════════════════════════════════════════');
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log('═══════════════════════════════════════════════\n');
    if (failed > 0)
        process.exit(1);
}
runTests();
