import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { supabase } from '../../lib/supabase';

const SQL_SCHEMA = `-- SGS Gundu Palav Admin Panel Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'palav',
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  badge TEXT,
  badge_type TEXT,
  spice_level TEXT,
  serving_note TEXT,
  highlight_meta TEXT,
  ingredients TEXT[],
  history_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery Items Table
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT,
  category TEXT NOT NULL DEFAULT 'food',
  category_label TEXT NOT NULL DEFAULT 'Food',
  image_url TEXT NOT NULL,
  caption TEXT,
  year TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations Table
CREATE TABLE IF NOT EXISTS locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  zone TEXT NOT NULL DEFAULT 'central',
  zone_label TEXT NOT NULL,
  type_label TEXT NOT NULL,
  type_color TEXT DEFAULT 'bg-emerald-600',
  address TEXT NOT NULL,
  area TEXT NOT NULL,
  phone TEXT,
  timings TEXT NOT NULL,
  notes TEXT,
  map_url TEXT,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  is_it_campus BOOLEAN DEFAULT false,
  is_out_of_bangalore BOOLEAN DEFAULT false,
  state TEXT DEFAULT 'Karnataka',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Franchise Inquiries Table
CREATE TABLE IF NOT EXISTS franchise_inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page Content Table (CMS)
CREATE TABLE IF NOT EXISTS page_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page TEXT NOT NULL,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page, section, key)
);

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grant access to anon and authenticated users
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;

-- RLS Policies (Enable Row Level Security)
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE franchise_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public read menu_items" ON menu_items;
DROP POLICY IF EXISTS "Public read gallery_items" ON gallery_items;
DROP POLICY IF EXISTS "Public read locations" ON locations;
DROP POLICY IF EXISTS "Public read page_content" ON page_content;
DROP POLICY IF EXISTS "Public read site_settings" ON site_settings;
DROP POLICY IF EXISTS "Public insert franchise_inquiries" ON franchise_inquiries;
DROP POLICY IF EXISTS "Public read franchise_inquiries" ON franchise_inquiries;

DROP POLICY IF EXISTS "Admin all menu_items" ON menu_items;
DROP POLICY IF EXISTS "Admin all gallery_items" ON gallery_items;
DROP POLICY IF EXISTS "Admin all locations" ON locations;
DROP POLICY IF EXISTS "Admin all franchise_inquiries" ON franchise_inquiries;
DROP POLICY IF EXISTS "Admin all page_content" ON page_content;
DROP POLICY IF EXISTS "Admin all site_settings" ON site_settings;

-- Public read policies
CREATE POLICY "Public read menu_items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public read gallery_items" ON gallery_items FOR SELECT USING (active = true);
CREATE POLICY "Public read locations" ON locations FOR SELECT USING (active = true);
CREATE POLICY "Public read page_content" ON page_content FOR SELECT USING (true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public insert franchise_inquiries" ON franchise_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read franchise_inquiries" ON franchise_inquiries FOR SELECT USING (true);

-- Authenticated admin policies
CREATE POLICY "Admin all menu_items" ON menu_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all gallery_items" ON gallery_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all locations" ON locations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all franchise_inquiries" ON franchise_inquiries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all page_content" ON page_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
  ('site_name', 'SGS Gundu Palav'),
  ('site_tagline', 'ESTD 1989 • THE TASTE EVERY ONE NEEDS'),
  ('phone', '+91 9341246466'),
  ('email', 'franchise@sgsgundupalav.com'),
  ('info_email', 'info@sgsgundupalav.com'),
  ('footer_copyright', '© 2024 SGS Gundu Palav. All rights reserved.'),
  ('instagram_url', ''),
  ('facebook_url', ''),
  ('youtube_url', '')
ON CONFLICT (key) DO NOTHING;
`;

function SettingField({ label, value, onChange, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export function AdminSettings() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState({
    site_name: 'SGS Gundu Palav',
    site_tagline: 'ESTD 1989 • THE TASTE EVERY ONE NEEDS',
    phone: '+91 9341246466',
    email: 'franchise@sgsgundupalav.com',
    info_email: 'info@sgsgundupalav.com',
    footer_copyright: '© 2024 SGS Gundu Palav. All rights reserved.',
    instagram_url: '',
    facebook_url: '',
    youtube_url: '',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    supabase.from('site_settings').select('key, value').then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {};
        data.forEach(row => { map[row.key] = row.value; });
        setSettings(prev => ({ ...prev, ...map }));
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    for (const [key, value] of Object.entries(settings)) {
      await supabase.from('site_settings').upsert(
        { key, value, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );
    }
    setSaving(false);
    toast('Settings saved!', 'success');
  };

  const copySchema = () => {
    navigator.clipboard.writeText(SQL_SCHEMA).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const set = (k: string, v: string) => setSettings(prev => ({ ...prev, [k]: v }));

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage global website settings and configuration.</p>
      </div>

      {/* Supabase Setup */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-600">database</span>
          Supabase Setup Guide
        </h2>
        <p className="text-gray-500 text-sm mb-4">Follow these steps to connect your Supabase database.</p>

        <div className="space-y-3">
          {[
            { n: 1, text: 'Create a free project at supabase.com' },
            { n: 2, text: 'Go to Project Settings → API and copy your Project URL and anon key' },
            { n: 3, text: 'Add these to your .env file as VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY' },
            { n: 4, text: 'Go to SQL Editor in Supabase and run the schema below' },
            { n: 5, text: 'Create a public storage bucket named "sgs-images" in Storage settings' },
            { n: 6, text: 'Create an admin user in Authentication → Users → Invite User' },
          ].map(step => (
            <div key={step.n} className="flex gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{step.n}</div>
              <p className="text-sm text-gray-700">{step.text}</p>
            </div>
          ))}
        </div>

        {/* .env template */}
        <div className="mt-5">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Add to your .env file:</p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-green-400 select-all">
            <p>VITE_SUPABASE_URL=https://your-project.supabase.co</p>
            <p>VITE_SUPABASE_ANON_KEY=your-anon-key-here</p>
          </div>
        </div>

        {/* SQL Schema */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Database Schema (copy & run in Supabase SQL Editor):</p>
            <button
              onClick={copySchema}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${copied ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <span className="material-symbols-outlined text-[14px]">{copied ? 'check' : 'content_copy'}</span>
              {copied ? 'Copied!' : 'Copy SQL'}
            </button>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-gray-300 max-h-64 overflow-y-auto whitespace-pre">
            {SQL_SCHEMA}
          </div>
        </div>
      </div>

      {/* Website Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600">web</span>
          Website Settings
        </h2>
        {loading ? (
          <div className="text-center py-8"><div className="inline-block w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SettingField label="Website Name" value={settings.site_name} onChange={v => set('site_name', v)} />
              <SettingField label="Tagline" value={settings.site_tagline} onChange={v => set('site_tagline', v)} />
              <SettingField label="Phone Number" value={settings.phone} onChange={v => set('phone', v)} type="tel" />
              <SettingField label="Franchise Email" value={settings.email} onChange={v => set('email', v)} type="email" />
              <SettingField label="Info Email" value={settings.info_email} onChange={v => set('info_email', v)} type="email" />
              <SettingField label="Footer Copyright Text" value={settings.footer_copyright} onChange={v => set('footer_copyright', v)} />
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Social Media URLs</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SettingField label="Instagram" value={settings.instagram_url} onChange={v => set('instagram_url', v)} type="url" />
                <SettingField label="Facebook" value={settings.facebook_url} onChange={v => set('facebook_url', v)} type="url" />
                <SettingField label="YouTube" value={settings.youtube_url} onChange={v => set('youtube_url', v)} type="url" />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-60">
                {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {saving ? 'Saving…' : 'Save Settings'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-purple-600">manage_accounts</span>
          Account Information
        </h2>
        <p className="text-gray-500 text-sm">
          Admin users are managed directly in your{' '}
          <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase Dashboard</a>{' '}
          under Authentication → Users. To add new admin users, use Supabase's "Invite User" feature.
        </p>
      </div>
    </div>
  );
}
