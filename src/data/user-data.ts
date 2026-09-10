export const userData = {
  name: 'Pham Ngoc Khoi',
  headline: 'Software Engineer & Full-Stack Developer',
  location: 'Ho Chi Minh, Vietnam',
  email: 'khoingoc456@gmail.com',
  phone: '(+84) 832-211-203',
  github: 'https://github.com/khoipn21',
  githubUsername: 'khoipn21',
  linkedin: 'https://linkedin.com/in/khoipn21',
};

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string[];
  tech: string[];
  current?: boolean;
}

export const experiences: Experience[] = [
  {
    company: 'WALA-ICT',
    role: 'Frontend Developer',
    period: 'May 2025 — Present',
    location: 'Ho Chi Minh, VN',
    current: true,
    description: [
      'Worked on outsourced e-commerce and proptech products, building internal dashboards and customer-facing web/mobile applications.',
      'Developed core workflows for product management, order handling, supplier settlement, tenant help requests, announcements, and notification systems.',
      'Built role-based experiences for admin, vendor, customer, landlord, and tenant users with login, account recovery, protected routes, and multilingual interfaces.',
      'Integrated marketplace features such as Coupang/Naver/G-Market linkage, checkout flows, real-time inquiry chat, and mobile push notifications.',
    ],
    tech: ['React', 'Next.js', 'React Native', 'TypeScript', 'TailwindCSS'],
  },
  {
    company: 'Freelance',
    role: 'Fullstack Developer',
    period: '2023 — Present',
    location: 'Remote',
    current: true,
    description: [
      'Delivered end-to-end web applications across recruitment, beauty-services, and fintech verticals for international clients.',
      'Built a recruitment platform with Next.js and NestJS featuring job posting pipelines, candidate matching, and role-based access.',
      'Developed a nail-salon booking system with appointment scheduling, service catalogs, staff calendars, and customer loyalty tracking.',
      'Created an AI-powered tax-compliance chatbot for the Polish market with LLM APIs and a Go backend.',
    ],
    tech: ['Next.js', 'NestJS', 'Go', 'TypeScript', 'Docker'],
  },
  {
    company: 'LECOLE',
    role: 'Fullstack Developer',
    period: 'Jan 2025 — May 2025',
    location: 'Ho Chi Minh, VN',
    description: [
      'Developed new features for an educational technology product including study workspace flows, question-sharing pages, and practice sessions.',
      'Worked extensively with Supabase and API integrations for authentication, database workflows, user statistics, and streak tracking.',
      'Contributed AI-assisted features such as study companion and question-generation flows to enhance the learning experience.',
      'Supported deployment infrastructure with Docker, Nginx, Redis, and environment-based build setups.',
    ],
    tech: ['Next.js', 'TypeScript', 'Supabase', 'TailwindCSS', 'Redis'],
  },
];

export interface Project {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  github: string;
  live?: string;
  image?: string;
  highlights: string[];
  category: string;
  featured: boolean;
  imageCaption: string;
  demoNote: string;
  problem: string;
  contribution: string;
  decision: string;
  challenge: string;
  limitation: string;
  nextStep: string;
  reviewSteps: string[];
}

export const projects: Project[] = [
  {
    slug: 'bookstore',
    title: 'E-commerce Bookstore',
    description:
      'A team-built bookstore with product search, cart and order flows, plus a separate admin dashboard. React and Redux meet Node.js and MongoDB.',
    tech: ['React', 'Redux', 'Node.js', 'MongoDB', 'Express', 'Vite'],
    github: 'https://github.com/khoipn21/TMDT-main',
    image: '/images/project-bookstore.png',
    category: 'Full-stack web application · E-commerce',
    featured: true,
    imageCaption: 'Existing storefront preview. Capture provenance has not been verified.',
    demoNote: 'Team project. Local setup documented; no public demo.',
    problem:
      'A bookstore needs a clear path from finding a book to managing a cart and reviewing an order.',
    contribution:
      'Co-authored by Pham Ngoc Khoi and Cao Quoc Viet, as credited in the repository README. The storefront, admin dashboard, and API are team work, not an individual project.',
    decision:
      'Used Redux to manage shared application state across catalog, cart, and account views, rather than keeping each view isolated.',
    challenge:
      'The shopping flow spans product data, cart state, authentication, and order management. Each step needs to preserve the user’s context.',
    limitation:
      'No verified public demo. Local evaluation requires three applications, MongoDB, aligned API URLs, and environment configuration. Payment credentials are not included; never use the example JWT secret outside local development.',
    nextStep:
      'Document a reproducible search-to-order walkthrough and test cart behavior after refresh.',
    reviewSteps: [
      'Read the repository setup instructions.',
      'Trace product search and cart state through the frontend.',
      'Review the user/admin boundaries and order endpoints.',
    ],
    highlights: [
      'JWT-based authentication with role-specific access (user/admin).',
      'Product search, shopping cart, order management, and an admin panel.',
      'Separate admin dashboard for product management, order status, sales statistics, and user management.',
    ],
  },
  {
    slug: 'murmur-chatapp',
    title: 'Murmur Chatapp',
    description:
      'A community chat application with channels, direct messages, and paginated conversation history. React on the front, Go behind the connection.',
    tech: ['React', 'TypeScript', 'Go', 'WebSocket', 'Chakra UI', 'PostgreSQL', 'Redis'],
    github: 'https://github.com/khoipn21/murmur-chatapp',
    image: '/images/project-murmur.png',
    category: 'Full-stack web application · Real-time',
    featured: true,
    imageCaption: 'Project artwork, not an application screenshot.',
    demoNote: 'Source review. No verified public demo.',
    problem:
      'A chat application needs conversations to update without forcing people to refresh the page.',
    contribution:
      'Built a React interface with Chakra UI and a Go messaging backend using Gin and Gorilla WebSocket.',
    decision:
      'Used TanStack Query for paginated message history and a WebSocket hook for incoming messages. This separates loading older conversations from receiving live updates.',
    challenge:
      'Real-time delivery and stored conversation history have different responsibilities. The interface and backend need to agree on message state.',
    limitation:
      'There is no verified public demo and no project-specific root setup guide. Running it requires the Vite client, Go server, database, and authentication/email configuration.',
    nextStep:
      'Write a complete local setup guide, then add reproducible checks for a two-user conversation and recovery after a lost connection.',
    reviewSteps: [
      'Inspect the murmur-app client and murmur-server backend directories.',
      'Trace ChatScreen pagination and useMessageSocket updates.',
      'Review the login, channel, and account routes; a full local setup guide is still needed.',
    ],
    highlights: [
      'Real-time messaging with WebSocket using Go backend with Gorilla-WebSocket.',
      'React and Chakra UI screens for channels, direct messages, account settings, and authentication.',
      'PostgreSQL for persistent storage and Redis for caching and session management.',
      'Paginated conversation history with TanStack Query and live WebSocket updates.',
    ],
  },
  {
    slug: 'codexbar-linux',
    title: 'CodexBar Linux Port',
    description:
      'A Linux-native tray and settings interface for monitoring AI coding-provider usage, built in Rust around the upstream CodexBar engine.',
    tech: ['Rust', 'GTK4', 'libadwaita', 'Swift', 'GitHub Actions'],
    github: 'https://github.com/khoipn21/CodexBar-Linux',
    image: '/images/project-codexbar.png',
    category: 'Open-source desktop application',
    featured: true,
    imageCaption: 'Project artwork, not an application screenshot.',
    demoNote: 'Desktop source build. No published release yet.',
    problem:
      'CodexBar was built for macOS. Linux users needed a native way to inspect their AI coding-provider usage.',
    contribution:
      'Built the Linux GUI and integration in Rust, GTK4, and libadwaita. The engine and original product design are from steipete/CodexBar, included as an MIT-licensed upstream submodule.',
    decision:
      'Kept the upstream Swift provider engine behind local HTTP endpoints while implementing the Linux interface in Rust. This separates provider integration from platform-specific UI.',
    challenge:
      'Adapting a macOS menu-bar experience to Linux required system-tray integration, GTK settings, autostart support, and Linux packaging.',
    limitation:
      'No release is published yet. Building requires Rust, Swift, and GTK dependencies. Tray support needs an AppIndicator host; provider usage requires local account sessions.',
    nextStep:
      'Improve the installation walkthrough and document desktop-environment compatibility with reproducible checks.',
    reviewSteps: [
      'Read the Linux installation instructions and upstream attribution.',
      'Inspect the tray and settings implementation.',
      'Review how the Linux client communicates with the provider engine.',
    ],
    highlights: [
      'Integrated ksni StatusNotifierItem for system tray presence on GNOME with custom cairo-rendered usage icons.',
      'Consumed upstream Swift engine via local HTTP endpoints for provider quotas, token breakdowns, and cost ledger.',
      'Built libadwaita settings window with provider configuration, refresh cadence control, and launch-at-login autostart.',
      'GitHub Actions runs Rust tests and builds .deb and tarball CI artifacts. These are not published releases.',
    ],
  },
  {
    slug: 'study-platform',
    title: 'Study Platform',
    description:
      'A Go backend for learning products, with authentication, course, and progress services connected through a gRPC API gateway.',
    tech: ['Go', 'gRPC', 'PostgreSQL', 'Docker', 'Redis'],
    github: 'https://github.com/khoipn21/study-platform',
    image: '/images/project-study.png',
    category: 'Learning platform · Backend architecture',
    featured: false,
    imageCaption: 'Concept artwork. This repository contains APIs, not the pictured web interface.',
    demoNote: 'Backend project. Local setup documented; no public demo.',
    problem:
      'An online learning product needs authentication, course enrollment, and progress tracking to work together.',
    contribution:
      'Built Go services for authentication, courses, and progress tracking, with a gateway and Docker setup. This repository does not contain a frontend.',
    decision:
      'Organized the backend around authentication, course, and progress services with gRPC communication and PostgreSQL storage.',
    challenge:
      'Keeping identity and enrollment information consistent across service boundaries adds complexity beyond a single application server.',
    limitation:
      'The repository contains backend services, not a finished browser application. Local evaluation needs the documented Docker services; OAuth and payment integrations require separate credentials.',
    nextStep:
      'Document and verify one complete enrollment-to-progress flow before expanding the architecture.',
    reviewSteps: [
      'Follow the repository README and .env.example for local Docker setup.',
      'Inspect the gateway Swagger documentation and service contracts.',
      'Trace an enrollment request through the course and progress services.',
    ],
    highlights: [
      'Authentication service with JWT, OAuth 2.0 (Google, GitHub, Facebook), and role-based access control.',
      'Course service for CRUD operations, lecture management, search/filtering, and enrollment system.',
      'Dedicated progress service and documented gRPC contracts for learning progress.',
      'API Gateway with rate limiting, circuit breaker pattern, and automatic retry mechanisms.',
    ],
  },
];

export const education = [
  {
    school: 'VTC Academy',
    period: '2022 — 2025',
    major: 'Full-stack Web Development',
    note: 'Talent Scholarship',
    location: 'Ho Chi Minh, VN',
  },
  {
    school: 'University of Science',
    period: '2021 — Present',
    major: 'Computer and Embedded System',
    location: 'Ho Chi Minh, VN',
  },
];
