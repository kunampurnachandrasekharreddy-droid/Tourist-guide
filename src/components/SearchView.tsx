import React, { useState, useMemo } from 'react';
import { Place, CategoryId, PriceLevel } from '../types';

interface SearchViewProps {
  places: Place[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenDetails: (place: Place) => void;
  onNavigate: (place: Place) => void;
  onOpenVoiceSearch: () => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  places,
  searchQuery,
  onSearchChange,
  onOpenDetails,
  onNavigate,
  onOpenVoiceSearch,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [selectedPrice, setSelectedPrice] = useState<PriceLevel | 'all'>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyOpenNow, setOnlyOpenNow] = useState<boolean>(false);

  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesArea = p.area.toLowerCase().includes(q);
        const matchesCuisine = p.cuisine?.toLowerCase().includes(q);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesArea && !matchesCuisine && !matchesTags) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Price filter
      if (selectedPrice !== 'all' && p.price !== selectedPrice) {
        return false;
      }

      // Rating filter
      if (minRating > 0 && p.rating < minRating) {
        return false;
      }

      // Open now filter
      if (onlyOpenNow && !p.isOpen) {
        return false;
      }

      return true;
    });
  }, [places, searchQuery, selectedCategory, selectedPrice, minRating, onlyOpenNow]);

  return (
    <div className="max-w-4xl mx-auto px-4 pt-3 pb-24 space-y-4">
      {/* Search Input Bar with Voice Button */}
      <div className="relative flex items-center bg-white rounded-2xl border border-slate-200/80 shadow-xs p-1.5 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <span className="material-symbols-outlined text-slate-400 ml-3">search</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search restaurants, hotels, hospitals, sights..."
          className="w-full px-3 py-2 text-sm text-slate-900 bg-transparent focus:outline-hidden placeholder:text-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
        <button
          onClick={onOpenVoiceSearch}
          className="p-2 text-[#2563EB] hover:bg-blue-50 rounded-xl transition-colors"
          title="Voice Search"
        >
          <span className="material-symbols-outlined text-[20px]">mic</span>
        </button>
      </div>

      {/* Category Pills Filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'all', label: 'All Places' },
          { id: 'restaurants', label: 'Restaurants' },
          { id: 'hotels', label: 'Hotels' },
          { id: 'attractions', label: 'Attractions' },
          { id: 'hospitals', label: 'Hospitals' },
          { id: 'atms', label: 'ATMs' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as CategoryId)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Secondary Filter Row (Price, Rating, Open Now) */}
      <div className="flex flex-wrap gap-2 items-center text-xs">
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
          <span className="text-slate-400 px-2 font-medium">Price:</span>
          {(['all', '$', '$$', '$$$', '$$$$'] as (PriceLevel | 'all')[]).map((pr) => (
            <button
              key={pr}
              onClick={() => setSelectedPrice(pr)}
              className={`px-2 py-1 rounded-lg font-bold transition-colors ${
                selectedPrice === pr ? 'bg-blue-100 text-[#2563EB]' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {pr === 'all' ? 'Any' : pr}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
          <span className="text-slate-400 px-2 font-medium">Rating:</span>
          {[0, 4.0, 4.5, 4.8].map((rt) => (
            <button
              key={rt}
              onClick={() => setMinRating(rt)}
              className={`px-2 py-1 rounded-lg font-semibold transition-colors flex items-center gap-0.5 ${
                minRating === rt ? 'bg-amber-100 text-amber-800' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {rt === 0 ? 'Any' : `${rt}★+`}
            </button>
          ))}
        </div>

        <button
          onClick={() => setOnlyOpenNow(!onlyOpenNow)}
          className={`px-3 py-2 rounded-xl font-semibold border transition-colors flex items-center gap-1.5 ${
            onlyOpenNow
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span
            className="material-symbols-outlined text-[16px]"
            style={onlyOpenNow ? { fontVariationSettings: '"FILL" 1' } : {}}
          >
            check_circle
          </span>
          Open Now
        </button>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center pt-2">
        <h3 className="text-sm font-bold text-slate-900">
          Showing {filteredPlaces.length} {filteredPlaces.length === 1 ? 'place' : 'places'}
        </h3>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {filteredPlaces.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80 p-6">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">
              search_off
            </span>
            <p className="text-sm font-bold text-slate-700">No places match your search criteria</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your keyword, price level, or category filter
            </p>
            <button
              onClick={() => {
                onSearchChange('');
                setSelectedCategory('all');
                setSelectedPrice('all');
                setMinRating(0);
                setOnlyOpenNow(false);
              }}
              className="mt-4 px-4 py-1.5 bg-blue-50 text-[#2563EB] font-bold text-xs rounded-xl hover:bg-blue-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredPlaces.map((place) => (
            <div
              key={place.id}
              onClick={() => onOpenDetails(place)}
              className="bg-white rounded-2xl border border-slate-200/80 p-3.5 flex flex-col sm:flex-row gap-3.5 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-full sm:w-28 h-32 sm:h-28 rounded-xl bg-slate-100 overflow-hidden relative flex-shrink-0">
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {place.price && (
                  <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white px-2 py-0.5 rounded">
                    {place.price}
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors">
                      {place.name}
                    </h4>
                    <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 flex-shrink-0">
                      <span
                        className="material-symbols-outlined text-[13px] text-amber-500"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                      >
                        star
                      </span>
                      {place.rating}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    {place.cuisine ? `${place.cuisine} • ` : ''}
                    {place.address}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span className="font-semibold text-slate-700">{place.distanceKm} km away</span>
                    <span>•</span>
                    <span>{place.walkTimeMin} min walk</span>
                  </div>

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
          ))
        )}
      </div>
    </div>
  );
};
