'use client';

import React, { useState } from 'react';
import { X, Bell, Droplets, Receipt, Utensils, HelpCircle, CheckCircle2 } from 'lucide-react';
import { sound } from '@/lib/audio';

interface CallWaiterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string;
}

export default function CallWaiterModal({
  isOpen,
  onClose,
  tableNumber,
}: CallWaiterModalProps) {
  const [selectedReason, setSelectedReason] = useState('Water Refill');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const reasons = [
    { label: 'Water Bottle / Pani Carafe', icon: Droplets, color: 'text-blue-500 bg-blue-50 border-blue-200' },
    { label: 'Bring the Bill / Check', icon: Receipt, color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
    { label: 'Extra Chutney, Pyaaz & Napkins', icon: Utensils, color: 'text-amber-500 bg-amber-50 border-amber-200' },
    { label: 'Captain Table Assistance', icon: HelpCircle, color: 'text-indigo-500 bg-indigo-50 border-indigo-200' },
  ];

  const handleCall = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/waiter-calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNumber,
          reason: selectedReason,
        }),
      });

      if (!res.ok) throw new Error('Failed to alert waiter');

      sound.playWaiterBell();
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        onClose();
      }, 2400);
    } catch (err) {
      console.error(err);
      alert('Could not notify waiter. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 animate-fade-in relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSent ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce-subtle">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Waiter Notified!</h3>
            <p className="text-xs text-slate-500">
              A staff member has been alerted for <span className="font-bold text-slate-800">Table {tableNumber}</span> and will be right with you.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                <Bell className="w-5 h-5 animate-bounce-subtle" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Call Waiter</h3>
                <p className="text-xs text-slate-500">Table {tableNumber} · Instant Notification</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Tap what you need and our front-of-house team will be dispatched directly to your table:
            </p>

            {/* Quick Reason Selection */}
            <div className="space-y-2">
              {reasons.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedReason === r.label;
                return (
                  <button
                    key={r.label}
                    type="button"
                    onClick={() => setSelectedReason(r.label)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-xs font-bold transition-all text-left ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/50 text-slate-900 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${r.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleCall}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-brand-600 hover:from-amber-600 hover:to-brand-700 text-white text-xs font-extrabold shadow-md shadow-amber-500/25 active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {isLoading ? 'Ringing Waiter...' : '🔔 Ring Service Bell'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
