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

/** A product shipped inside a job; the career graph draws each one as a branch. */
export interface ExperienceProject {
  /** Branch name in the career graph. */
  branch: string;
  name: string;
  summary: string;
  period: string;
  /** Month the work started, YYYY-MM. */
  start: string;
  /** Month the work ended, YYYY-MM. Omitted while it is still running. */
  end?: string;
  stack?: string;
  highlights: string[];
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  /** Month the job started, YYYY-MM. */
  start: string;
  location: string;
  description: string[];
  tech: string[];
  current?: boolean;
  projects?: ExperienceProject[];
}

export const experiences: Experience[] = [
  {
    company: 'WALA-ICT',
    role: 'Full-stack Developer',
    period: 'May 2025 — Present',
    start: '2025-05',
    location: 'Ho Chi Minh, VN',
    current: true,
    description: [
      'Ship outsourced e-commerce, proptech, and construction-operations products for Korean clients across 8 repositories (lead contributor on 7): Next.js/React consoles and storefronts plus React Native apps on external REST and STOMP backends.',
      'Bootstrapped 5 of those repositories (routing, layouts, API and state conventions, i18n, GitLab CI gates, PM2 deploy) so the 5–10 contributors on each built on one reviewed pattern instead of diverging.',
      'Own features end-to-end: Figma and product requirements through UI, API integration, translations in up to 9 locales, code review, and QA sign-off.',
    ],
    tech: ['Next.js', 'React', 'React Native', 'TypeScript', 'STOMP', 'GitLab CI'],
    projects: [
      {
        branch: 'alpaca',
        name: 'Alpaca',
        summary: 'Property management for landlords and tenants (app + CMS)',
        period: 'Aug 2025 — Mar 2026',
        start: '2025-08',
        end: '2026-03',
        stack:
          'React Native 0.81, React Navigation, Zustand + MMKV, RHF + Yup, Notifee; React 19, Vite',
        highlights: [
          'Took the app from empty repository to signed APK/IPA builds: onboarding, OTP sign-up, social login (Kakao, Naver, Google, Apple), role-based navigation, help requests, push notifications, charts, and reports.',
          'Built the CMS’s core domain: building, land, room, and lease management, service-company contracts with worklogs, help-request workflow, banners, scheduled push, and dashboard KPIs.',
        ],
      },
      {
        branch: 'daun',
        name: 'Daun',
        summary: 'B2B wholesale e-commerce + 4 marketplaces (portal, storefront)',
        period: 'Nov 2025 — Sep 2026',
        start: '2025-11',
        end: '2026-09',
        stack:
          'React 19, Vite, TanStack Router/Query, Mantine, Jotai, Yup/Zod, Tiptap, i18next, STOMP',
        highlights: [
          'Bootstrapped both repositories (routing, layouts, Axios/Query API pattern with a 401 refresh queue, GitLab CI) and remained lead contributor on both for 10 months (184 routes).',
          'Owned product registration end-to-end, the portal’s largest module: variations, KC certification, disclosure templates, admin approval with draft diff and history logs, Excel bulk upload/download, and image cropping.',
          'Integrated Coupang, Naver, Gmarket, and Auction so suppliers list once and sell on 4 marketplaces: API-key issuance, category mapping, multi-market templates, and product transfer with SKU mapping.',
          'Shipped storefront commerce from cart to receipt: cart grouping and quotation print, checkout and buy-now with card, key-in, and bulk payment, stock-aware SKU selection, and OTP/business-verified sign-up.',
        ],
      },
      {
        branch: 'unrivaled',
        name: 'Unrivaled',
        summary: 'Cross-border e-commerce in 9 locales (storefront, console, app)',
        period: 'Mar 2026 — Present',
        start: '2026-03',
        stack:
          'Next.js 16, React 19, Tailwind v4, TanStack Query/Table, Zustand, Zod, i18next, STOMP, Expo 56',
        highlights: [
          'Rebuilt the mobile app from a WebView shell into a native Expo Router app at full web parity in 6 weeks: 28/28 routes, 124 shared components, 5 social logins, Toss payments, and a parity toolchain (route-manifest checks, Android/iOS screenshot diffs, 155 tests).',
          'Built the AI floating chatbot on web and mobile end-to-end, from STOMP conversation lifecycle and consultant handover to a chatbot-driven draft checkout that completes as a public checkout session, with product/order/delivery cards, image messages, and photo-OCR address entry.',
          'Shipped the console’s CS suite for the AI bot: queue routing with takeover leases, manual-order drafting with OCR confidence, return/exchange/cancel claims, Facebook orders with bulk import, and push notifications.',
          'Delivered storefront auth and My Page (orders, claims, addresses, wishlist, reviews, coupons, referrals) plus console vendor onboarding, settlement, commission policies, and per-country quotas behind RBAC.',
        ],
      },
      {
        branch: 'chunji',
        name: 'Chunji',
        summary: 'Construction site-operations portal (Next.js, 100+ routes)',
        period: 'Aug 2026 — Present',
        start: '2026-08',
        highlights: [
          'Delivered the asset-management and maintenance-repair modules (9 screens, UI through live API): CRUD with bulk registration, transfers with carrier details, comments and status history, disposal scheduling, and filtered lists with CSV export.',
          'Built supplier self-service (company information with material catalog, contact responsibilities, withdrawal eligibility and requests) and tenant announcements, each with Zod-validated forms and EN/KO translations.',
        ],
      },
    ],
  },
  {
    company: 'LECOLE',
    role: 'Full-stack Developer',
    period: 'Jan 2025 — May 2025',
    start: '2025-01',
    location: 'Ho Chi Minh, VN',
    description: [
      'Shipped study-workspace, question-sharing, practice-session, and streak features for an edtech product on Next.js, Supabase, and Redis, and built an LLM-backed study companion and question generator on external LLM APIs.',
      'Ran delivery end-to-end with Docker, Nginx, environment-based builds, issue triage, and fast follow-up fixes.',
    ],
    tech: ['Next.js', 'Supabase', 'Redis', 'Docker', 'Nginx'],
  },
  {
    company: 'Freelance',
    role: 'AI tax-compliance assistant (Polish market)',
    period: '2024',
    start: '2024-01',
    location: 'Remote',
    description: [
      'Built Mijinfinn, a WhatsApp assistant for VAT, CIT, and PIT questions in Polish using RAG over tax regulations so every answer cites its source; agents call tax calculators and regulation lookup, traced through Langfuse.',
    ],
    tech: ['Python', 'WhatsApp Business API', 'LLM agents', 'RAG', 'Langfuse'],
  },
];

export interface StackLayer {
  tech: string;
  note: string;
}

export interface Project {
  slug: string;
  title: string;
  /** When the work happened, as written on the CV. */
  period?: string;
  description: string;
  tech: string[];
  github?: string;
  /** Further public repositories, such as a separate frontend. */
  repos?: { href: string; label: string }[];
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
  /** The project read as three layers, from what people touch down to where data lives. */
  stack?: { ui: StackLayer; api: StackLayer; data: StackLayer };
}

export const projects: Project[] = [
  {
    slug: 'bioweave',
    title: 'BioWeave',
    period: 'Oct 2026',
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
    stack: {
      ui: {
        tech: 'Next.js · Three.js · React Three Fiber',
        note: 'The browser builds each model from its spec',
      },
      api: { tech: 'Codex · TypeScript', note: 'AI writes the spec, QA gates review it' },
      data: { tech: 'PostgreSQL · MinIO', note: 'Model packages and drafts' },
    },
    problem:
      'AI-generated 3D models look convincing but often get the anatomy wrong: missing parts, wrong counts, invented proportions. Teachers and students cannot spot those errors, so model libraries fill up with content nobody can trust.',
    contribution:
      'Team project in a repository owned by Cao Quoc Viet. I owned the 3D side: the AI mesh pipeline end to end, the biology modelling skill and QA gates, all 18 AI mesh models in the library (10 prehistoric creatures, 8 plants with ontology mapped parts), and 3 procedural lichens, each fitted to published measurements with gltf-transform.',
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
    stack: {
      ui: { tech: 'React · Redux · Vite', note: 'Storefront and admin dashboard' },
      api: { tech: 'Node.js · Express', note: 'Search, cart, orders and JWT roles' },
      data: { tech: 'MongoDB', note: 'Books, users and orders' },
    },
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
    period: 'Jul 2024 – Sep 2024',
    description:
      'A community chat application with channels, direct messages, and paginated conversation history. React on the front, Go behind the connection.',
    tech: ['React', 'TypeScript', 'Go', 'WebSocket', 'Chakra UI', 'PostgreSQL', 'Redis', 'AWS'],
    github: 'https://github.com/khoipn21/murmur-chatapp',
    image: '/images/project-murmur.png',
    category: 'Full-stack web application · Real-time',
    featured: true,
    imageCaption: 'Illustrative artwork.',
    demoNote: 'Source available; no public demo.',
    stack: {
      ui: {
        tech: 'React · TypeScript · Chakra UI',
        note: 'Channels, direct messages, paged history',
      },
      api: { tech: 'Go · Gin · WebSocket', note: 'Live messages over one connection' },
      data: { tech: 'PostgreSQL · Redis', note: 'History in Postgres, sessions in Redis' },
    },
    problem:
      'A chat application needs conversations to update without forcing people to refresh the page.',
    contribution:
      'Sole developer. Built a React interface with Chakra UI, Zustand and TanStack Query, and a Go messaging backend using Gin and Gorilla WebSocket, deployed with Docker on AWS EC2 with media in S3.',
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
      'Media stored in S3, with the stack running in Docker on AWS EC2.',
      'Paginated conversation history with TanStack Query and live WebSocket updates.',
    ],
  },
  {
    slug: 'study-platform',
    title: 'Study Platform',
    period: 'Jul 2025 – Sep 2025',
    description:
      'Go microservices for a learning product behind one API gateway, with a React frontend in its own repository. Authentication, courses, enrollment, analytics, and learning path recommendations.',
    tech: ['Go', 'gRPC', 'PostgreSQL', 'Docker', 'React', 'TanStack Router', 'shadcn/ui'],
    github: 'https://github.com/khoipn21/study-platform',
    repos: [{ href: 'https://github.com/khoipn21/study-frontend', label: 'Frontend code' }],
    image: '/images/project-study.png',
    category: 'Learning platform · Microservices',
    featured: false,
    imageCaption: 'Concept artwork for the learning interface.',
    demoNote: 'Sole developer. Backend and frontend source available; no public demo.',
    stack: {
      ui: {
        tech: 'React · TanStack Router/Query · shadcn/ui',
        note: 'Separate study-frontend repository',
      },
      api: { tech: 'Go · gRPC', note: 'Services behind a gateway with rate limits and retries' },
      data: { tech: 'PostgreSQL · Docker', note: 'Service storage' },
    },
    problem:
      'An online learning product needs authentication, course enrollment, progress, and recommendations to work together.',
    contribution:
      'Sole developer. Built Go services for authentication, courses, enrollment, analytics, and learning path recommendations behind an API gateway, plus a React frontend with TanStack Router, TanStack Query, and shadcn/ui in a separate repository.',
    decision:
      'Organized the backend around separate services with gRPC communication and PostgreSQL storage, and put rate limiting, a circuit breaker, and retries in the gateway rather than in each service.',
    challenge:
      'Keeping identity and enrollment information consistent across service boundaries adds complexity beyond a single application server.',
    limitation:
      'No public deployment. Local evaluation needs the documented Docker services; OAuth and payment integrations require separate credentials.',
    nextStep:
      'Document and verify one complete enrollment to progress flow across the frontend and services before expanding the architecture.',
    reviewSteps: [
      'Follow the repository README and .env.example for local Docker setup.',
      'Inspect the gateway Swagger documentation and service contracts.',
      'Trace an enrollment request from the study-frontend screens through the course and progress services.',
    ],
    highlights: [
      'Authentication service with JWT, OAuth 2.0 (Google, GitHub, Facebook), and role-based access control.',
      'Course service for CRUD operations, lecture management, search/filtering, and enrollment system.',
      'Analytics and learning path recommendations, with documented gRPC contracts between services.',
      'API Gateway with rate limiting, circuit breaker pattern, and automatic retry mechanisms.',
      'React frontend with TanStack Router, TanStack Query, and shadcn/ui.',
    ],
  },
  {
    slug: 'mijinfinn',
    title: 'Mijinfinn',
    period: '2024',
    description:
      'An AI tax compliance assistant on WhatsApp for the Polish market. It answers VAT, CIT, and PIT questions in Polish and cites the regulation behind every answer.',
    tech: ['Python', 'WhatsApp Business API', 'LLM agents', 'RAG', 'Langfuse'],
    category: 'Freelance · AI assistant',
    featured: false,
    imageCaption: '',
    demoNote: 'Freelance client project. Private source; no public demo.',
    stack: {
      ui: { tech: 'WhatsApp Business API', note: 'Questions arrive as chat messages' },
      api: { tech: 'Python · LLM agents', note: 'Tool calls to tax calculators and lookups' },
      data: { tech: 'RAG · Langfuse', note: 'Regulation index and traces' },
    },
    problem:
      'Businesses in Poland ask tax questions in Polish and need answers they can check against the regulations, not a confident guess.',
    contribution:
      'Freelance build. Made the WhatsApp assistant: retrieval over Polish tax regulations, LLM agents that call tax calculators and regulation lookup, and tracing through Langfuse.',
    decision:
      'Grounded every answer in retrieved regulation text so each reply cites its source, and gave the agents calculator tools for the arithmetic.',
    challenge:
      'VAT, CIT, and PIT rules overlap, so each answer has to point at the specific regulation it relies on.',
    limitation: 'Client project: the source is private and there is no public demo.',
    nextStep:
      'Measure citation accuracy on a fixed set of real questions and track it in Langfuse.',
    reviewSteps: [
      'Ask about the retrieval setup and how sources attach to each answer.',
      'Ask about the calculator and regulation lookup tools the agents call.',
      'Ask about the Langfuse traces used to debug answers.',
    ],
    highlights: [
      'WhatsApp assistant for VAT, CIT, and PIT questions in Polish.',
      'RAG over tax regulations so every answer cites its source.',
      'LLM agents with tool calling for tax calculators and regulation lookup.',
      'Runs traced through Langfuse.',
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
    major: 'Computer and Embedded Systems',
    location: 'Ho Chi Minh, VN',
  },
];
