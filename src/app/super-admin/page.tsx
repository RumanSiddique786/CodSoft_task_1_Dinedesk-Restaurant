'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Building2, 
  Activity, 
  CreditCard, 
  ShieldCheck, 
  ArrowLeft,
  Server,
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function SuperAdminPage() {
  const tenants = [
    {
      name: "The Royal Rasoi Grand Bistro",
      slug: 'the-royal-rasoi',
      plan: 'Enterprise Tier',
      tables: 8,
      monthlyVolume: '₹42,85,000',
      status: 'ACTIVE',
      health: '99.98%',
    },
    {
      name: 'Dakshin Coastal Kitchen',
      slug: 'dakshin-coastal-kitchen',
      plan: 'Growth Tier',
      tables: 14,
      monthlyVolume: '₹68,20,000',
      status: 'ACTIVE',
      health: '100%',
    },
    {
      name: 'Peshawari Darbar & Tandoor',
      slug: 'peshawari-darbar',
      plan: 'Growth Tier',
      tables: 12,
      monthlyVolume: '₹51,40,000',
      status: 'ACTIVE',
      health: '99.95%',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h1 className="text-xl font-black text-white">
                  DineDesk SaaS Platform Monitor
                </h1>
                <span className="text-[10px] font-bold bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full border border-violet-500/30">
                  SUPER ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-tenant restaurant fleet overview, platform GMV, and WebSocket cluster telemetry.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>All Systems Operational</span>
            </span>
          </div>
        </div>

        {/* Global SaaS Platform Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Platform GMV
            </span>
            <div className="text-2xl font-black text-white">₹1,62,45,000</div>
            <span className="text-[11px] text-emerald-400 font-bold">+24% month-over-month</span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Active Tenants
            </span>
            <div className="text-2xl font-black text-white">3 Restaurants</div>
            <span className="text-[11px] text-slate-400">34 Active Tables Monitored</span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              WebSocket Latency
            </span>
            <div className="text-2xl font-black text-emerald-400">14 ms</div>
            <span className="text-[11px] text-slate-400">Socket.io In-Memory Engine</span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Database Sync
            </span>
            <div className="text-2xl font-black text-white">PostgreSQL / Prisma</div>
            <span className="text-[11px] text-emerald-400 font-bold">100% Uptime</span>
          </div>
        </div>

        {/* Tenants Fleet Table */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white">Onboarded Restaurant Tenants</h3>
            <span className="text-xs text-slate-400">SaaS Multi-Tenant Fleet</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="pb-3">Restaurant Brand</th>
                  <th className="pb-3">Subscription Tier</th>
                  <th className="pb-3">Tables</th>
                  <th className="pb-3">Monthly GMV</th>
                  <th className="pb-3">API Health</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {tenants.map((t) => (
                  <tr key={t.slug} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 font-bold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-violet-400 shrink-0" />
                      <span>{t.name}</span>
                    </td>
                    <td className="py-3.5 text-slate-300">{t.plan}</td>
                    <td className="py-3.5">{t.tables} Tables</td>
                    <td className="py-3.5 font-bold text-white">{t.monthlyVolume}</td>
                    <td className="py-3.5 text-emerald-400 font-bold">{t.health}</td>
                    <td className="py-3.5">
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/?restaurant=${t.slug}`}
                          className="px-2.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-[11px] shadow-sm transition-colors inline-flex items-center gap-1"
                        >
                          <span>Visit Menu</span>
                        </Link>
                        <Link
                          href={`/kds?restaurant=${t.slug}`}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] border border-slate-700 transition-colors inline-flex items-center gap-1"
                        >
                          <span>KDS</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
