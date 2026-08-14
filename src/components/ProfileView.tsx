import React, { useState } from 'react';
import { Place } from '../types';

interface ProfileViewProps {
  savedPlaces: Place[];
  onOpenDetails: (place: Place) => void;
  onNavigate: (place: Place) => void;
  onRemoveSaved: (place: Place) => void;
  onOpenSos: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  savedPlaces,
  onOpenDetails,
  onNavigate,
  onRemoveSaved,
  onOpenSos,
}) => {
  const [offlineMapDownloaded, setOfflineMapDownloaded] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedCurrency, setSelectedCurrency] = useState('INR (₹)');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98765 43210');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const handleSaveContact = () => {
    setIsEditingPhone(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-3 pb-24 space-y-5">
      {/* Tourist Profile Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-blue-400 text-white flex items-center justify-center font-black text-2xl shadow-md">
          TM
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-lg font-black text-slate-900">Tourist Explorer</h2>
            <span className="bg-blue-100 text-[#2563EB] text-[11px] font-bold px-2.5 py-0.5 rounded-full self-center sm:self-auto">
              Verified Traveler
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Active Destination: <span className="font-semibold text-slate-700">Mumbai, Maharashtra, India</span>
          </p>

          <div className="flex gap-4 mt-3 justify-center sm:justify-start">
            <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 text-center">
              <span className="text-xs font-bold text-slate-900">{savedPlaces.length}</span>
              <p className="text-[10px] text-slate-500">Saved Places</p>
            </div>
            <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 text-center">
              <span className="text-xs font-bold text-slate-900">12</span>
              <p className="text-[10px] text-slate-500">Places Explored</p>
            </div>
            <div className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 text-center">
              <span className="text-xs font-bold text-emerald-700">Active</span>
              <p className="text-[10px] text-emerald-600">SOS Guard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Places Wishlist */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Saved & Wishlist</h3>
            <p className="text-xs text-slate-500">{savedPlaces.length} places saved for later</p>
          </div>
        </div>

        {savedPlaces.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">
              bookmark_border
            </span>
            <p className="text-sm font-bold text-slate-700">No saved places yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Tap the bookmark icon on any restaurant, hotel, or monument to save it here.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {savedPlaces.map((place) => (
              <div
                key={place.id}
                onClick={() => onOpenDetails(place)}
                className="bg-white rounded-2xl border border-slate-200/80 p-3 flex gap-3 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
              >
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-slate-100"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#2563EB] transition-colors">
                        {place.name}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveSaved(place);
                        }}
                        className="text-slate-400 hover:text-red-500 p-0.5"
                        title="Remove"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{place.area}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-50">
                    <span className="text-[11px] font-bold text-amber-600 flex items-center gap-0.5">
                      ★ {place.rating}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(place);
                        }}
                        className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-[#2563EB] text-[11px] font-bold hover:bg-blue-100 transition-colors"
                      >
                        Route
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Emergency & Safety Configuration */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-red-600"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              emergency
            </span>
            <h3 className="text-sm font-bold text-slate-900">Emergency & ICE Contact</h3>
          </div>
          <button
            onClick={onOpenSos}
            className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">sos</span> SOS Hub
          </button>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800">Primary ICE Contact</p>
            {isEditingPhone ? (
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="mt-1 px-2 py-1 text-xs border rounded-lg bg-white"
              />
            ) : (
              <p className="text-xs text-slate-600 mt-0.5">{emergencyPhone}</p>
            )}
          </div>
          {isEditingPhone ? (
            <button
              onClick={handleSaveContact}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditingPhone(true)}
              className="text-xs font-bold text-[#2563EB] hover:underline"
            >
              Edit
            </button>
          )}
        </div>
      </section>

      {/* Tourist Preferences */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Travel Preferences</h3>

        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-xs font-bold text-slate-800">Offline City Map Pack</p>
            <p className="text-[11px] text-slate-500">Enable offline vector map cache (34 MB)</p>
          </div>
          <button
            onClick={() => setOfflineMapDownloaded(!offlineMapDownloaded)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              offlineMapDownloaded ? 'bg-[#2563EB]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                offlineMapDownloaded ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <hr className="border-slate-100" />

        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-xs font-bold text-slate-800">Guide Language</p>
            <p className="text-[11px] text-slate-500">Audio and interface language</p>
          </div>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5"
          >
            <option>English</option>
            <option>Hindi (हिन्दी)</option>
            <option>Marathi (मराठी)</option>
            <option>Spanish (Español)</option>
            <option>French (Français)</option>
            <option>German (Deutsch)</option>
            <option>Japanese (日本語)</option>
          </select>
        </div>

        <hr className="border-slate-100" />

        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-xs font-bold text-slate-800">Preferred Currency</p>
            <p className="text-[11px] text-slate-500">Display price estimates</p>
          </div>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5"
          >
            <option>INR (₹) - Indian Rupee</option>
            <option>USD ($) - US Dollar</option>
            <option>EUR (€) - Euro</option>
            <option>GBP (£) - British Pound</option>
          </select>
        </div>
      </section>

      {saveToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
          Contact updated successfully!
        </div>
      )}
    </div>
  );
};
