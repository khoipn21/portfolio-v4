import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { userData } from '@/data/user-data';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Pham Ngoc Khoi about software engineering roles, collaborations, or projects.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-shell">
      <header className="page-intro">
        <h1 className="page-title">
          Let’s build
          <br />
          something useful.
        </h1>
        <p className="lede">
          Have a role or project in mind? Tell me a little about the team, the problem, and what you
          need.
        </p>
        <a className="contact-email" href={`mailto:${userData.email}`}>
          {userData.email} <ArrowUpRight aria-hidden="true" />
        </a>
        <p className="demo-note">Opens your email app. You can also copy the address above.</p>
      </header>
      <section className="section-block detail-grid" aria-labelledby="elsewhere-heading">
        <h2 id="elsewhere-heading" className="section-title">
          Elsewhere
        </h2>
        <div className="prose">
          <p>
            <a className="text-link" href={userData.github}>
              GitHub: {userData.githubUsername} <ArrowUpRight aria-hidden="true" size={18} />
            </a>
          </p>
          <p>
            <a className="text-link" href={userData.linkedin}>
              LinkedIn <ArrowUpRight aria-hidden="true" size={18} />
            </a>
          </p>
          <p>
            <a className="text-link" href={`tel:${userData.phone.replace(/[^\d+]/g, '')}`}>
              {userData.phone}
            </a>
          </p>
          <p>{userData.location}</p>
        </div>
      </section>
      <section className="section-block detail-grid" aria-labelledby="context-heading">
        <h2 id="context-heading" className="section-title">
          A little context first
        </h2>
        <div className="prose">
          <p>
            I’m a software engineer and full-stack developer working with React, Next.js,
            TypeScript, and Go.
          </p>
          <div className="action-row">
            <Link className="text-link" href="/projects">
              Explore projects <ArrowUpRight aria-hidden="true" />
            </Link>
            <Link className="text-link" href="/resume">
              View résumé <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
