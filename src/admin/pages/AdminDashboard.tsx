import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { MENU_ITEMS, OUTLETS, GALLERY_ITEMS, BRAND } from '../../data/mockData';

// ─── Static counts from website ─────────────────────────────────
const STATIC_MENU_COUNT = MENU_ITEMS.length;
const STATIC_LOCATION_COUNT = OUTLETS.length;
const STATIC_GALLERY_COUNT = GALLERY_ITEMS.length;
const STATIC_PALAV = MENU_ITEMS.filter(m => m.category === 'palav').length;
const STATIC_STARTERS = MENU_ITEMS.filter(m => m.category === 'starter').length;
const STATIC_COMBOS = MENU_ITEMS.filter(m => m.category === 'combo').length;
const STATIC_OUTLETS_BLR = OUTLETS.filter(o => !o.isOutOfBangalore && !o.isITCampus).length;
const STATIC_OUTLETS_IT = OUTLETS.filter(o => o.isITCampus).length;
const STATIC_OUTLETS_OOB = OUTLETS.filter(o => o.isOutOfBangalore).length;

function StatCard({ icon, label, value, sub, color, to }: {
  icon: string; label: string; value: number | string; sub?: string; color: string; to: string;
}) {
  return (
    <Link to={to} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
          <span className="material-symbols-outlined text-white text-[20px]">{icon}</span>
        </div>
        <span className="material-symbols-outlined text-gray-300 group-hover:text-gray-400 transition-colors text-[18px]">arrow_forward</span>
      </div>
      <div>
        <div className="text-3xl font-bold text-gray-900 mb-0.5">{value}</div>
        <div className="text-sm text-gray-500 leading-tight">{label}</div>
        {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
      </div>
    </Link>
  );
}

function MiniCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className={`rounded-xl px-3 py-2 ${color} flex items-center justify-between gap-2`}>
      <span className="text-xs font-semibold truncate">{label}</span>
      <span className="text-sm font-bold flex-shrink-0">{value}</span>
    </div>
  );
}

export function AdminDashboard() {
  const [dbMenuCount, setDbMenuCount] = useState<number | null>(null);
  const [dbLocationCount, setDbLocationCount] = useState<number | null>(null);
  const [dbGalleryCount, setDbGalleryCount] = useState<number | null>(null);
  const [dbFranchiseCount, setDbFranchiseCount] = useState<number | null>(null);
  const [dbConnected, setDbConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [menu, locations, gallery, franchise] = await Promise.all([
          supabase.from('menu_items').select('id', { count: 'exact' }),
          supabase.from('locations').select('id', { count: 'exact' }),
          supabase.from('gallery_items').select('id', { count: 'exact' }),
          supabase.from('franchise_inquiries').select('id', { count: 'exact' }),
        ]);

        const coreError = menu.error || locations.error || gallery.error;
        setDbConnected(!coreError);

        if (!coreError) {
          setDbMenuCount(menu.count ?? 0);
          setDbLocationCount(locations.count ?? 0);
          setDbGalleryCount(gallery.count ?? 0);
          setDbFranchiseCount(franchise.count ?? 0);
        }
      } catch {
        setDbConnected(false);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const totalMenu = STATIC_MENU_COUNT + (dbMenuCount ?? 0);
  const totalLocations = STATIC_LOCATION_COUNT + (dbLocationCount ?? 0);
  const totalGallery = STATIC_GALLERY_COUNT + (dbGalleryCount ?? 0);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Complete overview of everything on your website.</p>
      </div>

      {/* ── Supabase warning ── */}
      {!dbConnected && !loading && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
          <span className="material-symbols-outlined text-amber-500 flex-shrink-0">warning</span>
          <div>
            <h3 className="font-semibold text-amber-800 mb-1">Database Not Connected</h3>
            <p className="text-amber-700 text-sm">
              Showing <strong>static website data only</strong> below. To also see admin-added items, fix your Supabase connection.
              Add the correct <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> (the JWT key starting with <code className="bg-amber-100 px-1 rounded">eyJ…</code>) from your Supabase project settings.
            </p>
            <Link to="/admin/settings" className="inline-flex items-center gap-1 text-amber-800 font-semibold text-sm mt-2 hover:underline">
              Go to Settings <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      )}

      {/* ── Main Stats Row ── */}
      <div>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Website Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon="restaurant_menu" label="Total Menu Items"
            value={loading ? '…' : totalMenu}
            sub={dbConnected ? `${STATIC_MENU_COUNT} static + ${dbMenuCount} added` : `${STATIC_MENU_COUNT} on website`}
            color="bg-blue-600" to="/admin/menu"
          />
          <StatCard
            icon="location_on" label="Total Branches"
            value={loading ? '…' : totalLocations}
            sub={dbConnected ? `${STATIC_LOCATION_COUNT} static + ${dbLocationCount} added` : `${STATIC_LOCATION_COUNT} on website`}
            color="bg-purple-600" to="/admin/locations"
          />
          <StatCard
            icon="photo_library" label="Gallery Images"
            value={loading ? '…' : totalGallery}
            sub={dbConnected ? `${STATIC_GALLERY_COUNT} static + ${dbGalleryCount} added` : `${STATIC_GALLERY_COUNT} on website`}
            color="bg-amber-500" to="/admin/gallery"
          />
          <StatCard
            icon="handshake" label="Franchise Requests"
            value={loading ? '…' : dbConnected ? (dbFranchiseCount ?? 0) : '—'}
            sub={dbConnected ? 'From admin DB' : 'Needs DB connection'}
            color="bg-rose-600" to="/admin/franchise"
          />
        </div>
      </div>

      {/* ── Menu Breakdown ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-gray-900">Menu Items on Website</h2>
            <p className="text-xs text-gray-400 mt-0.5">{STATIC_MENU_COUNT} items currently live on the public menu page</p>
          </div>
          <Link to="/admin/menu" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
            Manage <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>
        {/* Category breakdown mini cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
          <MiniCard label="Palav" value={STATIC_PALAV} color="bg-blue-50 text-blue-800" />
          <MiniCard label="Starters" value={STATIC_STARTERS} color="bg-orange-50 text-orange-800" />
          <MiniCard label="Combos" value={STATIC_COMBOS} color="bg-rose-50 text-rose-800" />
          {dbConnected && dbMenuCount !== null && dbMenuCount > 0 && (
            <MiniCard label="Admin Added" value={dbMenuCount} color="bg-emerald-50 text-emerald-800" />
          )}
        </div>
        {/* Item list preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {MENU_ITEMS.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg flex-shrink-0 border border-gray-200" />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-gray-400 text-[16px]">restaurant</span>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-800 truncate">{item.name}</p>
                <p className="text-xs text-gray-400">{item.price} · <span className="capitalize">{item.category}</span></p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" title="Live on website" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Locations Breakdown ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-gray-900">Branches & Outlets on Website</h2>
            <p className="text-xs text-gray-400 mt-0.5">{STATIC_LOCATION_COUNT} outlets across Bengaluru and beyond</p>
          </div>
          <Link to="/admin/locations" className="text-xs font-semibold text-purple-600 hover:underline flex items-center gap-1">
            Manage <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <MiniCard label="Bengaluru" value={STATIC_OUTLETS_BLR} color="bg-purple-50 text-purple-800" />
          <MiniCard label="IT Campus" value={STATIC_OUTLETS_IT} color="bg-indigo-50 text-indigo-800" />
          <MiniCard label="Out of BLR" value={STATIC_OUTLETS_OOB} color="bg-amber-50 text-amber-800" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {OUTLETS.map(outlet => (
            <div key={outlet.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              {outlet.image ? (
                <img src={outlet.image} alt={outlet.name} className="w-10 h-10 object-cover rounded-lg flex-shrink-0 border border-gray-200" />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-gray-400 text-[16px]">location_on</span>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-800 truncate">{outlet.name}</p>
                <p className="text-xs text-gray-400 truncate">{outlet.area || outlet.address.slice(0, 40)}</p>
              </div>
              <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${outlet.isITCampus ? 'bg-indigo-100 text-indigo-700' : outlet.isOutOfBangalore ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'}`}>
                {outlet.isITCampus ? 'IT' : outlet.isOutOfBangalore ? 'OOB' : 'BLR'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Gallery Breakdown ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-gray-900">Gallery Images on Website</h2>
            <p className="text-xs text-gray-400 mt-0.5">{STATIC_GALLERY_COUNT} images across food, kitchen & restaurant sections</p>
          </div>
          <Link to="/admin/gallery" className="text-xs font-semibold text-amber-600 hover:underline flex items-center gap-1">
            Manage <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {GALLERY_ITEMS.map(item => (
            <div key={item.id} className="relative group">
              <img
                src={item.imageUrl}
                alt={item.title ?? item.categoryLabel}
                className="w-full aspect-square object-cover rounded-lg border border-gray-200"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <p className="text-white text-[8px] font-semibold text-center px-1 leading-tight">{item.title ?? item.categoryLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Brand Info Card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-900 mb-4">Restaurant Brand Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: 'Brand Name', value: BRAND.name, icon: 'store' },
            { label: 'Established', value: 'Since 1989', icon: 'history' },
            { label: 'Main Phone', value: BRAND.displayPhone, icon: 'call' },
            { label: 'Franchise Email', value: BRAND.email, icon: 'mail' },
            { label: 'Info Email', value: BRAND.infoEmail, icon: 'mail_outline' },
            { label: 'Flagship', value: 'Balepet, Bengaluru', icon: 'location_on' },
          ].map(row => (
            <div key={row.label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <span className="material-symbols-outlined text-gray-400 text-[18px] flex-shrink-0">{row.icon}</span>
              <div className="min-w-0">
                <p className="text-xs text-gray-400">{row.label}</p>
                <p className="text-xs font-semibold text-gray-800 truncate">{row.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Add Menu Item', icon: 'add_circle', to: '/admin/menu', color: 'text-blue-600 bg-blue-50 hover:bg-blue-100' },
            { label: 'Add Location', icon: 'add_location', to: '/admin/locations', color: 'text-purple-600 bg-purple-50 hover:bg-purple-100' },
            { label: 'Upload Image', icon: 'add_photo_alternate', to: '/admin/gallery', color: 'text-amber-600 bg-amber-50 hover:bg-amber-100' },
            { label: 'View Franchise', icon: 'handshake', to: '/admin/franchise', color: 'text-rose-600 bg-rose-50 hover:bg-rose-100' },
          ].map(a => (
            <Link key={a.label} to={a.to} className={`${a.color} rounded-xl p-3 flex flex-col items-center gap-2 transition-colors text-center`}>
              <span className="material-symbols-outlined text-[24px]">{a.icon}</span>
              <span className="text-xs font-semibold">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
