'use client';

import React, { useEffect, useState } from 'react';
import { useCase } from '@/context/CaseContext';
import {
  Case,
  EvidenceItem,
  EventItem,
  Entity,
  ContradictionFinding,
  InvestigationGap,
} from '@/types';
import {
  FileBarChart,
  Printer,
  Download,
  CheckSquare,
  Square,
  ShieldAlert,
  FileText,
  Clock,
  AlertTriangle,
  Search,
  Building,
} from 'lucide-react';

export default function ReportsPage() {
  const { activeCaseId, activeCase } = useCase();

  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [contradictions, setContradictions] = useState<ContradictionFinding[]>([]);
  const [gaps, setGaps] = useState<InvestigationGap[]>([]);
  const [loading, setLoading] = useState(true);

  // Section inclusion options
  const [includeOverview, setIncludeOverview] = useState(true);
  const [includeEvidence, setIncludeEvidence] = useState(true);
  const [includeTimeline, setIncludeTimeline] = useState(true);
  const [includeContradictions, setIncludeContradictions] = useState(true);
  const [includeEntities, setIncludeEntities] = useState(true);
  const [includeGaps, setIncludeGaps] = useState(true);
  const [includeMethodology, setIncludeMethodology] = useState(true);

  useEffect(() => {
    if (!activeCaseId) return;
    const loadAll = async () => {
      try {
        setLoading(true);
        const [evRes, evtRes, entRes, cntrRes, gapRes] = await Promise.all([
          fetch(`/api/cases/${activeCaseId}/evidence`).then((r) => r.json()),
          fetch(`/api/cases/${activeCaseId}/events`).then((r) => r.json()),
          fetch(`/api/cases/${activeCaseId}/entities`).then((r) => r.json()),
          fetch(`/api/cases/${activeCaseId}/contradictions`).then((r) => r.json()),
          fetch(`/api/cases/${activeCaseId}/gaps`).then((r) => r.json()),
        ]);

        if (evRes.success) setEvidence(evRes.data || []);
        if (evtRes.success) {
          const sorted = (evtRes.data || []).sort(
            (a: EventItem, b: EventItem) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          setEvents(sorted);
        }
        if (entRes.success) setEntities(entRes.data || []);
        if (cntrRes.success) setContradictions(cntrRes.data || []);
        if (gapRes.success) setGaps(gapRes.data || []);
      } catch (err) {
        console.error('Failed to load report data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, [activeCaseId]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const reportData = {
      dossierTitle: `Investigative Dossier: ${activeCase?.referenceNumber}`,
      generatedAt: new Date().toISOString(),
      case: activeCase,
      evidenceSummary: evidence,
      timelineEvents: events,
      entities,
      flaggedContradictions: contradictions,
      investigationGaps: gaps,
      doctrine: 'AI recommends. Humans investigate. Humans decide.',
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Case_Dossier_${activeCase?.referenceNumber || 'Export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-slate-100">
      {/* Controls Ribbon (hidden during print) */}
      <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-xl p-5 shadow-2xl no-print space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 font-bold border border-sky-800">
                PROSECUTION CHARGESHEET DOSSIER
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                WAKAD PS // PCPC
              </span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <FileBarChart className="w-5 h-5 text-sky-400" />
              <span>Investigative Dossier & Report Generator</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Assemble certified intelligence briefs, chronological exhibits, and analytical triage records for Case{' '}
              <span className="font-semibold text-slate-200 font-mono">{activeCase?.referenceNumber}</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 bg-[#122131] hover:bg-[#182b3f] border border-[#22364A] text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors font-mono"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md font-mono"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Section Selectors */}
        <div className="pt-3 border-t border-[#1E2E3F]">
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
            Select Dossier Exhibits to Include:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeOverview}
                onChange={(e) => setIncludeOverview(e.target.checked)}
                className="rounded border-border-light text-brand-deepTeal"
              />
              <span>Case Overview</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeEvidence}
                onChange={(e) => setIncludeEvidence(e.target.checked)}
                className="rounded border-border-light text-brand-deepTeal"
              />
              <span>Evidence Inventory</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTimeline}
                onChange={(e) => setIncludeTimeline(e.target.checked)}
                className="rounded border-border-light text-brand-deepTeal"
              />
              <span>Timeline Sequence</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeContradictions}
                onChange={(e) => setIncludeContradictions(e.target.checked)}
                className="rounded border-border-light text-brand-deepTeal"
              />
              <span>Contradiction Analysis</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeEntities}
                onChange={(e) => setIncludeEntities(e.target.checked)}
                className="rounded border-border-light text-brand-deepTeal"
              />
              <span>Entities & Roles</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeGaps}
                onChange={(e) => setIncludeGaps(e.target.checked)}
                className="rounded border-border-light text-brand-deepTeal"
              />
              <span>Investigation Gaps</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeMethodology}
                onChange={(e) => setIncludeMethodology(e.target.checked)}
                className="rounded border-border-light text-brand-deepTeal"
              />
              <span>Doctrine & Limitations</span>
            </label>
          </div>
        </div>
      </div>

      {/* Rendered Printable Dossier Document */}
      <div className="bg-white border border-border-light rounded-lg shadow-card p-8 md:p-12 space-y-8 text-text-primary text-xs print:p-0 print:border-0 print:shadow-none font-serif">
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
          <div>
            <div className="text-[10px] tracking-widest uppercase font-mono font-bold text-sky-800">
              PIMPRI CHINCHWAD POLICE COMMISSIONERATE • WAKAD POLICE STATION
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1 font-sans">
              INVESTIGATIVE CASE DOSSIER // CHARGESHEET BRIEF
            </h1>
            <div className="text-xs text-slate-600 mt-1 font-mono">
              Reference: <strong className="text-slate-900">{activeCase?.referenceNumber}</strong> | Security Level: RESTRICTED // LAW ENFORCEMENT SENSITIVE
            </div>
          </div>
          <div className="text-right text-[11px] text-slate-600 font-mono">
            <div>Date: {new Date().toLocaleDateString()}</div>
            <div>Time: {new Date().toLocaleTimeString()}</div>
            <div className="text-sky-800 font-semibold">Status: {activeCase?.status?.toUpperCase()}</div>
          </div>
        </div>

        {/* Section 1: Case Overview */}
        {includeOverview && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-deepTeal border-b border-border-light pb-1 font-sans">
              1. Case Overview & Incident Summary
            </h2>
            <div className="grid grid-cols-2 gap-4 bg-bg-main p-4 rounded text-xs font-sans">
              <div>
                <span className="font-semibold text-text-secondary block">Case Title:</span>
                <span className="font-bold text-text-primary">{activeCase?.title}</span>
              </div>
              <div>
                <span className="font-semibold text-text-secondary block">Jurisdiction / Location:</span>
                <span>{activeCase?.incidentLocation}</span>
              </div>
              <div>
                <span className="font-semibold text-text-secondary block">Incident Timestamp:</span>
                <span>{activeCase?.incidentDate ? new Date(activeCase.incidentDate).toLocaleString() : 'N/A'}</span>
              </div>
              <div>
                <span className="font-semibold text-text-secondary block">Lead Investigating Officer:</span>
                <span>{activeCase?.leadInvestigator}</span>
              </div>
            </div>
            <div className="p-4 bg-bg-main/50 rounded border border-border-subtle leading-relaxed">
              <strong className="block mb-1 font-sans">Executive Summary:</strong>
              <p className="text-text-primary">{activeCase?.summary}</p>
            </div>
          </section>
        )}

        {/* Section 2: Evidence Inventory */}
        {includeEvidence && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-deepTeal border-b border-border-light pb-1 font-sans">
              2. Evidence Vault Inventory & Chain of Custody
            </h2>
            <table className="w-full text-left border border-border-light font-sans text-xs">
              <thead className="bg-bg-main text-[10px] uppercase font-semibold text-text-secondary">
                <tr>
                  <th className="p-2.5 border-b border-border-light">ID</th>
                  <th className="p-2.5 border-b border-border-light">Classification</th>
                  <th className="p-2.5 border-b border-border-light">Title & Provenance</th>
                  <th className="p-2.5 border-b border-border-light">Integrity Hash</th>
                  <th className="p-2.5 border-b border-border-light">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {evidence.map((item) => (
                  <tr key={item.id} className="hover:bg-bg-main/30">
                    <td className="p-2.5 font-mono text-[10px] font-bold text-brand-deepTeal">{item.id}</td>
                    <td className="p-2.5 capitalize">{item.evidenceType.replace('_', ' ')}</td>
                    <td className="p-2.5">
                      <div className="font-semibold text-text-primary">{item.title}</div>
                      <div className="text-[10px] text-text-secondary">{item.sourceDescription}</div>
                    </td>
                    <td className="p-2.5 font-mono text-[9px] text-text-muted">{item.fileHash?.slice(0, 14)}...</td>
                    <td className="p-2.5 uppercase text-[10px] font-semibold">{item.verificationStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Section 3: Timeline Reconstruction */}
        {includeTimeline && (
          <section className="space-y-3 print-page-break">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-deepTeal border-b border-border-light pb-1 font-sans">
              3. Chronological Event Sequence
            </h2>
            <div className="space-y-3 font-sans">
              {events.map((ev) => (
                <div key={ev.id} className="p-3 bg-bg-main/40 rounded border border-border-subtle text-xs">
                  <div className="flex items-center justify-between font-bold text-text-primary">
                    <span>
                      {ev.timeDisplay} — {ev.title}
                    </span>
                    <span className="text-[10px] font-mono capitalize text-brand-steelBlue">
                      [{ev.timePrecision}]
                    </span>
                  </div>
                  <p className="text-text-secondary mt-1">{ev.description}</p>
                  <div className="mt-2 text-[10px] text-text-muted flex items-center justify-between">
                    <span>Location: {ev.location}</span>
                    <span>Source: {ev.sourceEvidenceId}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 4: Contradiction Analysis */}
        {includeContradictions && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-deepTeal border-b border-border-light pb-1 font-sans">
              4. Evidence Contradictions & Claim Discrepancies
            </h2>
            <div className="space-y-4 font-sans">
              {contradictions.map((c) => (
                <div key={c.id} className="p-4 rounded border border-border-light bg-bg-main/20 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text-primary">{c.title}</span>
                    <span className="text-[9px] uppercase px-2 py-0.5 rounded font-semibold bg-status-criticalBg text-status-critical border border-status-criticalBorder">
                      {c.severity} Severity
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="bg-white p-2.5 rounded border border-border-subtle">
                      <span className="font-bold text-brand-deepTeal block">Claim A ({c.claimA.speakerOrSource}):</span>
                      <p className="italic text-text-primary mt-1">"{c.claimA.excerpt}"</p>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-border-subtle">
                      <span className="font-bold text-brand-deepTeal block">Claim B ({c.claimB.speakerOrSource}):</span>
                      <p className="italic text-text-primary mt-1">"{c.claimB.excerpt}"</p>
                    </div>
                  </div>

                  <p className="text-text-secondary leading-relaxed">{c.explanation}</p>

                  <div className="text-[11px] bg-white p-2.5 rounded border border-border-subtle">
                    <strong className="text-text-primary block mb-1">Non-Deceptive Alternatives Evaluated:</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-text-secondary">
                      {c.alternativeExplanations.map((alt, i) => (
                        <li key={i}>{alt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 5: Investigation Gaps */}
        {includeGaps && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-deepTeal border-b border-border-light pb-1 font-sans">
              5. Outstanding Investigation Gaps & Recommended Next Steps
            </h2>
            <div className="space-y-3 font-sans">
              {gaps.map((g) => (
                <div key={g.id} className="p-3 bg-bg-main/30 rounded border border-border-subtle text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text-primary">{g.title}</span>
                    <span className="text-[10px] uppercase font-mono font-semibold text-brand-steelBlue">{g.status}</span>
                  </div>
                  <p className="text-text-secondary">{g.description}</p>
                  <div className="text-[11px] text-text-primary font-medium bg-white p-2 rounded border border-border-subtle">
                    <strong>Recommended Operational Step: </strong> {g.suggestedNextStep}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 6: Methodology & Limitations */}
        {includeMethodology && (
          <section className="pt-6 border-t-2 border-brand-deepTeal space-y-2 font-sans text-[11px] text-text-secondary">
            <div className="flex items-center gap-1.5 font-bold text-text-primary">
              <ShieldAlert className="w-4 h-4 text-brand-steelBlue" />
              <span>Operational Philosophy & AI Admissibility Limitation Notice</span>
            </div>
            <p className="leading-relaxed">
              This dossier has been generated via <strong>The Third Eye Investigation Intelligence System</strong>.
              In accordance with system policy: <em>"AI recommends. Humans investigate. Humans decide."</em>
              Analytical inferences, timeline reconstructions, and contradiction flags are analytical decision-support aids
              derived strictly from ingested records. They do not constitute formal judicial determinations of guilt, intent, or culpability.
              All technical evidence pings and witness statements require primary source corroboration prior to filing charge sheets.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
