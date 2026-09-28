'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Users, Phone, Mail, Clock, Check, X, Plus } from 'lucide-react';
import { Reservation } from '@/lib/types';

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Reservation Form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [partySize, setPartySize] = useState('2');
  const [date, setDate] = useState('2026-09-25');
  const [timeSlot, setTimeSlot] = useState('19:30');
  const [notes, setNotes] = useState('');

  const fetchReservations = async () => {
    try {
      const res = await fetch('/api/reservations');
      const data = await res.json();
      if (Array.isArray(data)) setReservations(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleUpdateStatus = async (reservationId: string, status: Reservation['status']) => {
    try {
      await fetch('/api/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId, status }),
      });
      setReservations((prev) =>
        prev.map((r) => (r.id === reservationId ? { ...r, status } : r))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail: 'guest@example.com',
          partySize,
          date,
          timeSlot,
          notes,
        }),
      });

      if (!res.ok) throw new Error('Booking failed');
      await fetchReservations();
      setShowAddModal(false);
      setCustomerName('');
      setCustomerPhone('');
      setNotes('');
    } catch (err) {
      console.error(err);
      alert('Could not create reservation.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Table Reservations</h2>
          <p className="text-xs text-slate-500 font-medium">
            Manage table bookings, guest party sizes, and auto-confirmed slots.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md shadow-brand-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Reservation</span>
        </button>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Guest</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Party Size</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Assigned Table</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {reservations.map((resv) => (
                <tr key={resv.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">
                    <div>{resv.customerName}</div>
                    {resv.notes && (
                      <div className="text-[10px] text-slate-400 font-normal italic">
                        "{resv.notes}"
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{resv.customerPhone}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 font-bold text-slate-800">
                      <Users className="w-3.5 h-3.5 text-brand-600" />
                      <span>{resv.partySize} Guests</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{resv.date}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{resv.timeSlot}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {resv.table ? `Table ${resv.table.number}` : 'Unassigned'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        resv.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : resv.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {resv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {resv.status !== 'CONFIRMED' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(resv.id, 'CONFIRMED')}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                          title="Confirm Booking"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {resv.status !== 'CANCELLED' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(resv.id, 'CANCELLED')}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition-colors"
                          title="Cancel Booking"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Reservation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 animate-fade-in relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold text-slate-900 mb-1">Book New Table</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter customer reservation details and party size.
            </p>

            <form onSubmit={handleCreateReservation} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Guest Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98201 23456"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Party Size</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    required
                    value={partySize}
                    onChange={(e) => setPartySize(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Slot</label>
                  <input
                    type="time"
                    required
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reservation Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Special Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Anniversary celebration, corner booth"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold shadow-md shadow-brand-500/20"
                >
                  Save Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
