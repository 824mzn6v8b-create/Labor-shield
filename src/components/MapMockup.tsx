/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, Search, Navigation } from 'lucide-react';

interface MapMockupProps {
  onLocationSelect: (gps: string, addressName: string) => void;
}

export default function MapMockup({ onLocationSelect }: MapMockupProps) {
  const [pin, setPin] = useState<{ x: number; y: number } | null>({ x: 120, y: 150 });
  const [searchQuery, setSearchQuery] = useState('สมุทรสาคร / แขวงปทุมวัน');
  const [gpsString, setGpsString] = useState('13.5412, 100.2734');

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPin({ x, y });

    // Generate random but realistic looking Thailand GPS coordinates
    const lat = (13.4 + (1 - y / rect.height) * 0.5).toFixed(4);
    const lng = (100.2 + (x / rect.width) * 0.6).toFixed(4);
    const generatedGps = `${lat}, ${lng}`;
    setGpsString(generatedGps);

    // Provide a mocked address based on click location
    let estimatedArea = "เขตอุตสาหกรรมปริมณฑล";
    if (x < rect.width / 3) estimatedArea = "นิคมอุตสาหกรรมบางปู";
    else if (x > (rect.width * 2) / 3) estimatedArea = "เขตลาดกระบัง";
    else if (y < rect.height / 3) estimatedArea = "เขตบางรัก - ปทุมวัน";
    else if (y > (rect.height * 2) / 3) estimatedArea = "ท่าเรือและคลังสินค้า พระประแดง";

    onLocationSelect(generatedGps, estimatedArea);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    // Set a pin based on search
    setPin({ x: 200, y: 100 });
    const generatedGps = "13.7563, 100.5018";
    setGpsString(generatedGps);
    onLocationSelect(generatedGps, searchQuery);
  };

  return (
    <div id="map-mockup-container" className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
          <Navigation className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          ระบบพิกัดจำลอง (GPS Map Navigator)
        </span>
        <span className="font-mono text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
          {gpsString}
        </span>
      </div>

      {/* Search Input bar */}
      <form onSubmit={handleSearchSubmit} className="p-2.5 bg-white border-b border-slate-100 flex gap-1.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="map-search-input"
            type="text"
            className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-500 font-sans"
            placeholder="ค้นหาพิกัด ตำบล อำเภอ หรือชื่อโรงงาน..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          id="map-search-btn"
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded font-sans transition-colors cursor-pointer"
        >
          ค้นหา
        </button>
      </form>

      {/* Interactive Map Grid Design */}
      <div 
        id="interactive-map-stage"
        onClick={handleMapClick}
        className="h-44 bg-blue-50 relative cursor-crosshair overflow-hidden select-none"
        style={{
          backgroundImage: `
            radial-gradient(#cbd5e1 1.2px, transparent 1.2px), 
            linear-gradient(to right, rgba(203,213,225,0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(203,213,225,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      >
        {/* River Graphic */}
        <div className="absolute top-1/3 left-0 right-0 h-8 bg-blue-100/70 -rotate-6 blur-[1px]" />
        
        {/* Major Roads Grid */}
        <div className="absolute top-1/2 left-0 right-0 h-3 bg-slate-200/90" />
        <div className="absolute top-0 bottom-0 left-1/3 w-3 bg-slate-200/90" />
        <div className="absolute top-0 bottom-0 left-2/3 w-2.5 bg-slate-200/90" />

        {/* Highlighted Industrial / Landmark Areas */}
        <div className="absolute top-6 left-6 w-16 h-12 bg-emerald-100/60 rounded border border-emerald-200 flex items-center justify-center">
          <span className="text-[9px] text-emerald-800 font-sans text-center">พื้นที่ชุมชน</span>
        </div>
        <div className="absolute bottom-4 right-10 w-24 h-16 bg-amber-100/60 rounded border border-amber-200 flex items-center justify-center">
          <span className="text-[9px] text-amber-800 font-sans text-center">เขตนิติกรรมการค้า / โรงงาน</span>
        </div>
        <div className="absolute top-12 right-6 w-20 h-10 bg-blue-100/50 rounded border border-blue-200 flex items-center justify-center">
          <span className="text-[9px] text-blue-800 font-sans text-center">ท่าเรือประมง</span>
        </div>

        {/* Pin Marker Element */}
        {pin && (
          <div 
            id="map-selected-pin"
            className="absolute -translate-x-1/2 -translate-y-full transition-all duration-200"
            style={{ left: pin.x, top: pin.y }}
          >
            <div className="flex flex-col items-center">
              <div className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded shadow-md whitespace-nowrap font-mono">
                {gpsString}
              </div>
              <MapPin className="w-7 h-7 text-red-600 drop-shadow-[0_2px_4px_rgba(220,38,38,0.4)] fill-red-100 animate-bounce" />
              <div className="w-2.5 h-1 bg-red-950/20 rounded-full blur-[1px]" />
            </div>
          </div>
        )}

        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-[9px] text-slate-500 px-1.5 py-0.5 rounded font-sans">
          * ดับเบิ้ลคลิกหรือกดเพื่อย้ายพินพิกัดโรงงาน/สถานประกอบการ
        </div>
      </div>
    </div>
  );
}
