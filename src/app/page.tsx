'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  Search, 
  Flame, 
  Plus, 
  Sparkles, 
  Bell, 
  Calendar, 
  Clock, 
  ShieldAlert, 
  ChevronRight,
  Filter
} from 'lucide-react';
import Navbar, { RestaurantInfo } from '@/components/Navbar';
import ItemCustomizerModal from '@/components/ItemCustomizerModal';
import CartDrawer from '@/components/CartDrawer';
import CallWaiterModal from '@/components/CallWaiterModal';
import OrderTrackingModal from '@/components/OrderTrackingModal';
import ReviewModal from '@/components/ReviewModal';
import ReservationModal from '@/components/ReservationModal';
import { MenuItem, Category, CartItem, Order, HappyHourRule } from '@/lib/types';
import { Language, translations } from '@/lib/i18n';
import { getSocket } from '@/lib/socket';

export default function CustomerMenuPage() {
  // Multi-Tenant Restaurant State
  const [restaurants, setRestaurants] = useState<RestaurantInfo[]>([]);
  const [currentRestaurant, setCurrentRestaurant] = useState<RestaurantInfo | null>(null);
  const [restaurantSlug, setRestaurantSlug] = useState<string>('the-royal-rasoi');

  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [happyHours, setHappyHours] = useState<HappyHourRule[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVeg, setFilterVeg] = useState(false);
  const [filterGF, setFilterGF] = useState(false);
  const [filterSpicy, setFilterSpicy] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [tableNumber, setTableNumber] = useState<string | null>('T-01');
  
  // Cart & Order State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [activeOrderCount, setActiveOrderCount] = useState<number>(0);

  // Modals
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCallWaiterOpen, setIsCallWaiterOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  const t = translations[language];

  // 1. Initial Load: Read URL params (?restaurant=...&table=...) and fetch menu & restaurants
  useEffect(() => {
    let initialSlug = 'the-royal-rasoi';
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const rest = params.get('restaurant');
      const tbl = params.get('table');
      if (tbl) setTableNumber(tbl);
      if (rest) {
        initialSlug = rest;
        try { localStorage.setItem('dinedesk_restaurant', rest); } catch {}
      } else {
        try {
          const saved = localStorage.getItem('dinedesk_restaurant');
          if (saved) initialSlug = saved;
        } catch {}
      }
    }
    setRestaurantSlug(initialSlug);

    const loadData = async () => {
      try {
        const [restRes, menuRes] = await Promise.all([
          fetch('/api/restaurants'),
          fetch(`/api/menu?restaurant=${initialSlug}`),
        ]);
        const rests = await restRes.json();
        const menuData = await menuRes.json();

        if (Array.isArray(rests)) {
          setRestaurants(rests);
          const found = rests.find((r: RestaurantInfo) => r.slug === initialSlug) || rests[0];
          setCurrentRestaurant(found || null);
        }
        if (menuData.categories) setCategories(menuData.categories);
        if (menuData.happyHours) setHappyHours(menuData.happyHours);
        if (menuData.restaurant) setCurrentRestaurant(menuData.restaurant);
      } catch (err) {
        console.error('Failed to load menu & restaurants:', err);
      }
    };

    loadData();
  }, []);

  const handleSelectRestaurant = async (newSlug: string) => {
    setRestaurantSlug(newSlug);
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('dinedesk_restaurant', newSlug); } catch {}
      const url = new URL(window.location.href);
      url.searchParams.set('restaurant', newSlug);
      window.history.pushState({}, '', url.toString());
    }
    setCart([]);
    setSelectedCategory('all');

    try {
      const res = await fetch(`/api/menu?restaurant=${newSlug}`);
      const data = await res.json();
      if (data.restaurant) setCurrentRestaurant(data.restaurant);
      if (data.categories) setCategories(data.categories);
      if (data.happyHours) setHappyHours(data.happyHours);

      const defaultTable = newSlug === 'dakshin-coastal-kitchen' ? 'D-01' : newSlug === 'peshawari-darbar' ? 'P-01' : 'T-01';
      setTableNumber(defaultTable);
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Real-time WebSocket Listeners for 86'd items and live status updates
  useEffect(() => {
    const socket = getSocket();

    // Dish availability 86 toggle from kitchen
    socket.on('menu:availability_updated', (data: { itemId: string; isAvailable: boolean }) => {
      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          menuItems: cat.menuItems?.map((item) =>
            item.id === data.itemId ? { ...item, isAvailable: data.isAvailable } : item
          ),
        }))
      );
    });

    return () => {
      socket.off('menu:availability_updated');
    };
  }, []);

  // Active Happy Hour logic
  const isHappyHourActive = happyHours.some((h) => h.isActive);
  const happyHourDiscount = isHappyHourActive ? 0.20 : 0.0; // 20% off

  // Flattened menu items with category context
  const allItems = useMemo(() => {
    return categories.flatMap((cat) =>
      (cat.menuItems || []).map((item) => ({ ...item, categorySlug: cat.slug }))
    );
  }, [categories]);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }
      if (filterVeg && !item.isVeg) return false;
      if (filterGF && !item.isGlutenFree) return false;
      if (filterSpicy && item.spiceLevel === 0) return false;
      return true;
    });
  }, [allItems, selectedCategory, searchQuery, filterVeg, filterGF, filterSpicy]);

  // Cart Handlers
  const handleAddToCart = (
    item: MenuItem,
    quantity: number,
    selectedOptions: string[],
    spiceLevel: number,
    notes: string,
    calculatedPrice: number
  ) => {
    const cartItemId = `${item.id}-${selectedOptions.sort().join('_')}-${spiceLevel}-${notes}`;
    const existingIndex = cart.findIndex((c) => c.id === cartItemId);

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          id: cartItemId,
          menuItem: item,
          quantity,
          selectedOptions,
          spiceLevel,
          notes,
          unitPrice: calculatedPrice,
        },
      ]);
    }
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== cartItemId));
  };

  const handleOrderPlaced = (order: Order) => {
    setActiveOrder(order);
    setActiveOrderCount((prev) => prev + 1);
    setIsTrackingOpen(true);
  };

  const totalCartCount = cart.reduce((acc, c) => acc + c.quantity, 0);
  const totalCartAmount = cart.reduce((acc, c) => acc + c.unitPrice * c.quantity, 0);

  return (
    <div className="min-h-screen pb-24 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        currentLanguage={language}
        onLanguageChange={setLanguage}
        tableNumber={tableNumber}
        onTableChange={setTableNumber}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeOrderCount={activeOrderCount}
        onOpenTracking={() => setIsTrackingOpen(true)}
        currentRestaurant={currentRestaurant}
        restaurants={restaurants}
        onSelectRestaurant={handleSelectRestaurant}
        onOpenReservation={() => setIsReservationOpen(true)}
      />

      {/* Dynamic Happy Hour Banner */}
      {isHappyHourActive && (
        <div className="bg-gradient-to-r from-amber-600 via-brand-600 to-orange-600 text-white text-xs sm:text-sm font-extrabold py-2 px-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-amber-200" />
              <span>{t.happyHourActive}</span>
            </div>
            <span className="hidden sm:inline-block text-[11px] bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
              Automatic Discounts Applied
            </span>
          </div>
        </div>
      )}

      {/* Hero Welcome & Search Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 border-b border-slate-200/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Title & Dine-in indicator */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[11px] font-extrabold text-brand-700 bg-brand-50 border border-brand-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Contactless Table Dining
                </span>
                {tableNumber && (
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    Table: {tableNumber}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setIsReservationOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200/80 transition-all cursor-pointer shadow-xs active:scale-95"
                  title="Reserve a Table"
                >
                  <Calendar className="w-3 h-3 text-amber-600" />
                  <span>Reserve a Table</span>
                </button>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                {currentRestaurant?.name || t.welcome}
              </h1>
              {currentRestaurant?.address && (
                <p className="text-xs text-brand-600 font-bold mt-1 flex items-center gap-1">
                  <span>📍 {currentRestaurant.address}</span>
                </p>
              )}
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-xl">
                {t.tagline}
              </p>
            </div>

            {/* Search Input */}
            <div className="w-full md:max-w-md">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

          </div>

          {/* Category Tabs & Dietary Filter Chips */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Category Navigation Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {t.allCategories}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Dietary Quick Filter Chips */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setFilterVeg(!filterVeg)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  filterVeg
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{t.vegOnly}</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterGF(!filterGF)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  filterGF
                    ? 'bg-amber-50 text-amber-700 border-amber-300 font-bold shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>🌾</span>
                <span>{t.glutenFreeOnly}</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterSpicy(!filterSpicy)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  filterSpicy
                    ? 'bg-red-50 text-red-700 border-red-300 font-bold shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>🌶️</span>
                <span>{t.spicyOnly}</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Main Dishes Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <Filter className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No dishes match your filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Try adjusting your dietary filters or search terms to explore our full menu.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterVeg(false);
                setFilterGF(false);
                setFilterSpicy(false);
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 shadow-md shadow-brand-500/20"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const discountedPrice = item.price * (1 - happyHourDiscount);
              const is86 = !item.isAvailable;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative ${
                    is86 ? 'opacity-65 grayscale-30' : ''
                  }`}
                >
                  {/* Food Image with Veg/Non-Veg & Allergy Badges */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

                    {/* Veg / Non-Veg Indicator Badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md p-1.5 rounded-lg shadow-sm">
                      <div
                        className={`w-3 h-3 rounded-full border-2 ${
                          item.isVeg
                            ? 'bg-emerald-500 border-emerald-600'
                            : 'bg-red-500 border-red-600'
                        }`}
                        title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                      />
                    </div>

                    {/* Prep Time Tag */}
                    <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{item.prepTimeMinutes}m</span>
                    </div>

                    {/* Spice Level Indicator */}
                    {item.spiceLevel > 0 && (
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-red-600 flex items-center gap-1 shadow-sm">
                        <Flame className="w-3 h-3 fill-red-500" />
                        <span>{'🌶️'.repeat(item.spiceLevel)}</span>
                      </div>
                    )}

                    {/* 86'd Sold Out Overlay */}
                    {is86 && (
                      <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4" />
                          <span>{t.soldOut}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-brand-600 transition-colors">
                          {item.name}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                        {item.description}
                      </p>

                      {/* Allergen tags */}
                      {item.allergens && (
                        <div className="text-[10px] text-slate-400 font-medium mb-3">
                          Contains: {item.allergens}
                        </div>
                      )}
                    </div>

                    {/* Price & Add to Cart button */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        {isHappyHourActive ? (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-black text-brand-600">
                              ₹{discountedPrice.toFixed(0)}
                            </span>
                            <span className="text-xs text-slate-400 line-through">
                              ₹{item.price.toFixed(0)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-base font-black text-slate-900">
                            ₹{item.price.toFixed(0)}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={is86}
                        onClick={() => setCustomizingItem(item)}
                        className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{t.customize}</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Action Button: Call Waiter (Bottom Left) */}
      {tableNumber && (
        <div className="fixed bottom-6 left-6 z-30">
          <button
            type="button"
            onClick={() => setIsCallWaiterOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white hover:bg-amber-50 text-amber-700 font-extrabold text-xs shadow-xl border border-amber-200/80 active:scale-95 transition-all group"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bell className="w-4 h-4 animate-bounce-subtle" />
            </div>
            <span>{t.callWaiter}</span>
          </button>
        </div>
      )}

      {/* Floating Bottom Cart Bar for Mobile & Desktop (when items in cart) */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-6 right-6 z-30">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-brand-500/30 active:scale-95 transition-all hover:scale-105"
          >
            <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs font-black">
              {totalCartCount}
            </span>
            <span>View Cart · ₹{totalCartAmount.toFixed(0)}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modals & Slide-overs */}
      {customizingItem && (
        <ItemCustomizerModal
          item={customizingItem}
          language={language}
          discountMultiplier={isHappyHourActive ? 1 - happyHourDiscount : 1}
          onClose={() => setCustomizingItem(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCart([])}
        tableNumber={tableNumber}
        onOrderPlaced={handleOrderPlaced}
        language={language}
        restaurantSlug={currentRestaurant?.slug || restaurantSlug}
      />

      <CallWaiterModal
        isOpen={isCallWaiterOpen}
        onClose={() => setIsCallWaiterOpen(false)}
        tableNumber={tableNumber || 'T-01'}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        order={activeOrder}
        onClose={() => setIsTrackingOpen(false)}
        onOpenReview={() => setIsReviewOpen(true)}
      />

      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        orderId={activeOrder?.id}
      />

      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        restaurantName={currentRestaurant?.name}
        restaurantSlug={currentRestaurant?.slug}
      />

    </div>
  );
}
