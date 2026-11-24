import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../context/ToastContext';
import { Toggle } from '../components/Toggle';
import { GALLERY_ITEMS } from '../../data/mockData';
import { getDeletedIds, addDeletedId } from '../../lib/contentStorage';

export interface GalleryItemRow {
  id: string;
  title: string | null;
  category: string;
  category_label: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  active: boolean;
  created_at?: string;
  isStaticDefault?: boolean;
}

const CATEGORIES = [
  { value: 'food', label: 'Food' },
  { value: 'kitchen', label: 'Kitchen Artistry' },
  { value: 'restaurant-setup', label: 'Restaurant Setup' },
];

const isUuid = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

function GalleryForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: Partial<GalleryItemRow>;
  onSave: (data: Omit<GalleryItemRow, 'id'>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: initial.title ?? '',
    category: initial.category ?? 'food',
    category_label: initial.category_label ?? 'Food',
    image_url: initial.image_url ?? '',
    caption: initial.caption ?? '',
    display_order: initial.display_order ?? 0,
    active: initial.active ?? true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initial.image_url ?? '');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleCategoryChange = (val: string) => {
    const cat = CATEGORIES.find(c => c.value === val);
    set('category', val);
    set('category_label', cat?.label ?? val);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return form.image_url;
    setUploading(true);
    try {
      const ext = imageFile.name.split('.').pop();
      const path = `gallery/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('sgs-images').upload(path, imageFile, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from('sgs-images').getPublicUrl(path);
      return data.publicUrl;
    } catch {
      toast('Image upload failed.', 'error');
      return form.image_url;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url && !imageFile) {
      toast('Please provide an image URL or upload an image.', 'error');
      return;
    }
    const image_url = await uploadImage();
    onSave({ ...form, image_url });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">
            {initial.id ? 'Edit Gallery Image' : 'Add Gallery Image'}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-gray-500">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Image *</label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                className="w-full h-40 object-cover rounded-xl border border-gray-200 mb-3"
              />
            )}
            <input
              value={form.image_url}
              onChange={e => {
                set('image_url', e.target.value);
                setImagePreview(e.target.value);
              }}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
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
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Title</label>
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Image title (optional)"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Category</label>
              <select
                value={form.category}
                onChange={e => handleCategoryChange(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>
                    {c.label}
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
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Caption</label>
            <input
              value={form.caption}
              onChange={e => set('caption', e.target.value)}
              placeholder="Short caption (optional)"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <Toggle
              value={form.active}
              onChange={() => set('active', !form.active)}
              label="Show on Website"
              description="Toggle to show/hide in the gallery"
            />
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
            {uploading ? 'Uploading…' : saving ? 'Saving…' : 'Save Image'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminGallery() {
  const [items, setItems] = useState<GalleryItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<GalleryItemRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItemRow | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      // 1. Get deleted gallery IDs
      const deleted = await getDeletedIds('deleted_gallery_items');

      // 2. Load DB items
      const { data: dbData } = await supabase.from('gallery_items').select('*').order('display_order');
      const dbItems: GalleryItemRow[] = (dbData ?? []).map(d => ({
        ...d,
        isStaticDefault: false,
      }));

      // 3. Map static gallery items
      const staticRows: GalleryItemRow[] = GALLERY_ITEMS.map(g => ({
        id: g.id,
        title: g.title ?? null,
        category: g.category,
        category_label: g.categoryLabel,
        image_url: g.imageUrl,
        caption: null,
        display_order: 0,
        active: true,
        isStaticDefault: true,
      }));

      // 4. Merge: Supabase items override static items by image_url
      const merged: GalleryItemRow[] = [
        ...dbItems,
        ...staticRows.filter(s => !dbItems.some(d => d.image_url === s.image_url)),
      ];

      // 5. Filter deleted
      const activeList = merged.filter(
        item =>
          !deleted.includes(item.id.toLowerCase()) &&
          !deleted.includes(item.image_url.toLowerCase())
      );

      setItems(activeList);
    } catch (e) {
      console.error('Failed to load gallery items:', e);
      toast('Could not load gallery.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = items.filter(i => categoryFilter === 'all' || i.category === categoryFilter);

  const handleSave = async (data: Omit<GalleryItemRow, 'id'>) => {
    setSaving(true);
    try {
      if (editing && isUuid(editing.id)) {
        // Direct UUID update in Supabase
        const { error } = await supabase
          .from('gallery_items')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', editing.id);
        if (error) throw error;
        toast('Gallery image updated!', 'success');
      } else if (editing) {
        // Static item edit: update by image_url or insert new
        const { data: existing } = await supabase
          .from('gallery_items')
          .select('id')
          .eq('image_url', editing.image_url)
          .maybeSingle();

        if (existing?.id) {
          const { error } = await supabase
            .from('gallery_items')
            .update({ ...data, updated_at: new Date().toISOString() })
            .eq('id', existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('gallery_items').insert([data]);
          if (error) throw error;
        }
        toast('Gallery image updated and saved to database!', 'success');
      } else {
        // New image
        const { error } = await supabase.from('gallery_items').insert([data]);
        if (error) throw error;
        toast('Image added to gallery!', 'success');
      }

      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving image';
      toast('Error: ' + msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (isUuid(deleteTarget.id)) {
        await supabase.from('gallery_items').delete().eq('id', deleteTarget.id);
      } else {
        await supabase.from('gallery_items').delete().eq('image_url', deleteTarget.image_url);
      }

      // Add to deleted storage list
      await addDeletedId('deleted_gallery_items', deleteTarget.id);
      await addDeletedId('deleted_gallery_items', deleteTarget.image_url);

      toast('Image deleted from gallery.', 'success');
      setDeleteTarget(null);
      await load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error deleting image';
      toast('Error: ' + msg, 'error');
    }
  };

  const toggleActive = async (item: GalleryItemRow) => {
    const nextVal = !item.active;
    try {
      if (isUuid(item.id)) {
        await supabase.from('gallery_items').update({ active: nextVal }).eq('id', item.id);
      } else {
        const { data: existing } = await supabase
          .from('gallery_items')
          .select('id')
          .eq('image_url', item.image_url)
          .maybeSingle();

        if (existing?.id) {
          await supabase.from('gallery_items').update({ active: nextVal }).eq('id', existing.id);
        } else {
          const { id: _, isStaticDefault: __, ...rest } = item;
          await supabase.from('gallery_items').insert([{ ...rest, active: nextVal }]);
        }
      }

      setItems(prev => prev.map(i => (i.id === item.id ? { ...i, active: nextVal } : i)));
      toast(`Image ${nextVal ? 'shown' : 'hidden'}.`, 'success');
    } catch {
      toast('Failed to update status.', 'error');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-500 text-sm">
            {items.length} total images on your website — all editable &amp; manageable here
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
          Add Image
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[{ value: 'all', label: 'All' }, ...CATEGORIES].map(c => (
          <button
            key={c.value}
            onClick={() => setCategoryFilter(c.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              categoryFilter === c.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Unified Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm mt-2">Loading all gallery images…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <span className="material-symbols-outlined text-5xl text-gray-200 mb-3 block">photo_library</span>
          <p className="text-gray-500">No images found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(item => (
            <div
              key={item.id}
              className={`group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                !item.active ? 'opacity-60 bg-gray-50' : ''
              }`}
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={item.image_url}
                  alt={item.title ?? ''}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Status Indicator */}
                {!item.active && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-gray-900/80 text-white">
                    Hidden
                  </span>
                )}
                {/* Overlay Action Buttons */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setEditing(item);
                      setShowForm(true);
                    }}
                    title="Edit image"
                    className="p-2.5 bg-white rounded-xl text-blue-600 hover:bg-blue-50 transition-colors shadow-md cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    title="Delete image"
                    className="p-2.5 bg-white rounded-xl text-red-600 hover:bg-red-50 transition-colors shadow-md cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                  <button
                    onClick={() => toggleActive(item)}
                    title={item.active ? 'Hide from website' : 'Show on website'}
                    className="p-2.5 bg-white rounded-xl text-gray-700 hover:bg-gray-100 transition-colors shadow-md cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {item.active ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-gray-900 truncate">{item.title || item.category_label}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-gray-400 capitalize">{item.category}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditing(item);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-[11px] font-semibold flex items-center gap-0.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[13px]">edit</span> Edit
                    </button>
                    <span className="text-gray-300">·</span>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="text-red-500 hover:text-red-700 text-[11px] font-semibold flex items-center gap-0.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[13px]">delete</span> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <GalleryForm
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
            <h3 className="font-bold text-gray-900 mb-2">Delete Image?</h3>
            <p className="text-gray-600 text-sm mb-6">
              This will permanently remove this image from your website gallery.
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
