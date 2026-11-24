import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../context/ToastContext';
import { BRAND } from '../../data/mockData';

type ContentMap = Record<string, string>;

interface FieldConfig {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'url';
  placeholder?: string;
  hint?: string;
}

interface SectionConfig {
  section: string;
  label: string;
  icon?: string;
  description?: string;
  fields: FieldConfig[];
}

function ContentEditor({
  page,
  pageTitle,
  pageSubtitle,
  sections,
  defaults,
}: {
  page: string;
  pageTitle: string;
  pageSubtitle: string;
  sections: SectionConfig[];
  defaults: ContentMap;
}) {
  const { toast } = useToast();
  const [content, setContent] = useState<ContentMap>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(sections[0]?.section || '');

  // Load saved content from Supabase, falling back to website defaults
  useEffect(() => {
    async function loadContent() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('page_content')
          .select('section, key, value')
          .eq('page', page);

        if (!error && data && data.length > 0) {
          const remote: ContentMap = {};
          data.forEach(row => {
            remote[`${row.section}::${row.key}`] = row.value;
          });
          setContent({ ...defaults, ...remote });
        } else {
          setContent(defaults);
        }
      } catch {
        setContent(defaults);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, [page]);

  const handleChange = (section: string, key: string, value: string) => {
    setContent(prev => ({ ...prev, [`${section}::${key}`]: value }));
  };

  const handleResetSection = (section: string) => {
    const updated = { ...content };
    sections
      .find(s => s.section === section)
      ?.fields.forEach(f => {
        const k = `${section}::${f.key}`;
        updated[k] = defaults[k] ?? '';
      });
    setContent(updated);
    toast(`Reset section to website defaults.`, 'info');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const rows = Object.entries(content).map(([compositeKey, value]) => {
        const [section, key] = compositeKey.split('::');
        return {
          page,
          section,
          key,
          value,
          updated_at: new Date().toISOString(),
        };
      });

      // Upsert rows
      for (const row of rows) {
        await supabase
          .from('page_content')
          .upsert(row, { onConflict: 'page,section,key' });
      }

      toast('Changes saved! Public website will show your updated content.', 'success');
    } catch (err: unknown) {
      toast('Failed to save changes. Check Supabase connection.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const currentSection = sections.find(s => s.section === activeTab) || sections[0];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
          <p className="text-gray-500 text-sm mt-1">{pageSubtitle}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="material-symbols-outlined text-[18px]">save</span>
          )}
          <span>{saving ? 'Saving Changes…' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-2xl p-4 flex items-start gap-3">
        <span className="material-symbols-outlined text-blue-600 flex-shrink-0 text-[20px] mt-0.5">verified</span>
        <div className="text-xs text-blue-900 leading-relaxed">
          <strong>Website Content Synchronization:</strong> All fields below are pre-populated with the exact text currently live on the public website. Edit any field and click <strong>Save Changes</strong> to update what customers see.
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-200 no-scrollbar">
        {sections.map(s => {
          const isActive = s.section === activeTab;
          return (
            <button
              key={s.section}
              type="button"
              onClick={() => setActiveTab(s.section)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {s.icon && <span className="material-symbols-outlined text-[18px]">{s.icon}</span>}
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Section Editor */}
      {currentSection && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Section Banner */}
          <div className="p-5 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentSection.icon && (
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">{currentSection.icon}</span>
                </div>
              )}
              <div>
                <h2 className="font-bold text-gray-900 text-base">{currentSection.label}</h2>
                {currentSection.description && (
                  <p className="text-xs text-gray-500 mt-0.5">{currentSection.description}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleResetSection(currentSection.section)}
              className="text-xs text-gray-500 hover:text-blue-600 font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              title="Reset this section to website default"
            >
              <span className="material-symbols-outlined text-[14px]">restart_alt</span>
              <span>Reset to Default</span>
            </button>
          </div>

          {/* Form Fields */}
          <div className="p-6 space-y-5">
            {currentSection.fields.map(f => {
              const compositeKey = `${currentSection.section}::${f.key}`;
              const val = content[compositeKey] ?? '';
              const isDefault = val === (defaults[compositeKey] ?? '');

              return (
                <div key={f.key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {f.label}
                    </label>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isDefault
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {isDefault ? 'Default from site' : 'Customized'}
                    </span>
                  </div>

                  {f.type === 'textarea' ? (
                    <textarea
                      value={val}
                      onChange={e => handleChange(currentSection.section, f.key, e.target.value)}
                      rows={4}
                      placeholder={f.placeholder || `Enter ${f.label.toLowerCase()}…`}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-normal text-gray-800 bg-white"
                    />
                  ) : (
                    <input
                      type={f.type ?? 'text'}
                      value={val}
                      onChange={e => handleChange(currentSection.section, f.key, e.target.value)}
                      placeholder={f.placeholder || `Enter ${f.label.toLowerCase()}…`}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal text-gray-800 bg-white"
                    />
                  )}

                  {f.hint && <p className="text-[11px] text-gray-400">{f.hint}</p>}

                  {/* Preview image if field is an image URL */}
                  {f.type === 'url' && val && (
                    <div className="mt-2 flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-100 w-fit">
                      <img src={val} alt="preview" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                      <span className="text-xs text-gray-500">Image Preview</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Save Row */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Changes apply to the public website immediately after saving.
            </span>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-[18px]">save</span>
              )}
              <span>{saving ? 'Saving…' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Live Website Preview Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-emerald-600 text-[20px]">preview</span>
          <h3 className="font-bold text-gray-900 text-sm">Live Preview on Public Website</h3>
          <span className="text-[10px] uppercase tracking-wider bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full ml-auto">
            Live Preview
          </span>
        </div>

        <div className="p-4 rounded-xl bg-gray-900 text-white space-y-2 border border-gray-800">
          <div className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">
            {content[`${activeTab}::badge`] || content[`${activeTab}::tagline`] || pageTitle}
          </div>
          <div className="text-lg font-bold text-amber-200 font-serif">
            {content[`${activeTab}::title`] || content[`${activeTab}::heading`] || 'Heading Title'}
          </div>
          <div className="text-xs text-gray-300 leading-relaxed max-w-2xl">
            {content[`${activeTab}::description`] || content[`${activeTab}::content`] || content[`${activeTab}::intro`] || 'Section content preview...'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. HOME PAGE MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

export function AdminHome() {
  const defaults: ContentMap = {
    // Hero
    'hero::tagline': 'SGS Non Veg Gundu Palav • Since 1989',
    'hero::title': 'The Taste Every One Needs',
    'hero::description': "SGS Nonveg Gundu Palav — Bengaluru's beloved donne palav restaurant, rooted in authentic South Indian tradition since 1989. Serving over 300 happy customers daily.",
    'hero::cta_primary': 'Explore Royal Menu',
    'hero::cta_secondary': 'Find Nearest Outlet',
    'hero::image_url': '/chicken-donne-palav-hero.png',

    // Stats
    'stats::origin_year': '1989',
    'stats::origin_label': 'Origin Year',
    'stats::daily_diners': '300+',
    'stats::daily_label': 'Daily Diners',
    'stats::years_legacy': '35+',
    'stats::years_label': 'Years Legacy',

    // Heritage Story
    'heritage::badge': 'The Story of Our Balepet Heritage',
    'heritage::title': 'Founded by Late Gundu Muneshwara & Savithri',
    'heritage::content': 'In 1989, Gundu Muneshwara and his wife Savithri started their journey in Balepet with a passion for traditional cooking and a unique Donne Palav recipe. Which began as a small home-based business grew through the love and support of customers.\n\nToday, their four sons continue the family tradition, preparing special masalas and preserving the authentic taste that has made SGS Gundu Palav a beloved name for generations.',
    'heritage::pillar_1': '4 Sons • Upholding Heritage',
    'heritage::pillar_2': 'Brass Degh • Slow Charcoal Dum',
    'heritage::pillar_3': '35+ Years • Unchanged Recipe',
    'heritage::image_url': '/balepet-woodfire.jpg',

    // Specialties
    'specialties::badge': 'Iconic Offerings',
    'specialties::title': 'The Masters of SGS',
    'specialties::description': 'Every dish reflects our rich Balepet heritage, prepared with authentic spices, fresh ingredients, and traditional recipes to deliver a bold aroma and unforgettable taste in every bite.',
  };

  const sections: SectionConfig[] = [
    {
      section: 'hero',
      label: 'Hero Banner',
      icon: 'star',
      description: 'Main greeting at the top of the homepage with the headline and call-to-action buttons.',
      fields: [
        { key: 'tagline', label: 'Badge / Tagline', hint: 'Shows in the pill chip above the main title' },
        { key: 'title', label: 'Main Headline', hint: 'The big bold title on the home page' },
        { key: 'description', label: 'Subhead / Paragraph', type: 'textarea', hint: 'Intro paragraph under the headline' },
        { key: 'cta_primary', label: 'Primary Button Text' },
        { key: 'cta_secondary', label: 'Secondary Button Text' },
        { key: 'image_url', label: 'Hero Image URL', type: 'url' },
      ],
    },
    {
      section: 'stats',
      label: 'Heritage Metrics',
      icon: 'insights',
      description: 'The 3 key stats displayed in the hero banner.',
      fields: [
        { key: 'origin_year', label: 'Stat 1 Value (e.g. 1989)' },
        { key: 'origin_label', label: 'Stat 1 Label' },
        { key: 'daily_diners', label: 'Stat 2 Value (e.g. 300+)' },
        { key: 'daily_label', label: 'Stat 2 Label' },
        { key: 'years_legacy', label: 'Stat 3 Value (e.g. 35+)' },
        { key: 'years_label', label: 'Stat 3 Label' },
      ],
    },
    {
      section: 'heritage',
      label: 'Heritage Story Preview',
      icon: 'history_edu',
      description: 'The Balepet Chronicle section honoring the founders and 4 sons.',
      fields: [
        { key: 'badge', label: 'Section Badge' },
        { key: 'title', label: 'Section Heading' },
        { key: 'content', label: 'Story Narrative', type: 'textarea' },
        { key: 'pillar_1', label: 'Heritage Pillar 1' },
        { key: 'pillar_2', label: 'Heritage Pillar 2' },
        { key: 'pillar_3', label: 'Heritage Pillar 3' },
        { key: 'image_url', label: 'Feature Image URL', type: 'url' },
      ],
    },
    {
      section: 'specialties',
      label: 'Signature Dishes Intro',
      icon: 'restaurant',
      description: 'Heading & intro text for the Iconic Offerings / Masters of SGS section.',
      fields: [
        { key: 'badge', label: 'Overline Badge' },
        { key: 'title', label: 'Section Heading' },
        { key: 'description', label: 'Section Description', type: 'textarea' },
      ],
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <ContentEditor
        page="home"
        pageTitle="Home Page Management"
        pageSubtitle="Manage all text, headlines, and content displayed on the public home page."
        sections={sections}
        defaults={defaults}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. ABOUT PAGE MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

export function AdminAbout() {
  const defaults: ContentMap = {
    // Hero
    'hero::tagline': 'The Legacy of Authentic SGS Palav',
    'hero::title': 'The Story of SGS Nonveg Gundu Palav',
    'hero::description': 'From a humble beginning in Balepet to a trusted name in traditional palav, our journey is built on traditional recipes, slow cooking, and the authentic family spice blend passed down since 1989.',
    'hero::stat_1': '35+ Years Unbroken',
    'hero::stat_2': '14 Active Outlets',
    'hero::stat_3': 'Estd 1989 Balepet',
    'hero::stat_4': '100% Charcoal Dum',

    // Story
    'story::badge': 'Origin Story',
    'story::heading': 'A Woodfire Dream in Balepet',
    'story::content': 'In 1989, Gundu Muneshwara and his wife Savithri started their culinary journey in the vibrant streets of Balepet, Bengaluru. Armed with an obsession for authentic donne palav and stone-ground spices, they built what would become one of the city’s most celebrated culinary traditions.',
    'story::image_url': '/balepet-woodfire.jpg',

    // Founders
    'founders::badge': 'Our Founders',
    'founders::heading': 'Late Gundu Muneshwara & Savithri',
    'founders::bio': 'Together, they perfected the timeless recipe — short-grain Jeera Samba rice cooked over charcoal in heavy brass deghs, blended with fresh mint, native shallots, and hand-selected spices.',

    // Legacy Sons
    'sons::badge': 'Generation 2',
    'sons::heading': 'The 4 Sons Carrying Forward The Flame',
    'sons::content': 'Today, the four sons personally oversee spice procurement, hand-ground masalas, and the early morning woodfire cauldrons, ensuring every plate served honours their parents’ unbending commitment to quality.',
  };

  const sections: SectionConfig[] = [
    {
      section: 'hero',
      label: 'Hero Header',
      icon: 'auto_stories',
      description: 'The top title and introductory narrative of the About Us page.',
      fields: [
        { key: 'tagline', label: 'Heritage Badge' },
        { key: 'title', label: 'Main Page Title' },
        { key: 'description', label: 'Lead Paragraph', type: 'textarea' },
        { key: 'stat_1', label: 'Badge Metric 1' },
        { key: 'stat_2', label: 'Badge Metric 2' },
        { key: 'stat_3', label: 'Badge Metric 3' },
        { key: 'stat_4', label: 'Badge Metric 4' },
      ],
    },
    {
      section: 'story',
      label: 'Origin Story',
      icon: 'history',
      description: 'The narrative of how SGS started in Balepet in 1989.',
      fields: [
        { key: 'badge', label: 'Section Badge' },
        { key: 'heading', label: 'Story Heading' },
        { key: 'content', label: 'Story Narrative', type: 'textarea' },
        { key: 'image_url', label: 'Story Image URL', type: 'url' },
      ],
    },
    {
      section: 'founders',
      label: 'Founders Memorial',
      icon: 'diversity_1',
      description: 'Honoring Late Gundu Muneshwara and Savithri.',
      fields: [
        { key: 'badge', label: 'Badge' },
        { key: 'heading', label: 'Founders Heading' },
        { key: 'bio', label: 'Founders Tribute Bio', type: 'textarea' },
      ],
    },
    {
      section: 'sons',
      label: 'The Four Sons',
      icon: 'family_restroom',
      description: 'Second generation leadership maintaining tradition.',
      fields: [
        { key: 'badge', label: 'Badge' },
        { key: 'heading', label: 'Heading' },
        { key: 'content', label: 'Commitment Text', type: 'textarea' },
      ],
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <ContentEditor
        page="about"
        pageTitle="About Page Management"
        pageSubtitle="Manage the story, history, and brand background shown on the About Us page."
        sections={sections}
        defaults={defaults}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. FRANCHISE PAGE MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

export function AdminFranchise() {
  const { toast } = useToast();
  const [inquiries, setInquiries] = useState<
    { id: string; name: string; phone: string; city: string; email: string | null; message: string | null; status: string; created_at: string }[]
  >([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);

  useEffect(() => {
    supabase
      .from('franchise_inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setInquiries(data ?? []);
        setLoadingInquiries(false);
      });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('franchise_inquiries').update({ status }).eq('id', id);
    if (!error) {
      setInquiries(prev => prev.map(i => (i.id === id ? { ...i, status } : i)));
      toast('Inquiry status updated.', 'success');
    }
  };

  const defaults: ContentMap = {
    'hero::tagline': 'Franchise & Expansion Guild • Estd 1989',
    'hero::title': "Own a Piece of Bengaluru's Legendary Palav Tradition",
    'hero::description': 'Partner with an iconic 35-year culinary brand. Join our rapidly expanding footprint across Karnataka with proven operational excellence, authentic spice supply, and high-margin unit economics.',

    'format::title': 'Dine-In Heritage Restaurant',
    'format::footprint': '1,200 – 2,500 sq ft',
    'format::location': 'Prime High Street / Arterial Roads',
    'format::seating': '50 to 90 Covers',
    'format::capex': '₹60 Lakhs – ₹1 Crore+',
    'format::roi': '12 – 16 Months',

    'support::heading': 'Comprehensive Franchise Support',
    'support::point_1': 'Central spice supply & secret master masala batches',
    'support::point_2': 'Kitchen staff training & head chef onboarding',
    'support::point_3': 'Store architecture, design & brand guild standards',
    'support::point_4': 'Pre-launch marketing & localized brand launch',
  };

  const sections: SectionConfig[] = [
    {
      section: 'hero',
      label: 'Hero Banner',
      icon: 'campaign',
      description: 'The top invitation headline and proposition for franchise partners.',
      fields: [
        { key: 'tagline', label: 'Badge / Tagline' },
        { key: 'title', label: 'Main Heading' },
        { key: 'description', label: 'Value Proposition', type: 'textarea' },
      ],
    },
    {
      section: 'format',
      label: 'Store Format Specs',
      icon: 'storefront',
      description: 'Key requirements and financials for franchise partners.',
      fields: [
        { key: 'title', label: 'Format Name' },
        { key: 'footprint', label: 'Required Floor Area' },
        { key: 'location', label: 'Preferred Location' },
        { key: 'seating', label: 'Seating Capacity' },
        { key: 'capex', label: 'Estimated Capex' },
        { key: 'roi', label: 'Expected ROI' },
      ],
    },
    {
      section: 'support',
      label: 'Headquarters Support',
      icon: 'handshake',
      description: 'What the brand provides to franchise operators.',
      fields: [
        { key: 'heading', label: 'Section Title' },
        { key: 'point_1', label: 'Support Pillar 1' },
        { key: 'point_2', label: 'Support Pillar 2' },
        { key: 'point_3', label: 'Support Pillar 3' },
        { key: 'point_4', label: 'Support Pillar 4' },
      ],
    },
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    contacted: 'bg-blue-100 text-blue-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Franchise Inquiries Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Franchise Inquiries</h2>
            <p className="text-xs text-gray-400 mt-0.5">Leads submitted via the website franchise form</p>
          </div>
          <span className="text-xs bg-rose-50 text-rose-700 font-bold px-3 py-1 rounded-full border border-rose-200">
            {inquiries.length} Inquiries
          </span>
        </div>

        {loadingInquiries ? (
          <div className="text-center py-8">
            <div className="inline-block w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
            <span className="material-symbols-outlined text-4xl text-gray-300 block mb-2">handshake</span>
            <p className="text-gray-500 text-sm font-semibold">No franchise inquiries yet.</p>
            <p className="text-gray-400 text-xs mt-1">When customers submit the franchise form on the website, they will appear here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Name', 'Phone', 'City', 'Email', 'Date', 'Status', 'Action'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {inquiries.map(inq => (
                    <tr key={inq.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-semibold text-sm text-gray-900">{inq.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 font-mono">{inq.phone}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{inq.city}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{inq.email ?? '—'}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{new Date(inq.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${statusColors[inq.status] ?? 'bg-gray-100 text-gray-700'}`}>
                          {inq.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={inq.status}
                          onChange={e => updateStatus(inq.id, e.target.value)}
                          className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                        >
                          {['pending', 'contacted', 'approved', 'rejected'].map(s => (
                            <option key={s} value={s} className="capitalize">
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Franchise Page Content Editor */}
      <div>
        <ContentEditor
          page="franchise"
          pageTitle="Franchise Page Content"
          pageSubtitle="Customize the promotional copy and store format specs shown on the public Franchise page."
          sections={sections}
          defaults={defaults}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CONTACT PAGE MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

export function AdminContact() {
  const defaults: ContentMap = {
    // Hero
    'hero::badge': 'Connect With Our Balepet Headquarters',
    'hero::title': 'Get In Touch With SGS Gundu Palav',
    'hero::description': 'Have an inquiry regarding party orders, bulk festive catering, feedback on your recent meal, or visiting Balepet? We are always here to serve you.',

    // Balepet Desk
    'desk::title': 'Balepet Flagship Desk',
    'desk::address': BRAND.flagshipAddress,
    'desk::phone': BRAND.displayPhone,
    'desk::landline': BRAND.landline,
    'desk::hours': BRAND.hours,

    // Emails
    'emails::franchise_email': BRAND.email,
    'emails::info_email': BRAND.infoEmail,

    // Bulk Catering
    'catering::title': 'Bulk Festive & Celebration Catering',
    'catering::description': 'Planning a wedding, corporate milestone, or family get-together? We bring our live copper cauldrons and authentic donne palav setup directly to your location.',
    'catering::phone': BRAND.displayPhone,
  };

  const sections: SectionConfig[] = [
    {
      section: 'hero',
      label: 'Hero Banner',
      icon: 'contact_support',
      description: 'The top contact intro headline and subtext.',
      fields: [
        { key: 'badge', label: 'Top Badge' },
        { key: 'title', label: 'Main Headline' },
        { key: 'description', label: 'Intro Paragraph', type: 'textarea' },
      ],
    },
    {
      section: 'desk',
      label: 'Balepet Flagship Desk',
      icon: 'storefront',
      description: 'Official headquarters contact info shown across the contact page and footer.',
      fields: [
        { key: 'title', label: 'Desk Title' },
        { key: 'address', label: 'Physical Address', type: 'textarea' },
        { key: 'phone', label: 'Mobile / WhatsApp Phone' },
        { key: 'landline', label: 'Landline Phone' },
        { key: 'hours', label: 'Opening Hours', type: 'textarea' },
      ],
    },
    {
      section: 'emails',
      label: 'Official Inboxes',
      icon: 'mail',
      description: 'Public contact emails for franchises and general support.',
      fields: [
        { key: 'franchise_email', label: 'Franchise Inquiries Email' },
        { key: 'info_email', label: 'General / Feedback Email' },
      ],
    },
    {
      section: 'catering',
      label: 'Catering Inquiries',
      icon: 'soup_kitchen',
      description: 'Catering and large order section details.',
      fields: [
        { key: 'title', label: 'Section Title' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'phone', label: 'Catering Desk Phone' },
      ],
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <ContentEditor
        page="contact"
        pageTitle="Contact Page Management"
        pageSubtitle="Manage phone numbers, emails, addresses, and contact copy displayed on the website."
        sections={sections}
        defaults={defaults}
      />
    </div>
  );
}
