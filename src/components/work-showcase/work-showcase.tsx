'use client';

import { useRef, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, ArrowUpRight } from '@/components/icons';
import type { Project, StackLayer } from '@/data/user-data';
import './work-showcase.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const LAYERS = [
  { key: 'ui', label: 'UI' },
  { key: 'api', label: 'API' },
  { key: 'data', label: 'Data' },
] as const;

/** Layer gap along the stack's normal, in px. Mirrored by --stack-gap in the CSS. */
const GAP = 150;
const TILT = 56;
const TURN = -40;
const SCALE = 0.92;
/** Scroll distance per project, in viewport heights. */
const PER_PROJECT = 1.5;
/** The point inside a project's segment where its stack is fully exploded. */
const SETTLED = 0.62;

function labelOffset(index: number) {
  // Translating along the tilted normal moves a layer straight up or down on screen.
  return (1 - index) * -GAP * Math.sin((TILT * Math.PI) / 180) * SCALE;
}

export function WorkShowcase({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add('(min-width: 1000px) and (prefers-reduced-motion: no-preference)', () => {
        const el = root.current;
        if (!el) return;
        const stage = el.querySelector<HTMLElement>('.showcase-stage');
        const fill = el.querySelector<HTMLElement>('.showcase-rail-fill');
        const railItems = gsap.utils.toArray<HTMLElement>('.showcase-rail li', el);
        const items = gsap.utils.toArray<HTMLElement>('.showcase-item', el);
        if (!stage || !items.length) return;
        el.classList.add('is-live');

        const count = items.length;
        const tl = gsap.timeline({ defaults: { ease: 'none' } });

        items.forEach((item, i) => {
          const q = gsap.utils.selector(item);
          const scene = q('.showcase-scene')[0];
          const tilt = q('.stack-tilt')[0];
          const turn = q('.stack')[0];
          const ui = q('.stack-layer-ui')[0];
          const api = q('.stack-layer-api')[0];
          const data = q('.stack-layer-data')[0];
          const wire = q('.stack-wire')[0];
          const pulse = q('.stack-pulse')[0];
          const labels = q('.showcase-layer');
          const copy = q('.showcase-copy > *');

          gsap.set(item, { opacity: i === 0 ? 1 : 0 });
          gsap.set(tilt, { rotationX: 0, scale: 1 });
          gsap.set(turn, { rotationZ: 0 });
          gsap.set(ui, { z: 0 });
          gsap.set(api, { z: -1 });
          gsap.set(data, { z: -2 });
          gsap.set(wire, { rotationX: 90, scaleY: 0 });
          gsap.set(pulse, { z: GAP, opacity: 0 });
          gsap.set(labels, { opacity: 0, y: 0, yPercent: -50, '--hit': 0 });

          const t = i;
          if (i > 0) {
            tl.to(item, { opacity: 1, duration: 0.08 }, t);
            tl.fromTo(
              scene,
              { yPercent: 45 },
              { yPercent: 0, duration: 0.22, ease: 'power2.out' },
              t
            );
            tl.fromTo(
              copy,
              { y: 32, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.16, stagger: 0.025, ease: 'power2.out' },
              t + 0.02
            );
          }

          const explode = t + 0.16;
          tl.to(
            tilt,
            { rotationX: TILT, scale: SCALE, duration: 0.3, ease: 'power2.inOut' },
            explode
          );
          tl.to(turn, { rotationZ: TURN, duration: 0.3, ease: 'power2.inOut' }, explode);
          tl.to(ui, { z: GAP, duration: 0.3, ease: 'power2.inOut' }, explode + 0.02);
          tl.to(api, { z: 0, duration: 0.3, ease: 'power2.inOut' }, explode + 0.02);
          tl.to(data, { z: -GAP, duration: 0.3, ease: 'power2.inOut' }, explode + 0.02);
          tl.to(wire, { scaleY: 1, duration: 0.14 }, explode + 0.26);
          labels.forEach((label, k) => {
            tl.to(
              label,
              { opacity: 1, y: labelOffset(k), duration: 0.18, ease: 'power2.out' },
              explode + 0.2 + k * 0.04
            );
          });

          // One request falls from the interface through the API to the data.
          const fall = explode + 0.36;
          tl.set(pulse, { opacity: 1 }, fall);
          tl.to(pulse, { z: -GAP, duration: 0.24 }, fall);
          labels.forEach((label, k) => {
            tl.to(label, { '--hit': 1, duration: 0.03 }, fall + k * 0.12);
          });
          tl.to(pulse, { opacity: 0, duration: 0.03 }, fall + 0.24);

          if (i < count - 1) {
            tl.to(scene, { yPercent: -40, duration: 0.2, ease: 'power2.in' }, t + 0.84);
            tl.to(item, { opacity: 0, duration: 0.1 }, t + 0.92);
          }
        });
        tl.to({}, { duration: 0.1 });
        if (fill) tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: tl.duration() }, 0);

        const duration = tl.duration();
        let current = -1;
        const setActive = (progress: number) => {
          const index = Math.min(count - 1, Math.floor(progress * duration + 0.04));
          if (index === current) return;
          current = index;
          items.forEach((item, i) => item.classList.toggle('is-active', i === index));
          railItems.forEach((item, i) => item.classList.toggle('is-active', i === index));
        };

        const trigger = ScrollTrigger.create({
          trigger: stage,
          start: 'top top',
          end: () => `+=${count * PER_PROJECT * window.innerHeight}`,
          pin: true,
          scrub: 0.8,
          animation: tl,
          invalidateOnRefresh: true,
          onUpdate: (self) => setActive(self.progress),
        });
        setActive(0);

        const scrollToProject = (index: number, behavior: ScrollBehavior) => {
          const top =
            trigger.start + (trigger.end - trigger.start) * ((index + SETTLED) / duration);
          window.scrollTo({ top, behavior });
        };
        const onFocus = (event: FocusEvent) => {
          const item = (event.target as Element).closest<HTMLElement>('.showcase-item');
          if (item) scrollToProject(items.indexOf(item), 'instant');
        };
        const onRail = (event: MouseEvent) => {
          const button = (event.target as Element).closest<HTMLElement>('[data-goto]');
          if (button) scrollToProject(Number(button.dataset.goto), 'smooth');
        };
        el.addEventListener('focusin', onFocus);
        el.addEventListener('click', onRail);

        return () => {
          el.removeEventListener('focusin', onFocus);
          el.removeEventListener('click', onRail);
          el.classList.remove('is-live');
          items.forEach((item) => item.classList.remove('is-active'));
        };
      });
      return () => media.revert();
    },
    { scope: root }
  );

  return (
    <div ref={root} className="showcase">
      <div className="showcase-stage">
        {projects.map((project, index) => (
          <article className="showcase-item" key={project.slug}>
            <div className="showcase-copy">
              <p className="showcase-count" aria-hidden="true">
                <span>{String(index + 1).padStart(2, '0')}</span> /{' '}
                {String(projects.length).padStart(2, '0')}
              </p>
              <h3>
                <Link
                  className="showcase-name"
                  href={`/projects/${project.slug}`}
                  aria-label={`Read ${project.title} case study`}
                >
                  {project.title}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </h3>
              <p className="showcase-category">{project.category}</p>
              <p className="showcase-description">{project.description}</p>
              <div className="showcase-links">
                {project.github ? (
                  <a
                    className="text-link"
                    href={project.github}
                    aria-label={`${project.title} source code`}
                  >
                    Source <ArrowUpRight aria-hidden="true" />
                  </a>
                ) : (
                  project.demo && (
                    <Link
                      className="text-link"
                      href={project.demo.href}
                      aria-label={`${project.title}: ${project.demo.label.toLowerCase()}`}
                    >
                      {project.demo.label} <ArrowRight aria-hidden="true" />
                    </Link>
                  )
                )}
                <span className="showcase-note">{project.demoNote}</span>
              </div>
            </div>

            <div className="showcase-scene" aria-hidden="true">
              <div className="stack-tilt">
                <div className="stack">
                  <div className="stack-layer stack-layer-data">
                    <span className="stack-mark">Data</span>
                    <span className="stack-rows">
                      {Array.from({ length: 6 }, (_, k) => (
                        <i key={k} />
                      ))}
                    </span>
                  </div>
                  <div className="stack-layer stack-layer-api">
                    <span className="stack-mark">API</span>
                    <span className="stack-routes">
                      {Array.from({ length: 9 }, (_, k) => (
                        <i key={k} />
                      ))}
                    </span>
                  </div>
                  <div className="stack-layer stack-layer-ui">
                    {project.image && (
                      <Image
                        src={project.image}
                        alt=""
                        width={800}
                        height={500}
                        sizes="(max-width: 1000px) 80vw, 36vw"
                      />
                    )}
                  </div>
                  <span className="stack-wire" />
                  <span className="stack-pulse" />
                </div>
              </div>
            </div>

            {project.stack && (
              <dl className="showcase-layers" aria-label={`${project.title} by layer`}>
                {LAYERS.map(({ key, label }, k) => {
                  const layer: StackLayer = project.stack![key];
                  return (
                    <div
                      className="showcase-layer"
                      key={key}
                      style={{ '--ly': `${labelOffset(k)}px` } as CSSProperties}
                    >
                      <dt>{label}</dt>
                      <dd>
                        <span className="showcase-layer-tech">{layer.tech}</span>
                        <span className="showcase-layer-note">{layer.note}</span>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            )}
          </article>
        ))}

        <div className="showcase-rail" aria-hidden="true">
          <ol>
            {projects.map((project, index) => (
              <li key={project.slug}>
                <button type="button" tabIndex={-1} data-goto={index}>
                  <span>{String(index + 1).padStart(2, '0')}</span> {project.title}
                </button>
              </li>
            ))}
          </ol>
          <span className="showcase-rail-track">
            <span className="showcase-rail-fill" />
          </span>
        </div>
      </div>
    </div>
  );
}
