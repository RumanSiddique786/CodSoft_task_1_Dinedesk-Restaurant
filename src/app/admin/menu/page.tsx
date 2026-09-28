'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  Plus, 
  Search, 
  Trash2, 
  Flame, 
  Check, 
  X, 
  ShieldAlert, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { MenuItem, Category } from '@/lib/types';

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // New Dish Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('350');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80');
  const [isVeg, setIsVeg] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [spiceLevel, setSpiceLevel] = useState('0');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState('15');
  const [allergens, setAllergens] = useState('Dairy, Gluten');

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories);
        if (data.categories.length > 0 && !categoryId) {
          setCategoryId(data.categories[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleToggle86 = async (itemId: string, currentStatus: boolean) => {
    try {
      await fetch('/api/menu', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, isAvailable: !currentStatus }),
      });

      setCategories((prev) =>
        prev.map((c) => ({
          ...c,
          menuItems: c.menuItems?.map((i) =>
            i.id === itemId ? { ...i, isAvailable: !currentStatus } : i
          ),
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateDish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          price,
          categoryId,
          imageUrl,
          isVeg,
          isGlutenFree,
          spiceLevel,
          prepTimeMinutes,
          allergens,
        }),
      });

      if (!res.ok) throw new Error('Creation failed');
      await fetchMenu();
      setShowAddModal(false);
      // Reset form
      setName('');
      setDescription('');
    } catch (err) {
      console.error(err);
      alert('Could not save dish.');
    }
  };

  const allDishes = categories.flatMap((c) =>
    (c.menuItems || []).map((i) => ({ ...i, categoryName: c.name }))
  );

  const filteredDishes = allDishes.filter((dish) => {
    if (selectedCat !== 'all' && dish.categoryId !== selectedCat) return false;
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return dish.name.toLowerCase().includes(q) || dish.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Menu & Culinary Catalog</h2>
          <p className="text-xs text-slate-500 font-medium">
            Manage recipes, prices, allergens, and live 86'd stock availability.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md shadow-brand-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
              selectedCat === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            All Categories ({allDishes.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                selectedCat === c.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter dishes..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

      </div>

      {/* Dishes Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Dish</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Dietary</th>
                <th className="py-3 px-4">Spice</th>
                <th className="py-3 px-4">Prep Time</th>
                <th className="py-3 px-4 text-right">Availability (86'd)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredDishes.map((dish) => (
                <tr key={dish.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0 bg-slate-100">
                      <Image
                        src={dish.imageUrl}
                        alt={dish.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">{dish.name}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">
                        {dish.description}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-600">
                    {dish.categoryName}
                  </td>
                  <td className="py-3 px-4 font-black text-slate-900">
                    ₹{dish.price.toFixed(0)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      {dish.isVeg && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                          Veg
                        </span>
                      )}
                      {dish.isGlutenFree && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                          GF
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-red-500 font-bold">
                    {dish.spiceLevel > 0 ? '🌶️'.repeat(dish.spiceLevel) : 'None'}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {dish.prepTimeMinutes} mins
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggle86(dish.id, dish.isAvailable)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-black border transition-all ${
                        dish.isAvailable
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                      }`}
                    >
                      {dish.isAvailable ? 'In Stock (Live)' : "86'd (Sold Out)"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Dish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 animate-fade-in relative my-8">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold text-slate-900 mb-1">Add New Menu Item</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter recipe specifications, pricing, and allergen tags.
            </p>

            <form onSubmit={handleCreateDish} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Murgh Makhani or Paneer Tikka"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Gastronomic details, cooking methods, textures..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Spice (0-4)</label>
                  <input
                    type="number"
                    min="0"
                    max="4"
                    value={spiceLevel}
                    onChange={(e) => setSpiceLevel(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prep Time (min)</label>
                  <input
                    type="number"
                    value={prepTimeMinutes}
                    onChange={(e) => setPrepTimeMinutes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Allergens</label>
                  <input
                    type="text"
                    value={allergens}
                    onChange={(e) => setAllergens(e.target.value)}
                    placeholder="Dairy, Nuts..."
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isVeg}
                    onChange={(e) => setIsVeg(e.target.checked)}
                    className="accent-brand-600 rounded"
                  />
                  <span>Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isGlutenFree}
                    onChange={(e) => setIsGlutenFree(e.target.checked)}
                    className="accent-brand-600 rounded"
                  />
                  <span>Gluten Free</span>
                </label>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold shadow-md shadow-brand-500/20"
                >
                  Save & Publish Dish
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
