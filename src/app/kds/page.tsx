'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ChefHat, 
  Clock, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Layers, 
  ShieldAlert,
  ArrowLeft,
  X
} from 'lucide-react';
import { Order, MenuItem } from '@/lib/types';
import { getSocket } from '@/lib/socket';
import { sound } from '@/lib/audio';

export default function KitchenDisplaySystem() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [show86Drawer, setShow86Drawer] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PREPARING' | 'READY'>('ALL');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('the-royal-rasoi');
  const [restaurantName, setRestaurantName] = useState<string>('The Royal Rasoi Grand Bistro');

  // Keep a live clock to recalculate delay elapsed minutes every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  // Read URL query param if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const rest = params.get('restaurant');
      if (rest) setSelectedRestaurant(rest);
    }
  }, []);

  // Fetch initial active tickets and menu items for 86 controls
  const fetchOrders = async (slug = selectedRestaurant) => {
    try {
      const res = await fetch(`/api/orders?status=ACTIVE&restaurant=${slug}`);
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMenuItems = async (slug = selectedRestaurant) => {
    try {
      const res = await fetch(`/api/menu?restaurant=${slug}`);
      const data = await res.json();
      if (data.restaurant) setRestaurantName(data.restaurant.name);
      if (data.categories) {
        const items = data.categories.flatMap((c: { menuItems: MenuItem[] }) => c.menuItems || []);
        setMenuItems(items);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders(selectedRestaurant);
    fetchMenuItems(selectedRestaurant);
  }, [selectedRestaurant]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit('join_room', 'kds');

    // Live new order ticket arrival
    socket.on('order:incoming', (newOrder: Order) => {
      setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)]);
      if (audioEnabled) {
        sound.playOrderChime();
      }
    });

    // Order status updated
    socket.on('order:status_changed', (data: { orderId: string; status: Order['status']; order?: Order }) => {
      setOrders((prev) => {
        if (data.status === 'SERVED' || data.status === 'CANCELLED') {
          return prev.filter((o) => o.id !== data.orderId);
        }
        return prev.map((o) => (o.id === data.orderId ? { ...o, status: data.status } : o));
      });
    });

    // Menu 86 toggle update
    socket.on('menu:availability_updated', (data: { itemId: string; isAvailable: boolean }) => {
      setMenuItems((prev) =>
        prev.map((item) => (item.id === data.itemId ? { ...item, isAvailable: data.isAvailable } : item))
      );
    });

    return () => {
      socket.off('order:incoming');
      socket.off('order:status_changed');
      socket.off('menu:availability_updated');
    };
  }, [audioEnabled]);

  // Status transition handler
  const handleTransition = async (orderId: string, nextStatus: Order['status']) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: nextStatus }),
      });

      if (!res.ok) throw new Error('Status update failed');
      const updated = await res.json();

      setOrders((prev) => {
        if (nextStatus === 'SERVED' || nextStatus === 'CANCELLED') {
          return prev.filter((o) => o.id !== orderId);
        }
        return prev.map((o) => (o.id === orderId ? updated : o));
      });
    } catch (err) {
      console.error(err);
      alert('Could not update status.');
    }
  };

  // 86'd Toggle Handler
  const handleToggle86 = async (itemId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, isAvailable: !currentStatus }),
      });

      if (res.ok) {
        setMenuItems((prev) =>
          prev.map((i) => (i.id === itemId ? { ...i, isAvailable: !currentStatus } : i))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Compute elapsed minutes
  const getElapsedMinutes = (createdAt: string) => {
    const diffMs = currentTime.getTime() - new Date(createdAt).getTime();
    return Math.max(0, Math.floor(diffMs / 60000));
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'ALL') return true;
    return o.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      
      {/* KDS Header Bar */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Back to Customer App"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                <span>Kitchen Display System</span>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  LIVE SOCKET.IO
                </span>
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <select
                  value={selectedRestaurant}
                  onChange={(e) => setSelectedRestaurant(e.target.value)}
                  className="bg-slate-800 text-xs font-bold text-emerald-400 border border-slate-700 rounded-lg px-2 py-0.5 outline-none cursor-pointer hover:bg-slate-700 transition-colors"
                >
                  <option value="the-royal-rasoi">👑 The Royal Rasoi (Delhi)</option>
                  <option value="dakshin-coastal-kitchen">🌊 Dakshin Coastal (Bengaluru)</option>
                  <option value="peshawari-darbar">🍢 Peshawari Darbar (Mumbai)</option>
                </select>
                <span className="text-[11px] text-slate-400">· {orders.length} Active Tickets</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Filter Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
          {(['ALL', 'PREPARING', 'READY'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === tab
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Audio Chime Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2.5 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1.5 ${
              audioEnabled
                ? 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700'
                : 'bg-red-950/50 text-red-400 border-red-800/60'
            }`}
            title="Audio alerts on new order"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{audioEnabled ? 'Chime ON' : 'Muted'}</span>
          </button>

          {/* 86'd Sold Out Items Drawer Toggle */}
          <button
            onClick={() => setShow86Drawer(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 text-xs font-bold transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>86'd Items</span>
          </button>

          <button
            onClick={() => fetchOrders()}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Refresh tickets"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Ticket Grid */}
      <main className="flex-1 p-4 sm:p-6 overflow-x-auto">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-28 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-emerald-500 mb-4 shadow-xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">All Clear, Chef!</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              No active tickets currently in the kitchen queue. Incoming orders from customer QR scans and waitstaff will chime and appear here in real time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredOrders.map((order) => {
              const elapsed = getElapsedMinutes(order.createdAt);
              // Smart delay thresholds:
              // <10m: Green normal
              // 10-20m: Amber warning
              // >20m: Urgent flashing red
              const isUrgent = elapsed >= 20;
              const isWarning = elapsed >= 10 && elapsed < 20;

              return (
                <div
                  key={order.id}
                  className={`bg-slate-900 rounded-3xl border flex flex-col justify-between overflow-hidden shadow-2xl transition-all ${
                    isUrgent
                      ? 'border-red-500/80 ticket-urgent ring-1 ring-red-500'
                      : isWarning
                      ? 'border-amber-500/60'
                      : 'border-slate-800'
                  }`}
                >
                  {/* Ticket Header */}
                  <div
                    className={`p-4 border-b flex items-center justify-between ${
                      isUrgent
                        ? 'bg-red-950/40 border-red-900/60'
                        : isWarning
                        ? 'bg-amber-950/30 border-amber-900/50'
                        : 'bg-slate-800/50 border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-white">
                          {order.type === 'DINE_IN' ? `Table ${order.table?.number || 'T-XX'}` : 'Takeaway'}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                          {order.orderNumber}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {order.customerName} · {order.items.length} items
                      </div>
                    </div>

                    {/* Delay Elapsed Timer Badge */}
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black ${
                        isUrgent
                          ? 'bg-red-600 text-white animate-pulse'
                          : isWarning
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{elapsed}m</span>
                    </div>
                  </div>

                  {/* Special Guest Instructions Banner */}
                  {order.guestNotes && (
                    <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">"{order.guestNotes}"</span>
                    </div>
                  )}

                  {/* Ticket Items List */}
                  <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-72">
                    {order.items.map((item, idx) => {
                      const options: string[] = item.selectedOptions 
                        ? (typeof item.selectedOptions === 'string' ? JSON.parse(item.selectedOptions) : item.selectedOptions)
                        : [];

                      return (
                        <div key={idx} className="border-b border-slate-800/60 pb-2.5 last:border-b-0 last:pb-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2">
                              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                                {item.quantity}
                              </span>
                              <div>
                                <h4 className="text-sm font-extrabold text-white">
                                  {item.menuItem?.name || 'Dish Item'}
                                </h4>
                                {options.length > 0 && (
                                  <div className="text-[11px] text-amber-400 font-semibold mt-0.5">
                                    + {options.join(', ')}
                                  </div>
                                )}
                                {item.notes && (
                                  <div className="text-[11px] text-slate-400 italic mt-0.5">
                                    Chef note: "{item.notes}"
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Ticket Footer Action Buttons */}
                  <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
                    {order.status === 'PLACED' || order.status === 'CONFIRMED' ? (
                      <button
                        type="button"
                        onClick={() => handleTransition(order.id, 'PREPARING')}
                        className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <Flame className="w-4 h-4" />
                        <span>Start Cooking</span>
                      </button>
                    ) : order.status === 'PREPARING' ? (
                      <button
                        type="button"
                        onClick={() => handleTransition(order.id, 'READY')}
                        className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Order Ready</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleTransition(order.id, 'SERVED')}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Mark Served / Cleared</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 86'd Item Availability Drawer */}
      {show86Drawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-extrabold text-white">86'd Dishes / Live Out-of-Stock</h3>
                </div>
                <button
                  onClick={() => setShow86Drawer(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-400 mb-4">
                Toggling an item off immediately updates all customer mobile menus across all tables via WebSockets:
              </p>

              <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{item.name}</div>
                      <div className="text-[10px] text-slate-400">₹{item.price.toFixed(0)}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggle86(item.id, item.isAvailable)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                        item.isAvailable
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600/30'
                          : 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      }`}
                    >
                      {item.isAvailable ? 'Available' : "86'd (Sold Out)"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShow86Drawer(false)}
              className="w-full mt-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
