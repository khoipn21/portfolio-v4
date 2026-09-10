import type { Metadata } from 'next';
import Link from 'next/link';
import { experiences, education } from '@/data/user-data';

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
          across the stack.
        </h1>
        <p className="lede">
          Product teams and independent projects, from customer-facing interfaces to the APIs and
          services behind them.
        </p>
      </header>
      <section className="section-block" aria-label="Work experience">
        {experiences.map((experience) => (
          <article className="experience-row" key={experience.company}>
            <div>
              <h2 className="text-xl font-semibold">{experience.company}</h2>
              <p className="muted">{experience.period.replaceAll('—', '–')}</p>
              <p className="muted">{experience.location}</p>
            </div>
            <div className="prose">
              <h3>{experience.role}</h3>
              <ul>
                {experience.description.map((description) => (
                  <li key={description}>{description}</li>
                ))}
              </ul>
              <p>{experience.tech.join(' · ')}</p>
            </div>
          </article>
        ))}
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
