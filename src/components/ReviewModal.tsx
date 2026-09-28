'use client';

import React, { useState } from 'react';
import { X, Star, Heart, CheckCircle2 } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
}

export default function ReviewModal({
  isOpen,
  onClose,
  orderId,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [foodRating, setFoodRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Compliments to the Chef']);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const quickTags = [
    'Compliments to the Chef',
    'Lightning Fast Service',
    'Perfect Temperature',
    'Generous Portions',
    'Stunning Presentation',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const fullComment = selectedTags.length > 0 
        ? `${selectedTags.join(', ')}. ${comment}`
        : comment;

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          rating,
          foodRating,
          serviceRating,
          comment: fullComment || 'Exceptional culinary experience!',
        }),
      });

      if (!res.ok) throw new Error('Failed to submit review');
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('Could not submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-fade-in relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Thank You!</h3>
            <p className="text-xs text-slate-500">
              Your feedback helps our culinary and service teams maintain Michelin-grade standards.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">How Was Your Experience?</h3>
                <p className="text-xs text-slate-500">Rate your meal at The Royal Rasoi</p>
              </div>
            </div>

            {/* Overall Rating Stars */}
            <div className="text-center p-3 rounded-2xl bg-amber-50/50 border border-amber-100">
              <div className="text-xs font-bold text-slate-700 mb-1.5">Overall Dining Rating</div>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'text-amber-500 fill-amber-500 drop-shadow-xs'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Food vs Service Rating Sliders */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Food Quality</span>
                  <span className="text-brand-600">{foodRating}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={foodRating}
                  onChange={(e) => setFoodRating(parseInt(e.target.value, 10))}
                  className="w-full accent-brand-600 h-1 bg-slate-200 rounded cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Service Speed</span>
                  <span className="text-brand-600">{serviceRating}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={serviceRating}
                  onChange={(e) => setServiceRating(parseInt(e.target.value, 10))}
                  className="w-full accent-brand-600 h-1 bg-slate-200 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Quick compliments badges */}
            <div>
              <div className="text-xs font-bold text-slate-700 mb-2">Compliments & Tags</div>
              <div className="flex flex-wrap gap-1.5">
                {quickTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment Textarea */}
            <div>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share any specific notes for our chef or waitstaff..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
              />
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-md transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
