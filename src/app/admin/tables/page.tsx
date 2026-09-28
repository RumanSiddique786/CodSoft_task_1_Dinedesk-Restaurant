'use client';

import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  QrCode, 
  Users, 
  MapPin, 
  Printer, 
  ExternalLink, 
  X, 
  Check 
} from 'lucide-react';
import { Table } from '@/lib/types';
import TableQRCodeModal from '@/components/TableQRCodeModal';

export default function AdminTablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedQRTable, setSelectedQRTable] = useState<Table | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New Table Form
  const [number, setNumber] = useState('T-09');
  const [capacity, setCapacity] = useState('4');
  const [section, setSection] = useState('Main Floor');

  const fetchTables = async () => {
    try {
      const res = await fetch('/api/tables');
      const data = await res.json();
      if (Array.isArray(data)) setTables(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number, capacity, section }),
      });
      if (!res.ok) throw new Error('Table creation failed');
      await fetchTables();
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      alert('Could not create table.');
    }
  };

  const statusColors = {
    FREE: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    OCCUPIED: 'bg-rose-50 text-rose-700 border-rose-300',
    RESERVED: 'bg-amber-50 text-amber-700 border-amber-300',
    CLEANING: 'bg-sky-50 text-sky-700 border-sky-300',
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Floor Plan & Table QR Studio
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Manage physical table configurations and generate printable deep-linked ordering QR codes.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print QR Sheet</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md shadow-brand-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Table</span>
          </button>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {tables.map((table) => (
          <div
            key={table.id}
            className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xl font-black text-slate-900">{table.number}</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">{table.section}</div>
              </div>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                  statusColors[table.status]
                }`}
              >
                {table.status}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <Users className="w-4 h-4 text-slate-400" />
              <span>Capacity: {table.capacity} Guests</span>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedQRTable(table)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>View & Print QR</span>
              </button>

              <a
                href={`/?table=${table.number}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors"
                title="Test ordering session"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 animate-fade-in relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold text-slate-900 mb-1">Add Floor Table</h3>
            <p className="text-xs text-slate-500 mb-4">
              Configure table label, section, and guest seating limit.
            </p>

            <form onSubmit={handleCreateTable} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Table Number</label>
                <input
                  type="text"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="e.g. T-10 or B-01"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Seating Capacity</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  required
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dining Section</label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Main Floor">Main Floor</option>
                  <option value="Patio Garden">Patio Garden</option>
                  <option value="VIP Lounge">VIP Lounge</option>
                  <option value="Bar High-Tops">Bar High-Tops</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
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
                  Create Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Card Modal */}
      {selectedQRTable && (
        <TableQRCodeModal
          isOpen={true}
          tableNumber={selectedQRTable.number}
          section={selectedQRTable.section}
          onClose={() => setSelectedQRTable(null)}
        />
      )}

    </div>
  );
}
