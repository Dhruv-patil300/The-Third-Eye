'use client';

import React, { useState } from 'react';
import { useCase } from '@/context/CaseContext';
import { useLanguage } from '@/context/LanguageContext';
import { Case } from '@/types';
import {
  Briefcase,
  Plus,
  Search,
  Calendar,
  MapPin,
  User,
  Shield,
  FolderOpen,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Archive,
  ShieldCheck,
} from 'lucide-react';

export default function CasesPage() {
  const { t, caseText } = useLanguage();
  const {
    cases,
    activeCaseId,
    setActiveCaseId,
    setShowNewCaseModal,
    refreshCases,
  } = useCase();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingCase, setEditingCase] = useState<Case | null>(null);

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.incidentLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCase) return;

    try {
      const res = await fetch(`/api/cases/${editingCase.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCase),
      });
      if (res.ok) {
        await refreshCases();
        setEditingCase(null);
      }
    } catch (err) {
      console.error('Update case failed:', err);
    }
  };

  const handleDeleteCase = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete case "${title}"? All associated evidence, timeline events, and contradictions will be removed.`)) {
      try {
        const res = await fetch(`/api/cases/${id}`, { method: 'DELETE' });
        if (res.ok) {
          await refreshCases();
        }
      } catch (err) {
        console.error('Delete case failed:', err);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 font-bold border border-sky-800">
              {t('cases.title')}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {t('cases.description')}
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-sky-400" />
            <span>{t('cases.title')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            {t('cases.description')}
          </p>
        </div>

        <button
          onClick={() => setShowNewCaseModal(true)}
          className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md flex items-center gap-2 self-start sm:self-auto font-mono"
        >
          <Plus className="w-4 h-4" />
          <span>{t('cases.register')}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-xl p-4 shadow-md flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-84">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('cases.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto font-mono text-[11px]">
          <span className="text-slate-400">{t('common.status')}:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-[#22364A] rounded-lg bg-[#0E1A27] text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="all">{t('common.all')} ({cases.length})</option>
            <option value="active">{t('common.active')}</option>
            <option value="archived">{t('common.archived')}</option>
            <option value="closed">{t('common.closed')}</option>
          </select>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCases.map((c) => {
          const isActive = c.id === activeCaseId;
          return (
            <div
              key={c.id}
              className={`bg-[#0C1724] rounded-xl border transition-all flex flex-col justify-between p-5 shadow-xl ${
                isActive
                  ? 'border-sky-500 ring-2 ring-sky-500/20 bg-[#122030]'
                  : 'border-[#1E2E3F] hover:border-sky-500/60 hover:bg-[#101D2B]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-[10px] font-bold text-sky-400 bg-[#08121B] px-2 py-0.5 rounded border border-[#1E2E3F]">
                    {c.referenceNumber}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold border ${
                        c.priority === 'high'
                          ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                          : 'bg-[#08121B] text-slate-400 border-[#1E2E3F]'
                      }`}
                    >
                      {t(`priority.${c.priority}`)}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold border ${
                        c.status === 'active'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                          : 'bg-[#08121B] text-slate-400 border-[#1E2E3F]'
                      }`}
                    >
                      {t(`common.${c.status}`)}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-white leading-snug mt-1 font-sans">
                  {caseText(c.id, 'title', c.title)}
                </h3>

                <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed font-sans">
                  {caseText(c.id, 'summary', c.summary || t('common.noData'))}
                </p>

                <div className="mt-4 pt-3 border-t border-[#1E2E3F] space-y-1.5 text-[11px] text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-sky-400 flex-shrink-0" />
                    <span className="truncate text-slate-300">{caseText(c.id, 'location', c.incidentLocation)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-sky-400 flex-shrink-0" />
                    <span>{new Date(c.incidentDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-sky-400 flex-shrink-0" />
                    <span className="text-slate-300">{c.leadInvestigator}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-[#1E2E3F] flex items-center justify-between font-mono text-xs">
                {isActive ? (
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t('cases.activeWorkspace')}
                  </span>
                ) : (
                  <button
                    onClick={() => setActiveCaseId(c.id)}
                    className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold"
                  >
                    {t('cases.setActive')} →
                  </button>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingCase(c)}
                    className="p-1 text-slate-400 hover:text-sky-400 rounded transition-colors"
                    title="Edit Case Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {cases.length > 1 && (
                    <button
                      onClick={() => handleDeleteCase(c.id, c.title)}
                      className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors"
                      title="Delete Case"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Case Modal */}
      {editingCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
          <div className="bg-[#0C1724] rounded-xl border border-[#1E2E3F] shadow-2xl w-full max-w-lg overflow-hidden text-xs text-slate-100">
            <div className="px-5 py-3 bg-[#0F1B2A] border-b border-[#1E2E3F] flex items-center justify-between font-mono">
              <h3 className="font-bold text-white uppercase">{t('cases.editTitle')}</h3>
              <button
                onClick={() => setEditingCase(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateCase} className="p-5 space-y-3">
              <div>
                <label className="block font-mono text-[11px] mb-1 text-slate-300">{t('cases.titleField')} *</label>
                <input
                  type="text"
                  value={editingCase.title}
                  onChange={(e) => setEditingCase({ ...editingCase, title: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] mb-1 text-slate-300">{t('cases.referenceField')} *</label>
                  <input
                    type="text"
                    value={editingCase.referenceNumber}
                    onChange={(e) => setEditingCase({ ...editingCase, referenceNumber: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] mb-1 text-slate-300">{t('cases.statusField')}</label>
                  <select
                    value={editingCase.status}
                    onChange={(e) => setEditingCase({ ...editingCase, status: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 font-mono"
                  >
                    <option value="active">{t('common.active')}</option>
                    <option value="archived">{t('common.archived')}</option>
                    <option value="closed">{t('common.closed')}</option>
                    <option value="cold">{t('common.cold')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] mb-1 text-slate-300">{t('cases.locationField')}</label>
                <input
                  type="text"
                  value={editingCase.incidentLocation}
                  onChange={(e) => setEditingCase({ ...editingCase, incidentLocation: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] mb-1 text-slate-300">{t('cases.ioField')}</label>
                <input
                  type="text"
                  value={editingCase.leadInvestigator}
                  onChange={(e) => setEditingCase({ ...editingCase, leadInvestigator: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] mb-1 text-slate-300">{t('cases.summaryField')}</label>
                <textarea
                  rows={3}
                  value={editingCase.summary}
                  onChange={(e) => setEditingCase({ ...editingCase, summary: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 focus:outline-none focus:border-sky-500 font-sans"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#1E2E3F]">
                <button
                  type="button"
                  onClick={() => setEditingCase(null)}
                  className="px-3 py-1.5 border border-[#22364A] rounded-lg text-slate-400 hover:text-white"
                >
                  {t('action.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-mono font-semibold"
                >
                  {t('cases.update')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
