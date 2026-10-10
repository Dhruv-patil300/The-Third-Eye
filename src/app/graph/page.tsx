'use client';

import React, { useEffect, useState } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

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
      if (relRes.success) setRelationships(relRes.data || []);
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

  // Construct React Flow Nodes & Edges deterministically
  useEffect(() => {
    if (entities.length === 0) return;

    const centerX = 420;
    const centerY = 300;
    const radius = 250;

    const flowNodes: Node[] = entities.map((ent, i) => {
      const angle = (i / entities.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const color = CATEGORY_COLORS[ent.category] || CATEGORY_COLORS.person;

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
                    ent.status === 'flagged' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
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
          border: `1.5px solid ${color.border}`,
          borderRadius: '10px',
          color: color.text,
          width: 185,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        },
      };
    });

    const flowEdges: Edge[] = relationships.map((rel) => {
      const isDisputed = rel.verificationStatus === 'disputed';
      return {
        id: rel.id,
        source: rel.sourceEntityId,
        target: rel.targetEntityId,
        label: rel.label,
        type: 'smoothstep',
        animated: isDisputed,
        style: {
          stroke: isDisputed ? '#a45f56' : '#829078',
          strokeWidth: 2,
          strokeDasharray: isDisputed ? '4,4' : undefined,
        },
        labelStyle: {
          fill: '#514d44',
          fontWeight: 600,
          fontSize: 10,
          fontFamily: 'monospace',
        },
        labelBgStyle: {
          fill: '#f7f3eb',
          fillOpacity: 0.96,
          stroke: isDisputed ? '#a45f56' : '#d4c9b7',
          strokeWidth: 1,
          rx: 4,
          ry: 4,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isDisputed ? '#a45f56' : '#829078',
          width: 16,
          height: 16,
        },
        data: { rawRel: rel },
      };
    });

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [entities, relationships]);

  const onNodeClick = (_: any, node: Node) => {
    setSelectedRelationship(null);
    setSelectedEntity(node.data.rawEntity as Entity);
  };

  const onEdgeClick = (_: any, edge: Edge) => {
    setSelectedEntity(null);
    setSelectedRelationship(edge.data?.rawRel as EntityRelationship);
  };

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
            {t('graph.description')} {activeCase?.referenceNumber}.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono bg-[#0C1724] border border-[#1E2E3F] px-3 py-1.5 rounded-lg shadow-md">
          <span className="text-slate-400">{t('graph.legend')}:</span>
          <span className="flex items-center gap-1 text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> {t('graph.person')}
          </span>
          <span className="flex items-center gap-1 text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> {t('graph.vehicle')}
          </span>
          <span className="flex items-center gap-1 text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> {t('graph.location')}
          </span>
          <span className="flex items-center gap-1 text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Device / Tower
          </span>
        </div>
      </div>

      {/* Main Flow Canvas with Slide-out Inspector Panel */}
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
                className="text-slate-400 hover:text-white p-0.5 rounded"
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
              <span className="font-mono text-[10px] font-bold text-slate-400 block mb-1 uppercase">
                {t('graph.annotations')}
              </span>
              <p className="bg-[#08121B] p-2.5 rounded-lg border border-[#1E2E3F] text-slate-200 leading-relaxed text-[11px] font-sans">
                {selectedEntity.notes || t('graph.noAnnotations')}
              </p>
            </div>

            {selectedEntity.details && Object.keys(selectedEntity.details).length > 0 && (
              <div>
                <span className="font-mono text-[10px] font-bold text-slate-400 block mb-1 uppercase">
                  {t('graph.metadata')}
                </span>
                <div className="space-y-1 font-mono text-[10px] bg-[#08121B] p-2 rounded-lg border border-[#1E2E3F]">
                  {Object.entries(selectedEntity.details).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2">
                      <span className="text-slate-400 capitalize">{k}:</span>
                      <span className="text-sky-300 font-semibold truncate">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedEntity.sourceEvidenceIds && selectedEntity.sourceEvidenceIds.length > 0 && (
              <div>
                <span className="font-mono text-[10px] font-bold text-slate-400 block mb-1 uppercase">
                  {t('graph.sourceEvidence')}
                </span>
                <div className="space-y-1">
                  {selectedEntity.sourceEvidenceIds.map((evId) => {
                    const ev = evidenceList.find((e) => e.id === evId);
                    return (
                      <div
                        key={evId}
                        className="p-1.5 rounded bg-[#0F1B2A] border border-[#1E2E3F] flex items-center justify-between text-[11px]"
                      >
                        <span className="font-medium text-slate-200 truncate">
                          {ev ? ev.title : evId}
                        </span>
                        <span className="font-mono text-[9px] text-sky-400 uppercase font-bold flex-shrink-0 ml-2">
                          {evId}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Edge Detail Inspector Slide-out */}
        {selectedRelationship && (
          <div className="absolute top-4 right-4 w-84 bg-[#0C1724] border border-[#1E2E3F] rounded-xl shadow-2xl p-4 text-xs z-40 space-y-3 text-slate-100">
            <div className="flex items-start justify-between gap-2 border-b border-[#1E2E3F] pb-2">
              <div>
                <span className="text-[9px] uppercase font-mono font-bold text-sky-400 block">
                  {t('graph.relationshipProof')}
                </span>
                <h3 className="font-bold text-sm text-white font-sans">
                  {selectedRelationship.label}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRelationship(null)}
                className="text-slate-400 hover:text-white p-0.5 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#08121B] p-2.5 rounded-lg border border-[#1E2E3F] space-y-1">
              <span className="font-mono text-[10px] text-slate-400 uppercase block font-bold">
                {t('graph.connection')}:
              </span>
              <p className="text-slate-200 text-xs leading-relaxed font-sans">
                {selectedRelationship.description}
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Verification Status:</span>
              <span
                className={`px-1.5 py-0.5 rounded uppercase font-bold text-[9px] border ${
                  selectedRelationship.verificationStatus === 'disputed'
                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                }`}
              >
                {selectedRelationship.verificationStatus}
              </span>
            </div>

            <div>
              <span className="font-mono text-[10px] font-bold text-slate-400 block mb-1 uppercase">
                Supporting Source Documents
              </span>
              <div className="space-y-1">
                {selectedRelationship.supportingEvidenceIds.map((evId) => (
                  <div
                    key={evId}
                    className="p-1.5 rounded bg-[#0F1B2A] border border-[#1E2E3F] flex items-center justify-between text-[11px]"
                  >
                    <span className="text-slate-200 font-medium">Evidence Record</span>
                    <span className="font-mono text-[9px] text-sky-400 uppercase font-bold">{evId}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
