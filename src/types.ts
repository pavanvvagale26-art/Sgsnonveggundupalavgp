export type PageId = 'home' | 'about-us' | 'menu' | 'our-locations' | 'franchise' | 'gallery' | 'contact';

export interface MenuItem {
  id: string;
  name: string;
  badge?: string;
  badgeType?: 'primary' | 'royal' | 'fav' | 'classic' | 'special';
  description: string;
  price?: string;
  spiceLevel?: 'Mild' | 'Medium' | 'Signature Spicy';
  servingNote: string;
  highlightMeta: string;
  category: 'palav' | 'starter' | 'side' | 'retail' | 'combo';
  image?: string;
  images?: string[];
  ingredients?: string[];
  historyNote?: string;
}

export interface Outlet {
  id: string;
  name: string;
  zone: 'north' | 'central' | 'tech' | 'outstation';
  zoneLabel: string;
  typeLabel: string;
  typeColor: string;
  address: string;
  area: string;
  phone?: string;
  secondaryPhone?: string;
  timings: string;
  notes: string;
  mapQuery: string;
  image?: string;
  isOutOfBangalore?: boolean;
  isITCampus?: boolean;
  state?: string;
}

export interface GalleryItem {
  id: string;
  title?: string;
  category: 'all' | 'kitchen' | 'food' | 'restaurant-setup';
  categoryLabel: string;
  imageUrl: string;
  caption?: string;
  year?: string;
}
