import fs from 'fs';
import path from 'path';
import type {
  CaseStore,
  Case,
  EvidenceItem,
  Entity,
  EventItem,
  EntityRelationship,
  ContradictionFinding,
  InvestigationGap,
  AIMessage,
  AuditLog,
} from '../types';
import {
  initialStore,
  demoCases,
  presentationEvidence,
  presentationEntities,
  presentationEvents,
  presentationRelationships,
  presentationContradictions,
  presentationGaps,
  presentationAuditLogs,
} from './demoData';

function getStorageFilePath(): string {
  if (process.env.STORAGE_FILE_PATH) {
    return path.resolve(process.env.STORAGE_FILE_PATH);
  }
  // Vercel / AWS Lambda has read-only filesystem except /tmp
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join('/tmp', 'the-third-eye-storage.json');
  }
  return path.join(process.cwd(), 'data', 'storage.json');
}

let memoryStore: CaseStore | null = null;

function ensureDataDir(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      // Ignore in read-only environments
    }
  }
}

function mergeMissingRecords<T extends { id: string }>(stored: T[], seeded: T[]): { records: T[]; changed: boolean } {
  const storedIds = new Set(stored.map((item) => item.id));
  const missing = seeded.filter((item) => !storedIds.has(item.id));
  return { records: [...missing, ...stored], changed: missing.length > 0 };
}

export function shouldEnableDemoFixtures(): boolean {
  if (process.env.ENABLE_DEMO_FIXTURES === 'false') return false;
  if (process.env.ENABLE_DEMO_FIXTURES === 'true') return true;
  return process.env.NODE_ENV !== 'production';
}

export function getStore(): CaseStore {
  if (memoryStore) {
    return memoryStore;
  }

  const storageFile = getStorageFilePath();
  ensureDataDir(storageFile);

  const enableDemo = shouldEnableDemoFixtures();

  if (fs.existsSync(storageFile)) {
    try {
      const data = fs.readFileSync(storageFile, 'utf-8');
      const parsed = JSON.parse(data) as CaseStore;

      if (enableDemo) {
        const cases = mergeMissingRecords(parsed.cases, demoCases);
        const evidence = mergeMissingRecords(parsed.evidence, presentationEvidence);
        const entities = mergeMissingRecords(parsed.entities, presentationEntities);
        const events = mergeMissingRecords(parsed.events, presentationEvents);
        const relationships = mergeMissingRecords(parsed.relationships, presentationRelationships);
        const contradictions = mergeMissingRecords(parsed.contradictions, presentationContradictions);
        const gaps = mergeMissingRecords(parsed.gaps, presentationGaps);
        const auditLogs = mergeMissingRecords(parsed.auditLogs, presentationAuditLogs);

        parsed.cases = cases.records;
        parsed.evidence = evidence.records;
        parsed.entities = entities.records;
        parsed.events = events.records;
        parsed.relationships = relationships.records;
        parsed.contradictions = contradictions.records;
        parsed.gaps = gaps.records;
        parsed.auditLogs = auditLogs.records;

        const merges = [cases, evidence, entities, events, relationships, contradictions, gaps, auditLogs];
        if (merges.some((merge) => merge.changed)) {
          saveStore(parsed);
          return parsed;
        }
      }

      memoryStore = parsed;
      return parsed;
    } catch (err) {
      console.error('Failed to parse storage file, initializing store:', err);
    }
  }

  // Initial store setup
  const baseStore: CaseStore = enableDemo
    ? JSON.parse(JSON.stringify(initialStore))
    : {
        cases: [],
        evidence: [],
        entities: [],
        events: [],
        relationships: [],
        contradictions: [],
        gaps: [],
        assistantMessages: [],
        auditLogs: [],
      };

  saveStore(baseStore);
  return baseStore;
}

export function saveStore(store: CaseStore): void {
  const storageFile = getStorageFilePath();
  ensureDataDir(storageFile);
  memoryStore = store;
  try {
    const tempFile = `${storageFile}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(store, null, 2), 'utf-8');
    fs.renameSync(tempFile, storageFile);
  } catch (err) {
    // If filesystem write fails on serverless, keep memoryStore intact so requests still succeed
    console.warn('Filesystem write warning (continuing in-memory):', err);
  }
}

export function resetStorage(): CaseStore {
  const enableDemo = shouldEnableDemoFixtures();
  const baseStore: CaseStore = enableDemo
    ? JSON.parse(JSON.stringify(initialStore))
    : {
        cases: [],
        evidence: [],
        entities: [],
        events: [],
        relationships: [],
        contradictions: [],
        gaps: [],
        assistantMessages: [],
        auditLogs: [],
      };
  saveStore(baseStore);
  return baseStore;
}

export function exportDatabaseBackup(): string {
  const store = getStore();
  return JSON.stringify(store, null, 2);
}

export function restoreDatabaseBackup(backupJson: string): boolean {
  try {
    const parsed = JSON.parse(backupJson) as CaseStore;
    if (!Array.isArray(parsed.cases) || !Array.isArray(parsed.evidence)) {
      throw new Error('Invalid database backup structure');
    }
    saveStore(parsed);
    return true;
  } catch (err) {
    console.error('Failed to restore database backup:', err);
    return false;
  }
}

// -------------------------------------------------------------
// Case Queries & Mutations
// -------------------------------------------------------------
export function getAllCases(): Case[] {
  return getStore().cases;
}

export function getCaseById(id: string): Case | undefined {
  return getStore().cases.find((c) => c.id === id);
}

export function createCase(newCase: Omit<Case, 'createdAt' | 'updatedAt'>): Case {
  const store = getStore();
  const now = new Date().toISOString();
  const created: Case = {
    ...newCase,
    createdAt: now,
    updatedAt: now,
  };
  store.cases.unshift(created);
  addAuditLog(created.id, 'CASE_CREATED', `Case ${created.title} (${created.referenceNumber}) created`);
  saveStore(store);
  return created;
}

export function updateCase(id: string, updates: Partial<Case>): Case | undefined {
  const store = getStore();
  const index = store.cases.findIndex((c) => c.id === id);
  if (index === -1) return undefined;

  const updated: Case = {
    ...store.cases[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  store.cases[index] = updated;
  addAuditLog(id, 'CASE_UPDATED', `Case updated fields: ${Object.keys(updates).join(', ')}`);
  saveStore(store);
  return updated;
}

export function deleteCase(id: string): boolean {
  const store = getStore();
  const initialLen = store.cases.length;
  store.cases = store.cases.filter((c) => c.id !== id);
  // Also clean up associated records
  store.evidence = store.evidence.filter((e) => e.caseId !== id);
  store.entities = store.entities.filter((e) => e.caseId !== id);
  store.events = store.events.filter((e) => e.caseId !== id);
  store.relationships = store.relationships.filter((r) => r.caseId !== id);
  store.contradictions = store.contradictions.filter((c) => c.caseId !== id);
  store.gaps = store.gaps.filter((g) => g.caseId !== id);
  store.assistantMessages = store.assistantMessages.filter((m) => m.caseId !== id);
  store.auditLogs = store.auditLogs.filter((a) => a.caseId !== id);

  saveStore(store);
  return store.cases.length < initialLen;
}

// -------------------------------------------------------------
// Evidence Queries & Mutations
// -------------------------------------------------------------
export function getEvidenceByCase(caseId: string): EvidenceItem[] {
  return getStore().evidence.filter((e) => e.caseId === caseId);
}

export function getEvidenceItem(id: string): EvidenceItem | undefined {
  return getStore().evidence.find((e) => e.id === id);
}

export function createEvidence(item: Omit<EvidenceItem, 'id' | 'createdAt' | 'updatedAt'>): EvidenceItem {
  const store = getStore();
  const now = new Date().toISOString();
  const created: EvidenceItem = {
    ...item,
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: now,
    updatedAt: now,
  };
  store.evidence.unshift(created);
  addAuditLog(item.caseId, 'EVIDENCE_ADDED', `Ingested evidence: ${created.title} (${created.evidenceType})`);
  saveStore(store);
  return created;
}

export function updateEvidence(id: string, updates: Partial<EvidenceItem>): EvidenceItem | undefined {
  const store = getStore();
  const index = store.evidence.findIndex((e) => e.id === id);
  if (index === -1) return undefined;

  const updated: EvidenceItem = {
    ...store.evidence[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  store.evidence[index] = updated;
  addAuditLog(updated.caseId, 'EVIDENCE_UPDATED', `Updated evidence: ${updated.title}`);
  saveStore(store);
  return updated;
}

export function deleteEvidence(id: string): boolean {
  const store = getStore();
  const item = store.evidence.find((e) => e.id === id);
  if (!item) return false;
  store.evidence = store.evidence.filter((e) => e.id !== id);
  addAuditLog(item.caseId, 'EVIDENCE_DELETED', `Deleted evidence: ${item.title}`);
  saveStore(store);
  return true;
}

// -------------------------------------------------------------
// Entity Queries & Mutations
// -------------------------------------------------------------
export function getEntitiesByCase(caseId: string): Entity[] {
  return getStore().entities.filter((e) => e.caseId === caseId);
}

export function createEntity(entity: Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>): Entity {
  const store = getStore();
  const now = new Date().toISOString();
  const created: Entity = {
    ...entity,
    id: `ent-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: now,
    updatedAt: now,
  };
  store.entities.push(created);
  addAuditLog(entity.caseId, 'ENTITY_CREATED', `Added entity: ${created.name} (${created.category})`);
  saveStore(store);
  return created;
}

export function updateEntity(id: string, updates: Partial<Entity>): Entity | undefined {
  const store = getStore();
  const index = store.entities.findIndex((e) => e.id === id);
  if (index === -1) return undefined;

  const updated: Entity = {
    ...store.entities[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  store.entities[index] = updated;
  addAuditLog(updated.caseId, 'ENTITY_UPDATED', `Updated entity: ${updated.name}`);
  saveStore(store);
  return updated;
}

// -------------------------------------------------------------
// Event Queries & Mutations
// -------------------------------------------------------------
export function getEventsByCase(caseId: string): EventItem[] {
  return getStore().events.filter((e) => e.caseId === caseId);
}

export function createEvent(event: Omit<EventItem, 'id' | 'createdAt'>): EventItem {
  const store = getStore();
  const created: EventItem = {
    ...event,
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  store.events.push(created);
  addAuditLog(event.caseId, 'EVENT_CREATED', `Recorded event: ${created.title} (${created.timeDisplay})`);
  saveStore(store);
  return created;
}

export function updateEvent(id: string, updates: Partial<EventItem>): EventItem | undefined {
  const store = getStore();
  const index = store.events.findIndex((e) => e.id === id);
  if (index === -1) return undefined;

  const updated: EventItem = {
    ...store.events[index],
    ...updates,
  };
  store.events[index] = updated;
  addAuditLog(updated.caseId, 'EVENT_UPDATED', `Updated event: ${updated.title}`);
  saveStore(store);
  return updated;
}

// -------------------------------------------------------------
// Relationship Queries & Mutations
// -------------------------------------------------------------
export function getRelationshipsByCase(caseId: string): EntityRelationship[] {
  return getStore().relationships.filter((r) => r.caseId === caseId);
}

export function createRelationship(rel: Omit<EntityRelationship, 'id'>): EntityRelationship {
  const store = getStore();
  const created: EntityRelationship = {
    ...rel,
    id: `rel-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  };
  store.relationships.push(created);
  addAuditLog(rel.caseId, 'RELATIONSHIP_CREATED', `Connected entities: ${created.label}`);
  saveStore(store);
  return created;
}

// -------------------------------------------------------------
// Contradiction Queries & Mutations
// -------------------------------------------------------------
export function getContradictionsByCase(caseId: string): ContradictionFinding[] {
  return getStore().contradictions.filter((c) => c.caseId === caseId);
}

export function updateContradiction(
  id: string,
  updates: Partial<ContradictionFinding>
): ContradictionFinding | undefined {
  const store = getStore();
  const index = store.contradictions.findIndex((c) => c.id === id);
  if (index === -1) return undefined;

  const updated: ContradictionFinding = {
    ...store.contradictions[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  store.contradictions[index] = updated;
  addAuditLog(
    updated.caseId,
    'CONTRADICTION_UPDATED',
    `Contradiction "${updated.title}" status changed to ${updated.reviewStatus}`
  );
  saveStore(store);
  return updated;
}

// -------------------------------------------------------------
// Investigation Gap Queries & Mutations
// -------------------------------------------------------------
export function getGapsByCase(caseId: string): InvestigationGap[] {
  return getStore().gaps.filter((g) => g.caseId === caseId);
}

export function updateGap(id: string, updates: Partial<InvestigationGap>): InvestigationGap | undefined {
  const store = getStore();
  const index = store.gaps.findIndex((g) => g.id === id);
  if (index === -1) return undefined;

  const updated: InvestigationGap = {
    ...store.gaps[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  store.gaps[index] = updated;
  addAuditLog(updated.caseId, 'GAP_UPDATED', `Gap "${updated.title}" status changed to ${updated.status}`);
  saveStore(store);
  return updated;
}

// -------------------------------------------------------------
// Assistant Messages
// -------------------------------------------------------------
export function getAssistantMessages(caseId: string): AIMessage[] {
  return getStore().assistantMessages.filter((m) => m.caseId === caseId);
}

export function addAssistantMessage(msg: Omit<AIMessage, 'id' | 'timestamp'>): AIMessage {
  const store = getStore();
  const created: AIMessage = {
    ...msg,
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
  };
  store.assistantMessages.push(created);
  saveStore(store);
  return created;
}

// -------------------------------------------------------------
// Audit Logs
// -------------------------------------------------------------
export function addAuditLog(
  caseId: string,
  action: string,
  details: string,
  actor: string = 'Current Investigator'
): AuditLog {
  const store = getStore();
  const log: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    caseId,
    timestamp: new Date().toISOString(),
    actor,
    action,
    details,
  };
  store.auditLogs.unshift(log);
  if (store.auditLogs.length > 500) {
    store.auditLogs = store.auditLogs.slice(0, 500);
  }
  return log;
}

export function getAuditLogsByCase(caseId: string): AuditLog[] {
  return getStore().auditLogs.filter((l) => l.caseId === caseId);
}
