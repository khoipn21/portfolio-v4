import type { ComponentType } from 'react';
import { BioweaveFigure } from './bioweave/bioweave-figure';
import { BookstoreFigure } from './bookstore/bookstore-figure';
import { MurmurChatappFigure } from './murmur-chatapp/murmur-chatapp-figure';
import { StudyPlatformFigure } from './study-platform/study-platform-figure';

const FIGURES: Record<string, ComponentType> = {
  bioweave: BioweaveFigure,
  bookstore: BookstoreFigure,
  'murmur-chatapp': MurmurChatappFigure,
  'study-platform': StudyPlatformFigure,
};

export function hasProjectFigure(slug: string) {
  return slug in FIGURES;
}

export function ProjectFigure({ slug }: { slug: string }) {
  const Figure = FIGURES[slug];
  return Figure ? <Figure /> : null;
}
