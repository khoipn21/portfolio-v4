'use client';

import { useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  Asterisk,
  GitBranch,
  Keyboard,
  PaperPlaneTilt,
  Path,
  Stack,
  Trophy,
} from '@/components/icons';
import './station-rail.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STOPS = [
  { id: 'intro', label: 'Intro', Icon: Asterisk },
  { id: 'about', label: 'Approach', Icon: Keyboard },
  { id: 'how-i-build', label: 'Process', Icon: Path },
  { id: 'selected-work', label: 'Work', Icon: Stack },
  { id: 'awards', label: 'Award', Icon: Trophy },
  { id: 'experience', label: 'Experience', Icon: GitBranch },
  { id: 'contact', label: 'Contact', Icon: PaperPlaneTilt },
];

/** The same read line the iso world lights its stations from, as a share of the viewport. */
const HEAD = 0.55;
/** How far a glyph leans toward the pointer, in px. */
const PULL = 4;

function lean(event: PointerEvent<HTMLAnchorElement>) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2 * PULL;
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2 * PULL;
  el.style.setProperty('--mx', `${x.toFixed(1)}px`);
  el.style.setProperty('--my', `${y.toFixed(1)}px`);
}

function release(event: PointerEvent<HTMLAnchorElement>) {
  event.currentTarget.style.removeProperty('--mx');
  event.currentTarget.style.removeProperty('--my');
}

export function StationRail() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      // Read live rects rather than fixed trigger positions: the showcase pin
      // inflates the page after mount, and a section stays live for as long as
      // its spacer keeps its top above the head line.
      const sections = STOPS.map((stop) => document.getElementById(stop.id));
      const read = () => {
        const head = window.innerHeight * HEAD;
        let index = 0;
        sections.forEach((el, i) => {
          if (el && el.getBoundingClientRect().top <= head) index = i;
        });
        setActive(index);
      };
      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: read, onRefresh: read });
      read();
    },
    { scope: ref }
  );

  return (
    <nav
      ref={ref}
      className="station-rail print-hidden"
      aria-label="Sections"
      style={{ '--active': active } as CSSProperties}
    >
      <span className="station-rail-marker" aria-hidden="true">
        <svg viewBox="0 0 8 8">
          <path d="M4 0 8 4 4 8 0 4z" />
        </svg>
      </span>
      <ul>
        {STOPS.map(({ id, label, Icon }, index) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={index === active ? 'true' : undefined}
              onPointerMove={lean}
              onPointerLeave={release}
            >
              <span className="station-rail-glyph" aria-hidden="true">
                <Icon size={20} />
                <Icon size={20} weight="fill" />
              </span>
              <span className="station-rail-callout">{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
