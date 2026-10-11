'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useCase } from '@/context/CaseContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Entity, EntityRelationship, EvidenceItem } from '@/types';
import {
  Network,
  Search,
  Filter,
  User,
  MapPin,
  Car,
  Smartphone,
  Building,
  CheckCircle2,
  AlertTriangle,
  FileText,
  X,
  ExternalLink,
  Crosshair,
  ShieldAlert,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Sliders,
} from 'lucide-react';

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  person: { bg: '#eee9df', border: '#9b8068', text: '#302f2a' },
  vehicle: { bg: '#e9eee9', border: '#7c8d7e', text: '#302f2a' },
  location: { bg: '#edf0e5', border: '#85916e', text: '#302f2a' },
  device: { bg: '#f3eadb', border: '#b18c5e', text: '#302f2a' },
  organization: { bg: '#efebe4', border: '#8d8172', text: '#302f2a' },
};

export default function RelationshipGraphPage() {
  const { activeCaseId, activeCase } = useCase();
  const { t } = useLanguage();

  const [entities, setEntities] = useState<Entity[]>([]);
  const [relationships, setRelationships] = useState<EntityRelationship[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [selectedRelationship, setSelectedRelationship] = useState<EntityRelationship | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Timeline playback state
  const [playbackIndex, setPlaybackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const fetchGraphData = async () => {
    if (!activeCaseId) return;
    try {
      setLoading(true);
      const [entRes, relRes, evRes] = await Promise.all([
        fetch(`/api/cases/${activeCaseId}/entities`).then((r) => r.json()),
        fetch(`/api/cases/${activeCaseId}/relationships`).then((r) => r.json()),
        fetch(`/api/cases/${activeCaseId}/evidence`).then((r) => r.json()),
      ]);

      if (entRes.success) setEntities(entRes.data || []);
      if (relRes.success) {
        const rels: EntityRelationship[] = relRes.data || [];
        setRelationships(rels);
        setPlaybackIndex(rels.length); // Default to full graph view
      }
      if (evRes.success) setEvidenceList(evRes.data || []);
    } catch (err) {
      console.error('Failed to load graph data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData();
  }, [activeCaseId]);

  // Handle Timeline Playback
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setPlaybackIndex((prev) => {
          if (prev >= relationships.length) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1600);
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, relationships.length]);

  // Construct React Flow Nodes & Edges dynamically based on filters & playback
  useEffect(() => {
    if (entities.length === 0) return;

    // Filter entities
    const filteredEntities = entities.filter((ent) => {
      const matchCategory = categoryFilter === 'all' || ent.category === categoryFilter;
      const matchStatus = statusFilter === 'all' || ent.status === statusFilter;
      const matchSearch =
        !searchTerm.trim() ||
        ent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ent.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchStatus && matchSearch;
    });

    const visibleEntityIds = new Set(filteredEntities.map((e) => e.id));

    // Slice relationships based on timeline playback slider
    const currentRelationships = relationships.slice(0, playbackIndex);

    // Active relationships are only those connecting visible entities
    const visibleRelationships = currentRelationships.filter(
      (rel) => visibleEntityIds.has(rel.sourceEntityId) && visibleEntityIds.has(rel.targetEntityId)
    );

    const centerX = 440;
    const centerY = 320;
    const radius = 260;

    const flowNodes: Node[] = filteredEntities.map((ent, i) => {
      const angle = (i / filteredEntities.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const color = CATEGORY_COLORS[ent.category] || CATEGORY_COLORS.person;
      const isSelected = selectedEntity?.id === ent.id;

      return {
        id: ent.id,
        position: { x, y },
        data: {
          label: (
            <div className="p-2.5 text-left text-slate-100">
              <div className="flex items-center justify-between gap-1 mb-1 font-mono">
                <span className="text-[9px] uppercase font-bold tracking-wider text-sky-400">
                  {ent.category}
                </span>
                <span
                  className={`text-[8px] px-1 py-0.2 rounded font-bold uppercase ${
                    ent.status === 'flagged'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {ent.status}
                </span>
              </div>
              <div className="font-bold text-xs leading-tight truncate text-white">{ent.name}</div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5 capitalize font-mono">
                {ent.role.replace('_', ' ')}
              </div>
            </div>
          ),
          rawEntity: ent,
        },
        style: {
          background: color.bg,
          border: isSelected ? '2.5px solid #0284c7' : `1.5px solid ${color.border}`,
          borderRadius: '10px',
          color: color.text,
          width: 185,
          boxShadow: isSelected
            ? '0 0 16px rgba(2, 132, 199, 0.6)'
            : '0 4px 12px rgba(0, 0, 0, 0.4)',
        },
      };
    });

    const flowEdges: Edge[] = visibleRelationships.map((rel, idx) => {
      const isDisputed = rel.verificationStatus === 'disputed';
      const isLatest = idx === visibleRelationships.length - 1 && isPlaying;

      return {
        id: rel.id,
        source: rel.sourceEntityId,
        target: rel.targetEntityId,
        label: rel.label,
        type: 'smoothstep',
        animated: isDisputed || isLatest,
        style: {
          stroke: isLatest ? '#38bdf8' : isDisputed ? '#dc2626' : '#829078',
          strokeWidth: isLatest ? 3 : 2,
          strokeDasharray: isDisputed ? '4,4' : undefined,
        },
        labelStyle: {
          fill: isLatest ? '#0284c7' : '#514d44',
          fontWeight: 700,
          fontSize: 10,
          fontFamily: 'monospace',
        },
        labelBgStyle: {
          fill: '#f7f3eb',
          fillOpacity: 0.96,
          stroke: isLatest ? '#38bdf8' : isDisputed ? '#dc2626' : '#d4c9b7',
          strokeWidth: 1,
          rx: 4,
          ry: 4,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isLatest ? '#38bdf8' : isDisputed ? '#dc2626' : '#829078',
          width: 16,
          height: 16,
        },
        data: { rawRel: rel },
      };
    });

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [entities, relationships, categoryFilter, statusFilter, searchTerm, playbackIndex, isPlaying, selectedEntity]);

  const onNodeClick = (_: any, node: Node) => {
    setSelectedRelationship(null);
    setSelectedEntity(node.data.rawEntity as Entity);
  };

  const onEdgeClick = (_: any, edge: Edge) => {
    setSelectedEntity(null);
    setSelectedRelationship(edge.data?.rawRel as EntityRelationship);
  };

  const activePlaybackRel =
    playbackIndex > 0 && playbackIndex <= relationships.length
      ? relationships[playbackIndex - 1]
      : null;

  return (
    <div className="space-y-4 max-w-7xl mx-auto h-[calc(100vh-6.5rem)] flex flex-col text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 font-bold border border-sky-800">
              {t('graph.title')}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              PCPC ENTITY & ASSET MAPPING
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Network className="w-5 h-5 text-sky-400" />
            <span>{t('graph.title')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Interactive multi-entity intelligence network with timeline relationship playback for {activeCase?.referenceNumber}.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono bg-[#0C1724] border border-[#1E2E3F] px-3 py-1.5 rounded-lg shadow-md">
          <span className="text-slate-400">{t('graph.legend')}:</span>
          <span className="flex items-center gap-1 text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Person
          </span>
          <span className="flex items-center gap-1 text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Vehicle
          </span>
          <span className="flex items-center gap-1 text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400" /> Location
          </span>
          <span className="flex items-center gap-1 text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Device/Tower
          </span>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-xl p-3 shadow-md flex flex-wrap items-center justify-between gap-3 flex-shrink-0 text-xs">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search entity, role or plate..."
            className="w-full pl-8 pr-3 py-1 bg-[#08121B] border border-[#22364A] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono text-slate-400 mr-1 uppercase font-semibold">
            Filter:
          </span>
          {[
            { id: 'all', label: 'All' },
            { id: 'person', label: 'Persons' },
            { id: 'vehicle', label: 'Vehicles' },
            { id: 'location', label: 'Locations' },
            { id: 'device', label: 'Devices' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-sky-600 text-white font-bold'
                  : 'bg-[#08121B] border border-[#22364A] text-slate-300 hover:bg-[#122131]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 bg-[#08121B] border border-[#22364A] rounded-lg text-[11px] font-mono text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="all">All Statuses</option>
            <option value="flagged">Flagged Only</option>
            <option value="verified">Verified Only</option>
          </select>
        </div>
      </div>

      {/* Main Flow Canvas with Slide-out Inspector Panel & Timeline Playback */}
      <div className="flex-1 bg-[#070E17] border border-[#1E2E3F] rounded-xl shadow-2xl relative overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          fitView
          minZoom={0.2}
          maxZoom={2.5}
          attributionPosition="bottom-left"
        >
          <Background color="#162738" gap={24} size={1} />
          <Controls position="top-right" className="bg-[#0C1724] border border-[#1E2E3F] text-white" />
          <MiniMap
            nodeColor={(n) => {
              const cat = (n.data?.rawEntity as Entity)?.category;
              return CATEGORY_COLORS[cat]?.border || '#0EA5E9';
            }}
            maskColor="rgba(7, 14, 23, 0.75)"
            style={{ width: 140, height: 100, backgroundColor: '#09121B', border: '1px solid #1E2E3F' }}
          />
        </ReactFlow>

        {/* Floating Timeline Playback Slider Bar */}
        <div className="absolute bottom-4 left-4 right-4 max-w-2xl mx-auto bg-[#0C1724]/95 backdrop-blur-md border border-[#22364A] rounded-2xl p-3 shadow-2xl z-30 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-bold text-white uppercase text-[11px]">
                Timeline Relationship Playback
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-300 font-bold">
                Step {playbackIndex} / {relationships.length}
              </span>
            </div>

            {activePlaybackRel && (
              <span className="text-[10px] text-slate-300 truncate max-w-xs font-sans">
                Active: <strong className="text-amber-400 font-mono">{activePlaybackRel.label}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Play/Pause Button */}
            <button
              onClick={() => {
                if (playbackIndex >= relationships.length) {
                  setPlaybackIndex(1);
                  setIsPlaying(true);
                } else {
                  setIsPlaying(!isPlaying);
                }
              }}
              className="p-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition-colors cursor-pointer shrink-0 shadow-md"
              title={isPlaying ? 'Pause Playback' : 'Play Timeline'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            {/* Reset Button */}
            <button
              onClick={() => {
                setIsPlaying(false);
                setPlaybackIndex(relationships.length);
              }}
              className="p-2 rounded-xl bg-[#122131] hover:bg-[#182b3f] border border-[#22364A] text-slate-300 transition-colors cursor-pointer shrink-0"
              title="Reset to Full Graph"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Slider */}
            <div className="flex-1 flex items-center gap-2">
              <input
                type="range"
                min="1"
                max={Math.max(1, relationships.length)}
                value={playbackIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  setPlaybackIndex(parseInt(e.target.value));
                }}
                className="w-full accent-sky-500 cursor-pointer h-1.5 bg-[#08121B] rounded-lg border border-[#22364A]"
              />
            </div>
          </div>
        </div>

        {/* Node Detail Inspector Slide-out */}
        {selectedEntity && (
          <div className="absolute top-4 right-4 w-84 bg-[#0C1724] border border-[#1E2E3F] rounded-xl shadow-2xl p-4 text-xs z-40 max-h-[85%] overflow-y-auto space-y-3 text-slate-100">
            <div className="flex items-start justify-between gap-2 border-b border-[#1E2E3F] pb-2">
              <div>
                <span className="text-[9px] uppercase font-mono font-bold text-sky-400 block">
                  {t('graph.inspector')}
                </span>
                <h3 className="font-bold text-sm text-white leading-tight font-sans">
                  {selectedEntity.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEntity(null)}
                className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="bg-[#08121B] p-2 rounded-lg border border-[#1E2E3F]">
                <span className="text-slate-400 block text-[10px]">{t('graph.category')}</span>
                <span className="capitalize font-bold text-sky-300">
                  {selectedEntity.category}
                </span>
              </div>
              <div className="bg-[#08121B] p-2 rounded-lg border border-[#1E2E3F]">
                <span className="text-slate-400 block text-[10px]">{t('graph.status')}</span>
                <span
                  className={`capitalize font-bold ${
                    selectedEntity.status === 'flagged' ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {selectedEntity.status}
                </span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] font-mono mb-1">{t('graph.role')}</span>
              <p className="bg-[#08121B] p-2 rounded-lg border border-[#1E2E3F] text-slate-200 capitalize font-mono text-[11px]">
                {selectedEntity.role.replace('_', ' ')}
              </p>
            </div>

            {selectedEntity.notes && (
              <div>
                <span className="text-slate-400 block text-[10px] font-mono mb-1">{t('graph.notes')}</span>
                <p className="bg-[#08121B] p-2.5 rounded-lg border border-[#1E2E3F] text-slate-300 leading-relaxed font-sans text-xs">
                  {selectedEntity.notes}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Edge Detail Inspector Slide-out */}
        {selectedRelationship && (
          <div className="absolute top-4 right-4 w-84 bg-[#0C1724] border border-[#1E2E3F] rounded-xl shadow-2xl p-4 text-xs z-40 max-h-[85%] overflow-y-auto space-y-3 text-slate-100">
            <div className="flex items-start justify-between gap-2 border-b border-[#1E2E3F] pb-2">
              <div>
                <span className="text-[9px] uppercase font-mono font-bold text-sky-400 block">
                  Relationship Link
                </span>
                <h3 className="font-bold text-sm text-white leading-tight font-sans">
                  {selectedRelationship.label}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRelationship(null)}
                className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#08121B] p-2.5 rounded-lg border border-[#1E2E3F] space-y-1">
              <span className="text-slate-400 block text-[10px] font-mono uppercase">Forensic Classification</span>
              <span className="text-xs font-bold text-amber-300 font-mono">
                {selectedRelationship.relationshipType.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {selectedRelationship.description && (
              <div>
                <span className="text-slate-400 block text-[10px] font-mono mb-1">Evidentiary Basis</span>
                <p className="bg-[#08121B] p-2.5 rounded-lg border border-[#1E2E3F] text-slate-300 leading-relaxed font-sans text-xs">
                  {selectedRelationship.description}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
