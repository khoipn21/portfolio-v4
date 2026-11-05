import type { Metadata } from 'next';
import Link from 'next/link';
import { experiences, education, awards } from '@/data/user-data';
import { CareerGraph } from '@/components/career-graph/career-graph';

export const metadata: Metadata = {
  title: 'Experience',
  description:
    'Software engineering experience across e-commerce, proptech, education, and freelance full-stack applications.',
  alternates: { canonical: '/experience' },
};

export default function ExperiencePage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-shell">
      <header className="page-intro">
        <h1 className="page-title">
          Experience,
          <br />
          across the <em>stack</em>.
        </h1>
        <p className="lede">
          Product teams and independent projects, from customer-facing interfaces to the APIs and
          services behind them.
        </p>
      </header>
      <section className="section-block" aria-label="Work experience">
        <CareerGraph experiences={experiences} headingLevel="h2" />
      </section>
      <section className="section-block detail-grid" aria-labelledby="awards-heading">
        <h2 id="awards-heading" className="section-title">
          Awards
        </h2>
        <div className="prose">
          {awards.map((award) => (
            <div key={award.event}>
              <h3>
                {award.title} · {award.event}
              </h3>
              <p>
                {award.project} · {award.date}
              </p>
              <p>{award.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section-block detail-grid" aria-labelledby="education-heading">
        <h2 id="education-heading" className="section-title">
          Education
        </h2>
        <div className="prose">
          {education.map((item) => (
            <div key={item.school}>
              <h3>{item.school}</h3>
              <p>
                {item.major}
                {item.note && ` · ${item.note}`}
              </p>
              <p>
                {item.period.replaceAll('—', '–')} · {item.location}
              </p>
            </div>
          ))}
        </div>
      </section>
      <div className="section-block action-row">
        <Link className="text-link" href="/projects">
          Explore projects
        </Link>
        <Link className="text-link" href="/resume">
          View résumé
        </Link>
      </div>
    </main>
  );
}
