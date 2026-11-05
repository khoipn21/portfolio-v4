'use client';

import { useId, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { Experience, ExperienceProject } from '@/data/user-data';
import './career-graph.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Row =
  | { kind: 'job'; key: string; lane: 0; when: string; experience: Experience }
  | { kind: 'fork'; key: string; lane: number; when: string; project: ExperienceProject }
  | { kind: 'merge'; key: string; lane: 0; when: string; project: ExperienceProject }
  | { kind: 'head'; key: string; lane: 0; when: string; open: ExperienceProject[] };

type Draft = { [K in Row['kind']]: Omit<Extract<Row, { kind: K }>, 'lane'> }[Row['kind']];

/** Same month: close a branch before opening one, so a freed lane can be reused. */
const ORDER = { merge: 0, job: 1, fork: 2 } as const;

function periodStart(period: string) {
  return period.split('—')[0].trim();
}
function periodEnd(period: string) {
  return (period.split('—')[1] ?? period).trim();
}

function buildRows(experiences: Experience[]): Row[] {
  const events: { date: string; order: number; row: Draft }[] = [];
  for (const experience of experiences) {
    events.push({
      date: experience.start,
      order: ORDER.job,
      row: {
        kind: 'job',
        key: experience.company,
        when: periodStart(experience.period),
        experience,
      },
    });
    for (const project of experience.projects ?? []) {
      events.push({
        date: project.start,
        order: ORDER.fork,
        row: {
          kind: 'fork',
          key: `fork-${project.branch}`,
          when: periodStart(project.period),
          project,
        },
      });
      if (project.end) {
        events.push({
          date: project.end,
          order: ORDER.merge,
          row: {
            kind: 'merge',
            key: `merge-${project.branch}`,
            when: periodEnd(project.period),
            project,
          },
        });
      }
    }
  }
  events.sort((a, b) => a.date.localeCompare(b.date) || a.order - b.order);

  const lanes = new Map<string, number>();
  const rows: Row[] = events.map(({ row }) => {
    if (row.kind === 'fork' || row.kind === 'merge') {
      const branch = row.project.branch;
      let lane = lanes.get(branch);
      if (lane === undefined) {
        const taken = new Set(lanes.values());
        lane = 1;
        while (taken.has(lane)) lane++;
        lanes.set(branch, lane);
      }
      if (row.kind === 'merge') {
        // A merge commit lives on main; its branch keeps the fork's lane.
        lanes.delete(branch);
        return { ...row, lane: 0 } as Row;
      }
      return { ...row, lane } as Row;
    }
    return { ...row, lane: 0 } as Row;
  });

  const open = experiences.flatMap((e) => e.projects ?? []).filter((p) => !p.end);
  rows.push({ kind: 'head', key: 'head', lane: 0, when: 'Present', open });
  // Lanes are allocated oldest first; the log reads newest first, like `git log`.
  return rows.reverse();
}

function laneOf(rows: Row[], branch: string) {
  const fork = rows.find((row) => row.kind === 'fork' && row.project.branch === branch);
  return fork?.lane ?? 1;
}

/** Short, stable, decorative commit id. */
function shortHash(text: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
}

interface Geometry {
  ys: number[];
  lane: number;
  width: number;
  height: number;
}

const X0 = 12;
/** How far above a commit its branch curve starts or ends. */
const BEND = 40;

export function CareerGraph({
  experiences,
  detail = 'full',
  headingLevel = 'h3',
}: {
  experiences: Experience[];
  detail?: 'summary' | 'full';
  headingLevel?: 'h2' | 'h3';
}) {
  const rows = buildRows(experiences);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const clipRect = useRef<SVGRectElement>(null);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const clipId = useId().replaceAll(':', '');
  const Heading = headingLevel;
  const SubHeading = headingLevel === 'h2' ? 'h3' : 'h4';

  useLayoutEffect(() => {
    const el = list.current;
    if (!el) return;
    const measure = () => {
      const box = el.getBoundingClientRect();
      const ys = Array.from(el.querySelectorAll<HTMLElement>('[data-node]'), (node) => {
        const r = node.getBoundingClientRect();
        return Math.round(r.top + r.height / 2 - box.top);
      });
      const lane = parseFloat(getComputedStyle(el).getPropertyValue('--lane')) || 28;
      setGeo((prev) => {
        const next = { ys, lane, width: Math.round(box.width), height: Math.round(box.height) };
        return prev && JSON.stringify(prev) === JSON.stringify(next) ? prev : next;
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      if (!geo) return;
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const el = root.current;
        const rect = clipRect.current;
        if (!el || !rect) return;
        const items = gsap.utils.toArray<HTMLElement>('.graph-row', el);
        const nodes = gsap.utils.toArray<SVGElement>('.graph-node', el);
        const scan = el.querySelector<HTMLElement>('.graph-scan');
        const readout = el.querySelector<HTMLElement>('.graph-scan-when');
        el.classList.add('is-live');

        let lastLit = -2;
        const state = { head: 0 };
        const apply = () => {
          const head = state.head;
          rect.setAttribute('height', String(Math.max(0, head)));
          if (scan) scan.style.transform = `translateY(${head}px)`;
          let lit = -1;
          geo.ys.forEach((y, i) => {
            const on = y <= head + 1;
            if (on) lit = i;
            items[i]?.classList.toggle('is-on', on);
            nodes[i]?.classList.toggle('is-on', on);
          });
          if (lit !== lastLit && readout) {
            lastLit = lit;
            const row = rows[Math.max(0, lit)];
            readout.textContent = lit < 0 ? 'git log' : `${shortHash(row.key)} · ${row.when}`;
          }
        };
        apply();

        gsap.to(state, {
          head: geo.height,
          ease: 'none',
          onUpdate: apply,
          scrollTrigger: {
            trigger: list.current,
            start: 'top 72%',
            end: 'bottom 72%',
            scrub: 0.6,
          },
        });

        return () => {
          el.classList.remove('is-live');
          rect.setAttribute('height', String(geo.height));
          items.forEach((item) => item.classList.remove('is-on'));
          nodes.forEach((node) => node.classList.remove('is-on'));
        };
      });
      return () => media.revert();
    },
    { scope: root, dependencies: [geo] }
  );

  const x = (lane: number) => X0 + lane * (geo?.lane ?? 28);
  // Colour follows the branch, not the lane: lanes get reused once a branch merges.
  const hue = new Map(
    rows
      .flatMap((row) => (row.kind === 'fork' ? [row.project.branch] : []))
      .map((b, i) => [b, i % 4])
  );
  const tint = (branch: string) => (hue.get(branch) ?? 0) + 1;

  const branchPaths = geo
    ? rows
        .filter((row): row is Extract<Row, { kind: 'fork' }> => row.kind === 'fork')
        .map((fork) => {
          const i = rows.indexOf(fork);
          const yf = geo.ys[i];
          const xl = x(fork.lane);
          const mergeIndex = rows.findIndex(
            (row) => row.kind === 'merge' && row.project.branch === fork.project.branch
          );
          // Newest first: a branch enters from its merge commit above (or from the
          // top while still open), runs down to its first commit, then joins its
          // parent on main just below.
          let d: string;
          if (mergeIndex >= 0) {
            const ym = geo.ys[mergeIndex];
            d = `M${X0} ${ym} C${X0} ${ym + BEND / 2} ${xl} ${ym + BEND / 2} ${xl} ${ym + BEND}`;
          } else {
            d = `M${xl} ${geo.ys[0]}`;
          }
          d += ` V${yf} C${xl} ${yf + BEND / 2} ${X0} ${yf + BEND / 2} ${X0} ${yf + BEND}`;
          return { key: fork.project.branch, d, open: mergeIndex < 0 };
        })
    : [];

  const lines = geo && (
    <>
      <path className="graph-main" d={`M${X0} ${geo.ys[0]} V${geo.ys[geo.ys.length - 1]}`} />
      {branchPaths.map((path) => (
        <path key={path.key} className="graph-branch" d={path.d} data-branch={tint(path.key)} />
      ))}
    </>
  );

  return (
    <div ref={root} className="career-graph">
      <p className="graph-command" aria-hidden="true">
        <span>$</span> git log --graph
      </p>
      <div className="graph-body">
        {geo && (
          <svg
            className="graph-svg"
            width={geo.width}
            height={geo.height}
            viewBox={`0 0 ${geo.width} ${geo.height}`}
            aria-hidden="true"
          >
            <defs>
              <clipPath id={clipId}>
                <rect ref={clipRect} x="0" y="0" width={geo.width} height={geo.height} />
              </clipPath>
            </defs>
            <g className="graph-ghost">{lines}</g>
            <g className="graph-lit" clipPath={`url(#${clipId})`}>
              {lines}
            </g>
            {branchPaths
              .filter((path) => path.open)
              .map((path) => {
                const lane = laneOf(rows, path.key);
                return (
                  <path
                    key={path.key}
                    className="graph-tip"
                    d={`M${x(lane)} ${geo.ys[0]} v-24`}
                    data-branch={tint(path.key)}
                  />
                );
              })}
            {rows.map((row, i) => (
              <circle
                key={row.key}
                className={`graph-node graph-node-${row.kind}`}
                cx={x(row.lane)}
                cy={geo.ys[i]}
                r={row.kind === 'job' ? 7 : row.kind === 'head' ? 8 : 5}
                data-branch={row.kind === 'fork' ? tint(row.project.branch) : undefined}
              />
            ))}
          </svg>
        )}

        <ol ref={list} className="graph-rows">
          {rows.map((row) => (
            <li key={row.key} className={`graph-row graph-row-${row.kind}`}>
              <p className="graph-meta" aria-hidden="true">
                <span className="graph-hash" data-node>
                  {shortHash(row.key)}
                </span>
                <span className="graph-when">{row.when}</span>
              </p>
              <div className="graph-message">
                {row.kind === 'job' && (
                  <>
                    <p className="graph-refs">
                      <span className="graph-ref">main</span>
                      <span className="graph-period">
                        {row.experience.period.replaceAll('—', '–')}
                      </span>
                    </p>
                    <Heading className="graph-title">{row.experience.company}</Heading>
                    <p className="graph-role">
                      {row.experience.role} · {row.experience.location}
                    </p>
                    <ul className="graph-points">
                      {(detail === 'full'
                        ? row.experience.description
                        : row.experience.description.slice(0, 1)
                      ).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <p className="graph-stack">{row.experience.tech.join(' · ')}</p>
                  </>
                )}
                {row.kind === 'fork' && (
                  <>
                    <p className="graph-refs">
                      <span
                        className="graph-ref graph-ref-branch"
                        data-branch={tint(row.project.branch)}
                      >
                        {row.project.branch}
                      </span>
                      <span className="graph-period">
                        {row.project.period.replaceAll('—', '–')}
                      </span>
                    </p>
                    <SubHeading className="graph-subtitle">{row.project.name}</SubHeading>
                    <p className="graph-role">{row.project.summary}</p>
                    <ul className="graph-points">
                      {(detail === 'full'
                        ? row.project.highlights
                        : row.project.highlights.slice(0, 1)
                      ).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    {row.project.stack && <p className="graph-stack">{row.project.stack}</p>}
                  </>
                )}
                {row.kind === 'merge' && (
                  <p className="graph-merge">
                    Merge branch{' '}
                    <span
                      className="graph-ref graph-ref-branch"
                      data-branch={tint(row.project.branch)}
                    >
                      {row.project.branch}
                    </span>{' '}
                    into main
                    <span className="graph-period">
                      {row.project.name} · {row.project.period.replaceAll('—', '–')}
                    </span>
                  </p>
                )}
                {row.kind === 'head' && (
                  <p className="graph-merge">
                    <span className="graph-ref graph-ref-head">HEAD → main</span>
                    {row.open.length > 0 && (
                      <span className="graph-period">
                        Still shipping on{' '}
                        {row.open.map((project, k) => (
                          <span key={project.branch}>
                            {k > 0 && ' and '}
                            <span
                              className="graph-ref graph-ref-branch"
                              data-branch={tint(project.branch)}
                            >
                              {project.branch}
                            </span>
                          </span>
                        ))}
                      </span>
                    )}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>

        <div className="graph-scan" aria-hidden="true">
          <span className="graph-scan-when">git log</span>
        </div>
      </div>
    </div>
  );
}
