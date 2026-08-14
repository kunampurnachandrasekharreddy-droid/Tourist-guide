import React, { useState, useMemo } from 'react';
import { ActiveTab, CategoryId, Place, Review } from './types';
import { INITIAL_PLACES } from './data/placesData';
import { ShaderBackground } from './components/ShaderBackground';
import { InteractiveMap } from './components/InteractiveMap';
import { PlacesBottomSheet } from './components/PlacesBottomSheet';
import { PlaceDetailsView } from './components/PlaceDetailsView';
import { HomeView } from './components/HomeView';
import { SearchView } from './components/SearchView';
import { ProfileView } from './components/ProfileView';
import { SosModal } from './components/SosModal';
import { VoiceSearchModal } from './components/VoiceSearchModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');
  const [places, setPlaces] = useState<Place[]>(INITIAL_PLACES);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [radiusKm, setRadiusKm] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [detailsPlace, setDetailsPlace] = useState<Place | null>(null);
  const [activeRoutePlace, setActiveRoutePlace] = useState<Place | null>(null);
  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>(['peshawri', 'taj-mahal-palace']);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [isSosOpen, setIsSosOpen] = useState<boolean>(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState<boolean>(false);

  // Filter places based on active category, radius, and search query
  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      // Category filter
      if (selectedCategory !== 'all' && place.category !== selectedCategory) {
        return false;
      }

      // Radius filter:
      // In 1km mode, show places <= 1.5km to ensure rich nearby results
      if (radiusKm === 1 && place.distanceKm > 1.5) {
        return false;
      } else if (radiusKm === 5 && place.distanceKm > 5.5) {
        return false;
      } else if (radiusKm === 10 && place.distanceKm > 12) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = place.name.toLowerCase().includes(q);
        const matchesArea = place.area.toLowerCase().includes(q);
        const matchesCuisine = place.cuisine?.toLowerCase().includes(q);
        const matchesCategory = place.categoryLabel.toLowerCase().includes(q);
        if (!matchesName && !matchesArea && !matchesCuisine && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [places, selectedCategory, radiusKm, searchQuery]);

  const savedPlaces = useMemo(() => {
    return places.filter((p) => savedPlaceIds.includes(p.id));
  }, [places, savedPlaceIds]);

  const hospitals = useMemo(() => {
    return places.filter((p) => p.category === 'hospitals');
  }, [places]);

  const handleToggleSave = (place: Place) => {
    setSavedPlaceIds((prev) =>
      prev.includes(place.id) ? prev.filter((id) => id !== place.id) : [...prev, place.id]
    );
  };

  const handleAddReview = (placeId: string, review: Review) => {
    setPlaces((prev) =>
      prev.map((p) => {
        if (p.id === placeId) {
          const updatedReviews = [review, ...p.reviews];
          const newAvgRating = Number(
            (
              updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length
            ).toFixed(1)
          );
          return {
            ...p,
            reviews: updatedReviews,
            reviewCount: p.reviewCount + 1,
            rating: newAvgRating,
          };
        }
        return p;
      })
    );

    if (detailsPlace && detailsPlace.id === placeId) {
      setDetailsPlace((prev) => {
        if (!prev) return null;
        const updatedReviews = [review, ...prev.reviews];
        const newAvgRating = Number(
          (
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length
          ).toFixed(1)
        );
        return {
          ...prev,
          reviews: updatedReviews,
          reviewCount: prev.reviewCount + 1,
          rating: newAvgRating,
        };
      });
    }
  };

  const handleStartNavigation = (place: Place) => {
    setActiveRoutePlace(place);
    setSelectedPlace(place);
    setActiveTab('map');
  };

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden flex flex-col bg-[#f7f9fb] text-[#191c1e]">
      {/* Interactive WebGL Shader Canvas Glow Background */}
      <ShaderBackground />

      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-40 flex justify-between items-center px-4 py-2.5 bg-white/75 backdrop-blur-xl shadow-xs border-b border-slate-200/50">
        <button
          id="btn-app-location"
          onClick={() => {
            setActiveTab('map');
            setSelectedPlace(null);
          }}
          className="text-slate-700 hover:bg-slate-100 transition-colors rounded-full p-2 flex items-center justify-center active:scale-95"
          title="Current Location"
        >
          <span className="material-symbols-outlined text-[22px] text-blue-600">near_me</span>
        </button>

        <div className="flex flex-col items-center">
          <h1 className="text-xl font-extrabold text-[#2563EB] tracking-tight">TouristMate</h1>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest -mt-0.5">
            Mumbai Explorer
          </span>
        </div>

        <button
          id="btn-app-voice"
          onClick={() => setIsVoiceOpen(true)}
          className="text-slate-700 hover:bg-slate-100 transition-colors rounded-full p-2 flex items-center justify-center active:scale-95 text-blue-600"
          title="Voice Explorer"
        >
          <span className="material-symbols-outlined text-[22px]">mic</span>
        </button>
      </header>

      {/* Main Viewport Container */}
      <main className="flex-1 relative w-full h-full pt-[56px] pb-[68px] md:pb-0 overflow-hidden">
        {/* MAP TAB */}
        {activeTab === 'map' && (
          <div className="w-full h-full relative">
            {/* Floating Top Filter Controls (Over Map) */}
            <div className="absolute inset-x-0 top-0 p-3 flex flex-col gap-2 pointer-events-none z-30 pt-3">
              {/* Search Bar */}
              <div className="bg-white/90 backdrop-blur-xl rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-slate-200/80 flex items-center px-4 py-2.5 pointer-events-auto w-full max-w-md mx-auto">
                <span className="material-symbols-outlined text-slate-400 mr-2 text-[20px]">
                  search
                </span>
                <input
                  id="map-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search places..."
                  className="flex-1 bg-transparent border-none focus:outline-hidden text-xs md:text-sm font-medium text-slate-800 placeholder:text-slate-400 p-0"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-slate-400 hover:text-slate-600 mr-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
                <button
                  id="btn-open-search-tab"
                  onClick={() => setActiveTab('search')}
                  className="ml-1 text-[#2563EB] hover:bg-blue-50 rounded-full p-1 transition-colors"
                  title="Advanced Filters"
                >
                  <span className="material-symbols-outlined text-[20px]">filter_list</span>
                </button>
              </div>

              {/* Category Chips Bar */}
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar pointer-events-auto max-w-xl mx-auto w-full">
                <button
                  id="chip-all-places"
                  onClick={() => setSelectedCategory('all')}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shadow-xs flex items-center gap-1.5 ${
                    selectedCategory === 'all'
                      ? 'bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)]'
                      : 'bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 border border-slate-200/80'
                  }`}
                >
                  All Places
                </button>

                <button
                  id="chip-restaurants"
                  onClick={() => setSelectedCategory('restaurants')}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 shadow-xs flex items-center gap-1.5 ${
                    selectedCategory === 'restaurants'
                      ? 'bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)]'
                      : 'bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 border border-slate-200/80'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">restaurant</span>
                  Restaurants
                </button>

                <button
                  id="chip-hotels"
                  onClick={() => setSelectedCategory('hotels')}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 shadow-xs flex items-center gap-1.5 ${
                    selectedCategory === 'hotels'
                      ? 'bg-[#14B8A6] text-white shadow-[0_4px_12px_rgba(20,184,166,0.25)]'
                      : 'bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 border border-slate-200/80'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">hotel</span>
                  Hotels
                </button>

                <button
                  id="chip-hospitals"
                  onClick={() => setSelectedCategory('hospitals')}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 shadow-xs flex items-center gap-1.5 ${
                    selectedCategory === 'hospitals'
                      ? 'bg-[#BA1A1A] text-white shadow-[0_4px_12px_rgba(186,26,26,0.25)]'
                      : 'bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 border border-slate-200/80'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">local_hospital</span>
                  Hospitals
                </button>

                <button
                  id="chip-atms"
                  onClick={() => setSelectedCategory('atms')}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 shadow-xs flex items-center gap-1.5 ${
                    selectedCategory === 'atms'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 border border-slate-200/80'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">local_atm</span>
                  ATMs
                </button>

                <button
                  id="chip-attractions"
                  onClick={() => setSelectedCategory('attractions')}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 shadow-xs flex items-center gap-1.5 ${
                    selectedCategory === 'attractions'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 border border-slate-200/80'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                  Sights
                </button>
              </div>

              {/* Radius Selector Pills */}
              <div className="flex gap-2 pointer-events-auto">
                <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xs border border-slate-200/80 p-1 flex">
                  {[1, 5, 10].map((r) => (
                    <button
                      key={r}
                      id={`radius-${r}km`}
                      onClick={() => setRadiusKm(r)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                        radiusKm === r
                          ? 'bg-blue-100 text-[#2563EB]'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {r}km
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Vector Map with Markers & Pan / Zoom */}
            <InteractiveMap
              places={filteredPlaces}
              selectedPlace={selectedPlace}
              onSelectPlace={(p) => setSelectedPlace(p)}
              onOpenDetails={(p) => setDetailsPlace(p)}
              activeRoutePlace={activeRoutePlace}
              onClearRoute={() => setActiveRoutePlace(null)}
              onSosClick={() => setIsSosOpen(true)}
              radiusKm={radiusKm}
            />

            {/* Bottom Sheet for Nearby Places List */}
            <PlacesBottomSheet
              places={filteredPlaces}
              selectedPlace={selectedPlace}
              onSelectPlace={(p) => setSelectedPlace(p)}
              onOpenDetails={(p) => setDetailsPlace(p)}
              onStartNavigation={handleStartNavigation}
              isOpen={isSheetOpen}
              onToggleOpen={() => setIsSheetOpen(!isSheetOpen)}
              radiusKm={radiusKm}
              onViewAll={() => setIsSheetOpen(true)}
            />
          </div>
        )}

        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="w-full h-full overflow-y-auto">
            <HomeView
              places={places}
              onOpenDetails={(p) => setDetailsPlace(p)}
              onNavigate={handleStartNavigation}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              onGoToMap={() => setActiveTab('map')}
            />
          </div>
        )}

        {/* SEARCH TAB */}
        {activeTab === 'search' && (
          <div className="w-full h-full overflow-y-auto">
            <SearchView
              places={places}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenDetails={(p) => setDetailsPlace(p)}
              onNavigate={handleStartNavigation}
              onOpenVoiceSearch={() => setIsVoiceOpen(true)}
            />
          </div>
        )}

        {/* PROFILE / SAVED TAB */}
        {activeTab === 'profile' && (
          <div className="w-full h-full overflow-y-auto">
            <ProfileView
              savedPlaces={savedPlaces}
              onOpenDetails={(p) => setDetailsPlace(p)}
              onNavigate={handleStartNavigation}
              onRemoveSaved={handleToggleSave}
              onOpenSos={() => setIsSosOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Place Details Fullscreen Modal / View (Matching Image 7) */}
      {detailsPlace && (
        <PlaceDetailsView
          place={detailsPlace}
          onBack={() => setDetailsPlace(null)}
          onNavigate={handleStartNavigation}
          onToggleSave={handleToggleSave}
          isSaved={savedPlaceIds.includes(detailsPlace.id)}
          onAddReview={handleAddReview}
        />
      )}

      {/* SOS Emergency Modal */}
      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        hospitals={hospitals}
        onNavigateToHospital={handleStartNavigation}
      />

      {/* Voice Search Modal */}
      <VoiceSearchModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onSelectQuery={(q) => {
          setSearchQuery(q);
          setActiveTab('search');
        }}
      />

      {/* Bottom Navigation Bar */}
      <nav
        id="bottom-nav-bar"
        className="fixed bottom-0 w-full z-30 flex justify-around items-center px-4 py-2 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      >
        {/* Home */}
        <button
          id="nav-tab-home"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center w-16 h-12 transition-all group ${
            activeTab === 'home' ? 'text-[#2563EB]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform"
            style={activeTab === 'home' ? { fontVariationSettings: '"FILL" 1' } : {}}
          >
            home
          </span>
          <span className={`text-[11px] mt-0.5 ${activeTab === 'home' ? 'font-bold' : 'font-medium'}`}>
            Home
          </span>
        </button>

        {/* Map */}
        <button
          id="nav-tab-map"
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center justify-center transition-all active:scale-95 ${
            activeTab === 'map'
              ? 'bg-[#2563EB] text-white rounded-2xl px-5 py-1.5 shadow-[0_4px_12px_rgba(37,99,235,0.3)]'
              : 'text-slate-500 hover:text-slate-800 w-16 h-12'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={activeTab === 'map' ? { fontVariationSettings: '"FILL" 1' } : {}}
          >
            map
          </span>
          <span className={`text-[11px] mt-0.5 font-bold`}>Map</span>
        </button>

        {/* Search */}
        <button
          id="nav-tab-search"
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center justify-center w-16 h-12 transition-all group ${
            activeTab === 'search' ? 'text-[#2563EB]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform"
            style={activeTab === 'search' ? { fontVariationSettings: '"FILL" 1' } : {}}
          >
            search
          </span>
          <span className={`text-[11px] mt-0.5 ${activeTab === 'search' ? 'font-bold' : 'font-medium'}`}>
            Search
          </span>
        </button>

        {/* Profile */}
        <button
          id="nav-tab-profile"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center w-16 h-12 transition-all group ${
            activeTab === 'profile' ? 'text-[#2563EB]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform"
            style={activeTab === 'profile' ? { fontVariationSettings: '"FILL" 1' } : {}}
          >
            person
          </span>
          <span className={`text-[11px] mt-0.5 ${activeTab === 'profile' ? 'font-bold' : 'font-medium'}`}>
            Profile
          </span>
        </button>
      </nav>
    </div>
  );
}
