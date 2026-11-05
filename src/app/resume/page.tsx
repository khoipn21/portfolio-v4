import type { Metadata } from 'next';
import Link from 'next/link';
import { userData, experiences, education, awards, projects } from '@/data/user-data';
import { DownloadSimple } from '@/components/icons';
import { ExperienceRow } from '@/components/experience-row';

export const metadata: Metadata = {
  title: 'Résumé',
  description:
    'Experience, education, and technical skills of Pham Ngoc Khoi, Software Engineer & Full-Stack Developer.',
  alternates: { canonical: '/resume' },
};

const skills: [string, string][] = [
  ['Languages', 'TypeScript, JavaScript, Go, Python'],
  [
    'Frontend',
    'React 19, Next.js (App Router), Vite, TanStack Query/Router/Table, Zustand, Jotai, React Hook Form, Zod/Yup, Tailwind v4, shadcn/ui, Mantine, Tiptap, i18next',
  ],
  [
    'Mobile',
    'React Native (CLI and Expo), Expo Router, React Navigation, MMKV, Notifee/FCM, social login SDKs (Google, Apple, Kakao, Naver, LINE, Facebook), signed Android/iOS builds',
  ],
  ['Backend', 'Node.js, NestJS, Go (Gin, gRPC), REST, WebSocket/STOMP, JWT, OAuth 2.0, RBAC'],
  ['Data & infra', 'PostgreSQL, MongoDB, Redis, Docker, Nginx, PM2, GitLab CI, AWS EC2/S3, Sentry'],
  [
    'AI-assisted dev',
    'Claude Code, Codex, Cursor; author of agent skills, hooks, and workflows used daily at work',
  ],
  ['Spoken', 'Vietnamese (native), English (C1, professional working proficiency)'],
];

export default function ResumePage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-shell resume-page">
      <header className="page-intro">
        <h1 className="page-title">{userData.name}</h1>
        <p className="lede">{userData.headline}</p>
        <p className="meta-line">{userData.location}</p>
        <div className="action-row">
          <a className="text-link" href={`mailto:${userData.email}`}>
            {userData.email}
          </a>
          <a className="text-link" href={`tel:${userData.phone.replace(/[^+\d]/g, '')}`}>
            {userData.phone}
          </a>
          <a className="text-link" href={userData.github}>
            github.com/{userData.githubUsername}
          </a>
          <a className="button print-hidden" href="/cv.pdf" download="Pham-Ngoc-Khoi-CV.pdf">
            <DownloadSimple aria-hidden="true" size={18} /> Download PDF
          </a>
        </div>
      </header>
      <section className="section-block detail-grid" aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="section-title">
          Profile
        </h2>
        <p className="prose">
          Full-stack engineer with 2+ years shipping production web and mobile products in
          TypeScript (React, Next.js, React Native) and Go. Lead contributor on 7 of 8 repositories
          across four products at WALA-ICT, owning features from Figma and requirements through API
          integration, localization, code review, and QA. Strongest in end-to-end feature ownership,
          real-time (WebSocket/STOMP) and OAuth flows, and the conventions and CI gates a team ships
          on; comfortable in Go and Node backends (REST/gRPC, JWT/RBAC, PostgreSQL, Redis, AWS).
          First place, Sea x OpenAI Codex Hackathon Vietnam 2026 (BioWeave).
        </p>
      </section>
      <section className="section-block" aria-labelledby="experience-heading">
        <h2 id="experience-heading" className="section-title stacked-title">
          Experience
        </h2>
        {experiences.map((experience) => (
          <ExperienceRow key={experience.company} experience={experience} headingLevel="h3" />
        ))}
      </section>
      <section className="section-block detail-grid" aria-labelledby="projects-heading">
        <h2 id="projects-heading" className="section-title">
          Projects
        </h2>
        <div className="prose">
          {projects.map((project) => (
            <div key={project.slug}>
              <h3>
                <Link href={`/projects/${project.slug}`}>{project.title}</Link>
              </h3>
              <p className="experience-meta">
                {[project.category, project.period].filter(Boolean).join(' · ')}
              </p>
              <p>{project.description}</p>
              <p className="experience-meta">{project.tech.join(' · ')}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section-block detail-grid" aria-labelledby="skills-heading">
        <h2 id="skills-heading" className="section-title">
          Technical skills
        </h2>
        <dl className="prose skill-groups">
          {skills.map(([group, items]) => (
            <div key={group}>
              <dt>{group}</dt>
              <dd>{items}</dd>
            </div>
          ))}
        </dl>
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
