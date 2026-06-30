'use client';

import { useEffect, useState } from 'react';

export function CurrentTime() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Ho_Chi_Minh',
        })
      );
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10px]"
      style={{
        background: 'color-mix(in srgb, var(--bg-primary) 70%, transparent)',
        color: 'var(--text-tertiary)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        className="h-1.5 w-1.5 animate-pulse rounded-full"
        style={{ background: 'var(--accent-primary)' }}
      />
      {time} ICT
    </div>
  );
}
