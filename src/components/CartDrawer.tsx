'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Users, 
  Gift, 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  Clock
} from 'lucide-react';
import { CartItem, Order } from '@/lib/types';
import { Language, translations } from '@/lib/i18n';
import { sound } from '@/lib/audio';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  tableNumber: string | null;
  onOrderPlaced: (order: Order) => void;
  language: Language;
  restaurantSlug?: string;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  tableNumber,
  onOrderPlaced,
  language,
  restaurantSlug,
}: CartDrawerProps) {
  const t = translations[language];

  const [orderType, setOrderType] = useState<'DINE_IN' | 'PICKUP'>('DINE_IN');
  const [showSplitBill, setShowSplitBill] = useState(false);
  const [splitCount, setSplitCount] = useState(2);
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [redeemedPoints, setRedeemedPoints] = useState(false);
  const [customerName, setCustomerName] = useState('Aarav Sharma');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Calculation logic (INR & 5% Restaurant GST)
  const subtotal = cart.reduce((acc, curr) => acc + curr.unitPrice * curr.quantity, 0);
  const tax = Number((subtotal * 0.05).toFixed(2));
  const discount = redeemedPoints ? 50.00 : 0.00;
  const tipAmount = tipPercent > 0 ? Number(((subtotal * tipPercent) / 100).toFixed(2)) : 0;
  const grandTotal = Math.max(0, Number((subtotal + tax + tipAmount - discount).toFixed(2)));
  const perPersonShare = splitCount > 0 ? (grandTotal / splitCount).toFixed(2) : grandTotal.toFixed(2);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);

    try {
      const payload = {
        restaurantSlug,
        type: orderType,
        tableNumber: orderType === 'DINE_IN' ? (tableNumber || 'T-01') : null,
        customerName: customerName || 'Guest Diner',
        items: cart.map((c) => ({
          menuItemId: c.menuItem.id,
          quantity: c.quantity,
          unitPrice: c.unitPrice,
          selectedOptions: c.selectedOptions,
          notes: c.notes,
        })),
        discountAmount: discount,
        paymentMethod: 'CARD',
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Order submission failed');
      const newOrder = await res.json();

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Sound feedback
      sound.playSuccessChime();

      onClearCart();
      onClose();
      onOrderPlaced(newOrder);
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-100 animate-fade-in">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900">{t.cart}</h2>
              <span className="text-xs bg-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded-full">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200/60 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-5">
            
            {/* Order Mode Toggle */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setOrderType('DINE_IN')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  orderType === 'DINE_IN'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                🍽️ {t.dineIn} ({tableNumber || 'T-01'})
              </button>
              <button
                type="button"
                onClick={() => setOrderType('PICKUP')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  orderType === 'PICKUP'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                🛍️ {t.takeaway}
              </button>
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                  <Clock className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">{t.emptyCart}</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {t.addItems}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl border border-slate-100 bg-slate-50/50 flex gap-3 relative group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0 bg-slate-200">
                      <Image
                        src={item.menuItem.imageUrl}
                        alt={item.menuItem.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.menuItem.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Options / Addons Badges */}
                      {item.selectedOptions && item.selectedOptions.length > 0 && (
                        <div className="text-[10px] text-brand-700 font-medium truncate mb-1">
                          + {item.selectedOptions.join(', ')}
                        </div>
                      )}

                      {item.notes && (
                        <div className="text-[10px] text-slate-500 italic truncate mb-1">
                          Note: "{item.notes}"
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-extrabold text-xs text-slate-900">
                          ₹{(item.unitPrice * item.quantity).toFixed(0)}
                        </span>

                        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <>
                {/* Standout Feature: Loyalty Points & Rewards */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-slate-900">DineDesk Rewards</span>
                    </div>
                    <span className="text-[11px] font-extrabold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
                      240 pts
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mb-2">
                    {t.redeemPoints}
                  </p>
                  <button
                    type="button"
                    onClick={() => setRedeemedPoints(!redeemedPoints)}
                    className={`w-full py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      redeemedPoints
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-700 border-amber-300 hover:bg-amber-100/50'
                    }`}
                  >
                    {redeemedPoints ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>₹50.00 Discount Applied!</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Apply 100 Points Discount</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Standout Feature: Split-Bill Calculator */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowSplitBill(!showSplitBill)}
                      className="flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-brand-600 transition-colors"
                    >
                      <Users className="w-4 h-4 text-indigo-500" />
                      <span>{t.splitBill}</span>
                    </button>
                    <span className="text-[11px] font-bold text-indigo-600">
                      ₹{perPersonShare} / person
                    </span>
                  </div>

                  {showSplitBill && (
                    <div className="mt-3 pt-3 border-t border-slate-200 space-y-3 animate-fade-in">
                      <div>
                        <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                          <span>{t.numberOfPeople}</span>
                          <span className="font-bold text-slate-900">{splitCount} Diners</span>
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="8"
                          value={splitCount}
                          onChange={(e) => setSplitCount(parseInt(e.target.value, 10))}
                          className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Tip Selector */}
                      <div>
                        <div className="text-xs text-slate-600 mb-1.5 font-medium">{t.tipAmount}</div>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[0, 10, 15, 20].map((pct) => (
                            <button
                              key={pct}
                              type="button"
                              onClick={() => setTipPercent(pct)}
                              className={`py-1 rounded-lg text-xs font-bold border transition-colors ${
                                tipPercent === pct
                                  ? 'bg-indigo-600 text-white border-indigo-600'
                                  : 'bg-white text-slate-700 border-slate-200'
                              }`}
                            >
                              {pct === 0 ? 'None' : `${pct}%`}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Diner Name input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name (for ticket & receipt)
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    placeholder="e.g. Aarav Sharma"
                  />
                </div>
              </>
            )}

          </div>

          {/* Footer Totals & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-white space-y-3 shrink-0">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>{t.subtotal}</span>
                  <span className="font-semibold text-slate-800">₹{subtotal.toFixed(0)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Rewards Discount</span>
                    <span>-₹{discount.toFixed(0)}</span>
                  </div>
                )}
                {tipAmount > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Waiter Gratuity ({tipPercent}%)</span>
                    <span>+₹{tipAmount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t.tax}</span>
                  <span className="font-semibold text-slate-800">₹{tax.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                  <span>{t.total}</span>
                  <span className="text-base text-brand-600 font-black">₹{grandTotal.toFixed(0)}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handlePlaceOrder}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-700 hover:to-amber-700 text-white font-extrabold text-sm shadow-lg shadow-brand-500/25 active:scale-[0.99] transition-all flex items-center justify-between disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>{isSubmitting ? 'Placing Order...' : t.checkout}</span>
                </div>
                <div className="flex items-center gap-1 font-black">
                  <span>₹{grandTotal.toFixed(0)}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
