'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCase } from '@/context/CaseContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  EvidenceItem,
  ContradictionFinding,
  InvestigationGap,
  EventItem,
  Entity,
} from '@/types';
import {
  AlertTriangle,
  FileText,
  Search,
  ShieldCheck,
  Compass,
  MapPin,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { PCPC_TACTICAL_GEOPOINTS } from '@/lib/mapData';

const TacticalMapComponent = dynamic(
  () => import('@/components/map/TacticalMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[460px] w-full flex items-center justify-center bg-[#fbf9f5] border border-[#e2dcd2] rounded-xl text-xs font-mono text-[#64748b]">
        Loading PCPC GIS Grid…
      </div>
    ),
  }
);

export default function OverviewPage() {
  const { activeCaseId, activeCase, cases } = useCase();
  const { t, caseText } = useLanguage();

  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [contradictions, setContradictions] = useState<ContradictionFinding[]>([]);
  const [gaps, setGaps] = useState<InvestigationGap[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);

  useEffect(() => {
    const loadCaseData = async () => {
      if (!activeCaseId) return;

      try {
        const [evRes, cntrRes, gapRes, evtRes, entRes] = await Promise.all([
          fetch(`/api/cases/${activeCaseId}/evidence`).then((r) => r.json()),
          fetch(`/api/cases/${activeCaseId}/contradictions`).then((r) => r.json()),
          fetch(`/api/cases/${activeCaseId}/gaps`).then((r) => r.json()),
          fetch(`/api/cases/${activeCaseId}/events`).then((r) => r.json()),
          fetch(`/api/cases/${activeCaseId}/entities`).then((r) => r.json()),
        ]);

        if (evRes.success) setEvidence(evRes.data || []);
        if (cntrRes.success) setContradictions(cntrRes.data || []);
        if (gapRes.success) setGaps(gapRes.data || []);
        if (evtRes.success) setEvents(evtRes.data || []);
        if (entRes.success) setEntities(entRes.data || []);
      } catch (err) {
        console.error('Failed to load overview data:', err);
      }
    };

    loadCaseData();
  }, [activeCaseId]);

  const verifiedEvidence = evidence.filter((e) => e.verificationStatus === 'verified');
  const unresolvedContradictions = contradictions.filter(
    (item) => !['resolved', 'false_positive', 'insufficient_info'].includes(item.reviewStatus)
  );
  const openGaps = gaps.filter((item) => item.status === 'open' || item.status === 'investigating');
  const paceSignal = {
    activeCases: cases.filter((item) => item.status === 'active').length,
    evidenceItems: evidence.length,
    unverified: evidence.filter((item) => item.verificationStatus !== 'verified').length,
    openContradictions: unresolvedContradictions.length,
  };

  const investigations = cases.slice(0, 5).map((item) => ({
    id: item.referenceNumber,
    caseName: caseText(item.id, 'title', item.title),
    lead: item.leadInvestigator,
    evidence: item.id === activeCaseId ? evidence.length : null,
    activity: new Date(item.updatedAt).toLocaleDateString(),
    status: item.status,
  }));

  const alerts = [
    ...unresolvedContradictions.map((item) => ({
      label: item.title,
      tone: item.severity === 'high' ? 'alert' : 'warning',
      detail: item.explanation,
    })),
    ...openGaps.map((item) => ({
      label: item.title,
      tone: item.severity === 'critical' ? 'alert' : 'warning',
      detail: item.whatIsUnknown,
    })),
  ].slice(0, 3);

  const timeline = [...events]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(0, 5)
    .map((item) => ({
      time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: item.title,
      source: evidence.find((record) => record.id === item.sourceEvidenceId)?.title || item.location,
      confidence: `${Math.round(item.confidence * 100)}%`,
      status: item.verificationStatus.replace('_', ' '),
    }));

  return (
    <div className="mx-auto max-w-[1440px] pb-10 text-[#1d2430]">
      <div className="flex items-end justify-between gap-4 border-b border-[#e6dfd5] pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-[#667085]">
            <span>{t('dashboard.eyebrow')}</span>
            {activeCase && <span className="rounded border border-[#d4c9b7] bg-[#f7f3eb] px-2 py-1 tracking-normal">{activeCase.referenceNumber}</span>}
            {activeCase?.tags.includes('Illustrative Demo') && <span className="rounded border border-[#c8d2bd] bg-[#edf1e8] px-2 py-1 tracking-normal text-[#59694f]">Fictional demo</span>}
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#1d2430]">{t('dashboard.title')}</h1>
          <p className="mt-2 text-sm text-[#586370]">
            {t('dashboard.description')}
          </p>
        </div>

        <div className="rounded-xl border border-[#d9d1c8] bg-white px-3 py-2 text-[11px] font-mono text-[#475669] shadow-sm">
          AI recommends. Humans investigate. Humans decide.
        </div>
      </div>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: t('dashboard.activeCases'), value: paceSignal.activeCases, meta: `${cases.length} ${t('dashboard.registeredCases')}`, icon: ShieldCheck, accent: 'text-[#0284c7] bg-[#e0f2fe] border-[#bae6fd]' },
          { label: t('dashboard.evidence'), value: paceSignal.evidenceItems, meta: `${verifiedEvidence.length} ${t('dashboard.verified')}`, icon: FileText, accent: 'text-[#059669] bg-[#d1fae5] border-[#a7f3d0]' },
          { label: t('dashboard.unverified'), value: paceSignal.unverified, meta: t('dashboard.selectedCase'), icon: Search, accent: 'text-[#d97706] bg-[#fef3c7] border-[#fde68a]' },
          { label: t('dashboard.openFindings'), value: paceSignal.openContradictions, meta: `${openGaps.length} ${t('dashboard.openGaps')}`, icon: AlertTriangle, accent: 'text-[#dc2626] bg-[#fee2e2] border-[#fca5a5]' },
        ].map(({ label, value, meta, icon: Icon, accent }) => (
          <div key={label} className="rounded-2xl border border-[#c8d8e6] bg-[#f8fbfe]/90 p-4 shadow-[0_4px_20px_rgba(15,35,55,0.04)] backdrop-blur-md hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.12em] text-[#506e83]">
              <span>{label}</span>
              <div className={`p-1.5 rounded-lg border ${accent}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-[#0f2333]">{value}</div>
            <div className="mt-2 text-xs font-medium text-[#506e83]">{meta}</div>
          </div>
        ))}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1.8fr_0.9fr]">
        <div className="overflow-hidden rounded-2xl border border-[#c8d8e6] bg-[#f8fbfe]/90 shadow-[0_4px_24px_rgba(15,35,55,0.04)] backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-[#c8d8e6] px-4 py-3 bg-[#f1f6fa]">
            <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#506e83] font-bold">{t('dashboard.investigations')}</div>
            <Link href="/cases" className="text-xs font-semibold text-[#0284c7] hover:text-[#0369a1]">{t('action.viewAll')}</Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-[#eaf1f7] text-[10px] uppercase tracking-[0.14em] text-[#506e83] font-mono">
                <tr>
                  <th className="px-4 py-3 font-semibold">{t('dashboard.caseId')}</th>
                  <th className="px-4 py-3 font-semibold">{t('dashboard.caseName')}</th>
                  <th className="px-4 py-3 font-semibold">{t('dashboard.lead')}</th>
                  <th className="px-4 py-3 font-semibold">{t('dashboard.evidenceCount')}</th>
                  <th className="px-4 py-3 font-semibold">{t('dashboard.updated')}</th>
                  <th className="px-4 py-3 font-semibold">{t('dashboard.caseStatus')}</th>
                </tr>
              </thead>
              <tbody>
                {investigations.length > 0 ? investigations.map((item) => (
                  <tr key={item.id} className="border-t border-[#c8d8e6] text-sm text-[#0f2333] hover:bg-[#f1f6fa] transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[#0284c7]">{item.id}</td>
                    <td className="px-4 py-3 font-medium">{item.caseName}</td>
                    <td className="px-4 py-3 text-[#506e83]">{item.lead}</td>
                    <td className="px-4 py-3 font-mono text-[#506e83]">{item.evidence ?? '—'}</td>
                    <td className="px-4 py-3 text-[#506e83]">{item.activity}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-md border px-2 py-1 text-[10px] font-mono uppercase tracking-[0.12em] font-semibold ${item.status === 'active' ? 'border-[#a7f3d0] bg-[#ecfdf5] text-[#065f46]' : 'border-[#fde68a] bg-[#fffbeb] text-[#92400e]'}`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-[#648096]">{t('common.noData')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="self-start overflow-hidden rounded-2xl border border-[#c8d8e6] bg-[#f8fbfe]/90 shadow-[0_4px_24px_rgba(15,35,55,0.04)] backdrop-blur-md">
          <div className="border-b border-[#c8d8e6] px-4 py-3 text-[11px] font-mono uppercase tracking-[0.16em] text-[#506e83] font-bold bg-[#f1f6fa]">{t('dashboard.alerts')}</div>
          <div className="space-y-3 p-4">
            {alerts.length > 0 ? alerts.map((alert) => (
              <div key={alert.label} className="rounded-xl border border-[#c8d8e6] bg-[#ffffff] p-3 shadow-2xs hover:border-[#bae6fd] transition-colors">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#0f2333]">
                  <span className={`h-2.5 w-2.5 rounded-full ${alert.tone === 'warning' ? 'bg-[#f59e0b]' : alert.tone === 'alert' ? 'bg-[#ef4444]' : 'bg-[#10b981]'}`} />
                  {alert.label}
                </div>
                <div className="mt-2 text-xs text-[#506e83] leading-relaxed">{alert.detail}</div>
              </div>
            )) : <p className="px-1 py-3 text-sm text-[#648096]">{t('dashboard.noFindings')}</p>}
          </div>
        </aside>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="overflow-hidden rounded-2xl border border-[#e6dfd5] bg-white/85 shadow-[0_18px_35px_rgba(31,41,55,0.03)]">
          <div className="flex items-center justify-between border-b border-[#e6dfd5] px-4 py-3">
            <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#667085]">{t('dashboard.timeline')}</div>
            <Link href="/timeline" className="text-xs text-[#475669] hover:text-[#1d2430]">{t('dashboard.timelineLink')}</Link>
          </div>

          <div className="p-4">
            <div className="ml-1 space-y-4 border-l border-[#e6dfd5] pl-4">
              {timeline.length > 0 ? timeline.map((item) => (
                <div key={item.time} className="relative">
                  <div className="absolute -left-[1.4rem] top-1 h-2.5 w-2.5 rounded-full border border-[#aab3bb] bg-white" />
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-[72px] text-[10px] font-mono uppercase tracking-[0.12em] text-[#667085]">{item.time}</div>
                    <div className="flex-1">
                      <div className="text-sm text-[#1d2430]">{item.event}</div>
                      <div className="mt-1 text-[11px] text-[#586370]">{item.source}</div>
                    </div>
                    <div className="text-right text-[11px] text-[#586370]">
                      <div className="font-mono text-[#475669]">{item.confidence}</div>
                      <div className="mt-1 text-[#a26c2b]">{item.status}</div>
                    </div>
                  </div>
                </div>
              )) : <p className="py-3 text-sm text-[#767165]">{t('dashboard.noEvents')}</p>}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e6dfd5] bg-white/85 shadow-[0_18px_35px_rgba(31,41,55,0.03)]">
          <div className="border-b border-[#e6dfd5] px-4 py-3 text-[11px] font-mono uppercase tracking-[0.16em] text-[#667085]">{t('dashboard.relationships')}</div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {entities.length > 0 ? entities.slice(0, 6).map((node) => (
                <div key={node.id} className="rounded-xl border border-[#e6dfd5] bg-[#faf8f5] px-2 py-2 text-center text-[11px] text-[#586370]">
                  <span className="block truncate font-medium text-[#302f2a]">{node.name}</span>
                  <span className="mt-1 block capitalize">{node.category}</span>
                </div>
              )) : <p className="col-span-2 py-3 text-sm text-[#767165]">{t('dashboard.noEntities')}</p>}
            </div>
            <div className="mt-4 flex items-center justify-between text-[11px] text-[#586370]">
              <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#7e8f80]" /> {t('dashboard.connectedEntities')}</span>
              <Link href="/graph" className="text-[#475669]">{t('dashboard.openGraph')}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* PCPC Tactical GIS Section */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-[#e6dfd5] bg-white/85 shadow-[0_18px_35px_rgba(31,41,55,0.03)]">
        <div className="flex items-center justify-between border-b border-[#e6dfd5] px-4 py-3">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-[#667085]">
            <Compass className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>PCPC GIS Telemetry & Field Radar</span>
          </div>
          <Link href="/map" className="text-xs text-[#0284c7] hover:underline font-medium">
            Open Full Tactical Map &rarr;
          </Link>
        </div>
        <div className="p-4">
          <TacticalMapComponent
            markers={
              PCPC_TACTICAL_GEOPOINTS.filter((m) => m.caseId === activeCaseId).length > 0
                ? PCPC_TACTICAL_GEOPOINTS.filter((m) => m.caseId === activeCaseId)
                : PCPC_TACTICAL_GEOPOINTS
            }
            activeCaseTitle={activeCase?.title}
          />
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-2xl border border-[#e6dfd5] bg-white/85 shadow-[0_18px_35px_rgba(31,41,55,0.03)]">
          <div className="flex items-center justify-between border-b border-[#e6dfd5] px-4 py-3">
            <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#667085]">{t('dashboard.evidenceRepo')}</div>
            <Link href="/evidence" className="text-xs text-[#475669] hover:text-[#1d2430]">{t('dashboard.repositoryLink')}</Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#f7f4ef] text-[10px] uppercase tracking-[0.14em] text-[#667085] font-mono">
                <tr>
                  <th className="px-4 py-3 font-medium">{t('dashboard.evidenceId')}</th>
                  <th className="px-4 py-3 font-medium">{t('dashboard.type')}</th>
                  <th className="px-4 py-3 font-medium">{t('dashboard.source')}</th>
                  <th className="px-4 py-3 font-medium">{t('dashboard.verification')}</th>
                  <th className="px-4 py-3 font-medium">{t('dashboard.confidence')}</th>
                </tr>
              </thead>
              <tbody>
                {evidence.length > 0 ? evidence.slice(0, 5).map((item) => (
                  <tr key={item.id} className="border-t border-[#e6dfd5] text-[#1d2430]">
                    <td className="px-4 py-3 font-mono text-[#475669]">{item.id}</td>
                    <td className="px-4 py-3 capitalize">{item.evidenceType.replace('_', ' ')}</td>
                    <td className="max-w-[220px] truncate px-4 py-3 text-[#586370]">{item.recordedBy}</td>
                    <td className="px-4 py-3"><span className="inline-flex rounded-md border border-[#d9d1c8] bg-[#f8f5f1] px-2 py-1 text-[10px] font-mono capitalize text-[#475669]">{item.verificationStatus}</span></td>
                    <td className="px-4 py-3 font-mono text-[#475669]">{item.claims[0] ? `${Math.round(item.claims[0].confidence * 100)}%` : '—'}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-[#767165]">{t('dashboard.noEvidence')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e6dfd5] bg-white/85 shadow-[0_18px_35px_rgba(31,41,55,0.03)]">
          <div className="border-b border-[#e6dfd5] px-4 py-3 text-[11px] font-mono uppercase tracking-[0.16em] text-[#667085]">{t('dashboard.gaps')}</div>
          <div className="space-y-3 p-4">
            {openGaps.length > 0 ? openGaps.slice(0, 4).map((gap) => (
              <div key={gap.id} className="rounded-xl border border-[#e6dfd5] bg-[#faf8f5] p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-[#1d2430]">{gap.title}</div>
                  <span className={`h-2 w-2 rounded-full ${gap.severity === 'critical' ? 'bg-[#ad5a5a]' : 'bg-[#ba7b3d]'}`} />
                </div>
                <div className="mt-2 text-[11px] font-mono capitalize text-[#475669]">{gap.severity} priority</div>
                <div className="mt-2 text-xs text-[#586370]">{gap.whatIsUnknown}</div>
              </div>
            )) : <p className="py-3 text-sm text-[#767165]">{t('dashboard.noGaps')}</p>}
          </div>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-[#e6dfd5] bg-white/85 shadow-[0_18px_35px_rgba(31,41,55,0.03)]">
        <div className="flex items-center justify-between border-b border-[#e6dfd5] px-4 py-3">
          <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#667085]">{t('dashboard.ai')}</div>
          <Link href="/assistant" className="text-xs text-[#475669] hover:text-[#1d2430]">{t('dashboard.openAssistant')}</Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_0.8fr]">
          <div className="p-5">
            <div className="rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] p-4">
              <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#667085]">{t('dashboard.question')}</div>
              <div className="mt-3 text-lg text-[#1d2430]">{t('assistant.prompt.summary')}</div>
              <div className="mt-5 border-t border-[#e6dfd5] pt-4">
                <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#667085]">{t('dashboard.aiResponse')}</div>
                <div className="mt-2 text-sm leading-6 text-[#586370]">
                  {activeCase ? caseText(activeCase.id, 'summary', activeCase.summary) : t('header.noCase')}
                </div>
                <p className="mt-4 border-t border-[#e6dfd5] pt-3 text-xs leading-5 text-[#767165]">
                  {evidence.length === 0
                    ? t('dashboard.noEvidenceNotice')
                    : `${evidence.length} ${t('dashboard.evidenceNotice')} ${verifiedEvidence.length} ${t('dashboard.verifiedCount')}`}
                </p>
              </div>
            </div>
          </div>

          <div className="border-l border-[#e6dfd5] bg-[#f7f4ef] p-5">
            <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#667085]">{t('assistant.sources')}</div>
            <div className="mt-4 space-y-2 text-sm">
              {evidence.slice(0, 3).map((item) => (
                <div key={item.id} className="rounded-lg border border-[#d9d1c8] bg-white px-3 py-2 text-[11px] text-[#475669]">
                  <span className="font-mono">{item.id}</span>
                  <span className="ml-2">{item.title}</span>
                </div>
              ))}
              {evidence.length === 0 && <p className="text-xs text-[#767165]">{t('dashboard.noSources')}</p>}
            </div>
            <div className="mt-5 border-t border-[#e6dfd5] pt-4 text-sm">
              <div className="text-[#586370]">{t('common.status')}</div>
              <div className="mt-1 font-mono capitalize text-[#475669]">{activeCase?.status || 'Not selected'}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
