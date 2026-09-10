'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CompactThemeToggle } from '@/components/compact-theme-toggle';

const links = [
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/contact', label: 'Contact' },
  { href: '/resume', label: 'Résumé' },
];

export function TopNavbar() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <div className="page-shell header-inner">
        <Link href="/" className="wordmark" aria-label="Pham Ngoc Khoi, home">
          <span className="wordmark-initials" aria-hidden="true">
            pk.
          </span>
          <span>Pham Ngoc Khoi</span>
        </Link>
        <nav aria-label="Main navigation">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname.startsWith(href) ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <CompactThemeToggle />
      </div>
    </header>
  );
}
