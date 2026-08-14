import React from 'react';
import { Place, CategoryId } from '../types';
import { motion } from 'motion/react';

interface HomeViewProps {
  places: Place[];
  onOpenDetails: (place: Place) => void;
  onNavigate: (place: Place) => void;
  onSelectCategory: (cat: CategoryId) => void;
  onGoToMap: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  places,
  onOpenDetails,
  onNavigate,
  onSelectCategory,
  onGoToMap,
}) => {
  const topRated = [...places].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const diningHighlights = places.filter((p) => p.category === 'restaurants').slice(0, 3);
  const emergencyPlaces = places.filter((p) => p.category === 'hospitals').slice(0, 2);

  return (
    <div className="space-y-6 pb-24 pt-3 max-w-4xl mx-auto px-4">
      {/* Weather & Location Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#2563EB] to-blue-700 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden"
      >
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-1.5 text-blue-100 text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              <span>Mumbai, Maharashtra • Coastal Hub</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black mt-1">Discover Incredible India</h2>
            <p className="text-xs text-blue-100 mt-1 max-w-sm">
              Explore heritage monuments, coastal fine dining, 24/7 medical centers & secure ATMs.
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-2xl font-black">28°C</div>
            <p className="text-xs text-blue-200">Sunny & Pleasant</p>
          </div>
        </div>

        {/* Action button inside banner */}
        <div className="mt-4 pt-3 border-t border-blue-400/30 flex items-center justify-between">
          <span className="text-xs text-blue-100 font-medium">
            {places.length} curated verified places nearby
          </span>
          <button
            onClick={onGoToMap}
            className="px-4 py-1.5 rounded-full bg-white text-[#2563EB] text-xs font-bold hover:bg-blue-50 transition-colors flex items-center gap-1 shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">map</span> Open Explorer Map
          </button>
        </div>
      </motion.div>

      {/* Quick Category Jump Grid */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-bold text-slate-900">Explore by Category</h3>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {[
            { id: 'restaurants', label: 'Dining', icon: 'restaurant', color: 'bg-blue-50 text-[#2563EB]' },
            { id: 'hotels', label: 'Hotels', icon: 'hotel', color: 'bg-teal-50 text-teal-700' },
            { id: 'attractions', label: 'Sights', icon: 'photo_camera', color: 'bg-amber-50 text-amber-700' },
            { id: 'hospitals', label: 'Emergency', icon: 'local_hospital', color: 'bg-red-50 text-red-700' },
            { id: 'atms', label: 'ATMs', icon: 'local_atm', color: 'bg-emerald-50 text-emerald-700' },
            { id: 'all', label: 'All Places', icon: 'explore', color: 'bg-indigo-50 text-indigo-700' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id as CategoryId);
                onGoToMap();
              }}
              className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col items-center gap-1.5 group"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}
              >
                <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
              </div>
              <span className="text-xs font-bold text-slate-700">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Places Carousel / Grid */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Top Rated Tourist Gems</h3>
            <p className="text-xs text-slate-500">Highest rated dining and landmarks</p>
          </div>
          <button
            onClick={onGoToMap}
            className="text-xs font-bold text-[#2563EB] hover:underline"
          >
            View Map
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {topRated.map((place) => (
            <div
              key={place.id}
              onClick={() => onOpenDetails(place)}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              <div className="h-40 relative bg-slate-100 overflow-hidden">
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-900 flex items-center gap-1 shadow-sm">
                  <span
                    className="material-symbols-outlined text-[14px] text-amber-500"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    star
                  </span>
                  {place.rating} ({place.reviewCount})
                </div>
                {place.cuisine && (
                  <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                    {place.cuisine}
                  </span>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors">
                      {place.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{place.area}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-600">
                    {place.distanceKm} km
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {place.closingTime ? `Closes ${place.closingTime}` : 'Open'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(place);
                      }}
                      className="px-3 py-1 bg-blue-50 text-[#2563EB] hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">navigation</span> Go
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDetails(place);
                      }}
                      className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Safety & Essential Tourist Services Banner */}
      <section className="bg-red-50/70 border border-red-200/80 rounded-3xl p-4.5">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="material-symbols-outlined text-red-600 text-[22px]"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            health_and_safety
          </span>
          <h3 className="text-sm font-bold text-slate-900">24/7 Tourist Medical & Emergency</h3>
        </div>
        <p className="text-xs text-slate-600 mb-3">
          Direct access to accredited multi-specialty trauma centers and national tourist safety lines.
        </p>

        <div className="grid sm:grid-cols-2 gap-2">
          {emergencyPlaces.map((hosp) => (
            <div
              key={hosp.id}
              onClick={() => onOpenDetails(hosp)}
              className="bg-white p-3 rounded-xl border border-red-100 flex items-center justify-between shadow-2xs hover:border-red-300 transition-colors cursor-pointer"
            >
              <div>
                <p className="text-xs font-bold text-slate-900">{hosp.name}</p>
                <p className="text-[11px] text-slate-500">{hosp.area} • Open 24/7</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(hosp);
                }}
                className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">navigation</span> Route
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
