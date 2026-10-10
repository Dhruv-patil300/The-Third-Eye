'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCase } from '@/context/CaseContext';
import {
  EvidenceItem,
  ContradictionFinding,
  InvestigationGap,
  EventItem,
  Entity,
  AuditLog,
} from '@/types';
import {
  FileText,
  AlertTriangle,
  Search,
  Clock,
  Network,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  User,
  Activity,
  Plus,
  RefreshCw,
  Eye,
} from 'lucide-react';

export default function OverviewPage() {
  const { activeCase, activeCaseId, setShowNewEvidenceModal, setShowNewCaseModal } = useCase();

  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [contradictions, setContradictions] = useState<ContradictionFinding[]>([]);
  const [gaps, setGaps] = useState<InvestigationGap[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCaseData = async () => {
    if (!activeCaseId) return;
    try {
      setLoading(true);
      const [evRes, cntrRes, gapRes, evtRes, entRes, audRes] = await Promise.all([
        fetch(`/api/cases/${activeCaseId}/evidence`).then((r) => r.json()),
        fetch(`/api/cases/${activeCaseId}/contradictions`).then((r) => r.json()),
        fetch(`/api/cases/${activeCaseId}/gaps`).then((r) => r.json()),
        fetch(`/api/cases/${activeCaseId}/events`).then((r) => r.json()),
        fetch(`/api/cases/${activeCaseId}/entities`).then((r) => r.json()),
        fetch(`/api/cases/${activeCaseId}/audit`).then((r) => r.json()),
      ]);

      if (evRes.success) setEvidence(evRes.data || []);
      if (cntrRes.success) setContradictions(cntrRes.data || []);
      if (gapRes.success) setGaps(gapRes.data || []);
      if (evtRes.success) setEvents(evtRes.data || []);
      if (entRes.success) setEntities(entRes.data || []);
      if (audRes.success) setAuditLogs(audRes.data || []);
    } catch (err) {
      console.error('Failed to load overview data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCaseData();
  }, [activeCaseId]);

  const unreviewedContradictions = contradictions.filter(
    (c) => c.reviewStatus === 'unreviewed' || c.reviewStatus === 'under_review' || c.reviewStatus === 'confirmed_inconsistency'
  );
  const openGaps = gaps.filter((g) => g.status === 'open' || g.status === 'investigating');
  const unverifiedEvidence = evidence.filter((e) => e.verificationStatus === 'unverified' || e.verificationStatus === 'disputed');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Operational Case Banner */}
      <div className="bg-white border border-border-light rounded-lg p-5 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-deepTeal/10 text-brand-deepTeal font-semibold border border-brand-deepTeal/20">
                {activeCase?.referenceNumber || 'CASE REFERENCE'}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-status-successBg text-status-success border border-status-successBorder">
                {activeCase?.status || 'Active'}
              </span>
              <span className="text-[10px] text-text-secondary font-medium">
                Type: {activeCase?.caseType}
              </span>
            </div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">
              {activeCase?.title || 'No Active Case Loaded'}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary mt-2">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-brand-steelBlue" />
                <span>
                  Incident Date: {activeCase?.incidentDate ? new Date(activeCase.incidentDate).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-steelBlue" />
                <span>{activeCase?.incidentLocation || 'Incident Location Unknown'}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-brand-steelBlue" />
                <span>Lead: {activeCase?.leadInvestigator || 'Unassigned'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewEvidenceModal(true)}
              className="px-3 py-1.5 bg-brand-deepTeal text-white rounded text-xs font-medium hover:bg-brand-darkSteelTeal transition-colors shadow-subtle flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ingest Evidence</span>
            </button>
            <Link
              href="/reports"
              className="px-3 py-1.5 bg-white border border-border-light text-text-primary rounded text-xs font-medium hover:bg-bg-main transition-colors"
            >
              Generate Dossier
            </Link>
          </div>
        </div>

        {activeCase?.summary && (
          <div className="mt-4 pt-3 border-t border-border-subtle text-xs text-text-secondary leading-relaxed bg-bg-main/40 p-3 rounded">
            <span className="font-semibold text-text-primary">Executive Summary: </span>
            {activeCase.summary}
          </div>
        )}
      </div>

      {/* KPI Stat Cards (Real Calculated Values) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Evidence Ingested */}
        <Link
          href="/evidence"
          className="bg-white border border-border-light p-4 rounded-lg shadow-subtle hover:border-brand-steelBlue transition-all group"
        >
          <div className="flex items-center justify-between text-text-secondary">
            <span className="text-xs font-medium">Evidence Vault</span>
            <FileText className="w-4 h-4 text-brand-steelBlue group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-text-primary mt-2 font-mono">
            {evidence.length}
          </div>
          <div className="text-[11px] text-text-secondary mt-1 flex items-center justify-between">
            <span>{unverifiedEvidence.length} pending review</span>
            <span className="text-brand-steelBlue font-medium">Inspect →</span>
          </div>
        </Link>

        {/* Timeline Events */}
        <Link
          href="/timeline"
          className="bg-white border border-border-light p-4 rounded-lg shadow-subtle hover:border-brand-steelBlue transition-all group"
        >
          <div className="flex items-center justify-between text-text-secondary">
            <span className="text-xs font-medium">Chronological Events</span>
            <Clock className="w-4 h-4 text-brand-mutedBlueTeal group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-text-primary mt-2 font-mono">
            {events.length}
          </div>
          <div className="text-[11px] text-text-secondary mt-1 flex items-center justify-between">
            <span>Across 4 key locations</span>
            <span className="text-brand-steelBlue font-medium">View Timeline →</span>
          </div>
        </Link>

        {/* Active Contradictions */}
        <Link
          href="/contradictions"
          className="bg-white border border-border-light p-4 rounded-lg shadow-subtle hover:border-status-critical transition-all group"
        >
          <div className="flex items-center justify-between text-text-secondary">
            <span className="text-xs font-medium">Inconsistencies Flagged</span>
            <AlertTriangle className="w-4 h-4 text-status-critical group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-status-critical mt-2 font-mono">
            {contradictions.length}
          </div>
          <div className="text-[11px] text-text-secondary mt-1 flex items-center justify-between">
            <span className="text-status-critical font-medium">
              {unreviewedContradictions.length} requiring triage
            </span>
            <span className="text-status-critical font-medium">Review →</span>
          </div>
        </Link>

        {/* Investigation Gaps */}
        <Link
          href="/gaps"
          className="bg-white border border-border-light p-4 rounded-lg shadow-subtle hover:border-status-warning transition-all group"
        >
          <div className="flex items-center justify-between text-text-secondary">
            <span className="text-xs font-medium">Investigation Gaps</span>
            <Search className="w-4 h-4 text-status-warning group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-status-warning mt-2 font-mono">
            {gaps.length}
          </div>
          <div className="text-[11px] text-text-secondary mt-1 flex items-center justify-between">
            <span>{openGaps.length} unresolved</span>
            <span className="text-brand-steelBlue font-medium">Address →</span>
          </div>
        </Link>
      </div>

      {/* Main Workspace Split: Priority Contradictions & Investigation Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Priority Contradictions Panel */}
        <div className="bg-white border border-border-light rounded-lg p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-status-critical" />
              <h2 className="font-semibold text-sm text-text-primary">
                High-Priority Evidence Inconsistencies
              </h2>
            </div>
            <Link
              href="/contradictions"
              className="text-xs text-brand-steelBlue hover:underline font-medium"
            >
              All Contradictions ({contradictions.length})
            </Link>
          </div>

          <div className="space-y-3">
            {contradictions.slice(0, 2).map((c) => (
              <div
                key={c.id}
                className="border border-border-light rounded-md p-3.5 bg-bg-main/30 hover:bg-bg-main transition-colors space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-xs text-text-primary leading-snug">
                    {c.title}
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold bg-status-criticalBg text-status-critical border border-status-criticalBorder flex-shrink-0">
                    {c.severity}
                  </span>
                </div>

                {/* Excerpt comparison pill */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white p-2 rounded border border-border-subtle">
                    <div className="font-semibold text-[10px] text-text-secondary truncate">
                      Source A: {c.claimA.speakerOrSource}
                    </div>
                    <div className="text-text-primary italic mt-1 line-clamp-2">
                      {c.claimA.excerpt}
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded border border-border-subtle">
                    <div className="font-semibold text-[10px] text-text-secondary truncate">
                      Source B: {c.claimB.speakerOrSource}
                    </div>
                    <div className="text-text-primary italic mt-1 line-clamp-2">
                      {c.claimB.excerpt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-text-secondary">
                    Status:{' '}
                    <span className="font-semibold text-text-primary uppercase text-[10px]">
                      {c.reviewStatus.replace('_', ' ')}
                    </span>
                  </span>
                  <Link
                    href={`/contradictions?focus=${c.id}`}
                    className="text-brand-steelBlue font-medium hover:underline flex items-center gap-1"
                  >
                    <span>Examine Conflict</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Investigation Gaps Panel */}
        <div className="bg-white border border-border-light rounded-lg p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-status-warning" />
              <h2 className="font-semibold text-sm text-text-primary">
                Unresolved Investigative Gaps
              </h2>
            </div>
            <Link
              href="/gaps"
              className="text-xs text-brand-steelBlue hover:underline font-medium"
            >
              All Gaps ({gaps.length})
            </Link>
          </div>

          <div className="space-y-3">
            {gaps.slice(0, 3).map((g) => (
              <div
                key={g.id}
                className="border border-border-light rounded-md p-3 bg-bg-main/30 hover:bg-bg-main transition-colors space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-xs text-text-primary">{g.title}</div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold flex-shrink-0 ${
                      g.severity === 'critical'
                        ? 'bg-status-criticalBg text-status-critical border border-status-criticalBorder'
                        : 'bg-status-warningBg text-status-warning border border-status-warningBorder'
                    }`}
                  >
                    {g.severity}
                  </span>
                </div>
                <p className="text-[11px] text-text-secondary leading-snug line-clamp-2">
                  {g.description}
                </p>
                <div className="bg-white p-2 rounded border border-border-subtle text-[11px] flex items-start gap-1.5 mt-1">
                  <span className="font-semibold text-brand-steelBlue flex-shrink-0">Action:</span>
                  <span className="text-text-primary line-clamp-1">{g.suggestedNextStep}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Audit Trail & Quick Launch Assistants */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case Entities Summary */}
        <div className="bg-white border border-border-light rounded-lg p-5 shadow-card space-y-3">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2">
            <h3 className="font-semibold text-xs text-text-primary uppercase tracking-wider">
              Tracked Entities ({entities.length})
            </h3>
            <Link href="/graph" className="text-xs text-brand-steelBlue hover:underline">
              Graph View →
            </Link>
          </div>
          <div className="space-y-2">
            {entities.slice(0, 4).map((ent) => (
              <div
                key={ent.id}
                className="flex items-center justify-between p-2 rounded bg-bg-main/50 text-xs"
              >
                <div>
                  <div className="font-medium text-text-primary">{ent.name}</div>
                  <div className="text-[10px] text-text-secondary capitalize">
                    {ent.category} • {ent.role.replace('_', ' ')}
                  </div>
                </div>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                    ent.status === 'flagged'
                      ? 'bg-status-criticalBg text-status-critical'
                      : 'bg-status-successBg text-status-success'
                  }`}
                >
                  {ent.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chain of Custody & Audit Activity */}
        <div className="bg-white border border-border-light rounded-lg p-5 shadow-card space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-brand-steelBlue" />
              <h3 className="font-semibold text-xs text-text-primary uppercase tracking-wider">
                Case Activity & Integrity Audit Log
              </h3>
            </div>
            <Link href="/settings" className="text-xs text-brand-steelBlue hover:underline">
              Full Audit Trail →
            </Link>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {auditLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between gap-3 text-xs p-2 rounded hover:bg-bg-main transition-colors border-b border-border-subtle/50 last:border-0"
              >
                <div>
                  <div className="font-medium text-text-primary">{log.details}</div>
                  <div className="text-[10px] text-text-secondary flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-brand-deepTeal">{log.action}</span>
                    <span>•</span>
                    <span>{log.actor}</span>
                  </div>
                </div>
                <div className="text-[10px] text-text-muted font-mono flex-shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
