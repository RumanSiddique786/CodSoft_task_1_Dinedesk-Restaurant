'use client';

import React, { useState } from 'react';
import { X, CalendarDays, Clock, Users, Phone, User, CheckCircle2, Sparkles, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '@/lib/audio';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName?: string;
  restaurantSlug?: string;
}

export default function ReservationModal({
  isOpen,
  onClose,
  restaurantName = 'The Royal Rasoi Grand Bistro',
  restaurantSlug = 'the-royal-rasoi',
}: ReservationModalProps) {
  const [customerName, setCustomerName] = useState('Aarav Sharma');
  const [customerPhone, setCustomerPhone] = useState('+91 98201 23456');
  const [customerEmail, setCustomerEmail] = useState('aarav.sharma@example.com');
  const [partySize, setPartySize] = useState('4');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('19:30');
  const [notes, setNotes] = useState('Family dinner, preferred quiet corner booth');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    id: string;
    tableNumber?: string;
    partySize: number;
    date: string;
    timeSlot: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          partySize: parseInt(partySize, 10),
          date,
          timeSlot,
          notes,
          restaurantSlug,
        }),
      });

      if (!res.ok) throw new Error('Reservation request failed');
      const data = await res.json();

      setConfirmedBooking({
        id: data.id,
        tableNumber: data.table ? data.table.number : 'Assigned on Arrival',
        partySize: parseInt(partySize, 10),
        date,
        timeSlot,
      });

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
        sound.playSuccessChime();
      } catch {}
    } catch (err) {
      console.error(err);
      alert('Could not complete table reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100 animate-fade-in relative my-8">
        
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          title="Close"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedBooking ? (
          /* Confirmation State */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Booking Confirmed
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                Table Reserved Successfully!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                We look forward to hosting you at <strong className="text-slate-800">{restaurantName}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left text-xs space-y-2">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Guest Name</span>
                <span className="font-extrabold text-slate-900">{customerName}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Assigned Table</span>
                <span className="font-extrabold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-lg border border-brand-200">
                  {confirmedBooking.tableNumber}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Party Size</span>
                <span className="font-extrabold text-slate-900">{confirmedBooking.partySize} Guests</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Date & Time</span>
                <span className="font-extrabold text-slate-900">{confirmedBooking.date} at {confirmedBooking.timeSlot}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">Contact</span>
                <span className="font-extrabold text-slate-900">{customerPhone}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              Done & Return to Menu
            </button>
          </div>
        ) : (
          /* Form State */
          <div>
            <div className="mb-5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full w-fit mb-2 border border-amber-200/70">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Instant Confirmation</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Reserve a Dining Table
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Book your seating at <strong className="text-slate-800">{restaurantName}</strong>.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Guest Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98201 23456"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Party Size</label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={partySize}
                      onChange={(e) => setPartySize(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-semibold bg-white cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-semibold cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Slot</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-semibold bg-white cursor-pointer"
                    >
                      {['12:30', '13:00', '13:30', '14:00', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'].map((slot) => (
                        <option key={slot} value={slot}>
                          {slot} hrs
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Special Occasion / Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Birthday, Anniversary, window booth"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white font-black text-xs shadow-lg shadow-brand-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>{isSubmitting ? 'Confirming Seating...' : 'Confirm Table Booking'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
