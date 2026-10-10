'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useCase } from '@/context/CaseContext';
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
} from 'lucide-react';

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  person: { bg: '#EBF1F5', border: '#1E566C', text: '#172B35' },
  vehicle: { bg: '#EEF7FC', border: '#1F7DAD', text: '#172B35' },
  location: { bg: '#EBF5F0', border: '#2E7D5B', text: '#172B35' },
  device: { bg: '#FEF7EC', border: '#C07D2B', text: '#172B35' },
  organization: { bg: '#F4F7F9', border: '#5795A7', text: '#172B35' },
};

export default function RelationshipGraphPage() {
  const { activeCaseId, activeCase } = useCase();

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

    // Layout nodes in organized concentric or clustered pattern
    const centerX = 380;
    const centerY = 260;
    const radius = 240;

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
            <div className="p-2 text-left">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[9px] uppercase font-bold tracking-wider opacity-80">
                  {ent.category}
                </span>
                <span
                  className={`text-[8px] px-1 rounded font-semibold ${
                    ent.status === 'flagged' ? 'bg-[#FDEEEB] text-[#B84A39]' : 'bg-[#EBF5F0] text-[#2E7D5B]'
                  }`}
                >
                  {ent.status}
                </span>
              </div>
              <div className="font-bold text-xs leading-tight truncate">{ent.name}</div>
              <div className="text-[10px] text-text-secondary truncate mt-0.5 capitalize">
                {ent.role.replace('_', ' ')}
              </div>
            </div>
          ),
          rawEntity: ent,
        },
        style: {
          background: color.bg,
          border: `2px solid ${color.border}`,
          borderRadius: '8px',
          color: color.text,
          width: 175,
          boxShadow: '0 2px 5px rgba(23, 43, 53, 0.08)',
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
          stroke: isDisputed ? '#B84A39' : '#367589',
          strokeWidth: 2,
          strokeDasharray: isDisputed ? '4,4' : undefined,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isDisputed ? '#B84A39' : '#367589',
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
    <div className="space-y-4 max-w-7xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight flex items-center gap-2">
            <Network className="w-5 h-5 text-brand-steelBlue" />
            <span>Interactive Evidence Relationship Topology</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Evidence-backed relational graph mapping suspects, vehicles, keypads, and cell nodes for {activeCase?.referenceNumber}.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] bg-white border border-border-light px-3 py-1.5 rounded-lg shadow-subtle">
          <span className="font-semibold text-text-secondary">Legend:</span>
          <span className="flex items-center gap-1 text-text-primary">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E566C]" /> Person
          </span>
          <span className="flex items-center gap-1 text-text-primary">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1F7DAD]" /> Vehicle
          </span>
          <span className="flex items-center gap-1 text-text-primary">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D5B]" /> Location
          </span>
          <span className="flex items-center gap-1 text-text-primary">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C07D2B]" /> Device / Cell Mast
          </span>
        </div>
      </div>

      {/* Main Flow Canvas with Slide-out Inspector Panel */}
      <div className="flex-1 bg-white border border-border-light rounded-lg shadow-card relative overflow-hidden">
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
          <Background color="#D9E3E8" gap={20} size={1} />
          <Controls position="top-right" />
          <MiniMap
            nodeColor={(n) => {
              const cat = (n.data?.rawEntity as Entity)?.category;
              return CATEGORY_COLORS[cat]?.border || '#367589';
            }}
            style={{ width: 140, height: 100 }}
          />
        </ReactFlow>

        {/* Node Detail Inspector Slide-out */}
        {selectedEntity && (
          <div className="absolute top-4 right-4 w-80 bg-white border border-border-light rounded-lg shadow-modal p-4 text-xs z-40 max-h-[85%] overflow-y-auto space-y-3">
            <div className="flex items-start justify-between gap-2 border-b border-border-subtle pb-2">
              <div>
                <span className="text-[9px] uppercase font-mono font-bold text-brand-steelBlue block">
                  Entity Inspector
                </span>
                <h3 className="font-bold text-sm text-text-primary leading-tight">
                  {selectedEntity.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEntity(null)}
                className="text-text-muted hover:text-text-primary p-0.5 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-bg-main p-2 rounded">
                <span className="font-semibold text-text-secondary block">Category</span>
                <span className="capitalize font-medium text-text-primary">
                  {selectedEntity.category}
                </span>
              </div>
              <div className="bg-bg-main p-2 rounded">
                <span className="font-semibold text-text-secondary block">Role</span>
                <span className="capitalize font-medium text-text-primary">
                  {selectedEntity.role.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div>
              <span className="font-semibold text-[11px] text-text-secondary block mb-1">
                Investigative Notes
              </span>
              <p className="bg-bg-main/50 p-2.5 rounded border border-border-subtle text-text-primary leading-relaxed text-[11px]">
                {selectedEntity.notes || 'No investigative annotations on file.'}
              </p>
            </div>

            {selectedEntity.details && Object.keys(selectedEntity.details).length > 0 && (
              <div>
                <span className="font-semibold text-[11px] text-text-secondary block mb-1">
                  Metadata & Attributes
                </span>
                <div className="space-y-1 font-mono text-[10px] bg-bg-main p-2 rounded border border-border-subtle">
                  {Object.entries(selectedEntity.details).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2">
                      <span className="text-text-secondary capitalize">{k}:</span>
                      <span className="text-text-primary font-semibold truncate">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedEntity.sourceEvidenceIds && selectedEntity.sourceEvidenceIds.length > 0 && (
              <div>
                <span className="font-semibold text-[11px] text-text-secondary block mb-1">
                  Source Evidence References
                </span>
                <div className="space-y-1">
                  {selectedEntity.sourceEvidenceIds.map((evId) => {
                    const ev = evidenceList.find((e) => e.id === evId);
                    return (
                      <div
                        key={evId}
                        className="p-1.5 rounded bg-bg-highlight/40 border border-border-subtle flex items-center justify-between text-[11px]"
                      >
                        <span className="font-medium text-brand-deepTeal">
                          {ev ? ev.title : evId}
                        </span>
                        <span className="font-mono text-[9px] text-text-secondary uppercase">
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
          <div className="absolute top-4 right-4 w-80 bg-white border border-border-light rounded-lg shadow-modal p-4 text-xs z-40 space-y-3">
            <div className="flex items-start justify-between gap-2 border-b border-border-subtle pb-2">
              <div>
                <span className="text-[9px] uppercase font-mono font-bold text-brand-steelBlue block">
                  Relationship Proof
                </span>
                <h3 className="font-bold text-sm text-text-primary">
                  {selectedRelationship.label}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRelationship(null)}
                className="text-text-muted hover:text-text-primary p-0.5 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-bg-main p-2.5 rounded border border-border-subtle space-y-1">
              <span className="font-semibold text-text-secondary text-[11px]">Nature of Connection:</span>
              <p className="text-text-primary text-xs leading-relaxed">
                {selectedRelationship.description}
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-text-secondary font-medium">Verification Status:</span>
              <span
                className={`px-1.5 py-0.5 rounded uppercase font-semibold text-[9px] ${
                  selectedRelationship.verificationStatus === 'disputed'
                    ? 'bg-status-criticalBg text-status-critical'
                    : 'bg-status-successBg text-status-success'
                }`}
              >
                {selectedRelationship.verificationStatus}
              </span>
            </div>

            <div>
              <span className="font-semibold text-[11px] text-text-secondary block mb-1">
                Supporting Source Documents
              </span>
              <div className="space-y-1">
                {selectedRelationship.supportingEvidenceIds.map((evId) => (
                  <div
                    key={evId}
                    className="p-1.5 rounded bg-bg-highlight/40 border border-border-subtle flex items-center justify-between text-[11px]"
                  >
                    <span className="text-brand-deepTeal font-medium">Evidence Record</span>
                    <span className="font-mono text-[9px] text-text-secondary uppercase">{evId}</span>
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
