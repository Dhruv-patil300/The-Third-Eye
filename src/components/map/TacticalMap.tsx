'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapMarker } from '@/lib/mapData';
import {
  Compass,
  MapPin,
  ExternalLink,
  Camera,
  Car,
  Radio,
  AlertTriangle,
  User,
  Shield,
  Layers,
  ZoomIn,
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface TacticalMapProps {
  markers: MapMarker[];
  activeCaseTitle?: string;
  selectedMarkerId?: string | null;
  onSelectMarker?: (marker: MapMarker) => void;
}

export default function TacticalMapComponent({
  markers,
  activeCaseTitle,
  selectedMarkerId,
  onSelectMarker,
}: TacticalMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const leafletMarkersRef = useRef<{ [key: string]: any }>({});
  const polylineRef = useRef<any>(null);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selected, setSelected] = useState<MapMarker | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const filteredMarkers = markers.filter((m) => {
    if (activeCategory === 'all') return true;
    return m.category === activeCategory;
  });

  useEffect(() => {
    let isMounted = true;

    async function initLeaflet() {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const L = (await import('leaflet')).default;
      if (!isMounted || !mapContainerRef.current) return;

      // Fix default Leaflet icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const defaultCenter: [number, number] =
        markers.length > 0 ? [markers[0].latitude, markers[0].longitude] : [18.6298, 73.7997];

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 13,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | PCPC Tactical GIS Command',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      renderMarkers(L, map);
    }

    initLeaflet();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync markers whenever markers array changes (e.g. user selects another case in Header)
  useEffect(() => {
    async function updateMarkers() {
      if (!mapInstanceRef.current) return;
      const L = (await import('leaflet')).default;
      renderMarkers(L, mapInstanceRef.current);
      if (markers.length > 0) {
        setSelected(markers[0]);
      }
    }
    updateMarkers();
  }, [markers, activeCategory]);

  function getMarkerBadgeColor(cat: string, disputed?: boolean) {
    if (disputed) return '#dc2626'; // Red for debunked alibi
    switch (cat) {
      case 'crime_scene':
        return '#0284c7'; // Navy/Blue
      case 'tower':
        return '#7c3aed'; // Purple
      case 'anpr':
        return '#059669'; // Emerald
      case 'seizure':
        return '#ea580c'; // Amber
      default:
        return '#475569';
    }
  }

  function renderMarkers(L: any, map: any) {
    // Clear old markers
    Object.values(leafletMarkersRef.current).forEach((marker) => marker.remove());
    leafletMarkersRef.current = {};

    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    if (filteredMarkers.length === 0) return;

    const bounds = L.latLngBounds([]);
    const polylineCoords: [number, number][] = [];

    filteredMarkers.forEach((marker) => {
      bounds.extend([marker.latitude, marker.longitude]);
      polylineCoords.push([marker.latitude, marker.longitude]);

      const color = getMarkerBadgeColor(marker.category, marker.disputed);
      const isSelected = selected?.id === marker.id || selectedMarkerId === marker.id;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;">
            <div style="position: absolute; width: ${isSelected ? '38px' : '28px'}; height: ${isSelected ? '38px' : '28px'}; background-color: ${color}; opacity: 0.25; border-radius: 9999px; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: ${isSelected ? '26px' : '22px'}; height: ${isSelected ? '26px' : '22px'}; background-color: ${color}; border: 2.5px solid #ffffff; border-radius: 9999px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3); display: flex; align-items: center; justify-content: center;">
              <div style="width: 7px; height: 7px; background-color: #ffffff; border-radius: 9999px;"></div>
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const leafletMarker = L.marker([marker.latitude, marker.longitude], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          setSelected(marker);
          onSelectMarker?.(marker);
        });

      // Tooltip with photo thumbnail if available
      const thumbnailHtml = marker.photoUrl
        ? `<div style="margin-top: 4px; border-radius: 4px; overflow: hidden; width: 140px; height: 80px;"><img src="${marker.photoUrl}" style="width: 100%; height: 100%; object-fit: cover; display: block;" /></div>`
        : '';

      leafletMarker.bindTooltip(
        `<div style="font-family: sans-serif; font-size: 11px;">
          <strong style="color: #0f172a;">${marker.title}</strong>
          <div style="font-size: 10px; color: #64748b; margin-top: 2px;">${marker.locationName}</div>
          ${thumbnailHtml}
        </div>`,
        { direction: 'top', offset: [0, -12] }
      );

      leafletMarkersRef.current[marker.id] = leafletMarker;
    });

    // Draw connection trail between locations for chronological movement
    if (polylineCoords.length > 1) {
      polylineRef.current = L.polyline(polylineCoords, {
        color: '#0284c7',
        weight: 3,
        opacity: 0.65,
        dashArray: '6, 8',
      }).addTo(map);
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
    }
  }

  function handleFlyTo(marker: MapMarker) {
    setSelected(marker);
    onSelectMarker?.(marker);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([marker.latitude, marker.longitude], 16, { duration: 1.2 });
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[760px] bg-[#fbf9f5] border border-[#e2dcd2] rounded-xl p-3 shadow-xs">
      {/* Sidebar List of Geopoints & Evidence Links */}
      <div className="w-full lg:w-[420px] flex flex-col bg-white border border-[#e2dcd2] rounded-lg p-3 overflow-hidden shadow-xs">
        <div className="pb-3 border-b border-[#eef2f6]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#0284c7]" />
              <h3 className="font-semibold text-xs tracking-wider uppercase text-[#1e293b]">
                PCPC Tactical GIS Telemetry
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f1f5f9] text-[#475569] font-medium border border-[#e2e8f0]">
              {filteredMarkers.length} Nodes in Case
            </span>
          </div>
          {activeCaseTitle && (
            <p className="text-[11px] text-[#0284c7] font-medium truncate mt-1">
              Case: {activeCaseTitle}
            </p>
          )}

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-1 mt-2.5">
            {[
              { id: 'all', label: 'All Locations' },
              { id: 'crime_scene', label: 'Crime Scene' },
              { id: 'tower', label: 'Cell Towers' },
              { id: 'anpr', label: 'ANPR Gates' },
              { id: 'suspect_seen', label: 'Alibi Check' },
              { id: 'seizure', label: 'Seizures' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`text-[10px] px-2 py-1 rounded-md transition-all font-medium ${
                  activeCategory === tab.id
                    ? 'bg-[#0f172a] text-white shadow-xs'
                    : 'bg-[#f8fafc] text-[#475569] hover:bg-[#e2e8f0] border border-[#e2e8f0]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Marker Card Feed */}
        <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1">
          {filteredMarkers.map((marker) => {
            const isSelected = selected?.id === marker.id;
            const badgeColor = getMarkerBadgeColor(marker.category, marker.disputed);

            return (
              <div
                key={marker.id}
                onClick={() => handleFlyTo(marker)}
                className={`p-3 rounded-lg border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'border-[#0284c7] bg-[#f0f9ff] shadow-sm ring-1 ring-[#0284c7]/20'
                    : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:bg-[#f8fafc]'
                }`}
              >
                {/* Image Banner if available */}
                {marker.photoUrl && (
                  <div className="mb-2 relative h-28 rounded-md overflow-hidden border border-slate-200">
                    <img
                      src={marker.photoUrl}
                      alt={marker.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-1.5 left-2 right-2 text-[10px] text-white font-sans truncate">
                      {marker.photoCaption}
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: badgeColor }}
                    />
                    <h4 className="text-xs font-semibold text-[#1e293b] leading-tight line-clamp-1">
                      {marker.title}
                    </h4>
                  </div>
                  {marker.disputed && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold border border-red-200 uppercase flex-shrink-0">
                      Debunked
                    </span>
                  )}
                </div>

                <div className="mt-1 flex items-center gap-1 text-[11px] text-[#64748b]">
                  <MapPin className="w-3 h-3 text-[#94a3b8]" />
                  <span className="truncate">{marker.locationName}</span>
                </div>

                <p className="mt-1.5 text-[11px] text-[#334155] leading-relaxed line-clamp-2">
                  {marker.description}
                </p>

                {/* Person / Vehicle tags */}
                {(marker.suspectName || marker.vehiclePlate) && (
                  <div className="mt-2 flex items-center gap-2 text-[10px] font-mono">
                    {marker.suspectName && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        <User className="w-3 h-3" />
                        {marker.suspectName}
                      </span>
                    )}
                    {marker.vehiclePlate && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                        <Car className="w-3 h-3" />
                        {marker.vehiclePlate}
                      </span>
                    )}
                  </div>
                )}

                {marker.officialAttribution && (
                  <div className="mt-1.5 text-[9px] font-mono text-slate-500 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-sky-600 flex-shrink-0" />
                    <span className="truncate">{marker.officialAttribution}</span>
                  </div>
                )}

                <div className="mt-2 pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-[10px] font-mono text-[#64748b]">
                  <span>{marker.timestamp}</span>
                  <span className="text-[#0284c7] font-medium">{marker.sourceType}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Node Details Box */}
        {selected && (
          <div className="pt-3 border-t border-[#eef2f6] bg-[#f8fafc] -mx-3 -mb-3 p-3 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#0284c7] uppercase font-bold">
              <span>Verified Location Node</span>
              <span>
                {selected.latitude.toFixed(4)}, {selected.longitude.toFixed(4)}
              </span>
            </div>
            <div className="text-xs font-semibold text-[#1e293b]">{selected.title}</div>
            <div className="text-[11px] text-[#475569] font-mono">
              Exhibit Reference: <strong>{selected.evidenceRef}</strong>
            </div>
            {selected.photoCaption && (
              <div className="text-[10px] text-slate-500 italic">
                {selected.photoCaption}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Leaflet Map Viewport */}
      <div className="flex-1 relative rounded-lg overflow-hidden border border-[#e2dcd2] bg-[#eef2f6]">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Header HUD Badge */}
        <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#cbd5e1] shadow-xs flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1e293b]">
            PCPC SMART CITY TACTICAL GIS TELEMETRY • LIVE
          </span>
        </div>

        {/* Bottom Legend */}
        <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-md p-2.5 rounded-lg border border-[#cbd5e1] shadow-md flex flex-wrap items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
            <span className="text-[#334155] font-medium">Crime Scene</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed]" />
            <span className="text-[#334155] font-medium">Cell Tower Mast</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
            <span className="text-[#334155] font-medium">ANPR Road Gate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c]" />
            <span className="text-[#334155] font-medium">Evidence Seizure</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]" />
            <span className="text-[#334155] font-bold">Debunked Alibi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
