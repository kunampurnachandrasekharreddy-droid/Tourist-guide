import React, { useState } from 'react';
import { Place, Review } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface PlaceDetailsViewProps {
  place: Place;
  onBack: () => void;
  onNavigate: (place: Place) => void;
  onToggleSave: (place: Place) => void;
  isSaved: boolean;
  onAddReview: (placeId: string, review: Review) => void;
}

export const PlaceDetailsView: React.FC<PlaceDetailsViewProps> = ({
  place,
  onBack,
  onNavigate,
  onToggleSave,
  isSaved,
  onAddReview,
}) => {
  const [showHoursSchedule, setShowHoursSchedule] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showCallOptions, setShowCallOptions] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [allReviewsOpen, setAllReviewsOpen] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: place.name,
          text: `Check out ${place.name} on TouristMate! ${place.address}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText?.(
        `${place.name} - ${place.address} (${place.phone})`
      );
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  const handleCall = () => {
    setShowCallOptions(true);
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    const initials = reviewAuthor
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const colors = [
      'bg-indigo-600 text-white',
      'bg-emerald-600 text-white',
      'bg-blue-600 text-white',
      'bg-purple-600 text-white',
      'bg-amber-600 text-white',
    ];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor.trim(),
      avatarText: initials || 'TU',
      avatarColor,
      rating: reviewRating,
      timeAgo: 'Just now',
      comment: reviewComment.trim(),
      helpfulCount: 0,
    };

    onAddReview(place.id, newReview);
    setReviewAuthor('');
    setReviewComment('');
    setShowReviewModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 bg-[#f7f9fb] text-[#191c1e] overflow-y-auto flex flex-col"
    >
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 py-2.5 bg-white/90 backdrop-blur-md text-[#004ac6] shadow-xs border-b border-slate-200/50">
        <button
          id="btn-back-from-details"
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors active:scale-95 text-slate-700"
          title="Back"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>

        <h1 className="text-lg font-bold truncate px-2 flex-1 text-center text-slate-900">
          Place Details
        </h1>

        <div className="relative">
          <button
            id="btn-place-more-options"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors active:scale-95 text-slate-700"
            title="More Options"
          >
            <span className="material-symbols-outlined text-[24px]">more_vert</span>
          </button>

          {/* More Menu Dropdown */}
          <AnimatePresence>
            {showMoreMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                className="absolute right-0 top-full mt-1 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-1.5 z-50"
              >
                <button
                  onClick={() => {
                    onToggleSave(place);
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isSaved ? 'bookmark_remove' : 'bookmark_add'}
                  </span>
                  {isSaved ? 'Remove from Saved' : 'Save to Favorites'}
                </button>
                <button
                  onClick={() => {
                    handleShare();
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                >
                  <span className="material-symbols-outlined text-[18px]">share</span>
                  Share Place
                </button>
                <button
                  onClick={() => {
                    setShowReviewModal(true);
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                >
                  <span className="material-symbols-outlined text-[18px]">rate_review</span>
                  Write a Review
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-[56px] pb-16 flex-1">
        {/* Hero Image Header */}
        <div className="relative w-full h-[280px] md:h-[400px] bg-slate-900">
          <img
            src={place.imageUrl}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient shadow over image bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Floating Image Chips */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="flex flex-wrap gap-2">
              {place.cuisine && (
                <span className="bg-white/90 backdrop-blur-md text-slate-900 px-3 py-1 rounded-full text-xs font-semibold border border-white/40 shadow-sm flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-amber-600">
                    restaurant
                  </span>
                  {place.cuisine}
                </span>
              )}
              {place.price && (
                <span className="bg-white/90 backdrop-blur-md text-slate-900 px-3 py-1 rounded-full text-xs font-bold border border-white/40 shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">
                    payments
                  </span>
                  {place.price} INDIAN
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Details Content Container */}
        <div className="max-w-4xl mx-auto px-4 py-5 md:grid md:grid-cols-12 md:gap-6">
          {/* Main Content Column */}
          <div className="md:col-span-8 space-y-5">
            {/* Title & Basic Info */}
            <section>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                {place.name}
              </h2>
              <p className="text-sm font-medium text-slate-600 flex items-center gap-1.5 mt-1">
                <span
                  className="material-symbols-outlined text-[18px] text-amber-500"
                  style={{ fontVariationSettings: '"FILL" 1' }}
                >
                  star
                </span>
                <span className="font-bold text-slate-900">{place.rating}</span>
                <span>({place.reviewCount} reviews)</span>
                <span>•</span>
                <span className="text-[#2563EB] font-semibold">{place.distanceKm}km away</span>
              </p>
              {place.description && (
                <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                  {place.description}
                </p>
              )}
            </section>

            {/* Quick Action Buttons (4 grid matching Image 7) */}
            <section className="grid grid-cols-4 gap-2.5 md:gap-4">
              {/* Directions Button */}
              <button
                id="btn-action-directions"
                onClick={() => {
                  onNavigate(place);
                  onBack();
                }}
                className="flex flex-col items-center justify-center py-3 px-2 bg-[#2563EB] text-white rounded-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-sm group"
              >
                <span className="material-symbols-outlined text-[22px] mb-1 group-hover:scale-110 transition-transform">
                  directions
                </span>
                <span className="text-xs font-bold">Directions</span>
              </button>

              {/* Call Button */}
              <button
                id="btn-action-call"
                onClick={handleCall}
                className="flex flex-col items-center justify-center py-3 px-2 bg-white text-[#2563EB] border border-slate-200/80 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-xs group"
              >
                <span className="material-symbols-outlined text-[22px] mb-1 group-hover:scale-110 transition-transform">
                  call
                </span>
                <span className="text-xs font-bold text-slate-800">Call</span>
              </button>

              {/* Save Button */}
              <button
                id="btn-action-save"
                onClick={() => onToggleSave(place)}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-2xl border transition-all active:scale-95 shadow-xs group ${
                  isSaved
                    ? 'bg-blue-50 text-[#2563EB] border-blue-200 font-bold'
                    : 'bg-white text-[#2563EB] border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px] mb-1 group-hover:scale-110 transition-transform"
                  style={isSaved ? { fontVariationSettings: '"FILL" 1' } : {}}
                >
                  bookmark
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {isSaved ? 'Saved' : 'Save'}
                </span>
              </button>

              {/* Share Button */}
              <button
                id="btn-action-share"
                onClick={handleShare}
                className="flex flex-col items-center justify-center py-3 px-2 bg-white text-[#2563EB] border border-slate-200/80 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-xs group"
              >
                <span className="material-symbols-outlined text-[22px] mb-1 group-hover:scale-110 transition-transform">
                  share
                </span>
                <span className="text-xs font-bold text-slate-800">Share</span>
              </button>
            </section>

            {/* Detailed Info Card */}
            <section className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-4 space-y-3.5">
              {/* Address */}
              <div
                className="flex items-start gap-3 cursor-pointer group"
                onClick={() => {
                  onNavigate(place);
                  onBack();
                }}
              >
                <span className="material-symbols-outlined text-[#2563EB] mt-0.5 group-hover:scale-110 transition-transform">
                  location_on
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-[#2563EB] transition-colors">
                    {place.address}
                  </p>
                  <p className="text-xs font-bold text-[#2563EB] mt-0.5 flex items-center gap-1">
                    View on Map →
                  </p>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Hours / Schedule */}
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#2563EB] mt-0.5">schedule</span>
                <div className="flex-1">
                  <div
                    className="flex justify-between items-center w-full cursor-pointer"
                    onClick={() => setShowHoursSchedule(!showHoursSchedule)}
                  >
                    <div>
                      <p className="text-sm font-semibold text-emerald-700">
                        {place.isOpen ? 'Open Now' : 'Closed'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {place.closingTime ? `Closes at ${place.closingTime}` : place.openHours}
                      </p>
                    </div>
                    <span
                      className={`material-symbols-outlined text-slate-400 transition-transform ${
                        showHoursSchedule ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </div>

                  {showHoursSchedule && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2.5 pt-2.5 border-t border-slate-100 text-xs text-slate-600 space-y-1"
                    >
                      <div className="flex justify-between">
                        <span>Monday – Friday:</span>
                        <span className="font-semibold">{place.openHours}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday – Sunday:</span>
                        <span className="font-semibold">12:00 PM – 11:30 PM</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Website */}
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#2563EB] mt-0.5">language</span>
                <div className="min-w-0">
                  <a
                    href={`https://${place.website.replace(/^https?:\/\//, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-[#2563EB] hover:underline truncate block"
                  >
                    {place.website}
                  </a>
                </div>
              </div>
            </section>

            {/* Features Tags */}
            {place.features && place.features.length > 0 && (
              <section>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Amenities & Features
                </h3>
                <div className="flex flex-wrap gap-2">
                  {place.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[14px] text-emerald-600">
                        check_circle
                      </span>
                      {feat}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Recent Reviews Section */}
            <section className="space-y-3.5">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Recent Reviews</h3>
                <button
                  id="btn-open-add-review"
                  onClick={() => setShowReviewModal(true)}
                  className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span> Write a
                  Review
                </button>
              </div>

              <div className="space-y-3">
                {(allReviewsOpen ? place.reviews : place.reviews.slice(0, 2)).map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${rev.avatarColor}`}
                        >
                          {rev.avatarText}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{rev.author}</p>
                          <p className="text-[11px] text-slate-400">{rev.timeAgo}</p>
                        </div>
                      </div>
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className="material-symbols-outlined text-[15px]"
                            style={{
                              fontVariationSettings: i < rev.rating ? '"FILL" 1' : '"FILL" 0',
                            }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600">{rev.comment}</p>
                  </div>
                ))}
              </div>

              {place.reviews.length > 2 && (
                <button
                  onClick={() => setAllReviewsOpen(!allReviewsOpen)}
                  className="w-full py-2.5 text-[#2563EB] text-xs font-bold hover:bg-blue-50 rounded-xl transition-colors text-center"
                >
                  {allReviewsOpen
                    ? 'Show less'
                    : `Read all ${place.reviews.length} reviews`}
                </button>
              )}
            </section>
          </div>

          {/* Sidebar / Mini Map Column (Desktop & Visual Reference) */}
          <div className="md:col-span-4 mt-6 md:mt-0 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden p-3.5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Location Map
              </h4>
              <div className="rounded-xl overflow-hidden h-[220px] relative border border-slate-100">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX0DR9rxcwfEmDcLOzG-FMtTE-vYstkSDEAi32G-tC6PfjcnNqoe852UkomrW_ikea-vEf7YOyo8Jukr_A26y_rEnkLHupLJw_idy7JfccNEkifYUlLmFqUVfvKUjL86bcbWFsOUKPxHFEK_aUYFda_FhpwRKWEGvJHjbDgXLPCZRJ11gD-TxDzeghFsoTI4TQ7yWHeGsGc0ryjv7oM5OUEx3c7-jX1Yq0e4YzpbPP0Vh38gowCmc"
                  alt="Location Mini Map"
                  className="w-full h-full object-cover"
                />
                {/* Visual Pin */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#2563EB] drop-shadow-md animate-bounce">
                  <span
                    className="material-symbols-outlined text-[36px]"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    location_on
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  onNavigate(place);
                  onBack();
                }}
                className="mt-3 w-full py-2 bg-[#2563EB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">navigation</span> Start
                Directions
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Call Dial Dialog */}
      <AnimatePresence>
        {showCallOptions && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-2xl border border-slate-100 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-[26px]">call</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{place.name}</h3>
              <p className="text-sm font-semibold text-[#2563EB] mt-1">{place.phone}</p>
              <p className="text-xs text-slate-500 mt-2">
                Standard carrier charges may apply depending on your location.
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowCallOptions(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
                >
                  Cancel
                </button>
                <a
                  href={`tel:${place.phone.replace(/[^0-9+]/g, '')}`}
                  onClick={() => setShowCallOptions(false)}
                  className="flex-1 py-2 rounded-xl bg-[#2563EB] text-white font-bold text-xs hover:bg-blue-700 flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span> Dial
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Write a Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-bold text-slate-900">Write a Review</h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleAddReviewSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rating
                  </label>
                  <div className="flex gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <span
                          className="material-symbols-outlined text-[24px]"
                          style={{
                            fontVariationSettings:
                              star <= reviewRating ? '"FILL" 1' : '"FILL" 0',
                          }}
                        >
                          star
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Johnson"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Experience
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Share your thoughts about food, ambience, service..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-[#2563EB] text-white font-bold text-xs hover:bg-blue-700"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-400">
              check_circle
            </span>
            Details copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
