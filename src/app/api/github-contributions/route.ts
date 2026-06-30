import { NextResponse } from 'next/server';

/**
 * GitHub contributions Route Handler.
 * Scrapes the public contributions page HTML (no API token needed) and returns
 * structured JSON: per-day {date, level, count, weekday, weekIndex}, plus
 * totals, streaks, and month labels for the heatmap grid.
 *
 * ISR: revalidated every hour via `export const revalidate` + fetch `next.revalidate`.
 */

export const revalidate = 3600;

const GITHUB_USERNAME = 'khoipn21';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface Day {
  date: string;
  level: number;
  count: number;
  weekday: number;
  weekIndex: number;
}

interface HeatmapData {
  total: number;
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
  weeks: number;
  days: Day[];
  monthLabels: { weekIndex: number; label: string }[];
}

/** Extract the integer count from tooltip text like "2 contributions on ..." or "No contributions". */
function parseCount(text: string): number {
  const m = text.match(/(\d+)\s+contributions?/i);
  return m ? parseInt(m[1], 10) : 0;
}

/** Compute current streak (ending at last day) and longest streak across all days. */
function computeStreaks(days: Day[]): {
  current: number;
  longest: number;
} {
  let longest = 0;
  let run = 0;
  for (const d of days) {
    if (d.count > 0) {
      run++;
      if (run > longest) longest = run;
    } else {
      run = 0;
    }
  }
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) current++;
    else break;
  }
  return { current, longest };
}

export async function GET() {
  try {
    const res = await fetch(`https://github.com/users/${GITHUB_USERNAME}/contributions`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBot/1.0)' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `GitHub returned ${res.status}` }, { status: 502 });
    }

    const html = await res.text();

    // <td class="ContributionCalendar-day" ... id="..." data-date="..." data-level="...">
    const tdRegex = /<td[^>]*class="ContributionCalendar-day"[^>]*>/g;
    const idRegex = /id="(contribution-day-component-[^"]*)"/;
    const dateRegex = /data-date="([^"]*)"/;
    const levelRegex = /data-level="([^"]*)"/;

    // <tool-tip for="contribution-day-component-X-Y">N contributions on ...</tool-tip>
    const tooltipRegex =
      /<tool-tip[^>]*for="(contribution-day-component-[^"]*)"[^>]*>([^<]*)<\/tool-tip>/g;

    // Build id → count map from tooltips
    const counts = new Map<string, number>();
    let tm: RegExpExecArray | null;
    while ((tm = tooltipRegex.exec(html)) !== null) {
      counts.set(tm[1], parseCount(tm[2]));
    }

    // Build days array from <td> elements
    const days: Day[] = [];
    let tdm: RegExpExecArray | null;
    while ((tdm = tdRegex.exec(html)) !== null) {
      const tag = tdm[0];
      const idM = tag.match(idRegex);
      const dateM = tag.match(dateRegex);
      const levelM = tag.match(levelRegex);
      if (!dateM || !levelM) continue;

      const id = idM?.[1] ?? '';
      const date = dateM[1];
      const level = parseInt(levelM[1], 10);
      const count = counts.get(id) ?? 0;
      const weekday = new Date(date + 'T00:00:00').getDay();

      days.push({ date, level, count, weekday, weekIndex: 0 });
    }

    if (days.length === 0) {
      return NextResponse.json({ error: 'No contribution data found' }, { status: 502 });
    }

    // Sort oldest → newest and assign week indices (column-major grid alignment)
    days.sort((a, b) => a.date.localeCompare(b.date));
    const firstWeekday = days[0].weekday;
    days.forEach((d, i) => {
      d.weekIndex = Math.floor((i + firstWeekday) / 7);
    });

    const weeks = days[days.length - 1].weekIndex + 1;
    const total = days.reduce((s, d) => s + d.count, 0);
    const activeDays = days.filter((d) => d.count > 0).length;
    const { current: currentStreak, longest: longestStreak } = computeStreaks(days);

    // Month labels: record the first week index where each new month appears
    const monthLabels: { weekIndex: number; label: string }[] = [];
    let lastMonth = -1;
    for (const d of days) {
      const m = new Date(d.date + 'T00:00:00').getMonth();
      if (m !== lastMonth) {
        monthLabels.push({ weekIndex: d.weekIndex, label: MONTHS[m] });
        lastMonth = m;
      }
    }

    const data: HeatmapData = {
      total,
      activeDays,
      currentStreak,
      longestStreak,
      weeks,
      days,
      monthLabels,
    };

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch GitHub contributions' }, { status: 502 });
  }
}
