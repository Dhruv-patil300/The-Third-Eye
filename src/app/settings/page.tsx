'use client';

import React, { useEffect, useState } from 'react';
import { useCase } from '@/context/CaseContext';
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
} from 'lucide-react';

export default function SettingsPage() {
  const { activeCaseId, activeCase, resetToDemo } = useCase();

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
    if (confirm('Reset entire system database to the reference demonstration benchmark?')) {
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
    <div className="space-y-6 max-w-5xl mx-auto text-xs">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-text-primary tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand-steelBlue" />
          <span>System Settings & Forensic Audit Trail</span>
        </h1>
        <p className="text-text-secondary mt-1">
          Configure analytical runtime adapters, review system integrity logs, and manage persistent storage.
        </p>
      </div>

      {/* Grid: AI Provider & Storage Persistence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* AI Engine Configuration */}
        <div className="bg-white border border-border-light rounded-lg p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-steelBlue" />
              <h2 className="font-bold text-sm text-text-primary">Analytical AI Engine</h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-status-successBg text-status-success border border-status-successBorder">
              Engine Ready
            </span>
          </div>

          <div className="space-y-2 text-text-secondary">
            <div className="flex items-center justify-between p-2 rounded bg-bg-main border border-border-subtle">
              <span className="font-medium text-text-primary">Primary Provider:</span>
              <span className="font-mono text-brand-deepTeal font-semibold">Local Deterministic Engine</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              The local engine extracts named entities, timestamps, vehicle plates, and PIN credentials with zero external network latency and complete evidentiary air-gapping.
            </p>
          </div>

          <form onSubmit={handleSaveKey} className="space-y-2 pt-2 border-t border-border-subtle">
            <label className="block font-medium text-text-primary">
              Optional Google Gemini API Key
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="flex-1 px-2.5 py-1.5 border border-border-light rounded text-xs focus:outline-none focus:border-brand-steelBlue font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-brand-deepTeal hover:bg-brand-darkSteelTeal text-white rounded font-medium text-xs shadow-subtle"
              >
                Apply
              </button>
            </div>
            {keySaved && (
              <span className="text-[10px] text-status-success font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Configuration noted in runtime memory.</span>
              </span>
            )}
          </form>
        </div>

        {/* Database & Storage */}
        <div className="bg-white border border-border-light rounded-lg p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-brand-steelBlue" />
              <h2 className="font-bold text-sm text-text-primary">Evidentiary Persistence</h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-bg-highlight text-brand-deepTeal border border-border-subtle">
              Atomic Disk DB
            </span>
          </div>

          <div className="space-y-2 text-[11px] text-text-secondary">
            <div className="p-2.5 bg-bg-main rounded border border-border-subtle space-y-1 font-mono text-[10px]">
              <div className="flex justify-between">
                <span>Storage Path:</span>
                <span className="text-text-primary">./data/storage.json</span>
              </div>
              <div className="flex justify-between">
                <span>Integrity Lock:</span>
                <span className="text-status-success font-semibold">Active Mutex (Atomic Rename)</span>
              </div>
              <div className="flex justify-between">
                <span>Active Isolation:</span>
                <span className="text-text-primary">{activeCase?.referenceNumber}</span>
              </div>
            </div>
            <p className="leading-relaxed">
              Every newly uploaded evidence item, created entity, or changed contradiction status is safely persisted to disk.
            </p>
          </div>

          <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
            <div>
              <span className="font-medium text-text-primary block">Reset Benchmark</span>
              <span className="text-[10px] text-text-secondary">Restore the reference Greenwood Jewellers case.</span>
            </div>
            <button
              onClick={handleResetDemo}
              disabled={resetting}
              className="px-3 py-1.5 bg-white border border-border-light hover:bg-bg-main text-text-primary rounded font-medium flex items-center gap-1.5 shadow-subtle disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
              <span>{resetting ? 'Resetting...' : 'Reset Data'}</span>
            </button>
          </div>
          {resetSuccess && (
            <div className="p-2 rounded bg-status-successBg text-status-success border border-status-successBorder text-[11px] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Demonstration dataset benchmark restored successfully.</span>
            </div>
          )}
        </div>
      </div>

      {/* Forensic Audit Log Table */}
      <div className="bg-white border border-border-light rounded-lg p-5 shadow-card space-y-3">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-steelBlue" />
            <h2 className="font-bold text-sm text-text-primary">
              Immutable Case Audit Log ({auditLogs.length} Events)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-text-secondary">
            Case: {activeCase?.referenceNumber}
          </span>
        </div>

        <div className="border border-border-light rounded overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-bg-main text-[10px] uppercase font-semibold text-text-secondary">
              <tr>
                <th className="p-2.5 border-b border-border-light">Log ID</th>
                <th className="p-2.5 border-b border-border-light">Timestamp</th>
                <th className="p-2.5 border-b border-border-light">Action Event</th>
                <th className="p-2.5 border-b border-border-light">Actor / Officer</th>
                <th className="p-2.5 border-b border-border-light">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-bg-main/40">
                  <td className="p-2.5 text-[10px] text-text-muted">{log.id}</td>
                  <td className="p-2.5 text-text-secondary">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-2.5 font-bold text-brand-deepTeal">{log.action}</td>
                  <td className="p-2.5 text-text-primary font-sans">{log.actor}</td>
                  <td className="p-2.5 text-text-primary font-sans">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
