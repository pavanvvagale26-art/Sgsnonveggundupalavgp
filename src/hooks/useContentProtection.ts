import { useEffect } from 'react';

/**
 * useContentProtection
 *
 * Content protection is currently DISABLED.
 * Right-click, DevTools (F12 / Ctrl+Shift+I), Inspect Element,
 * Ctrl+U, Ctrl+S, and image drag are all allowed.
 *
 * To re-enable, restore the event listeners in this hook and the
 * matching CSS rules in index.css.
 */
export function useContentProtection() {
  // No-op: all protection listeners removed.
  useEffect(() => {}, []);
}
