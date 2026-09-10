import type { Metadata } from 'next';
import Link from 'next/link';
import { userData, experiences, education } from '@/data/user-data';
import { PrintResumeButton } from '@/components/print-resume-button';

export const metadata: Metadata = {
  title: 'Résumé',
  description:
    'Experience, education, and technical skills of Pham Ngoc Khoi, Software Engineer & Full-Stack Developer.',
  alternates: { canonical: '/resume' },
};

export default function ResumePage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-shell resume-page">
      <header className="page-intro">
        <h1 className="page-title">{userData.name}</h1>
        <p className="lede">{userData.headline}</p>
        <p className="muted mt-4">{userData.location}</p>
        <div className="action-row">
          <a className="text-link" href={`mailto:${userData.email}`}>
            {userData.email}
          </a>
          <a className="text-link" href={userData.github}>
            github.com/{userData.githubUsername}
          </a>
          <PrintResumeButton />
        </div>
        <p className="demo-note print-hidden">
          Choose “Save as PDF” in your browser’s print dialog to download a copy.
        </p>
      </header>
      <section className="section-block detail-grid" aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="section-title">
          Profile
        </h2>
        <p className="prose">
          Software engineer building web applications from interface to API. Experience across
          e-commerce, proptech, and educational products, including responsive interfaces,
          authentication, API integration, and real-time features.
        </p>
      </section>
      <section className="section-block" aria-labelledby="experience-heading">
        <h2 id="experience-heading" className="section-title mb-8">
          Experience
        </h2>
        {experiences.map((experience) => (
          <article className="experience-row" key={experience.company}>
            <div>
              <h3 className="text-xl font-semibold">{experience.company}</h3>
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
            </div>
          </article>
        ))}
      </section>
      <section className="section-block detail-grid" aria-labelledby="skills-heading">
        <h2 id="skills-heading" className="section-title">
          Technical skills
        </h2>
        <dl className="prose">
          <div>
            <dt className="font-semibold">Frontend</dt>
            <dd>
              HTML, CSS, JavaScript, TypeScript, React, Next.js, React Native, Tailwind CSS,
              TanStack Query
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Backend & data</dt>
            <dd>Go, Node.js, Express, NestJS, WebSocket, PostgreSQL, MongoDB, Redis, Supabase</dd>
          </div>
          <div>
            <dt className="font-semibold">Tools & delivery</dt>
            <dd>Git, Linux, Docker, Nginx, AWS, GitHub Actions</dd>
          </div>
        </dl>
      </section>
      <section className="section-block detail-grid" aria-labelledby="education-heading">
        <h2 id="education-heading" className="section-title">
          Education
        </h2>
        <div className="prose">
          {education.map((item) => (
            <div key={item.school}>
              <h3>{item.school}</h3>
              <p>{item.major}</p>
              <p>
                {item.period.replaceAll('—', '–')}
                {item.note && ` · ${item.note}`}
              </p>
            </div>
          ))}
        </div>
      </section>
      <div className="section-block print-hidden">
        <Link className="text-link" href="/projects">
          Read project case studies
        </Link>
      </div>
    </main>
  );
}
