import { supabase } from './supabase';

/**
 * Retrieves the list of deleted item IDs/names from Supabase site_settings with localStorage fallback
 */
export async function getDeletedIds(key: string): Promise<string[]> {
  try {
    const local = localStorage.getItem(`sgs_${key}`);
    const localList: string[] = local ? JSON.parse(local) : [];

    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .maybeSingle();

    if (data && data.value) {
      try {
        const remoteList: string[] = JSON.parse(data.value);
        const combined = Array.from(new Set([...localList, ...remoteList]));
        localStorage.setItem(`sgs_${key}`, JSON.stringify(combined));
        return combined;
      } catch {
        return localList;
      }
    }
    return localList;
  } catch {
    const local = localStorage.getItem(`sgs_${key}`);
    try {
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  }
}

/**
 * Adds an ID or name to the deleted items list so it stays deleted everywhere
 */
export async function addDeletedId(key: string, id: string): Promise<void> {
  try {
    const current = await getDeletedIds(key);
    const normalized = id.trim().toLowerCase();
    const idKey = id.trim();

    const updated = Array.from(new Set([...current, idKey, normalized]));
    localStorage.setItem(`sgs_${key}`, JSON.stringify(updated));

    await supabase
      .from('site_settings')
      .upsert(
        { key, value: JSON.stringify(updated), updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );
  } catch (err) {
    console.error(`Error saving deleted ${key}:`, err);
  }
}
