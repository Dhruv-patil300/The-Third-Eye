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
  Radio,
  Crosshair,
} from 'lucide-react';
import { ContradictionDiffVisualizer } from '@/components/tactical/ContradictionDiffVisualizer';

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
    <div className="space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 font-bold border border-rose-800">
              CROSS-EXAMINATION MATRIX
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              WAKAD PS // PCPC FORENSIC CELL
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <span>Contradiction & Inconsistency Triage</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Source-attributed cross-examination of conflicting alibis, telecom tower pings, and traffic surveillance logs.
          </p>
        </div>

        {/* Responsible Police Doctrine Banner */}
        <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-lg p-2.5 max-w-md text-[11px] text-slate-300 flex items-start gap-2 shadow-md">
          <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
          <div className="leading-snug font-sans">
            <strong className="text-sky-400 font-mono">Investigative Doctrine:</strong> A flagged conflict is not automatic proof of guilt. Cross-reference antenna azimuths, room CCTV, and independent Pancha panchnama before executing custody.
          </div>
        </div>
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Contradiction Findings */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-xl p-3 shadow-md flex items-center justify-between text-xs">
            <span className="font-mono font-bold text-slate-300 uppercase tracking-wide">
              Flagged Clashes ({filtered.length})
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1 border border-[#22364A] rounded-lg bg-[#0E1A27] text-xs text-slate-200 focus:outline-none font-mono"
            >
              <option value="all">All Triage States</option>
              <option value="unreviewed">Unreviewed</option>
              <option value="under_review">Under Review</option>
              <option value="confirmed_inconsistency">Confirmed Inconsistency</option>
              <option value="resolved">Resolved</option>
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
                  className={`bg-[#0C1724] border rounded-xl p-3.5 cursor-pointer transition-all shadow-md ${
                    isSelected
                      ? 'border-rose-500 ring-2 ring-rose-500/20 bg-[#121E2C]'
                      : 'border-[#1E2E3F] hover:border-sky-500/60 hover:bg-[#101D2B]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[9px] font-bold text-slate-400 uppercase px-1.5 py-0.5 rounded bg-[#08111A]">
                      {item.id.toUpperCase()}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-mono font-bold ${
                        item.severity === 'high'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {item.severity} Severity
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-white leading-snug font-sans">
                    {item.title}
                  </h3>

                  <div className="mt-2 text-[11px] text-slate-300 line-clamp-2 font-sans">
                    {item.explanation}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#1E2E3F] flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400 capitalize">
                      {item.category.replace('_', ' ')}
                    </span>
                    <span
                      className={`font-semibold uppercase ${
                        item.reviewStatus === 'confirmed_inconsistency'
                          ? 'text-rose-400'
                          : item.reviewStatus === 'under_review'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {item.reviewStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep-Dive Inconsistency Dossier */}
        <div className="lg:col-span-7 space-y-4">
          {selectedFinding ? (
            <>
              <ContradictionDiffVisualizer
                finding={selectedFinding}
                onUpdateStatus={handleStatusChange}
              />

              {/* Investigator Case Notes Card */}
              <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-xl p-4 shadow-xl text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-sky-400" />
                    Investigating Officer (IO) Case Notes
                  </span>
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-[11px] font-mono font-semibold flex items-center gap-1 transition-all"
                  >
                    <Save className="w-3 h-3" />
                    <span>{savingNotes ? 'Saving...' : 'Save Officer Note'}</span>
                  </button>
                </div>

                <textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Record formal field observations, raid instructions, or interrogation notes..."
                  rows={3}
                  className="w-full bg-[#08121B] border border-[#1E2E3F] rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
                />

                <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Logged under Section 172 Cr.P.C. / BNSS Case Diary</span>
                  <span className="text-slate-400">Auto-appended to Case Audit</span>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-xl p-8 text-center text-slate-400 font-mono text-xs">
              Select an inconsistency item from the left panel to begin forensic cross-examination.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
