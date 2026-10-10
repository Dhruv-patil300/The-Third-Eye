'use client';

import React, { useEffect, useState } from 'react';
import { useCase } from '@/context/CaseContext';
import { useLanguage } from '@/context/LanguageContext';
import { AuditLog } from '@/types';
import {
  Settings,
  Shield,
  Database,
  RotateCcw,
  Sparkles,
  Key,
  CheckCircle2,
  AlertCircle,
  Clock,
  Terminal,
  Activity,
  Server,
  ShieldAlert,
} from 'lucide-react';

export default function SettingsPage() {
  const { activeCaseId, activeCase, resetToDemo } = useCase();
  const { t } = useLanguage();

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [geminiKey, setGeminiKey] = useState('');
  const [keySaved, setKeySaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAuditLogs = async () => {
    if (!activeCaseId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/cases/${activeCaseId}/audit`);
      const json = await res.json();
      if (json.success) {
        setAuditLogs(json.data || []);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [activeCaseId]);

  const handleResetDemo = async () => {
    if (confirm('Reset entire system database to the authentic Pimpri Chinchwad Police benchmark case (FIR No. 0389/2025 Wakad PS)?')) {
      setResetting(true);
      await resetToDemo();
      await fetchAuditLogs();
      setResetting(false);
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 4000);
    }
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-xs text-slate-100">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 font-bold border border-sky-800">
            {t('settings.title')}
          </span>
          <span className="text-[10px] font-mono text-slate-400">
              {t('nav.settings')}
          </span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-sky-400" />
          <span>{t('settings.title')}</span>
        </h1>
        <p className="text-slate-400 mt-1 font-sans">
          {t('settings.description')}
        </p>
      </div>

      {/* Grid: AI Provider & Storage Persistence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* AI Engine Configuration */}
        <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2E3F] pb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <h2 className="font-bold text-sm text-white font-mono uppercase">{t('settings.aiEngine')}</h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
              {t('settings.engineReady')}
            </span>
          </div>

          <div className="space-y-2 text-slate-300">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#08121B] border border-[#1E2E3F] font-mono">
              <span className="font-bold text-slate-200">{t('settings.primaryProvider')}:</span>
              <span className="text-sky-400 font-bold">{t('settings.localProvider')}</span>
            </div>
            <p className="text-[11px] leading-relaxed font-sans text-slate-300">
              {t('settings.description')}
            </p>
          </div>

          <form onSubmit={handleSaveKey} className="space-y-2 pt-2 border-t border-[#1E2E3F]">
            <label className="block font-mono text-[11px] font-bold text-slate-300 uppercase">
              {t('settings.apiKey')}
            </label>
            <div className="flex gap-2 font-mono">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="flex-1 px-2.5 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 text-xs focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold text-xs shadow-md"
              >
                {t('settings.apply')}
              </button>
            </div>
            {keySaved && (
              <span className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{t('settings.saved')}</span>
              </span>
            )}
          </form>
        </div>

        {/* Database & Storage */}
        <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2E3F] pb-2.5">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-400" />
              <h2 className="font-bold text-sm text-white font-mono uppercase">{t('settings.storage')}</h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-sky-950/80 text-sky-300 border border-sky-800">
              ATOMIC DISK DB
            </span>
          </div>

          <div className="space-y-2 text-[11px] text-slate-300">
            <div className="p-2.5 bg-[#08121B] rounded-lg border border-[#1E2E3F] space-y-1 font-mono text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-400">{t('settings.storagePath')}:</span>
                <span className="text-sky-300 font-semibold">./data/storage.json</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t('settings.lock')}:</span>
                <span className="text-emerald-400 font-bold">Active Mutex (Atomic Rename)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t('settings.activeCase')}:</span>
                <span className="text-slate-200 font-bold">{activeCase?.referenceNumber}</span>
              </div>
            </div>
            <p className="leading-relaxed font-sans text-slate-300">
              {t('settings.persistence')}
            </p>
          </div>

          <div className="pt-2 border-t border-[#1E2E3F] flex items-center justify-between">
            <div>
              <span className="font-bold text-white block font-mono text-[11px]">{t('settings.resetTitle')}</span>
              <span className="text-[10px] text-slate-400">{t('settings.resetDescription')}</span>
            </div>
            <button
              onClick={handleResetDemo}
              disabled={resetting}
              className="px-3 py-1.5 bg-[#122030] border border-[#22364A] hover:bg-[#182b3e] text-slate-200 rounded-lg font-mono font-semibold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
              <span>{resetting ? t('settings.resetting') : t('settings.reset')}</span>
            </button>
          </div>
          {resetSuccess && (
            <div className="p-2 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[11px] font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('settings.restored')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Forensic Audit Log Table */}
      <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-[#1E2E3F] pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <h2 className="font-bold text-sm text-white font-mono uppercase">
              {t('settings.audit')} ({auditLogs.length} {t('settings.events')})
            </h2>
          </div>
          <span className="text-[10px] font-mono text-sky-400">
            Case: {activeCase?.referenceNumber}
          </span>
        </div>

        <div className="border border-[#1E2E3F] rounded-lg overflow-hidden">
          <table className="w-full text-left font-mono">
            <thead className="bg-[#08121B] text-[10px] uppercase font-bold text-slate-400 border-b border-[#1E2E3F]">
              <tr>
                <th className="p-2.5">{t('settings.logId')}</th>
                <th className="p-2.5">{t('settings.timestamp')}</th>
                <th className="p-2.5">{t('settings.action')}</th>
                <th className="p-2.5">{t('settings.actor')}</th>
                <th className="p-2.5">{t('settings.details')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A2A3A] text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#101D2B]">
                  <td className="p-2.5 text-[10px] text-slate-400">{log.id.toUpperCase()}</td>
                  <td className="p-2.5 text-slate-300">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-2.5 font-bold text-sky-400">{log.action}</td>
                  <td className="p-2.5 text-slate-200 font-sans">{log.actor}</td>
                  <td className="p-2.5 text-slate-300 font-sans">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
