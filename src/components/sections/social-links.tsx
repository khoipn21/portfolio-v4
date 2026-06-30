'use client';

import { userData } from '@/data/user-data';
import { Mail, FileText } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa';

const iconMap: Record<string, React.ReactNode> = {
  github: <SiGithub className="h-3.5 w-3.5" />,
  linkedin: <FaLinkedin className="h-3.5 w-3.5" />,
  email: <Mail className="h-3.5 w-3.5" />,
};

/**
 * Social links with premium pill design and Button-in-Button pattern.
 * Consistent radius language with the rest of the portfolio.
 */
export function SocialLinks() {
  return (
    <div id="contact" className="mt-6 scroll-mt-24">
      <h2 className="mb-3 text-[14px]" style={{ color: 'var(--text-tertiary)' }}>
        Here are my{' '}
        <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
          socials
        </span>
      </h2>
      <div className="flex flex-wrap gap-2">
        {userData.socials.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-full py-1.5 pr-1.5 pl-3.5 text-[12px] font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-accent)',
              color: 'var(--text-tertiary)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.03)',
            }}
          >
            <span className="opacity-70 transition-opacity duration-300 group-hover:opacity-100">
              {iconMap[social.icon]}
            </span>
            {social.name}
            {/* Button-in-Button: nested icon circle */}
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-[1px]"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-2.5 w-2.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </span>
          </a>
        ))}
        <a
          href="/resume"
          className="group flex items-center gap-2 rounded-full py-1.5 pr-1.5 pl-3.5 text-[12px] font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.03] active:scale-[0.98]"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-accent)',
            color: 'var(--text-tertiary)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.03)',
          }}
        >
          <span className="opacity-70 transition-opacity duration-300 group-hover:opacity-100">
            <FileText className="h-3.5 w-3.5" />
          </span>
          Resume
          {/* Button-in-Button: nested icon circle */}
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-[1px]"
            style={{ background: 'var(--bg-secondary)' }}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-2.5 w-2.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
}
