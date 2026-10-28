'use client';

import { Check, Copy } from 'lucide-react';
import { useEffect, useState, useSyncExternalStore } from 'react';

const subscribe = () => () => {};

type Status = 'idle' | 'copied' | 'failed';

export function CopyEmailButton({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    if (status !== 'copied') return;
    const timeout = window.setTimeout(() => setStatus('idle'), 2400);
    return () => window.clearTimeout(timeout);
  }, [status]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
  };

  // Clipboard access needs JavaScript; without it the button would do nothing.
  if (!mounted) return null;

  return (
    <>
      <button type="button" className="copy-button" onClick={copy}>
        {status === 'copied' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        Copy address
      </button>
      <span className="copy-status" role="status">
        {status === 'copied' && 'Copied to clipboard.'}
        {status === 'failed' && 'Couldn’t copy. Select the address above instead.'}
      </span>
    </>
  );
}
