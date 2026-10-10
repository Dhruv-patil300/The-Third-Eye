'use client';

import React, { useEffect, useState } from 'react';
import { useCase } from '@/context/CaseContext';
import { EventItem, Entity, EvidenceItem } from '@/types';
import {
  Clock,
  Plus,
  Search,
  Filter,
  MapPin,
  FileText,
  User,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  X,
  Sparkles,
  Radio,
  Crosshair,
} from 'lucide-react';

export default function TimelinePage() {
  const { activeCaseId, activeCase } = useCase();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTimeDisplay, setNewEventTimeDisplay] = useState('');
  const [newEventPrecision, setNewEventPrecision] = useState<'exact' | 'approximate' | 'reported' | 'inferred'>('reported');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');

  const fetchTimelineData = async () => {
    if (!activeCaseId) return;
    try {
      setLoading(true);
      const [evtRes, entRes, evRes] = await Promise.all([
        fetch(`/api/cases/${activeCaseId}/events`).then((r) => r.json()),
        fetch(`/api/cases/${activeCaseId}/entities`).then((r) => r.json()),
        fetch(`/api/cases/${activeCaseId}/evidence`).then((r) => r.json()),
      ]);

      if (evtRes.success) {
        const sorted = (evtRes.data || []).sort(
          (a: EventItem, b: EventItem) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setEvents(sorted);
      }
      if (entRes.success) setEntities(entRes.data || []);
      if (evRes.success) setEvidenceList(evRes.data || []);
    } catch (err) {
      console.error('Failed to load timeline data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelineData();
  }, [activeCaseId]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventTimeDisplay) return;

    try {
      const res = await fetch(`/api/cases/${activeCaseId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newEventTitle,
          timeDisplay: newEventTimeDisplay,
          timePrecision: newEventPrecision,
          location: newEventLocation || 'Unknown',
          description: newEventDescription || '',
          timestamp: new Date().toISOString(),
          associatedEntityIds: [],
          sourceEvidenceId: '',
          verificationStatus: 'verified',
          confidence: 0.95,
        }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewEventTitle('');
        setNewEventTimeDisplay('');
        setNewEventLocation('');
        setNewEventDescription('');
        await fetchTimelineData();
      }
    } catch (err) {
      console.error('Failed to create timeline event:', err);
    }
  };

  // Filter events
  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEntity =
      selectedEntityId === 'all' || ev.associatedEntityIds.includes(selectedEntityId);
    const matchesLocation =
      selectedLocation === 'all' || ev.location.toLowerCase().includes(selectedLocation.toLowerCase());
    return matchesSearch && matchesEntity && matchesLocation;
  });

  const locations = Array.from(new Set(events.map((e) => e.location))).filter(Boolean);

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 font-bold border border-sky-800">
              POLICE CHRONOLOGY RECONSTRUCTION
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              TIME-SPATIAL TRAJECTORY MATRIX
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-400" />
            <span>Chronological Incident Reconstruction</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Forensic temporal sequencing across Pimpri Chinchwad grid: Wakad, Dange Chowk, Bhumkar Chowk, Pimple Saudagar, and Somatane Toll.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Timeline Node</span>
        </button>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-xl p-3.5 shadow-md flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events, statements, actions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Tracked Entity:</span>
            <select
              value={selectedEntityId}
              onChange={(e) => setSelectedEntityId(e.target.value)}
              className="px-2.5 py-1.5 border border-[#22364A] rounded-lg bg-[#0E1A27] text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Entities ({entities.length})</option>
              {entities.map((ent) => (
                <option key={ent.id} value={ent.id}>
                  {ent.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Sector / Location:</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-2.5 py-1.5 border border-[#22364A] rounded-lg bg-[#0E1A27] text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Locations ({locations.length})</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Timeline Stream Spine */}
      <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-xl p-6 shadow-xl">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400 font-mono">
            No events match the selected filter criteria.
          </div>
        ) : (
          <div className="relative border-l-2 border-sky-500/30 ml-4 md:ml-36 space-y-8 py-2">
            {filteredEvents.map((ev, index) => {
              const srcEvidence = evidenceList.find((e) => e.id === ev.sourceEvidenceId);

              return (
                <div key={ev.id} className="relative pl-6 md:pl-8 group">
                  {/* Left Floating Timestamp Badge (Desktop) */}
                  <div className="hidden md:block absolute -left-40 top-0 w-32 text-right">
                    <span className="font-mono text-xs font-bold text-sky-400 block">
                      {ev.timeDisplay}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize font-mono block">
                      {ev.timePrecision} precision
                    </span>
                  </div>

                  {/* Marker Node Dot on the timeline spine */}
                  <div
                    className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-125 shadow-md ${
                      ev.verificationStatus === 'debunked' || ev.verificationStatus === 'disputed'
                        ? 'border-rose-500 bg-rose-950 text-rose-400'
                        : ev.timePrecision === 'exact'
                        ? 'border-sky-400 bg-sky-500 text-white'
                        : 'border-slate-500 bg-[#08121B]'
                    }`}
                  >
                    {ev.timePrecision === 'exact' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>

                  {/* Event Card */}
                  <div
                    className={`border rounded-xl p-4 transition-all text-xs shadow-md ${
                      ev.verificationStatus === 'debunked' || ev.verificationStatus === 'disputed'
                        ? 'border-rose-900/80 bg-rose-950/20'
                        : 'border-[#1E2E3F] bg-[#0E1A27] hover:bg-[#122232]'
                    }`}
                  >
                    {/* Mobile time display */}
                    <div className="md:hidden flex items-center justify-between mb-1.5 font-mono">
                      <span className="font-bold text-sky-400">{ev.timeDisplay}</span>
                      <span className="text-[10px] text-slate-400 capitalize">({ev.timePrecision})</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="font-bold text-sm text-white leading-snug font-sans">
                        {ev.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold ${
                            ev.verificationStatus === 'verified'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                              : ev.verificationStatus === 'disputed' || ev.verificationStatus === 'debunked'
                              ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                              : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {ev.verificationStatus}
                        </span>
                        <span className="text-[10px] text-slate-300 font-mono bg-[#08121B] px-2 py-0.5 rounded border border-[#1E2E3F]">
                          Conf: {(ev.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-sans">
                      {ev.description}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-[#1E2E3F] flex flex-wrap items-center justify-between gap-y-2 text-[11px] text-slate-400 font-mono">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-slate-200 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-sky-400" />
                          <span>{ev.location}</span>
                        </div>

                        {srcEvidence && (
                          <div className="flex items-center gap-1 text-sky-300 font-medium bg-sky-950/60 border border-sky-800/60 px-2 py-0.5 rounded">
                            <FileText className="w-3 h-3" />
                            <span>Source: {srcEvidence.id.toUpperCase()} ({srcEvidence.title})</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
          <div className="bg-[#0C1724] rounded-xl border border-[#1E2E3F] shadow-2xl w-full max-w-lg overflow-hidden text-xs text-slate-100">
            <div className="px-5 py-3 bg-[#0F1B2A] border-b border-[#1E2E3F] flex items-center justify-between">
              <h3 className="font-bold text-white font-mono uppercase">Record New Timeline Event</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateEvent} className="p-5 space-y-3">
              <div>
                <label className="block font-mono text-[11px] mb-1 text-slate-300">Event Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Sighting of dark jacket in rear service lane"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] mb-1 text-slate-300">Time Display *</label>
                  <input
                    type="text"
                    placeholder="e.g. 22:36 IST"
                    value={newEventTimeDisplay}
                    onChange={(e) => setNewEventTimeDisplay(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] mb-1 text-slate-300">Precision Tier</label>
                  <select
                    value={newEventPrecision}
                    onChange={(e) => setNewEventPrecision(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100"
                  >
                    <option value="exact">Exact (NTP / Log Timed)</option>
                    <option value="approximate">Approximate</option>
                    <option value="reported">Reported by Source</option>
                    <option value="inferred">Inferred by System</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-mono text-[11px] mb-1 text-slate-300">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Dange Chowk Junction"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] mb-1 text-slate-300">Event Narrative Description</label>
                <textarea
                  rows={3}
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-[#1E2E3F]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-[#22364A] rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-mono font-semibold"
                >
                  Save Timeline Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
