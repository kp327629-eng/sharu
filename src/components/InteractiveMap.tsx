import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ScheduleItem } from "../types";

interface InteractiveMapProps {
  scheduleItems: ScheduleItem[];
  selectedItem?: ScheduleItem | null;
  onSelectItem?: (item: ScheduleItem) => void;
  darkMode?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  scheduleItems,
  selectedItem,
  onSelectItem,
  darkMode = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center
      const initialLat = scheduleItems[0]?.lat || 35.0116;
      const initialLng = scheduleItems[0]?.lng || 135.7681;

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([initialLat, initialLng], 13);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Remove previous markers & polyline
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    // Set tile layer according to theme
    const tileUrl = darkMode
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    if (!scheduleItems || scheduleItems.length === 0) return;

    const latLngs: [number, number][] = [];

    // Add custom markers
    scheduleItems.forEach((item, index) => {
      latLngs.push([item.lat, item.lng]);

      const isSelected = selectedItem?.title === item.title;

      // Custom DivIcon marker
      const markerHtml = `
        <div style="
          background: ${isSelected ? "#0284c7" : darkMode ? "#18181b" : "#ffffff"};
          color: ${isSelected ? "#ffffff" : darkMode ? "#f4f4f5" : "#09090b"};
          border: 2px solid ${isSelected ? "#38bdf8" : "#0284c7"};
          border-radius: 12px;
          padding: 4px 8px;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 11px;
          font-weight: 700;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          cursor: pointer;
        ">
          <span style="background: #0284c7; color: #fff; width: 16px; height: 16px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; font-size: 9px;">${
            index + 1
          }</span>
          <span>${item.title.length > 18 ? item.title.slice(0, 18) + "…" : item.title}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: "custom-leaflet-marker",
        iconSize: [120, 32],
        iconAnchor: [60, 16],
      });

      const marker = L.marker([item.lat, item.lng], { icon: customIcon }).addTo(map);

      // Popup html
      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; padding: 4px; max-width: 200px;">
          <div style="font-weight: 700; font-size: 13px; color: #0284c7; margin-bottom: 4px;">${item.time} • ${item.title}</div>
          <div style="font-size: 11px; color: #52525b; margin-bottom: 6px;">${item.description}</div>
          <div style="font-size: 10px; font-weight: 600; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 6px; display: inline-block;">
            💡 ${item.proTip || "Insiders Favorite"}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on("click", () => {
        if (onSelectItem) onSelectItem(item);
      });

      markersRef.current.push(marker);
    });

    // Draw route polyline
    if (latLngs.length > 1) {
      const polyline = L.polyline(latLngs, {
        color: "#0284c7",
        weight: 3,
        dashArray: "6, 8",
        opacity: 0.8,
      }).addTo(map);

      polylineRef.current = polyline;
    }

    // Fit bounds automatically
    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [scheduleItems, selectedItem, darkMode]);

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-2xl overflow-hidden shadow-inner border border-black/10 dark:border-white/10">
      <div ref={mapContainerRef} className="w-full h-full z-10" />
      <div className="absolute top-3 left-3 z-20 backdrop-blur-md bg-white/80 dark:bg-zinc-900/80 px-3 py-1.5 rounded-xl border border-black/5 dark:border-white/10 shadow-sm text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
        Interactive Route & AI Places
      </div>
    </div>
  );
};
