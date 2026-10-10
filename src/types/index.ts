export type CaseStatus = 'active' | 'archived' | 'closed' | 'cold';
export type CasePriority = 'high' | 'medium' | 'low';

export interface Case {
  id: string;
  title: string;
  referenceNumber: string;
  caseType: string;
  incidentDate: string;
  incidentLocation: string;
  summary: string;
  status: CaseStatus;
  priority: CasePriority;
  leadInvestigator: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export type EvidenceType =
  | 'witness_statement'
  | 'fir_document'
  | 'cctv_observation'
  | 'movement_record'
  | 'digital_record'
  | 'forensic_report'
  | 'physical_evidence'
  | 'other';

export type ProcessingStatus = 'pending' | 'processing' | 'processed' | 'error';
export type VerificationStatus = 'unverified' | 'verified' | 'disputed' | 'debunked';

export interface SourceProvenance {
  origin: string;
  collector: string;
  chainOfCustody: string[];
  collectedAt: string;
  hash?: string;
}

export interface Claim {
  id: string;
  evidenceId: string;
  caseId: string;
  text: string;
  claimant: string;
  timestamp?: string;
  location?: string;
  claimType: 'assertion' | 'alibi' | 'observation' | 'record';
  confidence: number;
}

export interface EvidenceItem {
  id: string;
  caseId: string;
  title: string;
  evidenceType: EvidenceType;
  sourceDescription: string;
  dateReceived: string;
  eventTime?: string;
  recordedBy: string;
  processingStatus: ProcessingStatus;
  verificationStatus: VerificationStatus;
  extractedText: string;
  originalFileName?: string;
  fileMimeType?: string;
  fileSize?: number;
  fileHash?: string;
  sourceProvenance: SourceProvenance;
  relatedEntityIds: string[];
  relatedEventIds: string[];
  claims: Claim[];
  createdAt: string;
  updatedAt: string;
}

export type EntityCategory = 'person' | 'vehicle' | 'location' | 'device' | 'organization';
export type EntityRole = 'suspect' | 'witness' | 'victim' | 'person_of_interest' | 'investigator' | 'neutral';
export type EntityVerification = 'unverified' | 'verified' | 'flagged';

export interface Entity {
  id: string;
  caseId: string;
  name: string;
  category: EntityCategory;
  role: EntityRole;
  details: Record<string, string>;
  status: EntityVerification;
  notes: string;
  sourceEvidenceIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type TimePrecision = 'exact' | 'approximate' | 'reported' | 'inferred' | 'unknown';

export interface EventItem {
  id: string;
  caseId: string;
  title: string;
  timestamp: string; // ISO format or representative ISO date-time
  timeDisplay: string; // e.g. "9:05 PM"
  timePrecision: TimePrecision;
  description: string;
  location: string;
  associatedEntityIds: string[];
  sourceEvidenceId: string;
  verificationStatus: VerificationStatus;
  confidence: number;
  createdAt: string;
}

export type RelationshipType =
  | 'associate'
  | 'seen_with'
  | 'owner_of'
  | 'driver_of'
  | 'present_at'
  | 'phone_call'
  | 'conflicts_with'
  | 'alibi_provider'
  | 'witness_to';

export interface EntityRelationship {
  id: string;
  caseId: string;
  sourceEntityId: string;
  targetEntityId: string;
  relationshipType: RelationshipType;
  label: string;
  description: string;
  supportingEvidenceIds: string[];
  verificationStatus: VerificationStatus;
  confidence: number;
}

export type ContradictionSeverity = 'high' | 'medium' | 'low';
export type ContradictionCategory =
  | 'timeline_conflict'
  | 'alibi_discrepancy'
  | 'identity_mismatch'
  | 'location_impossibility'
  | 'statement_inconsistency';

export type ContradictionReviewStatus =
  | 'unreviewed'
  | 'under_review'
  | 'confirmed_inconsistency'
  | 'resolved'
  | 'false_positive'
  | 'insufficient_info';

export interface ClaimSnippet {
  evidenceId: string;
  evidenceTitle: string;
  excerpt: string;
  speakerOrSource: string;
  timestamp?: string;
  location?: string;
}

export interface ContradictionFinding {
  id: string;
  caseId: string;
  title: string;
  severity: ContradictionSeverity;
  category: ContradictionCategory;
  claimA: ClaimSnippet;
  claimB: ClaimSnippet;
  explanation: string;
  alternativeExplanations: string[];
  suggestedVerificationSteps: string[];
  reviewStatus: ContradictionReviewStatus;
  investigatorNotes: string;
  reviewedBy?: string;
  updatedAt: string;
}

export type GapSeverity = 'critical' | 'moderate' | 'minor';
export type GapCategory =
  | 'missing_timestamp'
  | 'unexplained_period'
  | 'unverified_claim'
  | 'missing_cctv'
  | 'unidentified_entity'
  | 'unverified_alibi'
  | 'missing_record';

export type GapStatus = 'open' | 'investigating' | 'addressed' | 'dismissed';

export interface InvestigationGap {
  id: string;
  caseId: string;
  title: string;
  category: GapCategory;
  severity: GapSeverity;
  description: string;
  whyItMatters: string;
  whatIsUnknown: string;
  relatedEvidenceIds: string[];
  relatedEntityIds: string[];
  suggestedNextStep: string;
  status: GapStatus;
  dismissalReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Citation {
  evidenceId: string;
  evidenceTitle: string;
  excerpt: string;
  pageOrSection?: string;
}

export interface AIMessage {
  id: string;
  caseId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: Citation[];
  suggestedFollowUps?: string[];
  timestamp: string;
}

export interface AuditLog {
  id: string;
  caseId: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
}

export interface CaseStore {
  cases: Case[];
  evidence: EvidenceItem[];
  entities: Entity[];
  events: EventItem[];
  relationships: EntityRelationship[];
  contradictions: ContradictionFinding[];
  gaps: InvestigationGap[];
  assistantMessages: AIMessage[];
  auditLogs: AuditLog[];
}
