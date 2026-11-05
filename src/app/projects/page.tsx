import type { Metadata } from 'next';
import { projects } from '@/data/user-data';
import { ProjectCard } from '@/components/projects/project-card';
import { PortfolioMotion } from '@/components/portfolio-motion';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Web applications, real-time systems, Go microservices, and an AI assistant by Pham Ngoc Khoi. Read the code, decisions, and known limitations.',
  alternates: { canonical: '/projects' },
};

export default function ProjectsPage() {
  return (
    <PortfolioMotion>
      <main id="main-content" tabIndex={-1} className="page-shell">
        <header className="page-intro">
          <h1 className="page-title">
            The work,
            <br />
            with <em>context</em>.
          </h1>
          <p className="lede">
            Hackathon, side, and freelance projects: 3D and AI, real-time chat, microservices, and
            commerce. Each case study separates what is built from what still needs work.
          </p>
        </header>
        <section aria-label="Project case studies" className="project-list">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              priority={index === 0}
              headingLevel="h2"
            />
          ))}
        </section>
      </main>
    </PortfolioMotion>
  );
}
