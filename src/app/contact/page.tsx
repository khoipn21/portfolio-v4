"use client";

import { userData } from "@/data/user-data";
import { ArrowLeft, Mail, Phone, MapPin, Globe } from "lucide-react";
import { SiGithub } from "react-icons/si";
import Link from "next/link";

/**
 * Contact page with Double-Bezel architecture.
 * Each contact card has outer shell + inner core.
 */
export default function ContactPage() {
  const contactItems = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: userData.email,
      href: `mailto:${userData.email}`,
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Phone",
      value: userData.phone,
      href: `tel:${userData.phone.replace(/[^\d+]/g, "")}`,
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Location",
      value: userData.location,
      href: undefined,
    },
    {
      icon: <SiGithub className="w-5 h-5" />,
      label: "GitHub",
      value: userData.githubUsername,
      href: userData.github,
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: "Portfolio",
      value: "portfolio.khoipn.com",
      href: userData.portfolio,
    },
  ];

  return (
    <div
      className="min-h-[100dvh] w-full relative overflow-x-hidden transition-colors duration-300 bg-[var(--bg-primary)] text-[var(--text-primary)]"
    >
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 mb-8 text-[13px] font-medium transition-colors duration-200"
          style={{ color: "var(--text-tertiary)" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </Link>

        <h1
          className="text-[28px] font-bold tracking-tight mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Get in Touch
        </h1>
        <p
          className="text-[14px] mb-8"
          style={{ color: "var(--text-tertiary)" }}
        >
          Feel free to reach out for collaborations, opportunities, or just to
          say hello.
        </p>

        <div className="space-y-3">
          {contactItems.map((item, idx) => {
            const Wrapper = item.href ? "a" : "div";
            return (
              <Wrapper
                key={idx}
                {...(item.href
                  ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group block"
              >
                {/* Double-Bezel: Outer Shell */}
                <div
                  className="rounded-[1.25rem] p-[1.5px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  style={{ background: "var(--border-accent)" }}
                >
                  {/* Double-Bezel: Inner Core */}
                  <div
                    className="rounded-[calc(1.25rem-1.5px)] flex items-center gap-4 p-5 transition-all duration-500 group-hover:-translate-y-0.5"
                    style={{
                      background: "var(--bg-card)",
                      boxShadow: "inset 0 1px 1px rgba(255,255,255,0.03)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: "var(--accent-glow)",
                        color: "var(--accent-primary)",
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p
                        className="text-[14px] font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.label}
                      </p>
                      <p
                        className="text-[13px]"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </div>
  );
}
