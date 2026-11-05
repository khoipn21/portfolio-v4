'use client';

import { Printer } from '@/components/icons';

export function PrintResumeButton() {
  return (
    <button type="button" className="button print-hidden" onClick={() => window.print()}>
      <Printer aria-hidden="true" size={18} /> Print / Save PDF
    </button>
  );
}
