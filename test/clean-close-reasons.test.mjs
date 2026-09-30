// Guards bridge.js's CLEAN_CLOSE_REASONS against a vendor:openlv refresh.
// The strings are openlv-internal (not exported), so if the vendored
// bundle rewords them every normal end-of-job close would silently turn
// into a red "Disconnected: …". Run with `node --test` after vendoring.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (name) => readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');

function cleanCloseReasons() {
  const m = read('bridge.js').match(/const CLEAN_CLOSE_REASONS = new Set\(\[([^\]]*)\]\)/);
  assert.ok(m, 'CLEAN_CLOSE_REASONS = new Set([...]) not found in bridge.js');
  const reasons = [...m[1].matchAll(/'([^']*)'|"([^"]*)"/g)].map((r) => r[1] ?? r[2]);
  assert.ok(reasons.length > 0, 'CLEAN_CLOSE_REASONS is empty');
  return reasons;
}

test('every clean-close reason is still emitted by the vendored openlv bundle', () => {
  const bundle = read('openlv.esm.js');
  for (const reason of cleanCloseReasons()) {
    assert.ok(
      bundle.includes(`emit("error","${reason}")`),
      `openlv.esm.js no longer emits "${reason}" — update CLEAN_CLOSE_REASONS in bridge.js`,
    );
  }
});

test('a transport failure is not treated as a clean close', () => {
  const bundle = read('openlv.esm.js');
  assert.ok(bundle.includes('emit("error","WebRTC connection failed")'));
  assert.ok(!cleanCloseReasons().includes('WebRTC connection failed'));
});
