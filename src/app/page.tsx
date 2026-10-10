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
  Crosshair,
  Radio,
  FileCheck2,
  Compass,
} from 'lucide-react';
import { TacticalRadarScanner } from '@/components/tactical/TacticalRadarScanner';
import { LiveIntelTicker } from '@/components/tactical/LiveIntelTicker';
import { AnimatedCounter } from '@/components/tactical/AnimatedCounter';

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
    (c) =>
      c.reviewStatus === 'unreviewed' ||
      c.reviewStatus === 'under_review' ||
      c.reviewStatus === 'confirmed_inconsistency'
  );
  const openGaps = gaps.filter((g) => g.status === 'open' || g.status === 'investigating');
  const verifiedEvidence = evidence.filter((e) => e.verificationStatus === 'verified');
  const topContradiction = contradictions[0] || null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Real-time Police Intel Ticker (Snitch Stream) */}
      <LiveIntelTicker />

      {/* Police Station Operational Command Banner */}
      <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 font-bold border border-sky-700/60">
                {activeCase?.referenceNumber || 'PCPC FIR REGISTER'}
              </span>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {activeCase?.status || 'Active'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Jurisdiction: Wakad Police Station (Zone 2, PCPC)
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
              {activeCase?.title || 'Pimpri Chinchwad Investigation Dossier'}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-300 mt-2 font-mono">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                <span>
                  Incident Date: {activeCase?.incidentDate ? new Date(activeCase.incidentDate).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>{activeCase?.incidentLocation || 'Wakad, Pimpri Chinchwad'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-sky-400" />
                <span>Lead IO: {activeCase?.leadInvestigator || 'Sr. PI Vitthal More'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              onClick={() => setShowNewEvidenceModal(true)}
              className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ingest Case Record</span>
            </button>
            <Link
              href="/reports"
              className="px-3.5 py-2 bg-[#122030] hover:bg-[#182a3e] border border-[#22364A] text-slate-200 rounded-lg text-xs font-semibold transition-all"
            >
              Generate Chargesheet Dossier
            </Link>
          </div>
        </div>

        {activeCase?.summary && (
          <div className="mt-4 pt-3 border-t border-[#1E2E3F] text-xs text-slate-300 leading-relaxed bg-[#08121B]/60 p-3 rounded-lg font-sans">
            <span className="font-bold text-sky-400 font-mono uppercase tracking-wider text-[11px]">
              IO Case Executive Summary:{' '}
            </span>
            {activeCase.summary}
          </div>
        )}
      </div>

      {/* Investigation Funnel & Pipeline Ribbon */}
      <div className="bg-[#0B1522] border border-[#1E2E3F] rounded-xl p-3 shadow-md">
        <div className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400 px-1 mb-2 flex items-center justify-between">
          <span>INVESTIGATION PIPELINE & PROGRESSION FUNNEL</span>
          <span className="text-emerald-400">CHARGESHEET READINESS: 72%</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          <div className="bg-[#101F2F] border border-[#1E3347] rounded-lg p-2.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 font-mono">1. EVIDENCE INGESTION</div>
              <div className="font-bold text-white text-sm font-mono mt-0.5">
                <AnimatedCounter value={evidence.length} /> Records
              </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="bg-[#101F2F] border border-[#1E3347] rounded-lg p-2.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 font-mono">2. FIELD CORROBORATION</div>
              <div className="font-bold text-white text-sm font-mono mt-0.5">
                <AnimatedCounter value={verifiedEvidence.length} /> Verified
              </div>
            </div>
            <FileCheck2 className="w-4 h-4 text-sky-400" />
          </div>

          <div className="bg-[#101F2F] border border-rose-900/60 rounded-lg p-2.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-rose-300 font-mono">3. INCONSISTENCY MATRIX</div>
              <div className="font-bold text-rose-400 text-sm font-mono mt-0.5">
                <AnimatedCounter value={contradictions.length} /> Clashes
              </div>
            </div>
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
          </div>

          <div className="bg-[#101F2F] border border-amber-900/60 rounded-lg p-2.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-amber-300 font-mono">4. CRITICAL GAPS</div>
              <div className="font-bold text-amber-400 text-sm font-mono mt-0.5">
                <AnimatedCounter value={openGaps.length} /> Unresolved
              </div>
            </div>
            <Search className="w-4 h-4 text-amber-400" />
          </div>

          <div className="bg-sky-950/40 border border-sky-700/60 rounded-lg p-2.5 flex items-center justify-between col-span-2 sm:col-span-1">
            <div>
              <div className="text-[10px] text-sky-300 font-mono">5. PROSECUTION PROOF</div>
              <div className="font-bold text-sky-400 text-sm font-mono mt-0.5">
                High Probative
              </div>
            </div>
            <ShieldCheck className="w-4 h-4 text-sky-400" />
          </div>
        </div>
      </div>

      {/* Triage Priority Hero (Top Unresolved Inconsistency) */}
      {topContradiction && (
        <div className="bg-gradient-to-r from-rose-950/50 via-[#121E2C] to-[#0D1824] border border-rose-900/70 rounded-xl p-5 shadow-2xl relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-rose-600 text-white shadow-sm flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  HIGH-PRIORITY POLICE TRIAGE ITEM
                </span>
                <span className="text-[10px] font-mono text-rose-300">
                  REF: {topContradiction.id.toUpperCase()}
                </span>
              </div>

              <h2 className="text-base font-bold text-white tracking-tight">
                {topContradiction.title}
              </h2>

              <p className="text-xs text-slate-300 max-w-3xl leading-relaxed font-sans">
                {topContradiction.explanation}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                <span className="text-amber-300">
                  Source A: {topContradiction.claimA.speakerOrSource} ({topContradiction.claimA.location})
                </span>
                <span>⚡ CLASHES WITH ⚡</span>
                <span className="text-emerald-300">
                  Source B: {topContradiction.claimB.speakerOrSource} ({topContradiction.claimB.location})
                </span>
              </div>
            </div>

            <div className="flex-shrink-0 flex flex-col sm:flex-row md:flex-col gap-2">
              <Link
                href="/contradictions"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-1.5"
              >
                <span>Triage Conflict in Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/timeline"
                className="px-4 py-2 bg-[#122131] hover:bg-[#172b40] border border-[#22364A] text-slate-300 rounded-lg text-xs font-semibold text-center transition-all"
              >
                Inspect on Chrono Timeline
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Tactical Radar Scanner & Live Telemetry Feed */}
      <TacticalRadarScanner />

      {/* Operational KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Evidence Ingested */}
        <Link
          href="/evidence"
          className="bg-[#0C1724] border border-[#1E2E3F] p-4 rounded-xl shadow-lg hover:border-sky-500 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-semibold uppercase">Evidence Vault</span>
            <FileText className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-mono">
            <AnimatedCounter value={evidence.length} />
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between font-mono">
            <span>{verifiedEvidence.length} certified verified</span>
            <span className="text-sky-400 font-semibold">Inspect Vault →</span>
          </div>
        </Link>

        {/* Timeline Events */}
        <Link
          href="/timeline"
          className="bg-[#0C1724] border border-[#1E2E3F] p-4 rounded-xl shadow-lg hover:border-sky-500 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-semibold uppercase">Chronological Events</span>
            <Clock className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-mono">
            <AnimatedCounter value={events.length} />
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between font-mono">
            <span>Across PCMC sectors</span>
            <span className="text-sky-400 font-semibold">Scrub Timeline →</span>
          </div>
        </Link>

        {/* Active Contradictions */}
        <Link
          href="/contradictions"
          className="bg-[#0C1724] border border-[#1E2E3F] p-4 rounded-xl shadow-lg hover:border-rose-500 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-semibold uppercase">Inconsistencies Flagged</span>
            <AlertTriangle className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-rose-400 mt-2 font-mono">
            <AnimatedCounter value={contradictions.length} />
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between font-mono">
            <span className="text-rose-400 font-medium">
              {unreviewedContradictions.length} active review
            </span>
            <span className="text-rose-400 font-semibold">Cross-Examine →</span>
          </div>
        </Link>

        {/* Investigation Gaps */}
        <Link
          href="/gaps"
          className="bg-[#0C1724] border border-[#1E2E3F] p-4 rounded-xl shadow-lg hover:border-amber-500 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-semibold uppercase">Investigation Gaps</span>
            <Search className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-2 font-mono">
            <AnimatedCounter value={gaps.length} />
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between font-mono">
            <span>{openGaps.length} pending leads</span>
            <span className="text-amber-400 font-semibold">Deploy Squad →</span>
          </div>
        </Link>
      </div>

      {/* Split Workspace: Contradiction Findings & Unresolved Investigation Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Inconsistencies Panel */}
        <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2E3F] pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h2 className="font-bold text-sm text-white font-mono uppercase tracking-wide">
                Active Evidence Inconsistencies ({contradictions.length})
              </h2>
            </div>
            <Link
              href="/contradictions"
              className="text-xs text-sky-400 hover:underline font-mono"
            >
              Inspect All Matrix →
            </Link>
          </div>

          <div className="space-y-3">
            {contradictions.slice(0, 3).map((c) => (
              <div
                key={c.id}
                className="border border-[#1E2E3F] rounded-lg p-3.5 bg-[#0F1C2A] hover:bg-[#132335] transition-colors space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-xs text-white leading-snug">
                    {c.title}
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold bg-rose-950/80 text-rose-300 border border-rose-800 flex-shrink-0">
                    {c.severity}
                  </span>
                </div>

                {/* Excerpt comparison pill */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-[#09121B] p-2.5 rounded border border-[#1E2E3F]">
                    <div className="font-mono text-[10px] text-amber-400 truncate font-semibold">
                      Source A: {c.claimA.speakerOrSource}
                    </div>
                    <div className="text-slate-300 italic mt-1 line-clamp-2 font-sans">
                      {c.claimA.excerpt}
                    </div>
                  </div>
                  <div className="bg-[#09121B] p-2.5 rounded border border-[#1E2E3F]">
                    <div className="font-mono text-[10px] text-emerald-400 truncate font-semibold">
                      Source B: {c.claimB.speakerOrSource}
                    </div>
                    <div className="text-slate-300 italic mt-1 line-clamp-2 font-sans">
                      {c.claimB.excerpt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                  <span>Category: {c.category.replace('_', ' ')}</span>
                  <Link
                    href={`/contradictions`}
                    className="text-sky-400 hover:text-sky-300 font-semibold"
                  >
                    Triage Clashes →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Investigation Gaps Panel */}
        <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2E3F] pb-3">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-400" />
              <h2 className="font-bold text-sm text-white font-mono uppercase tracking-wide">
                Critical Investigation Leads & Gaps ({gaps.length})
              </h2>
            </div>
            <Link
              href="/gaps"
              className="text-xs text-sky-400 hover:underline font-mono"
            >
              View All Gaps →
            </Link>
          </div>

          <div className="space-y-3">
            {gaps.slice(0, 3).map((g) => (
              <div
                key={g.id}
                className="border border-[#1E2E3F] rounded-lg p-3.5 bg-[#0F1C2A] hover:bg-[#132335] transition-colors space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-xs text-white leading-snug">
                    {g.title}
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold border flex-shrink-0 ${
                      g.severity === 'critical'
                        ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                        : 'bg-amber-950/80 text-amber-300 border-amber-800'
                    }`}
                  >
                    {g.severity}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed font-sans line-clamp-2">
                  {g.description}
                </p>

                <div className="p-2 rounded bg-[#09121B] border border-[#1E2E3F] text-[11px] text-sky-300 flex items-start gap-1.5">
                  <span className="font-mono text-sky-400 font-bold flex-shrink-0">Action:</span>
                  <span>{g.suggestedNextStep}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
