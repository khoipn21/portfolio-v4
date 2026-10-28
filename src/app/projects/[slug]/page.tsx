import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Fragment, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
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
  const index = projects.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  const groups: { title: string; sections: [string, ReactNode][] }[] = [
    {
      title: 'Context',
      sections: [
        ['The problem', <p key="problem">{project.problem}</p>],
        ['Contribution & credits', <p key="contribution">{project.contribution}</p>],
      ],
    },
    {
      title: 'The build',
      sections: [
        ['A technical decision', <p key="decision">{project.decision}</p>],
        ['The engineering challenge', <p key="challenge">{project.challenge}</p>],
        [
          'What the code includes',
          <ul key="highlights">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>,
        ],
      ],
    },
    {
      title: 'Limits & next steps',
      sections: [
        ['Current limitations', <p key="limitation">{project.limitation}</p>],
        ['What I would improve next', <p key="next-step">{project.nextStep}</p>],
        [
          'How to evaluate it',
          <Fragment key="review">
            <ol>
              {project.reviewSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p>Suggested starting points for a code review.</p>
            <a className="text-link" href={project.github}>
              Open repository <ArrowUpRight aria-hidden="true" size={18} />
            </a>
          </Fragment>,
        ],
      ],
    },
  ];

  return (
    <main id="main-content" tabIndex={-1} className="page-shell">
      <header className="page-intro">
        <Link className="text-link back-link" href="/projects">
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
          <dd>{project.live ? 'Live demo & source' : 'Source code; no public demo'}</dd>
        </div>
      </dl>
      {project.image && (
        <figure className="case-figure">
          <div className="case-frame">
            <Image
              className="case-image"
              src={project.image}
              alt={`${project.title} project artwork`}
              width={1200}
              height={750}
              sizes="(max-width: 1000px) 100vw, 896px"
            />
          </div>
          <figcaption>{project.imageCaption}</figcaption>
        </figure>
      )}
      {groups.map((group, groupIndex) => (
        <section key={group.title} className="case-group" aria-labelledby={`group-${groupIndex}`}>
          <h2 id={`group-${groupIndex}`} className="case-group-title">
            <span aria-hidden="true">{String(groupIndex + 1).padStart(2, '0')}</span>
            {group.title}
          </h2>
          {group.sections.map(([heading, content]) => (
            <div key={heading} className="case-section detail-grid">
              <h3>{heading}</h3>
              <div className="prose">{content}</div>
            </div>
          ))}
        </section>
      ))}
      <nav className="case-pager" aria-label="More case studies">
        <Link href={`/projects/${previous.slug}`} rel="prev">
          <span>
            <ArrowLeft aria-hidden="true" /> Previous
          </span>
          <strong>{previous.title}</strong>
        </Link>
        <Link href={`/projects/${next.slug}`} rel="next">
          <span>
            Next <ArrowRight aria-hidden="true" />
          </span>
          <strong>{next.title}</strong>
        </Link>
      </nav>
      <div className="case-next action-row">
        <Link className="text-link" href="/contact">
          Ask about this work <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </main>
  );
}
