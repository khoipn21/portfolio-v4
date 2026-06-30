'use client';

import { ArrowRight, ArrowUpRight, Calendar } from 'lucide-react';
import { blogsData } from '@/data/blogs-data';
import { useStaggerChildren } from '@/hooks/use-gsap';

/**
 * Blog list with Double-Bezel architecture.
 * Each card has outer shell + inner core for premium feel.
 */
export function BlogList() {
  const listRef = useStaggerChildren({ y: 20, stagger: 0.1 });

  return (
    <div ref={listRef as React.RefObject<HTMLDivElement>} className="flex flex-col gap-3 pt-4">
      {blogsData.map((blog, idx) => (
        <a
          href={blog.link}
          target={blog.isExternal ? '_blank' : undefined}
          rel={blog.isExternal ? 'noopener noreferrer' : undefined}
          key={idx}
          className="group relative block"
        >
          {/* Double-Bezel: Outer Shell */}
          <div
            className="rounded-[1rem] p-[1.5px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{ background: 'var(--border-accent)' }}
          >
            {/* Double-Bezel: Inner Core */}
            <div
              className="rounded-[calc(1rem-1.5px)] p-5 transition-all duration-500 group-hover:-translate-y-0.5"
              style={{
                background: 'var(--bg-card)',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.03)',
              }}
            >
              <div className="flex w-full items-start justify-between sm:items-center">
                <div className="flex flex-col gap-2.5">
                  <h3
                    className="pr-6 text-[14px] font-bold transition-colors duration-300 group-hover:text-[var(--accent-primary)] md:text-[15px]"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {blog.title}
                  </h3>

                  <div
                    className="flex flex-wrap items-center gap-4 text-[12px]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{blog.date}</span>
                    </div>

                    <div
                      className="flex items-center gap-1.5"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3.5 w-3.5"
                      >
                        <path d="M10 20v-5.5" />
                        <path d="M14 20v-5.5" />
                        <path d="M10.5 7A2.5 2.5 0 0 1 13 4.5V2" />
                        <path d="M13.5 7A2.5 2.5 0 0 0 11 4.5V2" />
                      </svg>
                      <span className="font-medium">{blog.claps}</span>
                    </div>

                    <div
                      className="hidden h-3 w-[1px] sm:block"
                      style={{ background: 'var(--border-secondary)' }}
                    />

                    <div className="flex flex-wrap items-center gap-2">
                      {blog.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="rounded-full border px-2 py-0.5 text-[10px] font-medium"
                          style={{
                            borderColor: 'var(--border-accent)',
                            color: 'var(--text-tertiary)',
                            background: 'var(--bg-secondary)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  className="ml-4 flex-shrink-0 transition-all duration-300 group-hover:translate-x-0.5"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {blog.isExternal ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
