import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { projects } from '@/data/user-data';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return { title: 'Project not found' };
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.description,
      url: `/projects/${project.slug}`,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  const sections = [
    ['The problem', project.problem],
    ['Contribution & credits', project.contribution],
    ['A technical decision', project.decision],
    ['The engineering challenge', project.challenge],
    ['Current limitations', project.limitation],
    ['What I would improve next', project.nextStep],
  ];

  return (
    <main id="main-content" tabIndex={-1} className="page-shell">
      <header className="page-intro">
        <Link className="text-link mb-8" href="/projects">
          <ArrowLeft aria-hidden="true" size={18} /> All projects
        </Link>
        <p className="project-type">{project.category}</p>
        <h1 className="page-title">{project.title}</h1>
        <p className="lede">{project.description}</p>
        <div className="action-row">
          <a className="button" href={project.github}>
            Source code <ArrowUpRight aria-hidden="true" />
          </a>
          {project.live && (
            <a className="button-secondary" href={project.live}>
              Live demo <ArrowUpRight aria-hidden="true" />
            </a>
          )}
        </div>
        {!project.live && <p className="demo-note">{project.demoNote}</p>}
      </header>

      <dl className="case-facts">
        <div>
          <dt>Stack</dt>
          <dd>{project.tech.join(' · ')}</dd>
        </div>
        <div>
          <dt>Evaluation</dt>
          <dd>{project.live ? 'Live demo & source' : 'Source review; runtime not verified'}</dd>
        </div>
      </dl>
      {project.image && (
        <figure className="case-figure">
          <Image
            className="case-image"
            src={project.image}
            alt={`${project.title} project artwork`}
            width={1200}
            height={750}
            sizes="(max-width: 1200px) 100vw, 1168px"
          />
          <figcaption>{project.imageCaption}</figcaption>
        </figure>
      )}
      {sections.map(([heading, content]) => (
        <section key={heading} className="case-section detail-grid">
          <h2>{heading}</h2>
          <p className="prose">{content}</p>
        </section>
      ))}
      <section className="case-section detail-grid">
        <h2>What the code includes</h2>
        <div className="prose">
          <ul>
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="case-section detail-grid">
        <h2>How to evaluate it</h2>
        <div className="prose">
          <ol>
            {project.reviewSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p>
            These are suggested review steps, not a claim that the project has passed an end-to-end
            test.
          </p>
          <a className="text-link" href={project.github}>
            Open repository <ArrowUpRight aria-hidden="true" size={18} />
          </a>
        </div>
      </section>
      <div className="case-next action-row">
        <Link className="text-link" href="/projects">
          More projects <ArrowUpRight aria-hidden="true" size={18} />
        </Link>
        <Link className="text-link" href="/contact">
          Ask about this work <ArrowUpRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </main>
  );
}
