'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Flame, Plus, Minus, Check } from 'lucide-react';
import { MenuItem } from '@/lib/types';
import { Language, translations } from '@/lib/i18n';

interface ItemCustomizerModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    quantity: number,
    selectedOptions: string[],
    spiceLevel: number,
    notes: string,
    calculatedPrice: number
  ) => void;
  language: Language;
  discountMultiplier?: number;
}

export default function ItemCustomizerModal({
  item,
  onClose,
  onAddToCart,
  language,
  discountMultiplier = 1,
}: ItemCustomizerModalProps) {
  const t = translations[language];

  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState(item.spiceLevel || 0);
  const [notes, setNotes] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // Indian culinary add-on options
  const addonOptions = [
    { name: 'Extra Amul Butter & Cream Dollop', price: 40 },
    { name: 'Extra Malai Paneer Cubes', price: 70 },
    { name: 'Spicy Mint & Coriander Chutney', price: 25 },
    { name: 'Chilled Boondi Raita Bowl', price: 60 },
  ];

  const toggleAddon = (addonName: string) => {
    if (selectedAddons.includes(addonName)) {
      setSelectedAddons(selectedAddons.filter((a) => a !== addonName));
    } else {
      setSelectedAddons([...selectedAddons, addonName]);
    }
  };

  // Base price with happy hour discount
  const basePrice = item.price * discountMultiplier;
  const addonsTotal = selectedAddons.reduce((acc, curr) => {
    const found = addonOptions.find((a) => a.name === curr);
    return acc + (found ? found.price : 0);
  }, 0);

  const unitPrice = basePrice + addonsTotal;
  const totalPrice = unitPrice * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl border border-slate-100 animate-fade-in my-8 max-h-[90vh] flex flex-col">
        
        {/* Header Image with close button */}
        <div className="relative h-56 w-full bg-slate-100 shrink-0">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 500px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              {item.isVeg && (
                <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md">
                  Vegetarian
                </span>
              )}
              {item.isGlutenFree && (
                <span className="bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md">
                  Gluten Free
                </span>
              )}
              {item.allergens && (
                <span className="bg-white/20 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-md">
                  {item.allergens}
                </span>
              )}
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">{item.name}</h2>
          </div>
        </div>

        {/* Customization Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <p className="text-xs text-slate-600 leading-relaxed">
            {item.description}
          </p>

          {/* Spice Level Selector */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-2.5">
              <Flame className="w-4 h-4 text-red-500" />
              <span>{t.spiceLevel}</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { level: 0, label: t.mild, icon: '🌶️' },
                { level: 1, label: t.medium, icon: '🌶️🌶️' },
                { level: 2, label: t.hot, icon: '🌶️🌶️🌶️' },
                { level: 3, label: t.extraHot, icon: '🔥' },
              ].map((s) => (
                <button
                  key={s.level}
                  type="button"
                  onClick={() => setSpiceLevel(s.level)}
                  className={`py-2 px-1.5 rounded-xl text-xs font-bold border transition-all text-center ${
                    spiceLevel === s.level
                      ? 'bg-red-50 text-red-700 border-red-400 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  <div className="text-sm mb-0.5">{s.icon}</div>
                  <div className="truncate">{s.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Add-ons and Toppings */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2.5">
              Chef Add-Ons & Extras
            </label>
            <div className="space-y-2">
              {addonOptions.map((addon) => {
                const isSelected = selectedAddons.includes(addon.name);
                return (
                  <button
                    key={addon.name}
                    type="button"
                    onClick={() => toggleAddon(addon.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                      isSelected
                        ? 'bg-brand-50/70 border-brand-500 text-brand-900 font-semibold shadow-xs'
                        : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                          isSelected
                            ? 'bg-brand-600 border-brand-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <span>{addon.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      +₹{addon.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Instructions Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1.5">
              {t.specialNotes}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.notesPlaceholder}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/80 flex items-center gap-4 shrink-0">
          
          {/* Quantity Stepper */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-9 text-center font-bold text-sm text-slate-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Submit */}
          <button
            onClick={() => {
              onAddToCart(item, quantity, selectedAddons, spiceLevel, notes, unitPrice);
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-700 hover:to-amber-700 text-white font-extrabold text-sm shadow-md shadow-brand-500/25 active:scale-[0.99] transition-all flex items-center justify-between"
          >
            <span>{t.addToCart}</span>
            <span>₹{totalPrice.toFixed(0)}</span>
          </button>

        </div>

      </div>
    </div>
  );
}
