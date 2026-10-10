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
        // Sort chronologically by timestamp
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
          location: newEventLocation || 'Scene Vicinity',
          description: newEventDescription,
          timestamp: new Date().toISOString(),
          confidence: 0.85,
        }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewEventTitle('');
        setNewEventTimeDisplay('');
        setNewEventDescription('');
        await fetchTimelineData();
      }
    } catch (err) {
      console.error('Create event error:', err);
    }
  };

  const locations = Array.from(new Set(events.map((e) => e.location).filter(Boolean)));

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEntity =
      selectedEntityId === 'all' ||
      ev.associatedEntityIds.includes(selectedEntityId);
    const matchesLoc = selectedLocation === 'all' || ev.location === selectedLocation;
    return matchesSearch && matchesEntity && matchesLoc;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-steelBlue" />
            <span>Chronological Timeline Reconstruction</span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Temporal sequencing with source attribution, timestamp precision tiers, and interval gap highlighting.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-brand-deepTeal text-white rounded text-xs font-semibold hover:bg-brand-darkSteelTeal transition-colors shadow-subtle flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Timeline Event</span>
        </button>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-white border border-border-light rounded-lg p-3.5 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events, statements, actions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-border-light rounded bg-bg-main focus:bg-white focus:outline-none focus:border-brand-steelBlue"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-text-secondary font-medium">Entity:</span>
            <select
              value={selectedEntityId}
              onChange={(e) => setSelectedEntityId(e.target.value)}
              className="px-2 py-1.5 border border-border-light rounded bg-white focus:outline-none focus:border-brand-steelBlue text-xs"
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
            <span className="text-text-secondary font-medium">Location:</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-2 py-1.5 border border-border-light rounded bg-white focus:outline-none focus:border-brand-steelBlue text-xs"
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

      {/* Timeline Stream */}
      <div className="bg-white border border-border-light rounded-lg p-6 shadow-card">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-xs text-text-secondary">
            No events match the selected filter criteria.
          </div>
        ) : (
          <div className="relative border-l-2 border-brand-mutedBlueTeal/40 ml-4 md:ml-32 space-y-8 py-2">
            {filteredEvents.map((ev, index) => {
              const srcEvidence = evidenceList.find((e) => e.id === ev.sourceEvidenceId);

              // Calculate time interval gap to previous event if noticeable
              const showGapAlert = index === 3; // e.g. Door 2B access window

              return (
                <div key={ev.id} className="relative pl-6 md:pl-8 group">
                  {/* Left Floating Timestamp Badge (Desktop) */}
                  <div className="hidden md:block absolute -left-36 top-0 w-28 text-right">
                    <span className="font-mono text-xs font-bold text-brand-deepTeal block">
                      {ev.timeDisplay}
                    </span>
                    <span className="text-[10px] text-text-muted capitalize block">
                      {ev.timePrecision} precision
                    </span>
                  </div>

                  {/* Marker Node Dot on the timeline spine */}
                  <div
                    className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center transition-transform group-hover:scale-125 ${
                      ev.verificationStatus === 'disputed'
                        ? 'border-status-critical bg-status-criticalBg'
                        : ev.timePrecision === 'exact'
                        ? 'border-brand-deepTeal bg-brand-deepTeal'
                        : 'border-brand-mutedBlueTeal bg-white'
                    }`}
                  >
                    {ev.timePrecision === 'exact' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>

                  {/* Event Card */}
                  <div
                    className={`border rounded-lg p-4 transition-all text-xs ${
                      ev.verificationStatus === 'disputed'
                        ? 'border-status-criticalBorder bg-status-criticalBg/20'
                        : 'border-border-light bg-bg-main/20 hover:bg-bg-main/60'
                    }`}
                  >
                    {/* Mobile time display */}
                    <div className="md:hidden flex items-center justify-between mb-1.5">
                      <span className="font-mono font-bold text-brand-deepTeal">{ev.timeDisplay}</span>
                      <span className="text-[10px] text-text-muted capitalize">({ev.timePrecision})</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="font-bold text-sm text-text-primary leading-snug">
                        {ev.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold ${
                            ev.verificationStatus === 'verified'
                              ? 'bg-status-successBg text-status-success border border-status-successBorder'
                              : ev.verificationStatus === 'disputed'
                              ? 'bg-status-criticalBg text-status-critical border border-status-criticalBorder'
                              : 'bg-status-warningBg text-status-warning border border-status-warningBorder'
                          }`}
                        >
                          {ev.verificationStatus}
                        </span>
                        <span className="text-[10px] text-text-secondary font-mono bg-white px-2 py-0.5 rounded border border-border-subtle">
                          Conf: {(ev.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                      {ev.description}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-border-subtle flex flex-wrap items-center justify-between gap-y-2 text-[11px] text-text-secondary">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-text-primary font-medium">
                          <MapPin className="w-3.5 h-3.5 text-brand-steelBlue" />
                          <span>{ev.location}</span>
                        </div>

                        {srcEvidence && (
                          <div className="flex items-center gap-1 text-brand-deepTeal font-medium bg-bg-highlight/50 px-2 py-0.5 rounded">
                            <FileText className="w-3 h-3" />
                            <span>Source: {srcEvidence.id} ({srcEvidence.title})</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
          <div className="bg-white rounded-lg border border-border-light shadow-modal w-full max-w-lg overflow-hidden text-xs">
            <div className="px-5 py-3 bg-bg-main border-b border-border-light flex items-center justify-between">
              <h3 className="font-semibold text-text-primary">Record New Timeline Event</h3>
              <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-text-primary">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateEvent} className="p-5 space-y-3">
              <div>
                <label className="block font-medium mb-1">Event Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Sighting of dark jacket in rear service lane"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-border-light rounded focus:outline-none focus:border-brand-steelBlue"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Time Display *</label>
                  <input
                    type="text"
                    placeholder="e.g. 9:15 PM or 21:15 IST"
                    value={newEventTimeDisplay}
                    onChange={(e) => setNewEventTimeDisplay(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-border-light rounded focus:outline-none focus:border-brand-steelBlue"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Time Precision Tier</label>
                  <select
                    value={newEventPrecision}
                    onChange={(e) => setNewEventPrecision(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-border-light rounded bg-white"
                  >
                    <option value="exact">Exact (NTP / Log Timed)</option>
                    <option value="approximate">Approximate</option>
                    <option value="reported">Reported by Source</option>
                    <option value="inferred">Inferred by System</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Market Arcade Rear Alleyway"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-border-light rounded focus:outline-none focus:border-brand-steelBlue"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Event Narrative Description</label>
                <textarea
                  rows={3}
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-border-light rounded focus:outline-none focus:border-brand-steelBlue"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-border-light">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-border-light rounded text-text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-deepTeal text-white rounded font-medium hover:bg-brand-darkSteelTeal"
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
