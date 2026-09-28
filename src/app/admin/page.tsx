'use client';

import React, { useEffect, useState } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  UtensilsCrossed 
} from 'lucide-react';
import { Order } from '@/lib/types';

interface AnalyticsData {
  metrics: {
    totalRevenue: number;
    todayRevenue: number;
    totalOrders: number;
    occupancyRate: number;
    averageOrderValue: number;
  };
  peakHours: { hour: string; orders: number }[];
  topItems: { name: string; count: number; revenue: number }[];
}

export default function AdminOverviewPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAnalytics, resOrders] = await Promise.all([
          fetch('/api/analytics'),
          fetch('/api/orders'),
        ]);

        const dataAnalytics = await resAnalytics.json();
        const dataOrders = await resOrders.json();

        if (dataAnalytics.metrics) setAnalytics(dataAnalytics);
        if (Array.isArray(dataOrders)) setRecentOrders(dataOrders.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
      </div>
    );
  }

  const metrics = analytics?.metrics || {
    totalRevenue: 0,
    todayRevenue: 0,
    totalOrders: 0,
    occupancyRate: 0,
    averageOrderValue: 0,
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Executive Dashboard</h2>
        <p className="text-xs text-slate-500 font-medium">
          Real-time operations, sales performance, and guest volume telemetry.
        </p>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Today's Gross Sales
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              ₹{metrics.todayRevenue.toFixed(0)}
            </div>
            <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4% vs last week</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {metrics.totalOrders}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Avg Ticket: ₹{metrics.averageOrderValue.toFixed(0)}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Table Occupancy
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {metrics.occupancyRate}%
            </div>
            <div className="text-[11px] text-indigo-600 font-bold mt-1">
              Main Floor Active
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Lifetime Revenue
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              ₹{metrics.totalRevenue.toFixed(0)}
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">
              Platform Processed
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Analytics Charts & Top Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Peak Hours Volume Graph */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Guest Order Volume by Hour</h3>
              <p className="text-xs text-slate-500">Service traffic patterns from lunch rush to late dinner</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-brand-600" />
              <span>Peak: 7:00 PM - 9:00 PM</span>
            </div>
          </div>

          {/* Simple Visual Bar Chart */}
          <div className="h-48 flex items-end justify-between gap-1.5 pt-6 px-2">
            {(analytics?.peakHours || []).map((ph) => {
              const maxCount = Math.max(1, ...(analytics?.peakHours || []).map((p) => p.orders));
              const heightPercent = Math.max(15, (ph.orders / maxCount) * 100);

              return (
                <div key={ph.hour} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {ph.orders}
                  </div>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-amber-500 group-hover:from-brand-500 group-hover:to-amber-400 transition-all cursor-pointer shadow-xs"
                    style={{ height: `${heightPercent}%` }}
                    title={`${ph.hour}: ${ph.orders} orders`}
                  />
                  <span className="text-[10px] font-bold text-slate-400 truncate w-full text-center">
                    {ph.hour.split(':')[0]}h
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Selling Items Leaderboard */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Top Culinary Sellers</h3>
            <p className="text-xs text-slate-500">Highest volume dishes ordered this week</p>
          </div>

          <div className="space-y-3">
            {(analytics?.topItems || []).map((item, idx) => (
              <div
                key={item.name}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-brand-100 text-brand-800 text-xs font-black flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-extrabold text-slate-900 truncate">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {item.count} orders served
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-slate-900 shrink-0">
                  ₹{item.revenue.toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Orders Ledger Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Live & Recent Orders</h3>
            <p className="text-xs text-slate-500">Order stream processed across dining tables and pickup</p>
          </div>
          <span className="text-xs font-bold text-slate-400">Showing last 6 orders</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Type / Table</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Items</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 font-mono font-bold text-slate-900">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3 font-semibold">
                    {ord.type === 'DINE_IN' ? `Table ${ord.table?.number || 'T-XX'}` : 'Takeaway'}
                  </td>
                  <td className="py-3">{ord.customerName}</td>
                  <td className="py-3 text-slate-500">
                    {ord.items.map((i) => `${i.quantity}x ${i.menuItem?.name}`).join(', ')}
                  </td>
                  <td className="py-3 font-extrabold text-slate-900">
                    ₹{ord.totalAmount.toFixed(0)}
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ord.status === 'SERVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'PREPARING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
