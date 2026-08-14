import React from 'react';
import { Place } from '../types';
import { motion } from 'motion/react';

interface PlacesBottomSheetProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  onOpenDetails: (place: Place) => void;
  onStartNavigation: (place: Place) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  radiusKm: number;
  onViewAll: () => void;
}

export const PlacesBottomSheet: React.FC<PlacesBottomSheetProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
  onOpenDetails,
  onStartNavigation,
  isOpen,
  onToggleOpen,
  radiusKm,
  onViewAll,
}) => {
  return (
    <motion.div
      id="places-sheet"
      initial={false}
      animate={{
        height: isOpen ? '75vh' : '150px',
      }}
      transition={{ type: 'spring', damping: 28, stiffness: 220 }}
      className="fixed inset-x-0 bottom-[64px] md:bottom-0 md:max-w-xl md:left-4 md:right-auto md:w-[440px] z-40 flex flex-col bg-white/95 backdrop-blur-2xl rounded-t-3xl shadow-[0_-8px_32px_rgba(0,0,0,0.12)] border-t border-slate-200/80"
    >
      {/* Drag / Click Handle */}
      <div
        id="sheet-handle"
        className="w-full py-2.5 flex justify-center cursor-pointer select-none group"
        onClick={onToggleOpen}
      >
        <div className="w-12 h-1.5 bg-slate-300 rounded-full group-hover:bg-slate-400 transition-colors"></div>
      </div>

      {/* Sheet Header */}
      <div className="px-4 pb-2.5 border-b border-slate-100 flex justify-between items-end">
        <div>
          <h2 className="text-lg font-bold text-slate-900 leading-tight">Nearby Places</h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            {places.length} results within {radiusKm}km
          </p>
        </div>
        <button
          id="btn-view-all-places"
          onClick={onViewAll}
          className="text-[#2563EB] text-xs font-bold hover:underline py-1 px-2 rounded-lg hover:bg-blue-50 transition-colors"
        >
          View All
        </button>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 no-scrollbar">
        {places.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">
              location_off
            </span>
            <p className="text-sm font-medium">No places found in this radius</p>
            <p className="text-xs text-slate-400 mt-1">Try increasing the radius to 5km or 10km</p>
          </div>
        ) : (
          places.map((place, idx) => {
            const isSelected = selectedPlace?.id === place.id;
            const isHospital = place.category === 'hospitals';

            return (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => onSelectPlace(place)}
                className={`bg-white rounded-2xl border p-3 flex gap-3.5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-[#2563EB] ring-2 ring-blue-100 bg-blue-50/20'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                {/* Place Thumbnail / Category Icon Box */}
                {isHospital ? (
                  <div className="w-18 h-18 rounded-xl bg-red-50 flex-shrink-0 flex items-center justify-center text-[#BA1A1A] border border-red-100">
                    <span
                      className="material-symbols-outlined text-[32px]"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      local_hospital
                    </span>
                  </div>
                ) : (
                  <div className="w-18 h-18 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden relative">
                    <img
                      src={place.imageUrl}
                      alt={place.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {place.price && (
                      <span className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white px-1.5 py-0.5 rounded">
                        {place.price}
                      </span>
                    )}
                  </div>
                )}

                {/* Details Column */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <h3 className="text-sm font-bold text-slate-900 truncate leading-snug">
                        {place.name}
                      </h3>
                      {isHospital ? (
                        <span className="text-[#BA1A1A] text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 whitespace-nowrap">
                          Open 24/7
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5 whitespace-nowrap">
                          <span
                            className="material-symbols-outlined text-[12px] text-amber-500"
                            style={{ fontVariationSettings: '"FILL" 1' }}
                          >
                            star
                          </span>{' '}
                          {place.rating}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5 truncate">
                      {place.cuisine ? `${place.cuisine} • ` : ''}
                      {place.area}
                    </p>
                  </div>

                  {/* Distance & Action Buttons */}
                  <div className="flex justify-between items-center mt-2 pt-1 border-t border-slate-50">
                    <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        {place.distanceKm < 1.5 ? 'directions_walk' : 'directions_car'}
                      </span>
                      <span>
                        {place.distanceKm < 1
                          ? `${Math.round(place.distanceKm * 1000)}m`
                          : `${place.distanceKm}km`}{' '}
                        ({place.distanceKm < 1.5 ? `${place.walkTimeMin} min` : `${place.driveTimeMin} min`})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartNavigation(place);
                        }}
                        className="bg-blue-50 hover:bg-blue-100 text-[#2563EB] px-3 py-1 rounded-full text-xs font-bold transition-colors flex items-center gap-1 active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[14px]">navigation</span> Go
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDetails(place);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold transition-colors active:scale-95"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};
