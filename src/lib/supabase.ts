import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Admin panel will not work without VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'sb_publishable_VG70s3I3JgT4d_aW-3eGGQ_7KibPcyI'
);

export type Database = {
  public: {
    Tables: {
      menu_items: {
        Row: {
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
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['menu_items']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['menu_items']['Row']>;
      };
      gallery_items: {
        Row: {
          id: string;
          title: string | null;
          category: string;
          category_label: string;
          image_url: string;
          caption: string | null;
          year: string | null;
          display_order: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['gallery_items']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['gallery_items']['Row']>;
      };
      locations: {
        Row: {
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
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['locations']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['locations']['Row']>;
      };
      franchise_inquiries: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string;
          city: string;
          message: string | null;
          status: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['franchise_inquiries']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['franchise_inquiries']['Row']>;
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['site_settings']['Row'], 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['site_settings']['Row']>;
      };
      page_content: {
        Row: {
          id: string;
          page: string;
          section: string;
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['page_content']['Row'], 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['page_content']['Row']>;
      };
    };
  };
};
