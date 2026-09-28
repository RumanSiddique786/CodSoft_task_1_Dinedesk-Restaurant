'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  UtensilsCrossed, 
  ChefHat, 
  BellRing, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Mail,
  UserCheck
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const demoAccounts = [
    {
      role: 'Customer',
      email: 'customer@dinedesk.com',
      destination: '/',
      icon: UtensilsCrossed,
      color: 'bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100',
      desc: 'Digital menu, contactless ordering, live tracker',
    },
    {
      role: 'Head Waiter',
      email: 'waiter@dinedesk.com',
      destination: '/waiter',
      icon: BellRing,
      color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
      desc: 'Table floor plan, real-time call buzzer, cash checkout',
    },
    {
      role: 'Executive Chef (Kitchen)',
      email: 'kitchen@dinedesk.com',
      destination: '/kds',
      icon: ChefHat,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
      desc: 'Live KDS queue, ticket audio chimes, 86 dish controls',
    },
    {
      role: 'Restaurant Admin',
      email: 'admin@dinedesk.com',
      destination: '/admin',
      icon: ShieldCheck,
      color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
      desc: 'Sales metrics, QR code studio, predictive restocking',
    },
    {
      role: 'Super Admin (SaaS)',
      email: 'superadmin@dinedesk.com',
      destination: '/super-admin',
      icon: Sparkles,
      color: 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100',
      desc: 'Multi-tenant fleet, platform GMV telemetry',
    },
  ];

  const handleFastLogin = (destination: string) => {
    router.push(destination);
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('waiter')) router.push('/waiter');
    else if (email.includes('kitchen')) router.push('/kds');
    else if (email.includes('superadmin')) router.push('/super-admin');
    else if (email.includes('admin')) router.push('/admin');
    else router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8 animate-fade-in">
        
        {/* Brand Logo & Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
          </Link>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Welcome to DineDesk
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to access your role-tailored dashboard and operations center.
          </p>
        </div>

        {/* 1-Click Fast Demo Login Switcher (Portfolio Super Feature) */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <UserCheck className="w-4 h-4" />
              <span>1-Click Fast Demo Switcher</span>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">
              Instant Recruiter Access
            </span>
          </div>

          <div className="space-y-2">
            {demoAccounts.map((acc) => {
              const Icon = acc.icon;
              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleFastLogin(acc.destination)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between group ${acc.color}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/80 flex items-center justify-center shadow-xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold">{acc.role}</div>
                      <div className="text-[10px] opacity-80">{acc.desc}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Traditional Credentials Form */}
        <form onSubmit={handleStandardSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@restaurant.com"
                className="w-full pl-9 pr-3 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-700 hover:to-amber-700 text-white font-extrabold text-sm shadow-xl shadow-brand-500/25 active:scale-[0.99] transition-all"
          >
            Sign In with Credentials
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Return to{' '}
          <Link href="/" className="text-brand-400 hover:underline font-bold">
            Customer Ordering Menu
          </Link>
        </div>

      </div>
    </div>
  );
}
