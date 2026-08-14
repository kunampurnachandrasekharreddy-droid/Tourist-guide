import React, { useState, useRef, useEffect } from 'react';
import { Place } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface InteractiveMapProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  onOpenDetails: (place: Place) => void;
  activeRoutePlace: Place | null;
  onClearRoute: () => void;
  onSosClick: () => void;
  radiusKm: number;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
  onOpenDetails,
  activeRoutePlace,
  onClearRoute,
  onSosClick,
  radiusKm,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mapLayer, setMapLayer] = useState<'standard' | 'transit' | 'traffic'>('standard');
  const [hoveredPlace, setHoveredPlace] = useState<Place | null>(null);

  // User location on map (center point around 50%, 46%)
  const userLocation = { x: 50, y: 46 };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.map-control-btn') || (e.target as HTMLElement).closest('.map-marker')) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Center on user location
  const handleRecenter = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));

  // Focus on selected place if it changes
  useEffect(() => {
    if (selectedPlace) {
      // Calculate offset to bring place towards center
      const offsetX = -(selectedPlace.mapCoordinates.xPercent - 50) * 4;
      const offsetY = -(selectedPlace.mapCoordinates.yPercent - 50) * 4;
      setPan({ x: offsetX, y: offsetY });
    }
  }, [selectedPlace]);

  const getMarkerIcon = (category: string) => {
    switch (category) {
      case 'restaurants':
        return 'restaurant';
      case 'hotels':
        return 'hotel';
      case 'hospitals':
        return 'local_hospital';
      case 'atms':
        return 'local_atm';
      case 'attractions':
        return 'photo_camera';
      default:
        return 'place';
    }
  };

  const getMarkerStyle = (place: Place, isSelected: boolean) => {
    if (place.category === 'hospitals') {
      return {
        bg: 'bg-[#BA1A1A] text-white',
        border: 'border-[#BA1A1A]/40',
        shadow: 'shadow-[0_4px_16px_rgba(186,26,26,0.35)]',
      };
    }
    if (place.category === 'hotels') {
      return {
        bg: 'bg-[#14B8A6] text-white',
        border: 'border-[#14B8A6]/40',
        shadow: 'shadow-[0_4px_16px_rgba(20,184,166,0.35)]',
      };
    }
    if (place.category === 'atms') {
      return {
        bg: 'bg-emerald-600 text-white',
        border: 'border-emerald-500/40',
        shadow: 'shadow-[0_4px_16px_rgba(5,150,105,0.35)]',
      };
    }
    if (place.category === 'attractions') {
      return {
        bg: 'bg-amber-600 text-white',
        border: 'border-amber-500/40',
        shadow: 'shadow-[0_4px_16px_rgba(217,119,6,0.35)]',
      };
    }
    // Default / Restaurants
    return {
      bg: isSelected ? 'bg-[#2563EB] text-white' : 'bg-white text-[#2563EB]',
      border: 'border-[#2563EB]/40',
      shadow: 'shadow-[0_4px_16px_rgba(37,99,235,0.25)]',
    };
  };

  return (
    <div
      ref={containerRef}
      id="interactive-map-container"
      className="relative w-full h-full overflow-hidden select-none bg-[#e8eef3] cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Transform Container for Pan & Zoom */}
      <div
        className="w-full h-full relative transition-transform duration-100 ease-out"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '50% 50%',
        }}
      >
        {/* Map Vector Graphic Background */}
        <div className="absolute inset-[-20%] w-[140%] h-[140%]">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3AHokyvLuzwst2tWjUvbjKkfMJiICVtrt4dDKiR3M0XiSozgCtVPX5iDuVCKn4B7dcsDn0Stt7ThddUUmjHKlqH7MbLBcsPO5pc1rPBR7sFXRmfit_sslHFc1cQY8lv6BGRMxRQ8qh002ek9FQg5UoDheDQiAfdry2RsfGP1VWJ-zz39oz9OxItXBl_QGdcJOOYlT5o-RBSc3J-SReuNC5EcaWCQkmnQj2b3MO3v941t54VEqPxc"
            alt="Tourist Explorer City Vector Map"
            className={`w-full h-full object-cover pointer-events-none transition-all duration-300 ${
              mapLayer === 'traffic'
                ? 'brightness-95 contrast-110'
                : mapLayer === 'transit'
                ? 'hue-rotate-15 contrast-105'
                : 'opacity-90'
            }`}
          />

          {/* SVG Map Overlay for Radius Ring & Route Path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#60A5FA" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Radar / Radius circle around user */}
            <circle
              cx={`${userLocation.x}%`}
              cy={`${userLocation.y}%`}
              r={`${Math.min(radiusKm * 4, 38)}%`}
              fill="rgba(37, 99, 235, 0.05)"
              stroke="rgba(37, 99, 235, 0.35)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="animate-pulse-slow"
            />

            {/* Active Turn-by-Turn Route Line */}
            {activeRoutePlace && (
              <g>
                <path
                  d={`M ${userLocation.x * 12} ${userLocation.y * 7} Q ${(userLocation.x + activeRoutePlace.mapCoordinates.xPercent) * 6 + 20} ${(userLocation.y + activeRoutePlace.mapCoordinates.yPercent) * 3.5 - 20}, ${activeRoutePlace.mapCoordinates.xPercent * 12} ${activeRoutePlace.mapCoordinates.yPercent * 7}`}
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="8 6"
                  className="animate-pulse"
                />
              </g>
            )}
          </svg>
        </div>

        {/* User Current Location Indicator (Pulsing Blue Dot) */}
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{ left: `${userLocation.x}%`, top: `${userLocation.y}%` }}
          onClick={handleRecenter}
          title="You are here"
        >
          <div className="relative flex h-8 w-8 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2563EB] opacity-60"></span>
            <span className="animate-pulse absolute inline-flex h-6 w-6 rounded-full bg-[#2563EB] opacity-30"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#2563EB] border-[3px] border-white shadow-md"></span>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-blue-200 shadow-sm text-[10px] font-bold text-blue-800 whitespace-nowrap">
            You
          </div>
        </div>

        {/* Interactive Place Markers */}
        {places.map((place) => {
          const isSelected = selectedPlace?.id === place.id;
          const isRouteDest = activeRoutePlace?.id === place.id;
          const style = getMarkerStyle(place, isSelected);

          return (
            <div
              key={place.id}
              className="absolute z-20 map-marker"
              style={{
                left: `${place.mapCoordinates.xPercent}%`,
                top: `${place.mapCoordinates.yPercent}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onMouseEnter={() => setHoveredPlace(place)}
              onMouseLeave={() => setHoveredPlace(null)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectPlace(place);
              }}
            >
              {/* Marker Pin */}
              <button
                id={`marker-${place.id}`}
                className={`group relative p-2 rounded-full border transition-all duration-300 flex items-center justify-center ${
                  style.bg
                } ${style.border} ${style.shadow} ${
                  isSelected || isRouteDest
                    ? 'ring-4 ring-[#2563EB]/40 scale-125 z-30'
                    : 'hover:scale-110'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: '"FILL" 1' }}
                >
                  {getMarkerIcon(place.category)}
                </span>

                {/* Star badge on pin */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border border-white flex items-center justify-center text-[8px] font-bold text-white shadow-xs">
                  ★
                </div>
              </button>

              {/* Hover Tooltip / Mini Popup */}
              <AnimatePresence>
                {(hoveredPlace?.id === place.id || isSelected) && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-slate-200/80 p-2.5 z-40 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex gap-2 items-center">
                      <img
                        src={place.imageUrl}
                        alt={place.name}
                        className="w-11 h-11 rounded-lg object-cover flex-shrink-0 bg-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {place.name}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                          <span className="text-amber-500 font-bold flex items-center">
                            ★ {place.rating}
                          </span>
                          <span>•</span>
                          <span>{place.distanceKm} km</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-500 truncate max-w-[110px]">
                        {place.cuisine || place.categoryLabel}
                      </span>
                      <button
                        onClick={() => onOpenDetails(place)}
                        className="text-[11px] font-bold text-[#2563EB] hover:text-blue-700 hover:underline flex items-center gap-0.5"
                      >
                        View Details →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Floating SOS Emergency Button (Prominent Red, matching Image 3) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 pointer-events-auto">
        <button
          id="btn-floating-sos"
          onClick={onSosClick}
          className="w-14 h-14 rounded-full bg-[#BA1A1A] text-white shadow-[0_8px_24px_rgba(186,26,26,0.45)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all relative group font-bold tracking-wider"
          title="Emergency SOS"
        >
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#BA1A1A] opacity-35"></span>
          <span className="text-sm font-extrabold tracking-tight">SOS</span>
        </button>
      </div>

      {/* Map Control Buttons (Bottom Right / Top Right) */}
      <div className="absolute right-4 bottom-44 md:bottom-24 z-30 flex flex-col gap-2 pointer-events-auto">
        {/* Recenter button */}
        <button
          id="btn-recenter-map"
          onClick={handleRecenter}
          className="map-control-btn w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition-all text-[#2563EB]"
          title="Recenter to My Location"
        >
          <span className="material-symbols-outlined text-[20px]">my_location</span>
        </button>

        {/* Zoom In */}
        <button
          id="btn-zoom-in"
          onClick={handleZoomIn}
          className="map-control-btn w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
          title="Zoom In"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
        </button>

        {/* Zoom Out */}
        <button
          id="btn-zoom-out"
          onClick={handleZoomOut}
          className="map-control-btn w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
          title="Zoom Out"
        >
          <span className="material-symbols-outlined text-[20px]">remove</span>
        </button>

        {/* Layer toggle */}
        <button
          id="btn-toggle-layer"
          onClick={() =>
            setMapLayer((prev) =>
              prev === 'standard' ? 'traffic' : prev === 'traffic' ? 'transit' : 'standard'
            )
          }
          className="map-control-btn w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
          title={`Layer: ${mapLayer}`}
        >
          <span className="material-symbols-outlined text-[20px]">layers</span>
        </button>
      </div>

      {/* Active Navigation Route Banner (if navigating) */}
      <AnimatePresence>
        {activeRoutePlace && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-28 left-4 right-4 max-w-md mx-auto z-40 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3.5 shadow-2xl border border-slate-700/50 flex items-center justify-between pointer-events-auto"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[22px]">turn_right</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  Live Navigation • {activeRoutePlace.walkTimeMin} min walk
                </p>
                <p className="text-sm font-bold text-white truncate max-w-[200px]">
                  Heading to {activeRoutePlace.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClearRoute}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
            >
              End
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
