'use client';

import React, { useEffect, useState } from 'react';
import { useCase } from '@/context/CaseContext';
import { ContradictionFinding, ContradictionReviewStatus, EvidenceItem } from '@/types';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  FileText,
  Clock,
  ArrowRight,
  ShieldAlert,
  Search,
  Filter,
  Save,
  Info,
} from 'lucide-react';

export default function ContradictionsPage() {
  const { activeCaseId, activeCase } = useCase();

  const [contradictions, setContradictions] = useState<ContradictionFinding[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [selectedFinding, setSelectedFinding] = useState<ContradictionFinding | null>(null);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesInput, setNotesInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchContradictions = async () => {
    if (!activeCaseId) return;
    try {
      setLoading(true);
      const [cntrRes, evRes] = await Promise.all([
        fetch(`/api/cases/${activeCaseId}/contradictions`).then((r) => r.json()),
        fetch(`/api/cases/${activeCaseId}/evidence`).then((r) => r.json()),
      ]);

      if (cntrRes.success) {
        setContradictions(cntrRes.data || []);
        if (cntrRes.data && cntrRes.data.length > 0) {
          const first = cntrRes.data[0];
          setSelectedFinding(first);
          setNotesInput(first.investigatorNotes || '');
        }
      }
      if (evRes.success) setEvidenceList(evRes.data || []);
    } catch (err) {
      console.error('Failed to load contradictions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContradictions();
  }, [activeCaseId]);

  const handleStatusChange = async (id: string, newStatus: ContradictionReviewStatus) => {
    try {
      const res = await fetch(`/api/cases/${activeCaseId}/contradictions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates: { reviewStatus: newStatus } }),
      });
      if (res.ok) {
        const json = await res.json();
        setContradictions((prev) => prev.map((c) => (c.id === id ? json.data : c)));
        if (selectedFinding?.id === id) {
          setSelectedFinding(json.data);
        }
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedFinding) return;
    try {
      setSavingNotes(true);
      const res = await fetch(`/api/cases/${activeCaseId}/contradictions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedFinding.id,
          updates: { investigatorNotes: notesInput },
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setContradictions((prev) =>
          prev.map((c) => (c.id === selectedFinding.id ? json.data : c))
        );
        setSelectedFinding(json.data);
      }
    } catch (err) {
      console.error('Save notes failed:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  const filtered = contradictions.filter(
    (c) => statusFilter === 'all' || c.reviewStatus === statusFilter
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-status-critical" />
            <span>Contradiction & Inconsistency Triage</span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Source-attributed cross-examination of conflicting claims, temporal collisions, and alternative explanations.
          </p>
        </div>

        {/* Responsible AI Disclaimer Banner */}
        <div className="bg-bg-highlight/40 border border-brand-mutedBlueTeal/40 rounded-lg p-2.5 max-w-md text-[11px] text-text-primary flex items-start gap-2">
          <Info className="w-4 h-4 text-brand-steelBlue flex-shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong className="text-brand-deepTeal">Investigative Doctrine:</strong> A contradiction is not proof of deception or guilt. Differences may stem from inaccurate memories, approximate timestamps, or incomplete records.
          </div>
        </div>
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Contradiction Findings */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white border border-border-light rounded-lg p-3 shadow-subtle flex items-center justify-between text-xs">
            <span className="font-semibold text-text-primary">
              Flagged Inconsistencies ({filtered.length})
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 py-1 border border-border-light rounded bg-white text-xs focus:outline-none"
            >
              <option value="all">All Triage States</option>
              <option value="unreviewed">Unreviewed</option>
              <option value="under_review">Under Review</option>
              <option value="confirmed_inconsistency">Confirmed Inconsistency</option>
              <option value="resolved">Resolved</option>
              <option value="false_positive">False Positive</option>
            </select>
          </div>

          <div className="space-y-2.5">
            {filtered.map((item) => {
              const isSelected = selectedFinding?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedFinding(item);
                    setNotesInput(item.investigatorNotes || '');
                  }}
                  className={`bg-white border rounded-lg p-3.5 cursor-pointer transition-all shadow-subtle ${
                    isSelected
                      ? 'border-status-critical ring-2 ring-status-critical/15 bg-status-criticalBg/10'
                      : 'border-border-light hover:border-brand-mutedBlueTeal hover:bg-bg-main/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-mono text-[9px] font-bold text-text-secondary uppercase px-1.5 py-0.5 rounded bg-bg-muted">
                      {item.id}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold ${
                        item.severity === 'high'
                          ? 'bg-status-criticalBg text-status-critical border border-status-criticalBorder'
                          : 'bg-status-warningBg text-status-warning border border-status-warningBorder'
                      }`}
                    >
                      {item.severity} Severity
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-text-primary leading-snug">
                    {item.title}
                  </h3>

                  <div className="mt-2 text-[11px] text-text-secondary line-clamp-2">
                    {item.explanation}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-border-subtle flex items-center justify-between text-[10px]">
                    <span className="capitalize text-text-secondary font-medium">
                      {item.category.replace('_', ' ')}
                    </span>
                    <span className="font-semibold text-text-primary uppercase">
                      {item.reviewStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep-Dive Inconsistency Dossier */}
        <div className="lg:col-span-7">
          {selectedFinding ? (
            <div className="bg-white border border-border-light rounded-lg shadow-card p-5 space-y-5 text-xs">
              {/* Finding Title & Status Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold text-status-critical bg-status-criticalBg px-2 py-0.5 rounded border border-status-criticalBorder">
                      {selectedFinding.id}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-text-secondary">
                      {selectedFinding.category.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-text-primary leading-tight">
                    {selectedFinding.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-semibold text-text-secondary text-[11px]">Triage:</span>
                  <select
                    value={selectedFinding.reviewStatus}
                    onChange={(e) => handleStatusChange(selectedFinding.id, e.target.value as any)}
                    className="px-2.5 py-1 text-xs font-semibold rounded border border-border-light bg-white focus:outline-none focus:border-brand-steelBlue"
                  >
                    <option value="unreviewed">Unreviewed</option>
                    <option value="under_review">Under Review</option>
                    <option value="confirmed_inconsistency">Confirmed Inconsistency</option>
                    <option value="resolved">Resolved</option>
                    <option value="false_positive">False Positive</option>
                    <option value="insufficient_info">Insufficient Info</option>
                  </select>
                </div>
              </div>

              {/* Side-by-Side Claim Excerpts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Claim A */}
                <div className="bg-bg-main p-3.5 rounded-lg border border-border-subtle space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-brand-deepTeal">Claim A (Source 1)</span>
                    <span className="font-mono text-[9px] text-text-secondary">
                      {selectedFinding.claimA.evidenceId}
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-text-secondary">
                    {selectedFinding.claimA.speakerOrSource}
                  </div>
                  <div className="p-2.5 bg-white rounded border border-border-subtle italic text-text-primary leading-relaxed font-serif">
                    {selectedFinding.claimA.excerpt}
                  </div>
                  {selectedFinding.claimA.timestamp && (
                    <div className="text-[10px] text-text-secondary flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-brand-steelBlue" />
                      <span>{selectedFinding.claimA.timestamp}</span>
                    </div>
                  )}
                </div>

                {/* Claim B */}
                <div className="bg-bg-main p-3.5 rounded-lg border border-border-subtle space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-brand-deepTeal">Claim B (Source 2)</span>
                    <span className="font-mono text-[9px] text-text-secondary">
                      {selectedFinding.claimB.evidenceId}
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-text-secondary">
                    {selectedFinding.claimB.speakerOrSource}
                  </div>
                  <div className="p-2.5 bg-white rounded border border-border-subtle italic text-text-primary leading-relaxed font-serif">
                    {selectedFinding.claimB.excerpt}
                  </div>
                  {selectedFinding.claimB.timestamp && (
                    <div className="text-[10px] text-text-secondary flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-brand-steelBlue" />
                      <span>{selectedFinding.claimB.timestamp}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Analytical Explanation */}
              <div className="space-y-1.5">
                <h3 className="font-semibold text-xs text-text-primary">
                  Analytical Inconsistency Breakdown
                </h3>
                <p className="p-3 bg-bg-highlight/30 rounded border border-border-subtle text-text-primary leading-relaxed text-xs">
                  {selectedFinding.explanation}
                </p>
              </div>

              {/* Non-Deceptive Alternative Explanations */}
              <div className="space-y-2">
                <h3 className="font-semibold text-xs text-text-primary flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-brand-steelBlue" />
                  <span>Alternative Hypotheses & Non-Deceptive Explanations</span>
                </h3>
                <div className="space-y-1.5">
                  {selectedFinding.alternativeExplanations.map((alt, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded bg-bg-main/60 border border-border-subtle text-[11px] text-text-primary flex items-start gap-2"
                    >
                      <span className="font-mono font-bold text-brand-deepTeal mt-0.5">
                        {idx + 1}.
                      </span>
                      <span className="leading-snug">{alt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Verification Steps */}
              <div className="space-y-2">
                <h3 className="font-semibold text-xs text-text-primary flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Targeted Investigative Verification Actions</span>
                </h3>
                <div className="space-y-1.5">
                  {selectedFinding.suggestedVerificationSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded bg-bg-main/40 border border-border-subtle text-[11px] flex items-start gap-2"
                    >
                      <span className="text-status-success font-bold">✓</span>
                      <span className="text-text-primary">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investigator Notes */}
              <div className="pt-3 border-t border-border-subtle space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-xs text-text-primary">
                    Investigator Annotations & Decision Log
                  </label>
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="px-3 py-1 bg-brand-deepTeal text-white rounded text-xs font-medium hover:bg-brand-darkSteelTeal flex items-center gap-1 disabled:opacity-60"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingNotes ? 'Saving...' : 'Save Notes'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Document sworn interview findings, witness demeanor, or corroborating physical tests..."
                  className="w-full p-2.5 border border-border-light rounded focus:outline-none focus:border-brand-steelBlue text-xs font-mono"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white border border-border-light rounded-lg p-12 text-center text-xs text-text-secondary shadow-card">
              Select an inconsistency finding from the left panel to review claim excerpts and investigative steps.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
