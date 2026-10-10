'use client';

import React, { useState } from 'react';
import { useCase } from '@/context/CaseContext';
import { useLanguage } from '@/context/LanguageContext';
import { X, Briefcase, Plus, AlertCircle, Shield } from 'lucide-react';

export function NewCaseModal() {
  const { t } = useLanguage();
  const { showNewCaseModal, setShowNewCaseModal, createCase } = useCase();

  const [title, setTitle] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [caseType, setCaseType] = useState('');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [summary, setSummary] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [leadInvestigator, setLeadInvestigator] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!showNewCaseModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !referenceNumber.trim()) {
      setError(t('newCase.error'));
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await createCase({
        title: title.trim(),
        referenceNumber: referenceNumber.trim(),
        caseType,
        incidentLocation: incidentLocation.trim() || 'Pimpri Chinchwad',
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
              {t('newCase.title')}
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
              {t('newCase.caseTitle')} *
            </label>
            <input
              type="text"
              placeholder={t('newCase.titlePlaceholder')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-bold text-slate-300 uppercase mb-1">
                {t('newCase.reference')} *
              </label>
              <input
                type="text"
                placeholder={t('newCase.referencePlaceholder')}
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-bold text-slate-300 uppercase mb-1">
                {t('newCase.priority')}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
              >
                <option value="high">{t('priority.high')}</option>
                <option value="medium">{t('priority.medium')}</option>
                <option value="low">{t('priority.low')}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-bold text-slate-300 uppercase mb-1">
                {t('newCase.classification')}
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
                {t('newCase.contact')}
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
              {t('newCase.location')}
            </label>
            <input
              type="text"
              placeholder={t('newCase.locationPlaceholder')}
              value={incidentLocation}
              onChange={(e) => setIncidentLocation(e.target.value)}
              className="w-full px-3 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] font-bold text-slate-300 uppercase mb-1">
              {t('newCase.summary')}
            </label>
            <textarea
              rows={3}
              placeholder={t('newCase.summaryPlaceholder')}
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
              {t('newCase.cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-mono font-semibold shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{submitting ? t('newCase.creating') : t('newCase.submit')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
