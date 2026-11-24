import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../context/ToastContext';
import { Toggle } from '../components/Toggle';
import { MENU_ITEMS } from '../../data/mockData';
import { getDeletedIds, addDeletedId } from '../../lib/contentStorage';

export interface MenuItemRow {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image_url: string | null;
  available: boolean;
  display_order: number;
  badge: string | null;
  badge_type: string | null;
  spice_level: string | null;
  serving_note: string | null;
  highlight_meta: string | null;
  ingredients: string[] | null;
  history_note: string | null;
  created_at?: string;
  updated_at?: string;
  isStaticDefault?: boolean;
}

const EMPTY: Omit<MenuItemRow, 'id'> = {
  name: '',
  description: '',
  price: '',
  category: 'palav',
  image_url: null,
  available: true,
  display_order: 0,
  badge: null,
  badge_type: null,
  spice_level: 'Signature Spicy',
  serving_note: null,
  highlight_meta: null,
  ingredients: null,
  history_note: null,
};

const CATEGORIES = ['palav', 'starter', 'combo', 'side', 'retail'];
const BADGE_TYPES = ['primary', 'royal', 'fav', 'classic', 'special'];
const SPICE_LEVELS = ['Mild', 'Medium', 'Signature Spicy'];

const isUuid = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-red-600">warning</span>
          </div>
          <h3 className="font-bold text-gray-900">Confirm Delete</h3>
        </div>
        <p className="text-gray-600 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: Partial<MenuItemRow>;
  onSave: (data: Omit<MenuItemRow, 'id'>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [ingredientsText, setIngredientsText] = useState((initial.ingredients ?? []).join(', '));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initial.image_url ?? '');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const path = `menu/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('sgs-images').upload(path, imageFile, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from('sgs-images').getPublicUrl(path);
      return data.publicUrl;
    } catch {
      toast('Image upload failed. Using URL if provided.', 'error');
      return form.image_url ?? null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) {
      toast('Name and description are required.', 'error');
      return;
    }
    const image_url = await uploadImage();
    const ingredients = ingredientsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    onSave({ ...form, image_url, ingredients: ingredients.length ? ingredients : null });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">
            {initial.id ? `Edit: ${initial.name}` : 'Add Menu Item'}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <span className="material-symbols-outlined text-gray-500">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Item Name *
              </label>
              <input
                value={form.name}
                onChange={e => set('name', e.target.value)}
                required
                placeholder="Chicken Donne Palav"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Description *
              </label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                required
                rows={3}
                placeholder="Describe the dish..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Price</label>
              <input
                value={form.price}
                onChange={e => set('price', e.target.value)}
                placeholder="₹220"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Category</label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Spice Level</label>
              <select
                value={form.spice_level ?? ''}
                onChange={e => set('spice_level', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {SPICE_LEVELS.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Display Order</label>
              <input
                type="number"
                value={form.display_order}
                onChange={e => set('display_order', Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Badge Label</label>
              <input
                value={form.badge ?? ''}
                onChange={e => set('badge', e.target.value)}
                placeholder="Master Recipe"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Badge Type</label>
              <select
                value={form.badge_type ?? ''}
                onChange={e => set('badge_type', e.target.value || null)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">None</option>
                {BADGE_TYPES.map(b => (
                  <option key={b} value={b}>
                    {b.charAt(0).toUpperCase() + b.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Serving Note</label>
              <input
                value={form.serving_note ?? ''}
                onChange={e => set('serving_note', e.target.value)}
                placeholder="Includes Boiled Egg & Gravy"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Highlight Meta</label>
              <input
                value={form.highlight_meta ?? ''}
                onChange={e => set('highlight_meta', e.target.value)}
                placeholder="Balepet Daily Handi"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Ingredients (comma-separated)
              </label>
              <input
                value={ingredientsText}
                onChange={e => setIngredientsText(e.target.value)}
                placeholder="Chicken, Spices, Curry Leaves"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">History Note</label>
              <textarea
                value={form.history_note ?? ''}
                onChange={e => set('history_note', e.target.value)}
                rows={2}
                placeholder="Heritage story..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Image Upload */}
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Menu Image</label>
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
                    type="text"
                    value={form.image_url ?? ''}
                    onChange={e => {
                      set('image_url', e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://... or upload below"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  />
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors w-full justify-center"
                  >
                    <span className="material-symbols-outlined text-[18px]">upload</span>
                    {imageFile ? imageFile.name : 'Upload from computer'}
                  </button>
                </div>
              </div>
            </div>

            {/* Available Toggle */}
            <div className="col-span-2">
              <Toggle
                value={form.available}
                onChange={() => set('available', !form.available)}
                label="Available on Menu"
                description="Toggle to show/hide on the public website"
              />
            </div>
          </div>
        </form>
        <div className="flex gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
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
            {uploading ? 'Uploading…' : saving ? 'Saving…' : 'Save Item'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminMenu() {
  const [items, setItems] = useState<MenuItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MenuItemRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuItemRow | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      // 1. Get deleted IDs/names from site_settings/storage
      const deleted = await getDeletedIds('deleted_menu_items');

      // 2. Load remote items from Supabase
      const { data: dbData } = await supabase.from('menu_items').select('*').order('display_order');
      const dbItems: MenuItemRow[] = (dbData ?? []).map(d => ({
        ...d,
        isStaticDefault: false,
      }));

      // 3. Map static items from mockData
      const staticRows: MenuItemRow[] = MENU_ITEMS.map(m => ({
        id: m.id,
        name: m.name,
        description: m.description,
        price: m.price || '',
        category: m.category,
        image_url: m.image || null,
        available: true,
        display_order: 0,
        badge: m.badge || null,
        badge_type: (m.badgeType as string) || null,
        spice_level: (m.spiceLevel as string) || 'Signature Spicy',
        serving_note: m.servingNote || null,
        highlight_meta: m.highlightMeta || null,
        ingredients: m.ingredients || null,
        history_note: m.historyNote || null,
        isStaticDefault: true,
      }));

      // 4. Merge: Supabase items override static items with matching name
      const merged: MenuItemRow[] = [
        ...dbItems,
        ...staticRows.filter(s => !dbItems.some(d => d.name.toLowerCase() === s.name.toLowerCase())),
      ];

      // 5. Filter out deleted items
      const activeList = merged.filter(
        item =>
          !deleted.includes(item.id.toLowerCase()) &&
          !deleted.includes(item.name.toLowerCase())
      );

      setItems(activeList);
    } catch (e) {
      console.error('Failed to load menu items:', e);
      toast('Could not load menu items.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = items.filter(i => {
    const matchSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || i.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleSave = async (data: Omit<MenuItemRow, 'id'>) => {
    setSaving(true);
    try {
      if (editing && isUuid(editing.id)) {
        // Direct UUID update in Supabase
        const { error } = await supabase
          .from('menu_items')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', editing.id);
        if (error) throw error;
        toast('Menu item updated!', 'success');
      } else if (editing) {
        // Editing a static item: check if already in Supabase by name or insert new
        const { data: existing } = await supabase
          .from('menu_items')
          .select('id')
          .ilike('name', editing.name)
          .maybeSingle();

        if (existing?.id) {
          const { error } = await supabase
            .from('menu_items')
            .update({ ...data, updated_at: new Date().toISOString() })
            .eq('id', existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('menu_items').insert([data]);
          if (error) throw error;
        }
        toast('Menu item updated and saved to database!', 'success');
      } else {
        // Adding new item
        const { error } = await supabase.from('menu_items').insert([data]);
        if (error) throw error;
        toast('New menu item added!', 'success');
      }

      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving item';
      toast('Error: ' + msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (isUuid(deleteTarget.id)) {
        await supabase.from('menu_items').delete().eq('id', deleteTarget.id);
      } else {
        await supabase.from('menu_items').delete().ilike('name', deleteTarget.name);
      }

      // Add to deleted list so it stays deleted on public site & admin
      await addDeletedId('deleted_menu_items', deleteTarget.id);
      await addDeletedId('deleted_menu_items', deleteTarget.name);

      toast(`"${deleteTarget.name}" deleted successfully.`, 'success');
      setDeleteTarget(null);
      await load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error deleting item';
      toast('Error: ' + msg, 'error');
    }
  };

  const toggleAvailable = async (item: MenuItemRow) => {
    const nextVal = !item.available;
    try {
      if (isUuid(item.id)) {
        await supabase.from('menu_items').update({ available: nextVal }).eq('id', item.id);
      } else {
        const { data: existing } = await supabase
          .from('menu_items')
          .select('id')
          .ilike('name', item.name)
          .maybeSingle();

        if (existing?.id) {
          await supabase.from('menu_items').update({ available: nextVal }).eq('id', existing.id);
        } else {
          const { id: _, isStaticDefault: __, ...rest } = item;
          await supabase.from('menu_items').insert([{ ...rest, available: nextVal }]);
        }
      }

      setItems(prev => prev.map(i => (i.id === item.id ? { ...i, available: nextVal } : i)));
      toast(`${item.name} is now ${nextVal ? 'available' : 'hidden'}.`, 'success');
    } catch {
      toast('Failed to update status.', 'error');
    }
  };

  const badgeColors: Record<string, string> = {
    primary: 'bg-blue-100 text-blue-700',
    royal: 'bg-amber-100 text-amber-700',
    fav: 'bg-rose-100 text-rose-700',
    classic: 'bg-emerald-100 text-emerald-700',
    special: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-500 text-sm">
            {items.length} total items on your website — all editable &amp; manageable here
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Menu Item
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
            search
          </span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search menu items…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Unified Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-gray-500 text-sm">Loading all menu items…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-gray-200 mb-3 block">restaurant_menu</span>
          <p className="text-gray-500">No menu items match your search.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                    Item
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden sm:table-cell">
                    Category
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">
                    Price
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">
                    Badge
                  </th>
                  <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                    Status
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-gray-100"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-gray-300 text-[18px]">image</span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-gray-900 truncate max-w-[180px]">{item.name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[180px]">
                            {item.description.slice(0, 50)}
                            {item.description.length > 50 ? '…' : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium capitalize">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="font-semibold text-sm text-gray-900">{item.price || '—'}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {item.badge ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                            badgeColors[item.badge_type ?? 'primary'] ?? 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Toggle value={item.available} onChange={() => toggleAvailable(item)} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditing(item);
                            setShowForm(true);
                          }}
                          title="Edit this item"
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          title="Delete this item"
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <MenuForm
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
        <ConfirmDialog
          message={`Are you sure you want to delete "${deleteTarget.name}"? It will be removed from your website.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
