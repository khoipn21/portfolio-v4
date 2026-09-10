import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { projects, userData, experiences } from '@/data/user-data';
import { PortfolioMotion } from '@/components/portfolio-motion';

export default function Home() {
  return (
    <PortfolioMotion>
      <main id="main-content" tabIndex={-1} className="home-page">
        <section className="viewport-panel home-hero" aria-labelledby="intro-heading">
          <div className="hero-opening">
            <h1 id="intro-heading" className="hero-name" aria-label="Pham Ngoc Khoi">
              <span data-panel-reveal aria-hidden="true">
                Pham
              </span>
              <span data-panel-reveal aria-hidden="true">
                Ngoc Khoi
              </span>
            </h1>
            <p className="hero-position">
              {userData.headline}. Building considered interfaces and the systems behind them.
            </p>
          </div>
          <div className="hero-stack">
            <span>Working across the stack</span>
            <p>
              Go <span>/</span> TypeScript <span>/</span> React <span>/</span> Next.js
            </p>
            <p className="hero-stack-support">PostgreSQL · Redis · Docker · AWS</p>
          </div>
          <div className="hero-foot">
            <a className="text-link" href={userData.github}>
              GitHub <ArrowUpRight aria-hidden="true" />
            </a>
            <a href="#selected-work" className="hero-work-link">
              Explore projects <ArrowDown aria-hidden="true" />
            </a>
          </div>
        </section>

        <section
          id="about"
          className="viewport-panel approach-panel"
          aria-labelledby="about-heading"
        >
          <div className="approach-opening">
            <h2 id="about-heading" data-panel-reveal>
              Care for the interface.
              <br />
              Think through the system.
            </h2>
            <figure className="approach-illustration" data-approach-illustration>
              <Image
                src="/images/interface-system.png"
                alt=""
                width={1536}
                height={1024}
                sizes="(max-width: 700px) 90vw, 40vw"
              />
              <figcaption>Interface / system — generated conceptual illustration.</figcaption>
            </figure>
          </div>
          <div className="approach-bottom">
            <p>
              I’m Khoi, a software engineer working across web interfaces, applications, and the
              systems that connect them.
            </p>
            <dl className="practice-list">
              <div>
                <dt>Interfaces</dt>
                <dd>React · Next.js · React Native · TypeScript</dd>
              </div>
              <div>
                <dt>Connections</dt>
                <dd>Go · Node.js · NestJS · REST · WebSocket</dd>
              </div>
              <div>
                <dt>Foundations</dt>
                <dd>PostgreSQL · Redis · Docker · AWS</dd>
              </div>
            </dl>
          </div>
        </section>

        <section id="selected-work" className="work-selection" aria-labelledby="work-heading">
          <h2 id="work-heading" data-panel-reveal>
            Selected work
          </h2>
          <div className="work-index">
            {projects
              .filter((project) => project.featured)
              .map((project, index) => (
                <article className="work-entry" key={project.slug}>
                  <span className="work-number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="work-entry-copy">
                    <h3>
                      <Link
                        className="work-name"
                        href={`/projects/${project.slug}`}
                        aria-label={`Read ${project.title} case study`}
                      >
                        <span data-panel-reveal aria-hidden="true">
                          {project.title}
                        </span>
                        <ArrowUpRight aria-hidden="true" />
                      </Link>
                    </h3>
                    <div className="work-entry-meta">
                      <span className="work-tech">{project.tech.join(' / ')}</span>
                      <a
                        className="text-link"
                        href={project.github}
                        aria-label={`${project.title} source code`}
                      >
                        Source <ArrowUpRight aria-hidden="true" />
                      </a>
                    </div>
                    <p className="work-availability">{project.demoNote}</p>
                  </div>
                  {project.image && (
                    <figure className="work-preview">
                      <Image
                        src={project.image}
                        alt=""
                        width={800}
                        height={500}
                        sizes="(max-width: 700px) 90vw, 42vw"
                      />
                      <figcaption>{project.imageCaption}</figcaption>
                    </figure>
                  )}
                </article>
              ))}
          </div>
          <Link className="text-link work-all" href="/projects">
            All projects <ArrowUpRight aria-hidden="true" />
          </Link>
        </section>

        <section className="viewport-panel experience-panel" aria-labelledby="experience-heading">
          <h2 id="experience-heading" data-panel-reveal>
            Built with teams.
            <br />
            Made for people.
          </h2>
          <div className="career-timeline">
            {experiences.map((experience) => (
              <article className="career-entry" key={experience.company}>
                <div className="career-heading">
                  <p className="career-period">{experience.period}</p>
                  <h3 data-panel-reveal>{experience.company}</h3>
                  <p>{experience.role}</p>
                </div>
                <div className="career-delivery">
                  <p className="career-label">What I delivered</p>
                  <ul>
                    {experience.description.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="career-tech">{experience.tech.join(' / ')}</p>
                </div>
              </article>
            ))}
          </div>
          <Link className="text-link" href="/experience">
            Experience & education <ArrowUpRight aria-hidden="true" />
          </Link>
        </section>

        <section className="viewport-panel contact-panel" aria-labelledby="contact-heading">
          <h2 id="contact-heading" data-panel-reveal>
            Have something
            <br />
            in mind?
          </h2>
          <div className="contact-bottom">
            <a className="contact-email" href={`mailto:${userData.email}`}>
              {userData.email}
              <ArrowUpRight aria-hidden="true" />
            </a>
            <div className="action-row">
              <Link className="text-link" href="/resume">
                View résumé <ArrowUpRight aria-hidden="true" />
              </Link>
              <Link className="text-link" href="/projects">
                All projects <ArrowUpRight aria-hidden="true" />
              </Link>
              <a className="text-link" href={userData.github}>
                GitHub <ArrowUpRight aria-hidden="true" />
              </a>
              <a className="text-link" href={userData.linkedin}>
                LinkedIn <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </div>
          <p className="home-copyright">
            © {new Date().getFullYear()} {userData.name}
          </p>
        </section>
      </main>
    </PortfolioMotion>
  );
}
