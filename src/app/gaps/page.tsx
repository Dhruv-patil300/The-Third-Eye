'use client';

import React, { useEffect, useState } from 'react';
import { useCase } from '@/context/CaseContext';
import { useLanguage } from '@/context/LanguageContext';
import { InvestigationGap, GapStatus } from '@/types';
import {
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  FileQuestion,
  Shield,
  HelpCircle,
  XCircle,
  Target,
  Sparkles,
} from 'lucide-react';

export default function InvestigationGapsPage() {
  const { activeCaseId, activeCase } = useCase();
  const { t } = useLanguage();

  const [gaps, setGaps] = useState<InvestigationGap[]>([]);
  const [selectedGap, setSelectedGap] = useState<InvestigationGap | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dismissalNote, setDismissalNote] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchGaps = async () => {
    if (!activeCaseId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/cases/${activeCaseId}/gaps`);
      const json = await res.json();
      if (json.success && json.data) {
        setGaps(json.data);
        if (json.data.length > 0 && !selectedGap) {
          setSelectedGap(json.data[0]);
        } else if (selectedGap) {
          const updated = json.data.find((g: InvestigationGap) => g.id === selectedGap.id);
          if (updated) setSelectedGap(updated);
        }
      }
    } catch (err) {
      console.error('Failed to load gaps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGaps();
  }, [activeCaseId]);

  const handleUpdateStatus = async (id: string, newStatus: GapStatus) => {
    try {
      const res = await fetch(`/api/cases/${activeCaseId}/gaps`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          updates: {
            status: newStatus,
            dismissalReason: newStatus === 'dismissed' ? dismissalNote : undefined,
          },
        }),
      });
      if (res.ok) {
        await fetchGaps();
      }
    } catch (err) {
      console.error('Failed to update gap status:', err);
    }
  };

  const filtered = gaps.filter((g) => statusFilter === 'all' || g.status === statusFilter);

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 font-bold border border-amber-800">
              {t('gaps.title')}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              WAKAD PS // PCPC PROSECUTION DEFICIENCIES
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-400" />
            <span>{t('gaps.title')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            {t('gaps.description')}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">{t('common.status')}:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-[#22364A] rounded-lg bg-[#0C1724] text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="all">{t('common.all')} ({gaps.length})</option>
            <option value="open">{t('common.open')}</option>
            <option value="investigating">{t('common.pending')}</option>
            <option value="addressed">{t('common.addressed')}</option>
            <option value="dismissed">{t('common.closed')}</option>
          </select>
        </div>
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Gaps */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center justify-between">
            <span>{t('gaps.detected')} ({filtered.length})</span>
            <span className="text-sky-400">{activeCase?.referenceNumber}</span>
          </div>

          <div className="space-y-2.5">
            {filtered.map((gap) => {
              const isSelected = selectedGap?.id === gap.id;
              return (
                <div
                  key={gap.id}
                  onClick={() => setSelectedGap(gap)}
                  className={`bg-[#0C1724] border rounded-xl p-3.5 cursor-pointer transition-all shadow-md ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-500/20 bg-[#141F2C]'
                      : 'border-[#1E2E3F] hover:border-amber-500/60 hover:bg-[#101D2B]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[9px] font-bold text-slate-400 uppercase px-1.5 py-0.5 rounded bg-[#08121B]">
                      {gap.id.toUpperCase()}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold border ${
                        gap.severity === 'critical'
                          ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                          : 'bg-amber-950/80 text-amber-300 border-amber-800'
                      }`}
                    >
                      {gap.severity}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-white leading-snug font-sans">
                    {gap.title}
                  </h3>

                  <p className="text-[11px] text-slate-300 mt-1.5 line-clamp-2 font-sans">
                    {gap.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-[#1E2E3F] flex items-center justify-between text-[10px] font-mono">
                    <span className="capitalize text-slate-400">
                      {gap.category.replace('_', ' ')}
                    </span>
                    <span className="font-bold text-amber-400 uppercase">
                      {gap.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep-Dive Gap Details */}
        <div className="lg:col-span-7">
          {selectedGap ? (
            <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-xl shadow-xl p-5 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E2E3F] pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold text-amber-400 bg-[#08121B] px-2 py-0.5 rounded border border-[#1E2E3F]">
                      {selectedGap.id.toUpperCase()}
                    </span>
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
                      {selectedGap.category.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-white font-sans">{selectedGap.title}</h2>
                </div>

                {/* Status Toggle Dropdown */}
                <div className="flex items-center gap-2 flex-shrink-0 font-mono">
                  <span className="text-slate-400 text-[11px]">{t('common.status')}:</span>
                  <select
                    value={selectedGap.status}
                    onChange={(e) => handleUpdateStatus(selectedGap.id, e.target.value as any)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#22364A] bg-[#08121B] text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="open">{t('common.open')}</option>
                    <option value="investigating">{t('common.pending')}</option>
                    <option value="addressed">{t('common.addressed')}</option>
                    <option value="dismissed">{t('common.closed')}</option>
                  </select>
                </div>
              </div>

              {/* Factual Description */}
              <div className="space-y-1">
                <span className="font-mono text-[11px] font-bold text-slate-300 block uppercase">
                  {t('gaps.descriptionLabel')}
                </span>
                <p className="p-3 bg-[#08121B] rounded-lg border border-[#1E2E3F] text-slate-200 leading-relaxed font-sans">
                  {selectedGap.description}
                </p>
              </div>

              {/* Why It Matters */}
              <div className="space-y-1">
                <span className="font-mono text-[11px] font-bold text-amber-400 block uppercase">
                  {t('gaps.significance')}
                </span>
                <p className="p-3 bg-[#0D1A27] rounded-lg border border-sky-900/60 text-slate-200 leading-relaxed font-sans">
                  {selectedGap.whyItMatters}
                </p>
              </div>

              {/* What Is Unknown */}
              <div className="space-y-1">
                <span className="font-mono text-[11px] font-bold text-rose-400 block uppercase">
                  {t('gaps.unknown')}
                </span>
                <p className="p-3 bg-rose-950/20 rounded-lg border border-rose-900/60 text-slate-200 leading-relaxed font-mono text-[11px]">
                  {selectedGap.whatIsUnknown}
                </p>
              </div>

              {/* Actionable Next Step */}
              <div className="space-y-1">
                <span className="font-mono text-[11px] font-bold text-emerald-400 block uppercase">
                  {t('gaps.reviewStep')}
                </span>
                <div className="p-3 bg-emerald-950/20 border border-emerald-900/70 rounded-lg text-emerald-300 font-medium flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                  <span className="text-slate-100 font-sans">{selectedGap.suggestedNextStep}</span>
                </div>
              </div>

              {/* Dismissal Reason Form if dismissed */}
              {selectedGap.status === 'dismissed' && (
                <div className="pt-3 border-t border-[#1E2E3F] space-y-2">
                  <label className="font-mono text-[11px] text-slate-400 block uppercase font-bold">
                    {t('gaps.dismissReason')}
                  </label>
                  <textarea
                    rows={2}
                    value={dismissalNote}
                    onChange={(e) => setDismissalNote(e.target.value)}
                    placeholder={t('gaps.dismissPlaceholder')}
                    className="w-full p-2.5 bg-[#08121B] border border-[#22364A] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    onClick={() => handleUpdateStatus(selectedGap.id, 'dismissed')}
                    className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded font-mono font-semibold text-xs"
                  >
                    {t('gaps.saveDismissal')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-xl p-12 text-center text-xs text-slate-400 font-mono shadow-xl">
              {t('gaps.selectPrompt')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
