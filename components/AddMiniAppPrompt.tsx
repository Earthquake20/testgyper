'use client';

import { useEffect, useState, useCallback } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

const LS_KEY = 'hyperrun:addMiniAppPrompt:added';

export default function AddMiniAppPrompt() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
const added = localStorage.getItem(LS_KEY) === 'yes';
const force = new URLSearchParams(location.search).has('addma');
if (!ignore && (force || !added)) setOpen(true);
      } catch {
        /* no-op */
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const handleConfirm = useCallback(async () => {
    try {
      setBusy(true);
      await sdk.actions.addMiniApp();
      localStorage.setItem(LS_KEY, 'yes');
      setOpen(false);
    } catch {
      // no flag so it can show next launch
    } finally {
      setBusy(false);
    }
  }, []);

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, []);

  if (!open) return null;

  return (
    <div className="addma-overlay" aria-modal="true" role="dialog">
      <div className="addma-panel">
        <div className="addma-head">
          <div className="addma-logo">HR</div>
          <div className="addma-title">Add Mini App. Hyper Run</div>
        </div>

        <div className="addma-note">Add to Farcaster for quick access and notifications</div>

        <div className="addma-actions">
          <button className="addma-btn addma-cancel" onClick={handleCancel} disabled={busy}>Cancel</button>
          <button className="addma-btn addma-ok" onClick={handleConfirm} disabled={busy}>
            {busy ? 'Working…' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
