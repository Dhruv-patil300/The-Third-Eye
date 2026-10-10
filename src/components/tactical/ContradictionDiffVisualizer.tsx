'use client';

import React, { useState } from 'react';
import { ContradictionFinding, ContradictionReviewStatus } from '@/types';
import {
  AlertTriangle,
  ArrowRight,
  MapPin,
  Clock,
  User,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  XCircle,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ContradictionDiffVisualizerProps {
  finding: ContradictionFinding;
  onUpdateStatus?: (id: string, status: ContradictionReviewStatus) => void;
  onSaveNotes?: (id: string, notes: string) => void;
}

export function ContradictionDiffVisualizer({
  finding,
  onUpdateStatus,
  onSaveNotes,
}: ContradictionDiffVisualizerProps) {
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [notes, setNotes] = useState(finding.investigatorNotes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  return (
    <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-xl overflow-hidden shadow-xl space-y-0 text-slate-100">
      {/* Top Banner */}
      <div className="px-5 py-3.5 bg-[#0F1B2B] border-b border-[#1E2E3F] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-800 flex items-center justify-center flex-shrink-0 text-rose-400">
            <AlertTriangle className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-rose-950/90 text-rose-300 border border-rose-800/80">
                {finding.severity.toUpperCase()} SEVERITY CLASH
              </span>
              <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider">
                {finding.category.replace('_', ' ')}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight mt-0.5">
              {finding.title}
            </h3>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] font-mono px-2.5 py-1 rounded-md border font-semibold flex items-center gap-1.5 ${
              finding.reviewStatus === 'confirmed_inconsistency'
                ? 'bg-rose-950/80 text-rose-300 border-rose-700'
                : finding.reviewStatus === 'under_review'
                ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                : finding.reviewStatus === 'resolved'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            {finding.reviewStatus.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Side-by-Side Forensic Clash Visualizer */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-11 gap-4 items-stretch bg-gradient-to-b from-[#0C1724] to-[#0A131E]">
        {/* Claim A Card */}
        <div className="lg:col-span-5 bg-[#101F2F] border border-[#1E3347] rounded-lg p-4 flex flex-col justify-between space-y-3 relative hover:border-sky-500/50 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E3347]">
            <span className="text-[10px] font-mono uppercase font-bold text-sky-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Claim A (Asserted Alibi / Statement)
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-800">
              {finding.claimA.evidenceId.toUpperCase()}
            </span>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-300 mb-1">
              Source: {finding.claimA.speakerOrSource}
            </div>
            <div className="text-xs italic text-slate-100 bg-[#09131D]/80 p-3 rounded border-l-2 border-amber-400 leading-relaxed font-sans">
              {finding.claimA.excerpt}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-400 pt-1 border-t border-[#1E3347]/70">
            {finding.claimA.location && (
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3 h-3 text-amber-400" />
                {finding.claimA.location}
              </span>
            )}
            {finding.claimA.timestamp && (
              <span className="flex items-center gap-1 text-slate-300">
                <Clock className="w-3 h-3 text-amber-400" />
                {new Date(finding.claimA.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST
              </span>
            )}
          </div>
        </div>

        {/* Central Tactical Clash Divider */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center py-2 lg:py-0">
          <div className="w-10 h-10 rounded-full bg-rose-950 border-2 border-rose-500 flex items-center justify-center text-rose-300 font-mono font-bold text-xs shadow-lg shadow-rose-900/50 animate-pulse">
            VS
          </div>
          <span className="text-[9px] font-mono text-rose-400 uppercase tracking-widest mt-1 text-center font-bold">
            MUTUALLY EXCLUSIVE
          </span>
        </div>

        {/* Claim B Card */}
        <div className="lg:col-span-5 bg-[#101F2F] border border-[#1E3347] rounded-lg p-4 flex flex-col justify-between space-y-3 relative hover:border-sky-500/50 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E3347]">
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Claim B (Objective Telemetry / Forensic Feed)
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
              {finding.claimB.evidenceId.toUpperCase()}
            </span>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-300 mb-1">
              Source: {finding.claimB.speakerOrSource}
            </div>
            <div className="text-xs italic text-slate-100 bg-[#09131D]/80 p-3 rounded border-l-2 border-emerald-400 leading-relaxed font-sans">
              {finding.claimB.excerpt}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-400 pt-1 border-t border-[#1E3347]/70">
            {finding.claimB.location && (
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {finding.claimB.location}
              </span>
            )}
            {finding.claimB.timestamp && (
              <span className="flex items-center gap-1 text-slate-300">
                <Clock className="w-3 h-3 text-emerald-400" />
                {new Date(finding.claimB.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Forensic Explanation & Physical Impossibility */}
      <div className="px-5 py-3.5 bg-[#0E1A27] border-t border-[#1E2E3F] text-xs space-y-2">
        <div className="font-mono text-[11px] font-bold text-sky-400 uppercase tracking-wide">
          Forensic Cross-Examination Analysis:
        </div>
        <p className="text-slate-300 leading-relaxed font-sans">
          {finding.explanation}
        </p>

        {/* Collapsible Alternative Hypotheses */}
        {finding.alternativeExplanations && finding.alternativeExplanations.length > 0 && (
          <div className="pt-2">
            <button
              onClick={() => setShowAlternatives(!showAlternatives)}
              className="text-[11px] text-sky-400 hover:text-sky-300 font-mono flex items-center gap-1 transition-colors"
            >
              <span>Non-Deceptive Alternatives Evaluated ({finding.alternativeExplanations.length})</span>
              {showAlternatives ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showAlternatives && (
              <ul className="mt-2 space-y-1.5 pl-4 border-l-2 border-sky-800 text-[11px] text-slate-400 font-sans">
                {finding.alternativeExplanations.map((alt, idx) => (
                  <li key={idx}>• {alt}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Suggested Verification Steps */}
      {finding.suggestedVerificationSteps && finding.suggestedVerificationSteps.length > 0 && (
        <div className="px-5 py-3 bg-[#09121B] border-t border-[#1E2E3F] text-xs">
          <div className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wide mb-1.5">
            Recommended Police Verification Protocol:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-300">
            {finding.suggestedVerificationSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-1.5 bg-[#0F1B28] p-2 rounded border border-[#1E2E3F]">
                <span className="font-mono text-amber-400 font-bold text-[10px]">{idx + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Investigator Triage Action Controls */}
      <div className="px-5 py-3 bg-[#0B1522] border-t border-[#1E2E3F] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
            Triage Decision:
          </span>
          {onUpdateStatus && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onUpdateStatus(finding.id, 'confirmed_inconsistency')}
                className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-all border ${
                  finding.reviewStatus === 'confirmed_inconsistency'
                    ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                    : 'bg-rose-950/40 text-rose-300 border-rose-900 hover:bg-rose-900/60'
                }`}
              >
                Confirm Inconsistency
              </button>
              <button
                onClick={() => onUpdateStatus(finding.id, 'under_review')}
                className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-all border ${
                  finding.reviewStatus === 'under_review'
                    ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                    : 'bg-amber-950/40 text-amber-300 border-amber-900 hover:bg-amber-900/60'
                }`}
              >
                Requires Interrogation
              </button>
              <button
                onClick={() => onUpdateStatus(finding.id, 'resolved')}
                className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-all border ${
                  finding.reviewStatus === 'resolved'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                    : 'bg-emerald-950/40 text-emerald-300 border-emerald-900 hover:bg-emerald-900/60'
                }`}
              >
                Mark Resolved
              </button>
            </div>
          )}
        </div>

        {finding.reviewedBy && (
          <div className="text-[10px] font-mono text-slate-400">
            Reviewed by: <span className="text-slate-200">{finding.reviewedBy}</span>
          </div>
        )}
      </div>
    </div>
  );
}
