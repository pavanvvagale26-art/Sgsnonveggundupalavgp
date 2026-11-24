import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../context/ToastContext';
import { Toggle } from '../components/Toggle';
import { OUTLETS } from '../../data/mockData';
import { getDeletedIds, addDeletedId } from '../../lib/contentStorage';

export interface LocationRow {
  id: string;
  name: string;
  zone: string;
  zone_label: string;
  type_label: string;
  type_color: string;
  address: string;
  area: string;
  phone: string | null;
  timings: string;
  notes: string | null;
  map_url: string | null;
  image_url: string | null;
  active: boolean;
  display_order: number;
  is_it_campus: boolean;
  is_out_of_bangalore: boolean;
  state: string | null;
  isStaticDefault?: boolean;
}

const ZONES = ['central', 'north', 'south', 'east', 'west', 'tech', 'outstation'];
const EMPTY: Omit<LocationRow, 'id'> = {
  name: '',
  zone: 'central',
  zone_label: 'Central',
  type_label: 'Dine-in & Takeaway',
  type_color: 'bg-emerald-600',
  address: '',
  area: '',
  phone: null,
  timings: '',
  notes: null,
  map_url: null,
  image_url: null,
  active: true,
  display_order: 0,
  is_it_campus: false,
  is_out_of_bangalore: false,
  state: 'Karnataka',
};

const isUuid = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

function LocationForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: Partial<LocationRow>;
  onSave: (data: Omit<LocationRow, 'id'>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const { toast } = useToast();
  const { isStaticDefault: _isd, id: _id, ...safeInitial } = initial as LocationRow;
  const [form, setForm] = useState({ ...EMPTY, ...safeInitial });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initial.image_url ?? '');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return form.image_url ?? null;
    setUploading(true);
    try {
      const ext = imageFile.name.split('.').pop();
      const path = `locations/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('sgs-images').upload(path, imageFile, { upsert: true });
      if (error) throw error;
      return supabase.storage.from('sgs-images').getPublicUrl(path).data.publicUrl;
    } catch {
      toast('Image upload failed.', 'error');
      return form.image_url ?? null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim()) {
      toast('Name and address are required.', 'error');
      return;
    }
    const image_url = await uploadImage();
    onSave({ ...form, image_url });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">
            {initial.id ? `Edit: ${initial.name}` : 'Add Location'}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-xl cursor-pointer">
            <span className="material-symbols-outlined text-gray-500">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label-style">Branch Name *</label>
              <input
                value={form.name}
                onChange={e => set('name', e.target.value)}
                required
                placeholder="Balepet Flagship"
                className="input-style w-full"
              />
            </div>
            <div>
              <label className="label-style">Zone</label>
              <select
                value={form.zone}
                onChange={e => {
                  set('zone', e.target.value);
                  set('zone_label', e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1));
                }}
                className="input-style w-full bg-white capitalize"
              >
                {ZONES.map(z => (
                  <option key={z} value={z} className="capitalize">
                    {z.charAt(0).toUpperCase() + z.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-style">Zone Label</label>
              <input
                value={form.zone_label}
                onChange={e => set('zone_label', e.target.value)}
                placeholder="Central Zone"
                className="input-style w-full"
              />
            </div>
            <div>
              <label className="label-style">Type Label</label>
              <input
                value={form.type_label}
                onChange={e => set('type_label', e.target.value)}
                placeholder="Dine-in & Takeaway"
                className="input-style w-full"
              />
            </div>
            <div>
              <label className="label-style">State</label>
              <input
                value={form.state ?? ''}
                onChange={e => set('state', e.target.value)}
                placeholder="Karnataka"
                className="input-style w-full"
              />
            </div>
            <div className="col-span-2">
              <label className="label-style">Full Address *</label>
              <textarea
                value={form.address}
                onChange={e => set('address', e.target.value)}
                required
                rows={2}
                placeholder="Street, Area, City, PIN"
                className="input-style w-full resize-none"
              />
            </div>
            <div className="col-span-2">
              <label className="label-style">Area (Short)</label>
              <input
                value={form.area}
                onChange={e => set('area', e.target.value)}
                placeholder="Balepet Circle, Bengaluru"
                className="input-style w-full"
              />
            </div>
            <div>
              <label className="label-style">Phone</label>
              <input
                value={form.phone ?? ''}
                onChange={e => set('phone', e.target.value)}
                placeholder="9341246466"
                className="input-style w-full"
              />
            </div>
            <div>
              <label className="label-style">Display Order</label>
              <input
                type="number"
                value={form.display_order}
                onChange={e => set('display_order', Number(e.target.value))}
                className="input-style w-full"
              />
            </div>
            <div className="col-span-2">
              <label className="label-style">Opening Hours</label>
              <input
                value={form.timings}
                onChange={e => set('timings', e.target.value)}
                placeholder="Tue–Fri: 10am–3pm, 6pm–9:30pm | Sun: 8am–3pm"
                className="input-style w-full"
              />
            </div>
            <div className="col-span-2">
              <label className="label-style">Google Maps URL or Query</label>
              <input
                value={form.map_url ?? ''}
                onChange={e => set('map_url', e.target.value)}
                placeholder="https://maps.google.com/..."
                className="input-style w-full"
              />
            </div>
            <div className="col-span-2">
              <label className="label-style">Notes</label>
              <textarea
                value={form.notes ?? ''}
                onChange={e => set('notes', e.target.value)}
                rows={2}
                placeholder="Additional notes..."
                className="input-style w-full resize-none"
              />
            </div>

            {/* Branch Image */}
            <div className="col-span-2">
              <label className="label-style">Branch Image</label>
              <div className="flex gap-4 items-start">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-24 h-24 object-cover rounded-xl border border-gray-200 flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <input
                    value={form.image_url ?? ''}
                    onChange={e => {
                      set('image_url', e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://... or upload"
                    className="input-style w-full mb-2"
                  />
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors w-full justify-center cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">upload</span>
                    {imageFile ? imageFile.name : 'Upload Image'}
                  </button>
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(
                [
                  { key: 'active', label: 'Active Branch', description: 'Show on website' },
                  { key: 'is_it_campus', label: 'IT Campus', description: 'Tech park outlet' },
                  { key: 'is_out_of_bangalore', label: 'Out of BLR', description: 'Non-Bengaluru branch' },
                ] as { key: keyof LocationRow; label: string; description: string }[]
              ).map(({ key, label, description }) => (
                <Toggle
                  key={key}
                  value={!!(form as Record<string, unknown>)[key]}
                  onChange={() => set(key, !(form as Record<string, unknown>)[key])}
                  label={label}
                  description={description}
                />
              ))}
            </div>
          </div>
        </form>
        <div className="flex gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit as never}
            disabled={saving || uploading}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {(saving || uploading) && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {uploading ? 'Uploading…' : saving ? 'Saving…' : 'Save Location'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminLocations() {
  const [items, setItems] = useState<LocationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<LocationRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LocationRow | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      // 1. Get deleted location IDs
      const deleted = await getDeletedIds('deleted_location_items');

      // 2. Load DB items
      const { data: dbData } = await supabase.from('locations').select('*').order('display_order');
      const dbItems: LocationRow[] = (dbData ?? []).map(d => ({
        ...d,
        isStaticDefault: false,
      }));

      // 3. Map static outlets
      const staticRows: LocationRow[] = OUTLETS.map(o => ({
        id: o.id,
        name: o.name,
        zone: o.zone,
        zone_label: o.zoneLabel,
        type_label: o.typeLabel,
        type_color: o.typeColor || 'bg-emerald-600',
        address: o.address,
        area: o.area,
        phone: o.phone || null,
        timings: o.timings,
        notes: o.notes || null,
        map_url: o.mapQuery || null,
        image_url: o.image || null,
        active: true,
        display_order: 0,
        is_it_campus: o.isITCampus || false,
        is_out_of_bangalore: o.isOutOfBangalore || false,
        state: o.state || 'Karnataka',
        isStaticDefault: true,
      }));

      // 4. Merge: Supabase items override static items by name
      const merged: LocationRow[] = [
        ...dbItems,
        ...staticRows.filter(s => !dbItems.some(d => d.name.toLowerCase() === s.name.toLowerCase())),
      ];

      // 5. Filter deleted
      const activeList = merged.filter(
        item =>
          !deleted.includes(item.id.toLowerCase()) &&
          !deleted.includes(item.name.toLowerCase())
      );

      setItems(activeList);
    } catch (e) {
      console.error('Failed to load locations:', e);
      toast('Could not load locations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = items.filter(
    i =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.address.toLowerCase().includes(search.toLowerCase()) ||
      i.area.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data: Omit<LocationRow, 'id'>) => {
    setSaving(true);
    // Strip internal/non-DB fields before sending to Supabase
    const { isStaticDefault: _isd, ...cleanData } = data as Omit<LocationRow, 'id'> & { isStaticDefault?: boolean };
    try {
      if (editing && isUuid(editing.id)) {
        // Direct UUID update in Supabase
        const { error } = await supabase
          .from('locations')
          .update({ ...cleanData, updated_at: new Date().toISOString() })
          .eq('id', editing.id);
        if (error) throw error;
        toast('Location updated!', 'success');
      } else if (editing) {
        // Static item edit: update by name or insert new
        const { data: existing } = await supabase
          .from('locations')
          .select('id')
          .ilike('name', editing.name)
          .maybeSingle();

        if (existing?.id) {
          const { error } = await supabase
            .from('locations')
            .update({ ...cleanData, updated_at: new Date().toISOString() })
            .eq('id', existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('locations').insert([cleanData]);
          if (error) throw error;
        }
        toast('Location updated and saved to database!', 'success');
      } else {
        // New location
        const { error } = await supabase.from('locations').insert([cleanData]);
        if (error) throw error;
        toast('New location added!', 'success');
      }

      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving location';
      toast('Error: ' + msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (isUuid(deleteTarget.id)) {
        await supabase.from('locations').delete().eq('id', deleteTarget.id);
      } else {
        await supabase.from('locations').delete().ilike('name', deleteTarget.name);
      }

      // Add to deleted storage list
      await addDeletedId('deleted_location_items', deleteTarget.id);
      await addDeletedId('deleted_location_items', deleteTarget.name);

      toast(`"${deleteTarget.name}" deleted successfully.`, 'success');
      setDeleteTarget(null);
      await load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error deleting location';
      toast('Error: ' + msg, 'error');
    }
  };

  const toggleActive = async (item: LocationRow) => {
    const nextVal = !item.active;
    try {
      if (isUuid(item.id)) {
        await supabase.from('locations').update({ active: nextVal }).eq('id', item.id);
      } else {
        const { data: existing } = await supabase
          .from('locations')
          .select('id')
          .ilike('name', item.name)
          .maybeSingle();

        if (existing?.id) {
          await supabase.from('locations').update({ active: nextVal }).eq('id', existing.id);
        } else {
          const { id: _, isStaticDefault: __, ...rest } = item;
          await supabase.from('locations').insert([{ ...rest, active: nextVal }]);
        }
      }

      setItems(prev => prev.map(i => (i.id === item.id ? { ...i, active: nextVal } : i)));
      toast(`Branch ${nextVal ? 'activated' : 'deactivated'}.`, 'success');
    } catch {
      toast('Failed to update status.', 'error');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Location Management</h1>
          <p className="text-gray-500 text-sm">
            {items.length} total branches on your website — all editable &amp; manageable here
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add_location</span>
          Add Location
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
          search
        </span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search locations by name, area or address…"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {/* Unified Cards Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm mt-2">Loading all locations…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <span className="material-symbols-outlined text-5xl text-gray-200 block mb-3">location_off</span>
          <p className="text-gray-500">No locations found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(item => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between transition-all ${!item.active ? 'opacity-70 bg-gray-50/50' : ''
                }`}
            >
              <div className="flex gap-4 p-4">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl flex-shrink-0 border border-gray-100"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-gray-300">location_on</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm leading-tight">{item.name}</h3>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium capitalize">
                          {item.zone_label}
                        </span>
                        {item.is_it_campus && (
                          <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium">
                            IT Campus
                          </span>
                        )}
                        {item.is_out_of_bangalore && (
                          <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium">
                            Out of BLR
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Toggle value={item.active} onChange={() => toggleActive(item)} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.address}</p>
                  {item.phone && (
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">phone</span>
                      {item.phone}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex border-t border-gray-50">
                <button
                  onClick={() => {
                    setEditing(item);
                    setShowForm(true);
                  }}
                  title="Edit this branch"
                  className="flex-1 py-2.5 text-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span> Edit
                </button>
                <div className="w-px bg-gray-100" />
                <button
                  onClick={() => setDeleteTarget(item)}
                  title="Delete this branch"
                  className="flex-1 py-2.5 text-red-500 hover:bg-red-50 transition-colors text-sm font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <LocationForm
          initial={editing ?? {}}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          saving={saving}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-gray-900 mb-2">Delete Location?</h3>
            <p className="text-gray-600 text-sm mb-6">
              Delete <strong>"{deleteTarget.name}"</strong>? It will be removed from your website.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
