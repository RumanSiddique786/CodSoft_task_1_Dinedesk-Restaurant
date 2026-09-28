'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Clock, CheckCircle2, ShieldCheck, Tag, ArrowRight } from 'lucide-react';
import { HappyHourRule } from '@/lib/types';

export default function AdminHappyHourPage() {
  const [rules, setRules] = useState<HappyHourRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchRules = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      if (data.happyHours) setRules(data.happyHours);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleToggleActive = async (ruleId: string, currentActive: boolean) => {
    try {
      const res = await fetch('/api/analytics', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ happyHourId: ruleId, isActive: !currentActive }),
      });

      if (res.ok) {
        setRules((prev) =>
          prev.map((r) => (r.id === ruleId ? { ...r, isActive: !currentActive } : r))
        );
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateDiscount = async (ruleId: string, discountPercent: number) => {
    try {
      const res = await fetch('/api/analytics', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ happyHourId: ruleId, discountPercent }),
      });

      if (res.ok) {
        setRules((prev) =>
          prev.map((r) => (r.id === ruleId ? { ...r, discountPercent } : r))
        );
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Automated Pricing Rule Engine
          </span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Dynamic Happy-Hour Rules
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Configure time-slotted promotional pricing rules that dynamically discount menu items on customer phones.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Pricing rules updated successfully! Customer menus are synced.</span>
        </div>
      )}

      {/* Rules Configuration Cards */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">{rule.title}</h3>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                      rule.isActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {rule.isActive ? 'Active Engine' : 'Paused'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Applies to: {rule.targetCategory || 'All Food & Drinks'}
                </p>
              </div>

              {/* Toggle Engine Button */}
              <button
                type="button"
                onClick={() => handleToggleActive(rule.id, rule.isActive)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                  rule.isActive
                    ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                {rule.isActive ? 'Disable Happy Hour' : 'Activate Happy Hour Now'}
              </button>
            </div>

            {/* Rule Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span>Discount Percentage</span>
                  <span className="text-sm font-black text-brand-600">
                    {rule.discountPercent}% OFF
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={rule.discountPercent}
                  onChange={(e) => handleUpdateDiscount(rule.id, parseInt(e.target.value, 10))}
                  className="w-full accent-brand-600 h-1.5 bg-slate-200 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Time Window</span>
                </span>
                <div className="text-xs font-extrabold text-slate-900 pt-1">
                  {rule.startHour}:00 - {rule.endHour}:00 (Daily)
                </div>
                <span className="text-[10px] text-slate-400">
                  4:00 PM to 7:00 PM Sunset Window
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-500" />
                  <span>Targeted Dishes</span>
                </span>
                <div className="text-xs font-extrabold text-slate-900 pt-1">
                  Tandoori Kebabs, Starters & Mocktails
                </div>
                <span className="text-[10px] text-slate-400">
                  Auto strikethrough prices on customer devices
                </span>
              </div>

            </div>

            {/* Live Customer Preview Simulation */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                  Live Customer Preview
                </span>
                <div className="text-xs font-extrabold text-slate-900 mt-0.5">
                  Paneer Tikka Angara: <span className="line-through text-slate-400">₹340</span>{' '}
                  <span className="text-brand-600 font-black">
                    ₹{Math.round(340 * (1 - rule.discountPercent / 100))}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                Saved & Live
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
