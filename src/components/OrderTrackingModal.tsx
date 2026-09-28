'use client';

import React, { useEffect, useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ChefHat, 
  Bell, 
  Utensils, 
  Printer, 
  Star, 
  Clock, 
  Receipt
} from 'lucide-react';
import { Order } from '@/lib/types';
import { getSocket } from '@/lib/socket';

interface OrderTrackingModalProps {
  isOpen?: boolean;
  order: Order | null;
  onClose: () => void;
  onOpenReview: () => void;
}

export default function OrderTrackingModal({
  isOpen = true,
  order: initialOrder,
  onClose,
  onOpenReview,
}: OrderTrackingModalProps) {
  const [order, setOrder] = useState<Order | null>(initialOrder);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

  // Listen to WebSocket status changes for this order
  useEffect(() => {
    if (!order) return;

    const socket = getSocket();
    const handleStatusChanged = (data: { orderId: string; status: Order['status']; order?: Order }) => {
      if (data.orderId === order.id) {
        if (data.order) {
          setOrder(data.order);
        } else {
          setOrder((prev) => (prev ? { ...prev, status: data.status } : null));
        }
      }
    };

    socket.on('order:status_changed', handleStatusChanged);
    return () => {
      socket.off('order:status_changed', handleStatusChanged);
    };
  }, [order]);

  if (!isOpen || !order) return null;

  const steps: { key: Order['status']; label: string; desc: string; icon: React.ElementType }[] = [
    { key: 'PLACED', label: 'Order Placed', desc: 'Sent directly to kitchen', icon: CheckCircle2 },
    { key: 'CONFIRMED', label: 'Confirmed', desc: 'Queued in kitchen tickets', icon: Clock },
    { key: 'PREPARING', label: 'Preparing', desc: 'Chefs are cooking your dishes', icon: ChefHat },
    { key: 'READY', label: 'Plated & Ready', desc: 'En route to your table', icon: Bell },
    { key: 'SERVED', label: 'Served', desc: 'Bon appétit!', icon: Utensils },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.status);
  const activeIdx = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 animate-fade-in relative my-8">
        
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          title="Close Tracker and Back to Menu"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
              Live Order Tracker
            </span>
            <span className="text-xs font-bold text-slate-400">
              {order.orderNumber}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {order.type === 'DINE_IN' ? `Table ${order.table?.number || 'T-01'}` : 'Takeaway Order'}
          </h2>
          <p className="text-xs text-slate-500">
            Estimated time: approx {order.estimatedMinutes} minutes
          </p>
        </div>

        {/* Animated 5-Step Progress Bar */}
        <div className="py-4 px-2 bg-slate-50/80 rounded-2xl border border-slate-100 mb-6">
          <div className="relative flex justify-between items-center mb-6 px-3">
            {/* Connecting progress bar track */}
            <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-200 -z-0">
              <div 
                className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${(activeIdx / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {/* Stepper Dots */}
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isPast = idx < activeIdx;
              const isCurrent = idx === activeIdx;

              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 scale-110 ring-4 ring-brand-100 animate-pulse'
                        : isPast
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white text-slate-300 border-2 border-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-bold mt-2 text-center absolute -bottom-5 w-20 ${
                    isCurrent ? 'text-brand-600' : isPast ? 'text-emerald-700' : 'text-slate-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center pt-2">
            <span className="text-xs font-semibold text-slate-600">
              Status:{' '}
              <span className="font-extrabold text-slate-900">
                {steps[activeIdx]?.desc}
              </span>
            </span>
          </div>
        </div>

        {/* Toggle Invoice / Receipt */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowReceipt(!showReceipt)}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-brand-600" />
              <span>Digital Tax Invoice & Items</span>
            </div>
            <span className="text-brand-600 font-extrabold">₹{order.totalAmount.toFixed(0)}</span>
          </button>

          {showReceipt && (
            <div className="mt-3 p-4 rounded-xl border border-dashed border-slate-300 bg-white space-y-2 text-xs text-slate-600 animate-fade-in">
              <div className="font-bold text-slate-900 border-b pb-1 flex justify-between">
                <span>Item</span>
                <span>Subtotal</span>
              </div>
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between py-1">
                  <span>
                    {item.quantity}x {item.menuItem?.name || 'Dish Item'}
                  </span>
                  <span className="font-semibold text-slate-900">
                    ₹{item.subtotal.toFixed(0)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span>GST (5.0%)</span>
                  <span>₹{order.taxAmount?.toFixed(0) || '0'}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-[11px] text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>-₹{order.discountAmount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-slate-900 text-sm pt-1 border-t">
                  <span>Total Paid (UPI / Card)</span>
                  <span className="text-brand-600">₹{order.totalAmount.toFixed(0)}</span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenReview();
            }}
            className="flex-1 py-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Rate This Meal</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            Back to Menu
          </button>
        </div>

      </div>
    </div>
  );
}
