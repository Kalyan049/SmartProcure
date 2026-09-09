import * as procService from './procurement.service';

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${label}`);
    passed++;
  } else {
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

  } catch (err: any) {
    console.error(err);
    failed++;
  }

  console.log('\n═══════════════════════════════════════════════');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('═══════════════════════════════════════════════\n');

  if (failed > 0) process.exit(1);
}

runTests();
