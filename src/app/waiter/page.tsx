'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  BellRing, 
  MapPin, 
  CheckCircle2, 
  ArrowLeft, 
  Droplets, 
  Receipt, 
  Sparkles, 
  RefreshCw, 
  Check, 
  CreditCard,
  Volume2,
  VolumeX,
  Users
} from 'lucide-react';
import { Table, WaiterCall, Order } from '@/lib/types';
import { getSocket } from '@/lib/socket';
import { sound } from '@/lib/audio';

export default function WaiterDashboard() {
  const [tables, setTables] = useState<Table[]>([]);
  const [waiterCalls, setWaiterCalls] = useState<WaiterCall[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const fetchTables = async () => {
    try {
      const res = await fetch('/api/tables');
      const data = await res.json();
      if (Array.isArray(data)) setTables(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCalls = async () => {
    try {
      const res = await fetch('/api/waiter-calls');
      const data = await res.json();
      if (Array.isArray(data)) setWaiterCalls(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders?status=ACTIVE');
      const data = await res.json();
      if (Array.isArray(data)) setActiveOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTables();
    fetchCalls();
    fetchOrders();

    const socket = getSocket();
    socket.emit('join_room', 'waiter');

    // Real-time waiter buzzer event
    socket.on('waiter:buzzer', (callData: WaiterCall) => {
      setWaiterCalls((prev) => [callData, ...prev]);
      if (audioEnabled) {
        sound.playWaiterBell();
      }
    });

    // Real-time call cleared
    socket.on('waiter:call_cleared', (callId: string) => {
      setWaiterCalls((prev) => prev.filter((c) => c.id !== callId));
    });

    // Real-time table status update
    socket.on('table:status_changed', (data: { tableId: string; status: Table['status'] }) => {
      setTables((prev) =>
        prev.map((t) => (t.id === data.tableId ? { ...t, status: data.status } : t))
      );
    });

    return () => {
      socket.off('waiter:buzzer');
      socket.off('waiter:call_cleared');
      socket.off('table:status_changed');
    };
  }, [audioEnabled]);

  // Handle call resolution
  const handleResolveCall = async (callId: string) => {
    try {
      await fetch('/api/waiter-calls', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callId }),
      });
      setWaiterCalls((prev) => prev.filter((c) => c.id !== callId));
    } catch (err) {
      console.error(err);
    }
  };

  // Change table state
  const handleUpdateTableStatus = async (tableId: string, status: Table['status']) => {
    try {
      await fetch('/api/tables', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, status }),
      });
      setTables((prev) => prev.map((t) => (t.id === tableId ? { ...t, status } : t)));
      if (selectedTable?.id === tableId) {
        setSelectedTable((prev) => (prev ? { ...prev, status } : null));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const statusColors = {
    FREE: 'bg-emerald-500/10 text-emerald-700 border-emerald-300 ring-emerald-500',
    OCCUPIED: 'bg-rose-500/10 text-rose-700 border-rose-300 ring-rose-500',
    RESERVED: 'bg-amber-500/10 text-amber-700 border-amber-300 ring-amber-500',
    CLEANING: 'bg-sky-500/10 text-sky-700 border-sky-300 ring-sky-500',
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Waiter Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
              <BellRing className="w-5 h-5 animate-bounce-subtle" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                <span>Front-of-House Portal</span>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                  WAITER DESK
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">
                Floor Plan & Live Customer Call Buzzer
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1.5 ${
              audioEnabled
                ? 'bg-slate-800 text-amber-400 border-slate-700'
                : 'bg-red-950/50 text-red-400 border-red-800/60'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{audioEnabled ? 'Bell ON' : 'Muted'}</span>
          </button>

          <button
            onClick={() => {
              fetchTables();
              fetchCalls();
              fetchOrders();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        
        {/* Left Column: Live Call Buzzer Queue (Standout Feature) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <span>Incoming Table Calls ({waiterCalls.length})</span>
            </h2>
            <span className="text-[11px] text-slate-400">Real-time WebSocket</span>
          </div>

          {waiterCalls.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-800/40 border border-slate-800 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
              <h4 className="text-xs font-bold text-white">No Active Waiter Calls</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                When diners tap "Call Waiter" from their mobile QR session, alert tickets will ring here instantly.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {waiterCalls.map((call) => (
                <div
                  key={call.id}
                  className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/50 shadow-xl flex items-center justify-between gap-3 animate-fade-in"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm shrink-0">
                      {call.table?.number || 'T-XX'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        {call.reason.toLowerCase().includes('water') ? (
                          <Droplets className="w-3.5 h-3.5 text-blue-400" />
                        ) : call.reason.toLowerCase().includes('bill') ? (
                          <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        <span>{call.reason}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {call.table?.section || 'Main Dining'} · Just now
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleResolveCall(call.id)}
                    className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all shrink-0"
                  >
                    Clear Call
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Quick Stats Widget */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-300">Floor Overview</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Seated Tables</span>
                <span className="font-extrabold text-rose-400">
                  {tables.filter((t) => t.status === 'OCCUPIED').length}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Available</span>
                <span className="font-extrabold text-emerald-400">
                  {tables.filter((t) => t.status === 'FREE').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Interactive Floor Plan */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Interactive Floor Plan & Table States</span>
            </h2>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Free
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Occupied
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Reserved
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-sky-500" /> Cleaning
              </span>
            </div>
          </div>

          {/* Tables Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {tables.map((table) => {
              const isSelected = selectedTable?.id === table.id;
              const hasActiveCall = waiterCalls.some((c) => c.table?.number === table.number);

              return (
                <div
                  key={table.id}
                  onClick={() => setSelectedTable(table)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer bg-slate-800/80 hover:bg-slate-800 flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'border-brand-500 ring-2 ring-brand-500 shadow-xl'
                      : hasActiveCall
                      ? 'border-amber-500 ticket-urgent'
                      : 'border-slate-700/80'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-base font-black text-white">{table.number}</div>
                      <div className="text-[10px] text-slate-400">{table.section}</div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {table.capacity}
                    </span>
                  </div>

                  {/* Status Pill */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                        statusColors[table.status]
                      }`}
                    >
                      {table.status}
                    </span>
                    {hasActiveCall && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Inspector & State Modifier Panel */}
          {selectedTable && (
            <div className="p-5 rounded-3xl bg-slate-800/90 border border-slate-700 shadow-2xl animate-fade-in space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white">
                    Table {selectedTable.number} Inspector
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedTable.section} · Seats up to {selectedTable.capacity} guests
                  </p>
                </div>
                <span
                  className={`text-xs font-black px-3 py-1 rounded-full border ${
                    statusColors[selectedTable.status]
                  }`}
                >
                  {selectedTable.status}
                </span>
              </div>

              {/* State Transition Action Buttons */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Update Table Operational Status:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['FREE', 'OCCUPIED', 'RESERVED', 'CLEANING'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateTableStatus(selectedTable.id, st)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-black border transition-all ${
                        selectedTable.status === st
                          ? 'bg-brand-600 text-white border-brand-500 shadow-md'
                          : 'bg-slate-900 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                    >
                      Mark {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deep link session generator */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-700">
                <span>Dine-In URL: /?table={selectedTable.number}</span>
                <Link
                  href={`/?table=${selectedTable.number}`}
                  target="_blank"
                  className="text-brand-400 hover:text-brand-300 font-bold underline"
                >
                  Launch Customer Ordering Session →
                </Link>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
