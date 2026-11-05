import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight } from '@/components/icons';
import { projects, userData, experiences, awards } from '@/data/user-data';
import { PortfolioMotion } from '@/components/portfolio-motion';
import { AwardVideo } from '@/components/award-video';
import { KeyBench } from '@/components/key-bench/key-bench';
import { RequestLineFigure } from '@/components/figures/request-line/request-line-figure';
import { WorkShowcase } from '@/components/work-showcase/work-showcase';
import { CareerGraph } from '@/components/career-graph/career-graph';
import { Spotlight } from '@/components/spotlight';

export default function Home() {
  return (
    <PortfolioMotion>
      <main id="main-content" tabIndex={-1} className="home-page">
        <section className="viewport-panel home-hero" aria-labelledby="intro-heading">
          <div className="hero-opening">
            <Spotlight
              className="hero-spotlight"
              radius={200}
              reveal={
                <p className="hero-name">
                  <span>From UI</span>
                  <span>to the API</span>
                </p>
              }
            >
              <h1 id="intro-heading" className="hero-name" aria-label="Pham Ngoc Khoi">
                <span data-panel-reveal aria-hidden="true">
                  Pham
                </span>
                <span data-panel-reveal aria-hidden="true">
                  Ngoc Khoi
                </span>
              </h1>
            </Spotlight>
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
            <Spotlight
              reveal={
                <p className="approach-heading">
                  Sweat the <em>pixels</em>.
                  <br />
                  Then trace every <em>request</em>.
                </p>
              }
            >
              <h2 id="about-heading" className="approach-heading" data-word-reveal>
                Care for the <em>interface</em>.
                <br />
                Think through the <em>system</em>.
              </h2>
            </Spotlight>
            <div className="approach-illustration" data-approach-illustration>
              <KeyBench />
            </div>
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

        <section id="how-i-build" className="build-panel" aria-labelledby="build-heading">
          <div className="build-head">
            <h2 id="build-heading" data-panel-reveal>
              How I build
            </h2>
            <p>
              The stack I reach for, traced as one request. A Next.js screen asks a Go service, Go
              checks Redis first, and only a miss goes on to Postgres and leaves a copy behind.
            </p>
          </div>
          <div className="build-figure">
            <RequestLineFigure />
          </div>
        </section>

        <section id="selected-work" className="work-selection" aria-labelledby="work-heading">
          <h2 id="work-heading" data-panel-reveal>
            Selected work
          </h2>
          <WorkShowcase projects={projects.filter((project) => project.featured)} />
          <Link className="text-link work-all" href="/projects">
            All projects <ArrowRight aria-hidden="true" />
          </Link>
        </section>

        {awards.slice(0, 1).map((award) => (
          <section
            key={award.event}
            id="awards"
            className="viewport-panel award-panel"
            aria-labelledby="award-heading"
          >
            <div className="award-copy">
              <header className="award-head">
                <h2 id="award-heading" data-panel-reveal>
                  Won <em>{`${award.title.toLowerCase()}.`}</em>
                </h2>
                <p className="award-event">
                  {award.event}, with {award.project}. <span>{award.date}</span>
                </p>
              </header>
              <p className="award-summary">{award.summary}</p>
              <dl className="award-facts">
                {award.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            {award.stream && award.teaser && award.poster && (
              <figure className="award-media">
                <AwardVideo
                  stream={award.stream}
                  teaser={award.teaser}
                  poster={award.poster}
                  duration={award.videoDuration ?? ''}
                  label={`${award.project} demo video`}
                />
                <figcaption>{award.videoCaption}</figcaption>
              </figure>
            )}
          </section>
        ))}

        <section className="viewport-panel experience-panel" aria-labelledby="experience-heading">
          <h2 id="experience-heading" data-panel-reveal>
            Built with teams.
            <br />
            Made for <em>people</em>.
          </h2>
          <CareerGraph experiences={experiences} detail="summary" />
          <Link className="text-link" href="/experience">
            Full experience & education <ArrowRight aria-hidden="true" />
          </Link>
        </section>

        <section className="viewport-panel contact-panel" aria-labelledby="contact-heading">
          <Spotlight
            radius={220}
            reveal={
              <p className="contact-heading">
                Let’s make
                <br />
                it <em>real</em>.
              </p>
            }
          >
            <h2 id="contact-heading" className="contact-heading" data-panel-reveal>
              Have something
              <br />
              in <em>mind</em>?
            </h2>
          </Spotlight>
          <div className="contact-bottom">
            <a className="contact-email" href={`mailto:${userData.email}`}>
              {userData.email}
              <ArrowUpRight aria-hidden="true" />
            </a>
            <div className="action-row">
              <Link className="text-link" href="/resume">
                View résumé <ArrowRight aria-hidden="true" />
              </Link>
              <Link className="text-link" href="/projects">
                All projects <ArrowRight aria-hidden="true" />
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
