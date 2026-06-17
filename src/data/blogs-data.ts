export interface BlogPost {
  title: string;
  date: string;
  claps: number;
  tags: string[];
  link: string;
  isExternal: boolean;
}

export const blogsData: BlogPost[] = [
  {
    title: "Building a Real-Time Chat App with Go and WebSocket",
    date: "Sep 2024",
    claps: 42,
    tags: ["Go", "WebSocket", "React"],
    link: "#",
    isExternal: true,
  },
  {
    title: "From Monolith to Microservices: My Study Platform Journey",
    date: "Oct 2025",
    claps: 38,
    tags: ["Microservices", "gRPC", "Go"],
    link: "#",
    isExternal: true,
  },
  {
    title: "Porting macOS Apps to Linux with Rust and GTK4",
    date: "Jun 2026",
    claps: 56,
    tags: ["Rust", "GTK4", "Linux"],
    link: "#",
    isExternal: true,
  },
];

export interface OpenSourcePR {
  title: string;
  repository: string;
  url: string;
  state: "merged" | "open" | "closed";
  date: string;
}

export const openSourcePRs: OpenSourcePR[] = [
  {
    title: "Fix: Handle edge case in auth token refresh",
    repository: "khoipn21/study-platform",
    url: "https://github.com/khoipn21/study-platform",
    state: "merged",
    date: "Aug 2025",
  },
  {
    title: "feat: Add Linux system tray integration",
    repository: "khoipn21/CodexBar-Linux",
    url: "https://github.com/khoipn21/CodexBar-Linux",
    state: "merged",
    date: "May 2026",
  },
  {
    title: "docs: Update README with Linux install instructions",
    repository: "khoipn21/CodexBar-Linux",
    url: "https://github.com/khoipn21/CodexBar-Linux",
    state: "merged",
    date: "Jun 2026",
  },
  {
    title: "fix: Resolve WebSocket reconnection issue",
    repository: "khoipn21/murmur-chatapp",
    url: "https://github.com/khoipn21/murmur-chatapp",
    state: "merged",
    date: "Sep 2024",
  },
  {
    title: "feat: Add Redis caching layer",
    repository: "khoipn21/study-platform",
    url: "https://github.com/khoipn21/study-platform",
    state: "merged",
    date: "Aug 2025",
  },
  {
    title: "chore: Containerize services with Docker",
    repository: "khoipn21/murmur-chatapp",
    url: "https://github.com/khoipn21/murmur-chatapp",
    state: "merged",
    date: "Sep 2024",
  },
];
