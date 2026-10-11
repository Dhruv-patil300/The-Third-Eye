import test from 'node:test';
import assert from 'node:assert/strict';
import { computeSha256, sanitizeFileName } from '@/lib/evidenceStorage';
import {
  AUTHORIZED_OFFICERS,
  createSessionToken,
  verifySessionToken,
  canUserAccessCase,
} from '@/lib/auth';
import { recordAuditEvent, verifyAuditChain } from '@/lib/audit';

test('Evidence Integrity: Genuine SHA-256 Hashing', () => {
  const textData = 'Forensic Seizure Panchnama: 7.65mm Spent Cartridge';
  const hash1 = computeSha256(textData);
  const hash2 = computeSha256(Buffer.from(textData, 'utf-8'));

  assert.match(hash1, /^sha256:[a-f0-9]{64}$/);
  assert.equal(hash1, hash2);

  const tamperedData = 'Forensic Seizure Panchnama: 7.65mm Spent Cartridge (TAMPERED)';
  const tamperedHash = computeSha256(tamperedData);
  assert.notEqual(tamperedHash, hash1);
});

test('Evidence Storage: Path Traversal Defenses', () => {
  assert.equal(sanitizeFileName('../../etc/passwd'), 'passwd');
  assert.equal(sanitizeFileName('..\\..\\boot.ini'), 'boot.ini');
  assert.equal(sanitizeFileName('cctv_footage_cam01.mp4'), 'cctv_footage_cam01.mp4');
});

test('Authentication: Officer Session Token Signing & Verification', () => {
  const officer = AUTHORIZED_OFFICERS[0];
  const token = createSessionToken(officer, 1);
  assert.ok(token);

  const verified = verifySessionToken(token);
  assert.ok(verified);
  assert.equal(verified?.id, officer.id);
  assert.equal(verified?.role, 'SUPERVISOR');
  assert.equal(verified?.badgeNumber, 'PCPC-IPS-001');
});

test('Authentication: Rejection of Tampered Tokens', () => {
  const officer = AUTHORIZED_OFFICERS[1];
  const token = createSessionToken(officer, 1);
  const parts = token.split('.');
  const tamperedToken = `${parts[0]}.eyJyYW5kb20iOiJmYWtlIn0.${parts[2]}`;
  const verified = verifySessionToken(tamperedToken);
  assert.equal(verified, null);
});

test('Authorization: Least-Privilege Case Access Boundaries (IDOR Defense)', () => {
  const supervisor = AUTHORIZED_OFFICERS[0];
  const investigator = AUTHORIZED_OFFICERS[1];
  const auditor = AUTHORIZED_OFFICERS[3];

  // Supervisor has access to all cases
  assert.equal(canUserAccessCase(supervisor, 'case-pcpc-wakad-2025', 'write'), true);
  assert.equal(canUserAccessCase(supervisor, 'case-other-unauthorized', 'write'), true);

  // Investigator has access to assigned case
  assert.equal(canUserAccessCase(investigator, 'case-pcpc-wakad-2025', 'write'), true);
  // Investigator is denied access to unassigned case
  assert.equal(canUserAccessCase(investigator, 'case-other-unassigned', 'write'), false);

  // Auditor has read-only access
  assert.equal(canUserAccessCase(auditor, 'case-pcpc-wakad-2025', 'read'), true);
  assert.equal(canUserAccessCase(auditor, 'case-pcpc-wakad-2025', 'write'), false);
});

test('Audit Logging: Cryptographic Audit Trail Verification', () => {
  const testCaseId = `test-case-${Date.now()}`;
  const entry = recordAuditEvent({
    caseId: testCaseId,
    actor: 'PI Vikram Shinde (PCPC-CRIME-4819)',
    action: 'EVIDENCE_INGESTED',
    details: 'Ingested Ballistic Report - Genuine Digest Verified',
    outcome: 'SUCCESS',
  });

  assert.ok(entry.id);
  assert.equal(entry.caseId, testCaseId);

  const verification = verifyAuditChain(testCaseId);
  assert.equal(verification.valid, true);
  assert.equal(verification.invalidEntries.length, 0);
});
