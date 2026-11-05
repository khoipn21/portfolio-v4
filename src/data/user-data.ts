export const userData = {
  name: 'Pham Ngoc Khoi',
  headline: 'Software Engineer & Full-Stack Developer',
  location: 'Ho Chi Minh, Vietnam',
  email: 'contact@khoipn.com',
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
    role: 'Software / Fullstack Developer',
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
  {
    company: 'Freelance',
    role: 'Fullstack Developer',
    period: '2024',
    location: 'Remote',
    description: [
      'Delivered recruitment, salon-management, and tax-compliance products for international clients.',
      'Built a recruitment platform with Next.js and NestJS featuring job posting pipelines, candidate matching, and role-based access.',
      'Developed a nail-salon booking system with appointment scheduling, service catalogs, staff calendars, and customer loyalty tracking.',
      'Built a Polish-market WhatsApp tax assistant using Python, LLMs, RAG, and Langfuse, with source citations and tools for tax calculations and regulation lookup.',
    ],
    tech: ['Next.js', 'NestJS', 'Node.js', 'PostgreSQL', 'Python', 'RAG', 'Langfuse'],
  },
];

export interface Project {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
  demo?: { href: string; label: string };
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
    slug: 'bioweave',
    title: 'BioWeave',
    description:
      'A web platform for 3D biology models: AI writes a spec you can check, the browser builds the model, and the community verifies it. First place at the Sea x OpenAI Codex Hackathon Vietnam 2026.',
    tech: [
      'Next.js',
      'Three.js',
      'React Three Fiber',
      'TypeScript',
      'PostgreSQL',
      'MinIO',
      'Codex',
    ],
    demo: { href: '/#awards', label: 'Watch the demo' },
    image: '/images/bioweave-deep-time-poster.webp',
    category: 'Hackathon project · AI and 3D',
    featured: true,
    imageCaption: 'Still from the demo recording: the Deep Time view.',
    demoNote: 'Team hackathon project. Private repository; demo video on the homepage.',
    problem:
      'AI-generated 3D models look convincing but often get the anatomy wrong: missing parts, wrong counts, invented proportions. Teachers and students cannot spot those errors, so model libraries fill up with content nobody can trust.',
    contribution:
      'Team project in a repository owned by Cao Quoc Viet. I owned the 3D side: the biology modelling skill and QA gates, 22 of the sample models, and the AI mesh pipeline in the Studio.',
    decision:
      'Made evidence a hard requirement. Every model part carries an ontology ID (Uberon, Cell Ontology, Gene Ontology, Plant Ontology) and every size and colour cites a source, so a reviewer can check a model instead of trusting it.',
    challenge:
      'AI agents tend to approve their own output. The QA pipeline runs automated checks and then a separate review pass, so the agent that builds a model never approves its own render.',
    limitation:
      'Built in a hackathon, so it is a demo rather than a product. The repository is private and there is no public deployment. AI mesh results land as Drafts and still need human review.',
    nextStep:
      'Deploy a public demo so teachers can try the review flow, and track which errors the automated checks miss.',
    reviewSteps: [
      'Watch the demo recording on the homepage.',
      'Ask for repository access to review the 3D biology skill and its QA gates.',
      'Trace an AI mesh run from the Studio prompt to a Draft in the library.',
    ],
    highlights: [
      'Codex skill for 3D biology models: each part maps to an ontology ID, and each size and colour has a cited source.',
      'Automated QA checks plus a separate review pass; the agent that builds a model never approves its own render.',
      'AI mesh pipeline that researches a subject, draws a reference image and produces one 3D object in under two minutes, with one paid generation call per run. Results always land as Drafts.',
      'Demo library of 94 model packages, including 76 generator-built models split into named, selectable parts.',
    ],
  },
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
    imageCaption: 'Storefront preview.',
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
    imageCaption: 'Illustrative artwork.',
    demoNote: 'Source available; no public demo.',
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
    slug: 'study-platform',
    title: 'Study Platform',
    description:
      'A Go backend for learning products, with authentication, course, and progress services connected through a gRPC API gateway.',
    tech: ['Go', 'gRPC', 'PostgreSQL', 'Docker', 'Redis'],
    github: 'https://github.com/khoipn21/study-platform',
    image: '/images/project-study.png',
    category: 'Learning platform · Backend architecture',
    featured: false,
    imageCaption: 'Concept artwork. The repository covers the APIs behind an interface like this.',
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

export interface Award {
  title: string;
  event: string;
  date: string;
  project: string;
  description: string;
  summary: string;
  facts: { value: string; label: string }[];
  stream?: string;
  teaser?: string;
  poster?: string;
  videoDuration?: string;
  videoCaption?: string;
}

export const awards: Award[] = [
  {
    title: 'First Place',
    event: 'Sea x OpenAI Codex Hackathon Vietnam 2026',
    date: 'Oct 2026',
    project: 'BioWeave',
    description:
      'Team project: a web platform for 3D biology models where AI writes a checkable spec, the browser builds the model, and the community verifies it. Owned the 3D pipeline: a Codex skill that maps every model part to an ontology ID with cited sizes and colours, automated QA with a separate review pass, and an AI mesh pipeline that lands each result as a Draft for review. Demoed a library of 94 model packages in the Top 5 final to judges from OpenAI, Sea and Shopee.',
    summary:
      'BioWeave is a web platform for 3D biology models: AI writes a checkable spec, the browser builds the model, and the community verifies it. I owned the 3D pipeline, from ontology-linked model parts to automated QA.',
    facts: [
      { value: '1st', label: 'of five finalists' },
      { value: '94', label: 'model packages in the demo' },
      { value: '7h', label: 'of on-site hacking' },
    ],
    stream: 'https://khoipn-media.pages.dev/bioweave/deep-time/v1/master.m3u8',
    teaser: '/videos/bioweave-deep-time-teaser.mp4',
    poster: '/images/bioweave-deep-time-poster.webp',
    videoDuration: '1:00',
    videoCaption: 'BioWeave Deep Time view, scrolling from the Precambrian to today.',
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
