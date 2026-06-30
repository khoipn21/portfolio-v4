export const userData = {
  name: 'Pham Ngoc Khoi',
  displayName: 'khoipn21',
  age: new Date().getFullYear() - 2003,
  headline: 'Junior Full-Stack Developer | React, TypeScript & Go',
  location: 'Ho Chi Minh, Vietnam',
  email: 'khoingoc456@gmail.com',
  phone: '(+84) 832-211-203',
  github: 'https://github.com/khoipn21',
  githubUsername: 'khoipn21',
  linkedin: 'https://linkedin.com/in/khoipn21',
  portfolio: 'https://portfolio.khoipn.com',
  bio: 'Software engineer focused on React, Next.js, React Native, and TypeScript. I love building, breaking, and shipping things that make a difference.',
  highlights: [
    'Full-stack developer passionate about clean UI and robust backends.',
    'Building e-commerce, proptech, and ed-tech products with modern web stacks.',
    'I believe actions speak louder than words, so I put my code where my mouth is.',
  ],
  currentWork: [
    { name: 'WALA-ICT', link: '#' },
    { name: 'Freelance Projects', link: '#' },
  ],
  socials: [
    {
      name: 'GitHub',
      href: 'https://github.com/khoipn21',
      icon: 'github',
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/in/khoipn21',
      icon: 'linkedin',
    },
    {
      name: 'Email',
      href: 'mailto:khoingoc456@gmail.com',
      icon: 'email',
    },
  ],
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
}

export const projects: Project[] = [
  {
    slug: 'codexbar-linux',
    title: 'CodexBar Linux Port',
    description:
      'Full Linux port of a macOS AI-coding usage monitor, replacing the native Swift/AppKit UI with a Rust GTK4/libadwaita desktop application.',
    tech: ['Rust', 'GTK4', 'libadwaita', 'Swift', 'GitHub Actions'],
    github: 'https://github.com/khoipn21/CodexBar-Linux',
    image: '/images/project-codexbar.png',
    highlights: [
      'Integrated ksni StatusNotifierItem for system tray presence on GNOME with custom cairo-rendered usage icons.',
      'Consumed upstream Swift engine via local HTTP endpoints for provider quotas, token breakdowns, and cost ledger.',
      'Built libadwaita settings window with provider configuration, refresh cadence control, and launch-at-login autostart.',
      'Implemented CI/CD pipelines with GitHub Actions that build, bundle, and publish .deb and tarball artifacts.',
    ],
  },
  {
    slug: 'study-platform',
    title: 'Study Platform',
    description:
      'A comprehensive online learning platform built with Go microservices architecture featuring authentication, course management, and progress tracking.',
    tech: ['React', 'TypeScript', 'Go', 'gRPC', 'PostgreSQL', 'Docker'],
    github: 'https://github.com/khoipn21/study-platform',
    image: '/images/project-study.png',
    highlights: [
      'Authentication service with JWT, OAuth 2.0 (Google, GitHub, Facebook), and role-based access control.',
      'Course service for CRUD operations, lecture management, search/filtering, and enrollment system.',
      'Progress service for tracking user learning progress, analytics, and learning path recommendations.',
      'API Gateway with rate limiting, circuit breaker pattern, and automatic retry mechanisms.',
    ],
  },
  {
    slug: 'murmur-chatapp',
    title: 'Murmur Chatapp',
    description:
      'A real-time chat web application supporting multiple users using WebSocket with a friendly UI/UX.',
    tech: ['React', 'Go', 'Gin', 'WebSocket', 'PostgreSQL', 'Redis', 'AWS'],
    github: 'https://github.com/khoipn21/murmur-chatapp',
    image: '/images/project-murmur.png',
    highlights: [
      'Real-time messaging with WebSocket using Go backend with Gorilla-WebSocket.',
      'Designed friendly front-end UI/UX with React and ChakraUI.',
      'PostgreSQL for persistent storage and Redis for caching and session management.',
      'Deployed on AWS EC2 with S3 for data storage.',
    ],
  },
  {
    slug: 'bookstore',
    title: 'E-commerce Bookstore',
    description:
      'Frontend built with ReactJS for dynamic interfaces, styled with Bootstrap 5, and managed with Redux. Backend with Node.js and MongoDB.',
    tech: ['React', 'Redux', 'Node.js', 'Express', 'MongoDB', 'Bootstrap'],
    github: 'https://github.com/khoipn21/TMDT-main',
    image: '/images/project-bookstore.png',
    highlights: [
      'JWT-based authentication with role-specific access (user/admin).',
      'Product search, shopping cart, order management, and an admin panel.',
      'Deployed on Ubuntu with Nginx reverse proxy.',
    ],
  },
];

export interface Skill {
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools';
}

export const skills: Skill[] = [
  { name: 'React', icon: 'devicon:react', category: 'frontend' },
  { name: 'Next.js', icon: 'devicon:nextjs', category: 'frontend' },
  { name: 'React Native', icon: 'devicon:react', category: 'frontend' },
  { name: 'TypeScript', icon: 'devicon:typescript', category: 'frontend' },
  {
    name: 'Tailwind CSS',
    icon: 'devicon:tailwindcss',
    category: 'frontend',
  },
  { name: 'Mantine', icon: 'simple-icons:mantine', category: 'frontend' },
  {
    name: 'TanStack Query',
    icon: 'simple-icons:tanstack',
    category: 'frontend',
  },
  { name: 'Zustand', icon: 'devicon:zustand', category: 'frontend' },
  { name: 'GSAP', icon: 'simple-icons:greensock', category: 'frontend' },
  { name: 'HTML5', icon: 'devicon:html5', category: 'frontend' },
  { name: 'CSS3', icon: 'devicon:css3', category: 'frontend' },
  { name: 'JavaScript', icon: 'devicon:javascript', category: 'frontend' },
  { name: 'Node.js', icon: 'devicon:nodejs', category: 'backend' },
  { name: 'Express', icon: 'devicon:express', category: 'backend' },
  { name: 'Go', icon: 'devicon:go', category: 'backend' },
  { name: 'NestJS', icon: 'devicon:nestjs', category: 'backend' },
  { name: 'PostgreSQL', icon: 'devicon:postgresql', category: 'database' },
  { name: 'MySQL', icon: 'devicon:mysql', category: 'database' },
  { name: 'MongoDB', icon: 'devicon:mongodb', category: 'database' },
  { name: 'Redis', icon: 'devicon:redis', category: 'database' },
  { name: 'Supabase', icon: 'devicon:supabase', category: 'database' },
  { name: 'Docker', icon: 'devicon:docker', category: 'devops' },
  { name: 'AWS', icon: 'logos:aws', category: 'devops' },
  { name: 'Nginx', icon: 'devicon:nginx', category: 'devops' },
  { name: 'Git', icon: 'devicon:git', category: 'tools' },
  { name: 'GitHub', icon: 'devicon:github', category: 'tools' },
  { name: 'Figma', icon: 'devicon:figma', category: 'tools' },
  { name: 'Linux', icon: 'devicon:linux', category: 'tools' },
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
