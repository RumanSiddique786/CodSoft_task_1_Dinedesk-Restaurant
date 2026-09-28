'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Printer, QrCode, ExternalLink } from 'lucide-react';

interface TableQRCodeModalProps {
  tableNumber: string;
  section: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function TableQRCodeModal({
  tableNumber,
  section,
  isOpen,
  onClose,
}: TableQRCodeModalProps) {
  const [dataUrl, setDataUrl] = useState<string>('');
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const tableUrl = `${origin}/?table=${tableNumber}`;

  useEffect(() => {
    if (tableNumber) {
      QRCode.toDataURL(
        tableUrl,
        {
          width: 320,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        },
        (err, url) => {
          if (!err && url) {
            setDataUrl(url);
          }
        }
      );
    }
  }, [tableNumber, tableUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 animate-fade-in relative text-center">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Card Area */}
        <div id="printable-qr-card" className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 mb-5">
          <div className="flex items-center justify-center gap-1.5 mb-1 text-brand-600">
            <QrCode className="w-4 h-4" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest">
              The Royal Rasoi Grand Bistro
            </span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-0.5">
            Table {tableNumber}
          </h2>
          <p className="text-[11px] text-slate-500 mb-4 font-medium">
            {section} · Contactless Ordering
          </p>

          {dataUrl ? (
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 inline-block mb-3">
              <img src={dataUrl} alt={`QR Code for Table ${tableNumber}`} className="w-52 h-52 mx-auto" />
            </div>
          ) : (
            <div className="w-52 h-52 bg-slate-200 rounded-2xl animate-pulse mx-auto mb-3" />
          )}

          <p className="text-[11px] text-slate-600 font-semibold max-w-xs mx-auto">
            Scan with your phone camera to view the menu, customize dishes, and order instantly.
          </p>
        </div>

        {/* Action Controls */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <a
              href={dataUrl}
              download={`DineDesk-Table-${tableNumber}-QR.png`}
              className="flex-1 py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </a>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Card</span>
            </button>
          </div>

          <a
            href={tableUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 transition-colors"
          >
            <span>Open Table Session URL</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
}
