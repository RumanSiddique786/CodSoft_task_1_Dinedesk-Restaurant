'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  Globe, 
  MapPin, 
  Layers, 
  ChefHat, 
  BellRing, 
  ShieldCheck, 
  ChevronDown,
  Sparkles,
  Building2,
  Check,
  CalendarDays
} from 'lucide-react';
import { Language, translations } from '@/lib/i18n';

export interface RestaurantInfo {
  id: string;
  name: string;
  slug: string;
  address?: string | null;
  phone?: string | null;
}

interface NavbarProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  tableNumber: string | null;
  onTableChange: (table: string | null) => void;
  cartCount: number;
  onOpenCart: () => void;
  activeOrderCount?: number;
  onOpenTracking?: () => void;
  currentRestaurant?: RestaurantInfo | null;
  restaurants?: RestaurantInfo[];
  onSelectRestaurant?: (slug: string) => void;
  onOpenReservation?: () => void;
}

export default function Navbar({
  currentLanguage,
  onLanguageChange,
  tableNumber,
  onTableChange,
  cartCount,
  onOpenCart,
  activeOrderCount = 0,
  onOpenTracking,
  currentRestaurant,
  restaurants = [],
  onSelectRestaurant,
  onOpenReservation,
}: NavbarProps) {
  const [showRestaurantMenu, setShowRestaurantMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [inputTable, setInputTable] = useState(tableNumber || 'T-01');

  const t = translations[currentLanguage];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          
          {/* Brand Logo & Restaurant Switcher */}
          <div className="flex items-center gap-2.5">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-slate-900">
                    Dine<span className="text-brand-600">Desk</span>
                  </span>
                  <span className="text-[10px] font-semibold bg-brand-100 text-brand-700 px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                    SaaS
                  </span>
                </div>
              </div>
            </Link>

            {/* Vertical Separator */}
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            {/* Restaurant Switcher Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRestaurantMenu(!showRestaurantMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 text-left border border-slate-200/60 transition-colors group"
                title="Select Restaurant Outlet"
              >
                <div className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                  {currentRestaurant?.slug === 'dakshin-coastal-kitchen' ? '🌊' : currentRestaurant?.slug === 'peshawari-darbar' ? '🍢' : '👑'}
                </div>
                <div className="max-w-[140px] sm:max-w-[210px]">
                  <p className="text-xs font-black text-slate-900 truncate leading-tight group-hover:text-brand-600 transition-colors">
                    {currentRestaurant?.name || 'The Royal Rasoi Grand Bistro'}
                  </p>
                  <p className="text-[9px] text-slate-400 font-semibold truncate leading-none mt-0.5">
                    {currentRestaurant?.address?.split(',')[0] || 'Select Restaurant'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 shrink-0 ml-0.5" />
              </button>

              {/* Restaurant Dropdown Popover */}
              {showRestaurantMenu && (
                <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-white shadow-2xl border border-slate-200/80 py-2 z-50 animate-fade-in divide-y divide-slate-100">
                  <div className="px-4 py-2 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Select Restaurant</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      {restaurants.length || 3} Live
                    </span>
                  </div>

                  <div className="p-1.5 space-y-1">
                    {(restaurants.length > 0 ? restaurants : [
                      { id: '1', name: 'The Royal Rasoi Grand Bistro', slug: 'the-royal-rasoi', address: 'Connaught Circus, Central Delhi' },
                      { id: '2', name: 'Dakshin Coastal Kitchen', slug: 'dakshin-coastal-kitchen', address: '100ft Road, Indiranagar, Bengaluru' },
                      { id: '3', name: 'Peshawari Darbar & Tandoor', slug: 'peshawari-darbar', address: 'Colaba Causeway, South Mumbai' },
                    ]).map((r) => {
                      const isSelected = (currentRestaurant?.slug || 'the-royal-rasoi') === r.slug;
                      return (
                        <button
                          key={r.slug}
                          type="button"
                          onClick={() => {
                            if (onSelectRestaurant) onSelectRestaurant(r.slug);
                            setShowRestaurantMenu(false);
                          }}
                          className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all ${
                            isSelected
                              ? 'bg-brand-50 border border-brand-200 text-brand-950 font-bold shadow-xs'
                              : 'hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-xs ${
                            isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {r.slug === 'dakshin-coastal-kitchen' ? '🌊' : r.slug === 'peshawari-darbar' ? '🍢' : '👑'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <p className={`text-xs font-black truncate ${isSelected ? 'text-brand-700' : 'text-slate-900'}`}>
                                {r.name}
                              </p>
                              {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                              {r.address}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Book / Reserve Table Button */}
            {onOpenReservation && (
              <button
                type="button"
                onClick={onOpenReservation}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200/80 transition-colors shadow-xs"
                title="Book / Reserve a Table"
              >
                <CalendarDays className="w-3.5 h-3.5 text-amber-600" />
                <span>Reserve Table</span>
              </button>
            )}

            {/* Table Badge Selector */}
            <button
              onClick={() => setShowTableModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold transition-colors"
              title="Change Dining Table"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              <span>{tableNumber ? `${t.table} ${tableNumber}` : t.takeaway}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium transition-colors"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-slate-600" />
                <span className="uppercase text-[11px] font-bold">{currentLanguage}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl bg-white shadow-xl border border-slate-100 py-1.5 z-50 animate-fade-in">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        onLanguageChange(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left hover:bg-slate-50 transition-colors ${
                        currentLanguage === l.code ? 'font-bold text-brand-600 bg-brand-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Live Role Switcher (Portfolio Super Feature) */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors border border-indigo-200/60"
                title="Switch App Role"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Portals</span>
                <ChevronDown className="w-3 h-3 text-indigo-400" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-fade-in">
                  <div className="px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-slate-400">
                    Live Portal Views
                  </div>
                  <Link
                    href="/"
                    onClick={() => setShowRoleMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <UtensilsCrossed className="w-4 h-4 text-brand-600" />
                    <div>
                      <div className="font-semibold">Customer App</div>
                      <div className="text-[10px] text-slate-400">Digital menu & QR ordering</div>
                    </div>
                  </Link>
                  <Link
                    href="/kds"
                    onClick={() => setShowRoleMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <ChefHat className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-semibold">Kitchen Display (KDS)</div>
                      <div className="text-[10px] text-slate-400">Live kitchen tickets & 86'd items</div>
                    </div>
                  </Link>
                  <Link
                    href="/waiter"
                    onClick={() => setShowRoleMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <BellRing className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="font-semibold">Waiter & Floor Plan</div>
                      <div className="text-[10px] text-slate-400">Live buzzer & table statuses</div>
                    </div>
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setShowRoleMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-semibold">Admin Dashboard</div>
                      <div className="text-[10px] text-slate-400">Sales, restock & QR engine</div>
                    </div>
                  </Link>
                  <Link
                    href="/super-admin"
                    onClick={() => setShowRoleMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-violet-600" />
                    <div>
                      <div className="font-semibold">Super Admin (SaaS)</div>
                      <div className="text-[10px] text-slate-400">Tenants & platform telemetry</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Active Order Tracker Button (if user has placed order) */}
            {activeOrderCount > 0 && onOpenTracking && (
              <button
                onClick={onOpenTracking}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 transition-colors animate-pulse"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Tracking ({activeOrderCount})</span>
              </button>
            )}

            {/* Shopping Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 active:scale-95 transition-all flex items-center justify-center"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-slate-900 text-white text-[11px] font-extrabold flex items-center justify-center border-2 border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

        </div>
      </header>

      {/* Table Change Modal */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Set Your Dining Mode</h3>
            <p className="text-xs text-slate-500 mb-4">
              Select your table number for dine-in contactless service, or switch to takeaway.
            </p>

            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Table Number
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['T-01', 'T-02', 'T-03', 'T-04', 'T-05', 'T-06', 'T-07', 'T-08'].map((tbl) => (
                    <button
                      key={tbl}
                      onClick={() => setInputTable(tbl)}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                        inputTable === tbl
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {tbl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onTableChange(null);
                    setShowTableModal(false);
                  }}
                  className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
                >
                  Switch to Takeaway / Pickup
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTableModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onTableChange(inputTable);
                  setShowTableModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20"
              >
                Confirm Table
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
