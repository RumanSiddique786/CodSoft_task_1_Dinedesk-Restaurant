'use client';

import React, { useEffect, useState } from 'react';
import { 
  PackageSearch, 
  AlertTriangle, 
  TrendingDown, 
  CheckCircle2, 
  ShoppingCart, 
  RefreshCw,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { InventoryItem } from '@/lib/types';

interface ExtendedInventoryItem extends InventoryItem {
  isUrgent: boolean;
  daysLeft: number;
  status: 'CRITICAL_LOW' | 'REORDER_SOON' | 'OPTIMAL';
}

export default function PredictiveRestockingPage() {
  const [inventory, setInventory] = useState<ExtendedInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderGenerated, setOrderGenerated] = useState(false);

  const fetchRestockingData = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      if (data.restockingAlerts) {
        setInventory(data.restockingAlerts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestockingData();
  }, []);

  const criticalItems = inventory.filter((i) => i.status === 'CRITICAL_LOW');
  const reorderSoonItems = inventory.filter((i) => i.status === 'REORDER_SOON');

  const handleGeneratePO = () => {
    setOrderGenerated(true);
    setTimeout(() => setOrderGenerated(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              Machine Learning & Moving Average Model
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Predictive Ingredient Restocking
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Forecasts tomorrow's culinary demand based on 7-day rolling order history to prevent 86'd stockouts.
          </p>
        </div>

        <button
          onClick={handleGeneratePO}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all self-start sm:self-auto"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{orderGenerated ? 'Purchase Order Generated!' : 'Generate Supplier P.O.'}</span>
        </button>
      </div>

      {/* Alert KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
              Critical Low Stock
            </span>
            <div className="text-2xl font-black text-rose-950 mt-0.5">
              {criticalItems.length} Ingredients
            </div>
            <p className="text-[11px] text-rose-600 font-medium mt-1">
              Stockout expected within 24 hours
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-200/60 text-rose-700 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              Reorder Soon
            </span>
            <div className="text-2xl font-black text-amber-950 mt-0.5">
              {reorderSoonItems.length} Ingredients
            </div>
            <p className="text-[11px] text-amber-700 font-medium mt-1">
              Estimated 2-3 days consumption left
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-200/60 text-amber-800 flex items-center justify-center">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Optimal Inventory
            </span>
            <div className="text-2xl font-black text-emerald-950 mt-0.5">
              {inventory.length - criticalItems.length - reorderSoonItems.length} Items
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              Safely buffered for peak weekend service
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-200/60 text-emerald-800 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Inventory & Predictive Horizon Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Ingredient Stock Telemetry & Burn Rates
            </h3>
            <p className="text-xs text-slate-500">
              Live stock readings compared against automated depletion forecasts.
            </p>
          </div>
          <button
            onClick={fetchRestockingData}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-3 px-3">Ingredient</th>
                <th className="py-3 px-3">Current Stock</th>
                <th className="py-3 px-3">Safety Min</th>
                <th className="py-3 px-3">Cost / Unit</th>
                <th className="py-3 px-3">Forecast Horizon</th>
                <th className="py-3 px-3">Predictive Status</th>
                <th className="py-3 px-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-3 font-extrabold text-slate-900">
                    {item.name}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-slate-800">
                    {item.currentStock.toFixed(1)} {item.unit}
                  </td>
                  <td className="py-3.5 px-3 text-slate-500">
                    {item.minThreshold.toFixed(1)} {item.unit}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-800">
                    ₹{item.costPerUnit.toFixed(0)}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-extrabold text-slate-900">
                      ~{item.daysLeft} {item.daysLeft === 1 ? 'day' : 'days'}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      estimated run-rate
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                        item.status === 'CRITICAL_LOW'
                          ? 'bg-rose-50 text-rose-700 border-rose-300'
                          : item.status === 'REORDER_SOON'
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      }`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={handleGeneratePO}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                    >
                      <span>Reorder</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
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
