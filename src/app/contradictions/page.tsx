'use client';

import React, { useEffect, useState } from 'react';
import { useCase } from '@/context/CaseContext';
import { useLanguage } from '@/context/LanguageContext';
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
  Plus,
  X,
} from 'lucide-react';
import { ContradictionDiffVisualizer } from '@/components/tactical/ContradictionDiffVisualizer';

export default function ContradictionsPage() {
  const { activeCaseId, activeCase } = useCase();
  const { t } = useLanguage();

  const [contradictions, setContradictions] = useState<ContradictionFinding[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [selectedFinding, setSelectedFinding] = useState<ContradictionFinding | null>(null);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesInput, setNotesInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    title: '',
    severity: 'high' as 'high' | 'medium' | 'low',
    category: 'statement_inconsistency' as ContradictionFinding['category'],
    claimAText: '',
    claimASpeaker: '',
    claimBText: '',
    claimBSpeaker: '',
    explanation: '',
  });
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

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

  const handleAddContradiction = async () => {
    if (!activeCaseId || !addForm.title.trim()) return;
    try {
      setAddSubmitting(true);
      const res = await fetch(`/api/cases/${activeCaseId}/contradictions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      if (res.ok) {
        setAddSuccess(true);
        setTimeout(() => {
          setShowAddModal(false);
          setAddForm({ title: '', severity: 'high', category: 'statement_inconsistency', claimAText: '', claimASpeaker: '', claimBText: '', claimBSpeaker: '', explanation: '' });
          setAddSuccess(false);
          fetchContradictions();
        }, 900);
      }
    } catch (err) {
      console.error('Failed to add contradiction:', err);
    } finally {
      setAddSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 font-bold border border-rose-800">
              {t('contradictions.title')}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              WAKAD PS // PCPC FORENSIC CELL
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <span>{t('contradictions.title')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            {t('contradictions.description')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Responsible Police Doctrine Banner */}
          <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-lg p-2.5 max-w-md text-[11px] text-slate-300 flex items-start gap-2 shadow-md">
            <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
            <div className="leading-snug font-sans">
              <strong className="text-sky-400 font-mono">Investigative Doctrine:</strong> A flagged conflict is not automatic proof of guilt. Cross-reference antenna azimuths, room CCTV, and independent Pancha panchnama before executing custody.
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-700 hover:bg-rose-600 text-white rounded-lg font-mono font-semibold text-xs transition-colors shadow-md shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Inconsistency</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Contradiction Findings */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-xl p-3 shadow-md flex items-center justify-between text-xs">
            <span className="font-mono font-bold text-slate-300 uppercase tracking-wide">
              {t('contradictions.title')} ({filtered.length})
            </span>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1 border border-[#22364A] rounded-lg bg-[#0E1A27] text-xs text-slate-200 focus:outline-none font-mono"
              >
                <option value="all">{t('contradictions.allStates')}</option>
                <option value="unreviewed">{t('contradictions.unreviewed')}</option>
                <option value="under_review">{t('contradictions.underReview')}</option>
                <option value="confirmed_inconsistency">{t('contradictions.confirmed')}</option>
                <option value="resolved">{t('contradictions.resolved')}</option>
              </select>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1 px-2.5 py-1 bg-rose-700 hover:bg-rose-600 text-white rounded-lg font-mono font-semibold text-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log</span>
              </button>
            </div>
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
                    <span>{savingNotes ? t('contradictions.saving') : t('contradictions.saveNote')}</span>
                  </button>
                </div>

                <textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder={t('contradictions.notePlaceholder')}
                  rows={3}
                  className="w-full bg-[#08121B] border border-[#1E2E3F] rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
                />

                <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span>{t('contradictions.noteLogged')}</span>
                  <span className="text-slate-400">{t('contradictions.noteLogged')}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-xl p-8 text-center text-slate-400 font-mono text-xs">
              {t('contradictions.noSelection')}
            </div>
          )}
        </div>
      </div>

    {/* ─── Add Contradiction Modal ─── */}
    {showAddModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-[#0C1724] border border-[#22364A] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto text-slate-100">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2E3F]">
            <div>
              <span className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-widest block">LOG NEW CONFLICT</span>
              <h2 className="text-sm font-bold text-white font-sans">Register Statement Inconsistency</h2>
            </div>
            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Modal Body */}
          <div className="px-6 py-5 space-y-4 text-xs">
            <div>
              <label className="font-mono text-[11px] font-bold text-slate-300 block uppercase mb-1">Inconsistency Title <span className="text-rose-400">*</span></label>
              <input type="text" value={addForm.title} onChange={(e) => setAddForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Suspect's restaurant alibi contradicts Jio tower ping at crime scene" className="w-full p-2.5 bg-[#08121B] border border-[#22364A] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-[11px] font-bold text-slate-300 block uppercase mb-1">Severity</label>
                <select value={addForm.severity} onChange={(e) => setAddForm(f => ({ ...f, severity: e.target.value as any }))} className="w-full p-2.5 bg-[#08121B] border border-[#22364A] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-rose-500">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="font-mono text-[11px] font-bold text-slate-300 block uppercase mb-1">Category</label>
                <select value={addForm.category} onChange={(e) => setAddForm(f => ({ ...f, category: e.target.value as any }))} className="w-full p-2.5 bg-[#08121B] border border-[#22364A] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-rose-500">
                  <option value="timeline_conflict">Timeline Conflict</option>
                  <option value="alibi_discrepancy">Alibi Discrepancy</option>
                  <option value="identity_mismatch">Identity Mismatch</option>
                  <option value="location_impossibility">Location Impossibility</option>
                  <option value="statement_inconsistency">Statement Inconsistency</option>
                </select>
              </div>
            </div>
            {/* Claim A */}
            <div className="p-3.5 bg-sky-950/20 border border-sky-900/50 rounded-xl space-y-2">
              <span className="font-mono text-[11px] font-bold text-sky-400 uppercase">Claim / Statement A</span>
              <input type="text" value={addForm.claimASpeaker} onChange={(e) => setAddForm(f => ({ ...f, claimASpeaker: e.target.value }))} placeholder="Speaker / Source (e.g. Accused Tanaji Shinde, statement dt. 15-Jan-2025)" className="w-full p-2 bg-[#08121B] border border-[#22364A] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500" />
              <textarea rows={2} value={addForm.claimAText} onChange={(e) => setAddForm(f => ({ ...f, claimAText: e.target.value }))} placeholder="Exact excerpt from statement or evidence..." className="w-full p-2 bg-[#08121B] border border-[#22364A] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none" />
            </div>
            {/* Claim B */}
            <div className="p-3.5 bg-rose-950/20 border border-rose-900/50 rounded-xl space-y-2">
              <span className="font-mono text-[11px] font-bold text-rose-400 uppercase">Contradicting Claim / Evidence B</span>
              <input type="text" value={addForm.claimBSpeaker} onChange={(e) => setAddForm(f => ({ ...f, claimBSpeaker: e.target.value }))} placeholder="Source (e.g. Airtel CDR Record, Cell Mast #404-869-21943)" className="w-full p-2 bg-[#08121B] border border-[#22364A] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500" />
              <textarea rows={2} value={addForm.claimBText} onChange={(e) => setAddForm(f => ({ ...f, claimBText: e.target.value }))} placeholder="Exact excerpt or description of contradicting evidence..." className="w-full p-2 bg-[#08121B] border border-[#22364A] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none" />
            </div>
            {/* Explanation */}
            <div>
              <label className="font-mono text-[11px] font-bold text-slate-300 block uppercase mb-1">Forensic Explanation</label>
              <textarea rows={2} value={addForm.explanation} onChange={(e) => setAddForm(f => ({ ...f, explanation: e.target.value }))} placeholder="Why are these two claims mutually exclusive? What does this prove?" className="w-full p-2.5 bg-[#08121B] border border-[#22364A] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none" />
            </div>
          </div>
          {/* Modal Footer */}
          <div className="px-6 pb-5 flex items-center justify-end gap-3">
            <button onClick={() => setShowAddModal(false)} className="px-4 py-1.5 rounded-lg border border-[#22364A] text-slate-300 text-xs font-mono hover:bg-[#1a2535] transition-colors">Cancel</button>
            <button
              onClick={handleAddContradiction}
              disabled={addSubmitting || !addForm.title.trim()}
              className={`flex items-center gap-1.5 px-5 py-1.5 rounded-lg text-white text-xs font-mono font-semibold transition-all ${
                addSuccess ? 'bg-emerald-600' : addSubmitting || !addForm.title.trim() ? 'bg-rose-900/50 cursor-not-allowed' : 'bg-rose-700 hover:bg-rose-600'
              }`}
            >
              {addSuccess ? (<><CheckCircle2 className="w-3.5 h-3.5" /> Logged</>) : addSubmitting ? (<><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Logging…</>) : (<><Save className="w-3.5 h-3.5" /> Log Inconsistency</>)}
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
