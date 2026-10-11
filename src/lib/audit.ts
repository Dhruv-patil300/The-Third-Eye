import crypto from 'crypto';
import type { AuditLog } from '../types';
import { getStore, saveStore } from './storage';

export interface AuditEventInput {
  caseId: string;
  actor: string;
  action:
    | 'AUTHENTICATION_SUCCESS'
    | 'AUTHENTICATION_FAILED'
    | 'CASE_ACCESSED'
    | 'CASE_CREATED'
    | 'CASE_MODIFIED'
    | 'EVIDENCE_INGESTED'
    | 'EVIDENCE_HASH_VERIFIED'
    | 'EVIDENCE_ACCESSED'
    | 'EVIDENCE_DOWNLOADED'
    | 'CONTRADICTION_LOGGED'
    | 'CONTRADICTION_REVIEWED'
    | 'GAP_LOGGED'
    | 'GAP_REVIEWED'
    | 'REPORT_GENERATED'
    | 'REPORT_EXPORTED'
    | 'AUTHORIZATION_DENIED';
  targetId?: string;
  targetType?: string;
  details: string;
  clientIp?: string;
  userAgent?: string;
  outcome?: 'SUCCESS' | 'DENIED' | 'FAILED';
}

/**
 * Computes SHA-256 integrity hash for an audit record
 */
function computeAuditHash(log: Omit<AuditLog, 'id'>, prevHash = ''): string {
  const content = `${prevHash}|${log.caseId}|${log.timestamp}|${log.actor}|${log.action}|${log.details}`;
  return crypto.createHash('sha256').update(content, 'utf-8').digest('hex');
}

/**
 * Appends a tamper-verifiable audit event to the store
 */
export function recordAuditEvent(input: AuditEventInput): AuditLog {
  const store = getStore();
  const now = new Date().toISOString();

  // Find previous audit entry for this case to chain hashes
  const caseLogs = store.auditLogs.filter((l) => l.caseId === input.caseId);
  const prevHash = caseLogs.length > 0 ? (caseLogs[caseLogs.length - 1] as any).integrityHash || '' : 'GENESIS';

  const logEntry: AuditLog & {
    integrityHash: string;
    prevHash: string;
    outcome: string;
    clientIp?: string;
  } = {
    id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    caseId: input.caseId,
    timestamp: now,
    actor: input.actor,
    action: input.action,
    details: `${input.details}${input.outcome ? ` [Outcome: ${input.outcome}]` : ''}${
      input.clientIp ? ` [IP: ${input.clientIp}]` : ''
    }`,
    integrityHash: '',
    prevHash,
    outcome: input.outcome || 'SUCCESS',
    clientIp: input.clientIp,
  };

  logEntry.integrityHash = computeAuditHash(logEntry, prevHash);

  store.auditLogs.unshift(logEntry as AuditLog);
  saveStore(store);

  return logEntry as AuditLog;
}

/**
 * Verifies the integrity of the audit log chain for a given case
 */
export function verifyAuditChain(caseId: string): {
  valid: boolean;
  totalLogs: number;
  invalidEntries: string[];
} {
  const store = getStore();
  const caseLogs = store.auditLogs
    .filter((l) => l.caseId === caseId)
    .slice()
    .reverse(); // Chronological order

  const invalidEntries: string[] = [];
  let prevHash = 'GENESIS';

  for (const entry of caseLogs) {
    const raw = entry as any;
    if (raw.integrityHash) {
      const expected = computeAuditHash(entry, raw.prevHash || prevHash);
      if (raw.integrityHash !== expected) {
        invalidEntries.push(entry.id);
      }
      prevHash = raw.integrityHash;
    }
  }

  return {
    valid: invalidEntries.length === 0,
    totalLogs: caseLogs.length,
    invalidEntries,
  };
}
