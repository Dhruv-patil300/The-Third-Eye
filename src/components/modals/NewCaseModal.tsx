'use client';

import React, { useState } from 'react';
import { useCase } from '@/context/CaseContext';
import { X, Briefcase, Plus, AlertCircle, Shield } from 'lucide-react';

export function NewCaseModal() {
  const { showNewCaseModal, setShowNewCaseModal, createCase } = useCase();

  const [title, setTitle] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [caseType, setCaseType] = useState('Commercial Dacoity / Vault Breach');
  const [incidentLocation, setIncidentLocation] = useState('Wakad, Pimpri Chinchwad');
  const [summary, setSummary] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [leadInvestigator, setLeadInvestigator] = useState('Sr. PI Vitthal More (Wakad PS)');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!showNewCaseModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !referenceNumber.trim()) {
      setError('Please provide both case title and FIR reference number.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await createCase({
        title: title.trim(),
        referenceNumber: referenceNumber.trim(),
        caseType,
        incidentLocation: incidentLocation.trim() || 'Wakad, Pimpri Chinchwad',
        summary: summary.trim(),
        priority,
        leadInvestigator,
        status: 'active',
        incidentDate: new Date().toISOString(),
        tags: [caseType, `${priority.toUpperCase()} Priority`, 'PCPC'],
      });
      setShowNewCaseModal(false);
      // Reset form
      setTitle('');
      setReferenceNumber('');
      setSummary('');
    } catch (err: any) {
      setError(err.message || 'Failed to create case');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none text-slate-100">
      <div className="bg-[#0C1724] rounded-xl border border-[#1E2E3F] shadow-2xl w-full max-w-lg overflow-hidden text-xs">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-[#0F1B2A] border-b border-[#1E2E3F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-400" />
            <h2 className="font-bold text-sm text-white font-mono uppercase tracking-wide">
              Register New FIR Case File
            </h2>
          </div>
          <button
            onClick={() => setShowNewCaseModal(false)}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-800 text-[11px] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-mono text-[11px] font-bold text-slate-300 uppercase mb-1">
              Case / Incident Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Armed Vault Breach & Dacoity at Hinjawadi Infotech Park"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-bold text-slate-300 uppercase mb-1">
                FIR Reference No *
              </label>
              <input
                type="text"
                placeholder="e.g. FIR No. 0412/2025 (Hinjawadi PS)"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-bold text-slate-300 uppercase mb-1">
                Priority Tier
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
              >
                <option value="high">Priority High</option>
                <option value="medium">Priority Medium</option>
                <option value="low">Priority Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-bold text-slate-300 uppercase mb-1">
                Case Classification / Offense
              </label>
              <input
                type="text"
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-bold text-slate-300 uppercase mb-1">
                Lead IO / Police Inspector
              </label>
              <input
                type="text"
                value={leadInvestigator}
                onChange={(e) => setLeadInvestigator(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] font-bold text-slate-300 uppercase mb-1">
              Scene Location / Landmark
            </label>
            <input
              type="text"
              placeholder="e.g. Datta Mandir Road, Wakad, Pimpri Chinchwad"
              value={incidentLocation}
              onChange={(e) => setIncidentLocation(e.target.value)}
              className="w-full px-3 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] font-bold text-slate-300 uppercase mb-1">
              Preliminary Incident Brief
            </label>
            <textarea
              rows={3}
              placeholder="Document the primary allegations, estimated loss, suspect names, and telemetry parameters..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-[#1E2E3F]">
            <button
              type="button"
              onClick={() => setShowNewCaseModal(false)}
              className="px-3.5 py-1.5 border border-[#22364A] rounded-lg text-slate-400 hover:text-white font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-mono font-semibold shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{submitting ? 'Creating...' : 'Initialize Dossier'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
