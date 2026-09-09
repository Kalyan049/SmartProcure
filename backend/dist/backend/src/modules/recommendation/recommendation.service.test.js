"use strict";
/**
 * SmartProcure Recommendation Engine — Standalone Test Script
 *
 * Run with: node -r ts-node/register src/modules/recommendation/recommendation.service.test.ts
 *
 * Tests: filtering, scoring, edge cases, crop compatibility, distances, queue/capacity conditions.
 */
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
const recommendation_service_1 = require("./recommendation.service");
const centersService = __importStar(require("../centers/centers.service"));
// ── Tiny assertion helpers ───────────────────────────────────────────────────
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
// ── Test Runner ──────────────────────────────────────────────────────────────
const engine = new recommendation_service_1.RecommendationService();
async function withCenters(mocked, fn, inputs) {
    const spy = centersService.getAllCenters;
    const original = spy;
    centersService.getAllCenters = async () => mocked;
    try {
        const result = await engine.calculateRecommendation({
            farmerId: 'test-farmer',
            crop: 'Wheat',
            quantityQuintals: 40,
            preferredDate: '2026-10-01',
            ...inputs,
        });
        fn(result);
    }
    finally {
        centersService.getAllCenters = original;
    }
}
async function runTests() {
    console.log('\n=== SmartProcure Recommendation Engine — Unit Tests ===\n');
    // ── Test 1: Filters closed centers ─────────────────────────────────────────
    console.log('Test 1: Closed centers are filtered out');
    try {
        const closedCenters = [
            makeCenter('c1', 'CLOSED', ['Wheat'], 10, 10, 20, 5),
            makeCenter('c2', 'OPEN', ['Wheat'], 20, 20, 40, 10),
        ];
        await withCenters(closedCenters, (result) => {
            assert(result.best_option.center.id === 'c2', 'Open center wins over closed center');
            assert(result.alternatives.length === 0, 'No alternatives (only 1 eligible)');
        });
    }
    catch (e) {
        console.error(`  ERROR: ${e.message}`);
        failed++;
    }
    // ── Test 2: Filters incompatible crops ────────────────────────────────────
    console.log('\nTest 2: Crop incompatibility is filtered out');
    try {
        const centers = [
            makeCenter('c1', 'OPEN', ['Paddy'], 10, 10, 20, 5), // Wrong crop
            makeCenter('c2', 'OPEN', ['Wheat'], 30, 30, 60, 15), // Correct crop
        ];
        await withCenters(centers, (result) => {
            assert(result.best_option.center.id === 'c2', 'Wheat center wins, Paddy-only filtered');
        });
    }
    catch (e) {
        console.error(`  ERROR: ${e.message}`);
        failed++;
    }
    // ── Test 3: Lower queue wins over farther distance ────────────────────────
    console.log('\nTest 3: Queue (35%) outweighs Distance (10%)');
    try {
        const centers = [
            makeCenter('near-heavy', 'OPEN', ['Wheat'], 90, 90, 180, 2), // Close but heavy queue
            makeCenter('far-light', 'OPEN', ['Wheat'], 15, 20, 30, 35), // Far but light queue
        ];
        await withCenters(centers, (result) => {
            assert(result.best_option.center.id === 'far-light', 'Low queue (far) beats high queue (near)');
            assert(result.best_option.score_factors.total_score < result.alternatives[0].score_factors.total_score, 'Winner has lower total score');
        });
    }
    catch (e) {
        console.error(`  ERROR: ${e.message}`);
        failed++;
    }
    // ── Test 4: All centers ineligible → throws ───────────────────────────────
    console.log('\nTest 4: No eligible centers → engine throws');
    try {
        const centers = [
            makeCenter('c1', 'CLOSED', ['Wheat'], 10, 10, 20, 5),
            makeCenter('c2', 'OPEN', ['Paddy'], 10, 10, 20, 5),
        ];
        await withCenters(centers, () => {
            assert(false, 'Should have thrown but did not');
        });
    }
    catch (e) {
        assert(e.message.includes('No eligible'), 'Throws with clear "No eligible" error');
    }
    // ── Test 5: 100% loaded center is filtered ────────────────────────────────
    console.log('\nTest 5: Full-capacity center is filtered');
    try {
        const centers = [
            makeCenter('full', 'OPEN', ['Wheat'], 100, 100, 400, 3), // 100% load → ineligible
            makeCenter('avail', 'OPEN', ['Wheat'], 50, 50, 100, 8),
        ];
        await withCenters(centers, (result) => {
            assert(result.best_option.center.id === 'avail', 'Full center filtered, available wins');
        });
    }
    catch (e) {
        console.error(`  ERROR: ${e.message}`);
        failed++;
    }
    // ── Test 6: Scores change when load changes ────────────────────────────────
    console.log('\nTest 6: Changing load changes recommendation');
    try {
        // Scenario A: c2 has low load → should win
        const scenarioA = [
            makeCenter('c1', 'OPEN', ['Wheat'], 80, 80, 160, 10),
            makeCenter('c2', 'OPEN', ['Wheat'], 10, 10, 20, 12),
        ];
        await withCenters(scenarioA, (result) => {
            assert(result.best_option.center.id === 'c2', 'Scenario A: c2 (low load) wins');
        });
        // Scenario B: c2 has HIGH load → c1 should win
        const scenarioB = [
            makeCenter('c1', 'OPEN', ['Wheat'], 10, 10, 20, 12),
            makeCenter('c2', 'OPEN', ['Wheat'], 85, 85, 170, 10),
        ];
        await withCenters(scenarioB, (result) => {
            assert(result.best_option.center.id === 'c1', 'Scenario B: c1 (low load) wins after c2 load changes');
        });
    }
    catch (e) {
        console.error(`  ERROR: ${e.message}`);
        failed++;
    }
    // ── Test 7: Weights are correct ───────────────────────────────────────────
    console.log('\nTest 7: Score factors respect defined weights (35/30/20/10/5)');
    try {
        // Set up a scenario where we can manually verify the score
        const centers = [
            makeCenter('c1', 'OPEN', ['Wheat'], 50, 50, 120, 25),
        ];
        await withCenters(centers, (result) => {
            const f = result.best_option.score_factors;
            const expectedScore = 0.35 * f.queue_score + 0.30 * f.capacity_score
                + 0.20 * f.eta_score + 0.10 * f.distance_score + 0.05 * f.preference_score;
            assert(Math.abs(f.total_score - expectedScore) < 0.001, `Score matches weight formula: ${f.total_score.toFixed(4)} ≈ ${expectedScore.toFixed(4)}`);
        });
    }
    catch (e) {
        console.error(`  ERROR: ${e.message}`);
        failed++;
    }
    // ── Test 8: Returns alternatives ─────────────────────────────────────────
    console.log('\nTest 8: Multiple centers return best + alternatives');
    try {
        const centers = [
            makeCenter('c1', 'OPEN', ['Wheat'], 90, 90, 180, 5),
            makeCenter('c2', 'OPEN', ['Wheat'], 40, 40, 80, 10),
            makeCenter('c3', 'OPEN', ['Wheat'], 15, 15, 30, 20),
        ];
        await withCenters(centers, (result) => {
            assert(result.alternatives.length === 2, 'Returns 2 alternatives alongside best');
            assert(result.best_option !== null, 'best_option is present');
        });
    }
    catch (e) {
        console.error(`  ERROR: ${e.message}`);
        failed++;
    }
    // ── Summary ───────────────────────────────────────────────────────────────
    console.log('\n═══════════════════════════════════════════════');
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log('═══════════════════════════════════════════════\n');
    if (failed > 0) {
        process.exit(1);
    }
}
// ── Test Data Factory ────────────────────────────────────────────────────────
function makeCenter(id, status, crops, queueLength, load, waitMins, distanceKm) {
    return {
        id,
        name: `Test Center ${id}`,
        code: id.toUpperCase(),
        address: '123 Test St',
        district: 'Varanasi',
        state: 'Uttar Pradesh',
        latitude: 25.3,
        longitude: 82.9,
        daily_capacity_quintals: 500,
        current_load_percent: load,
        processing_rate_min_per_farmer: 6,
        status,
        load_status: load > 70 ? 'HIGH' : load > 40 ? 'BUSY' : 'NORMAL',
        operating_hours: { open: '08:00 AM', close: '06:00 PM' },
        supported_crops: crops,
        contact_phone: '+91 000 0000000',
        queueLength,
        estimatedWaitTimeMins: waitMins,
        distanceKm,
    };
}
runTests().catch(console.error);
