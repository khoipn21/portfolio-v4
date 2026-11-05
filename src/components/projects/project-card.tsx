import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from '@/components/icons';
import type { Project } from '@/data/user-data';

export function ProjectCard({
  project,
  priority = false,
  headingLevel = 'h3',
}: {
  project: Project;
  priority?: boolean;
  headingLevel?: 'h2' | 'h3';
}) {
  const Heading = headingLevel;
  return (
    <article className={project.image ? 'project-item' : 'project-item is-text-only'}>
      {project.image && (
        <figure>
          <Link
            className="project-media"
            href={`/projects/${project.slug}`}
            tabIndex={-1}
            aria-hidden="true"
          >
            <Image
              src={project.image}
              alt=""
              width={800}
              height={500}
              sizes="(max-width: 700px) calc(100vw - 64px), (max-width: 1000px) 50vw, 720px"
              preload={priority}
              data-project-image
            />
          </Link>
          <figcaption className="project-illustration-note">{project.imageCaption}</figcaption>
        </figure>
      )}
      <div>
        <span className="project-type">
          {project.category}
          {project.period && ` · ${project.period}`}
        </span>
        <Heading>
          <Link className="project-title" href={`/projects/${project.slug}`}>
            {project.title}
            <ArrowRight aria-hidden="true" />
          </Link>
        </Heading>
        <p className="project-description">{project.description}</p>
        <ul className="project-tech" aria-label={`${project.title} technologies`}>
          {project.tech.slice(0, 4).map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        <div className="action-row">
          <Link
            className="text-link"
            href={`/projects/${project.slug}`}
            aria-label={`Read ${project.title} case study`}
          >
            Case study <ArrowRight aria-hidden="true" />
          </Link>
          {project.github && (
            <a
              className="text-link"
              href={project.github}
              aria-label={`${project.title} source code`}
            >
              Source code <ArrowUpRight aria-hidden="true" />
            </a>
          )}
          {project.repos?.map((repo) => (
            <a
              key={repo.href}
              className="text-link"
              href={repo.href}
              aria-label={`${project.title} ${repo.label.toLowerCase()}`}
            >
              {repo.label} <ArrowUpRight aria-hidden="true" />
            </a>
          ))}
          {project.live && (
            <a className="text-link" href={project.live}>
              Live demo <ArrowUpRight aria-hidden="true" />
            </a>
          )}
        </div>
        {!project.live && <p className="demo-note">{project.demoNote}</p>}
      </div>
    </article>
  );
}
