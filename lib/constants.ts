export interface Metric {
  value: string;
  label: string;
}

export interface Project {
  slug: string;
  name: string;
  category: string;
  featured: boolean;
  tagline: string;
  summary: string;
  description: string;
  tech: string;
  url: string;
  accent: string;
  year: string;
  role: string;
  focus: string[];
  metrics: Metric[];
  highlights: string[];
  detail: {
    paragraphs: string[];
    approach: string;
    outcome: string;
  };
}

export const projects: Project[] = [
  {
    slug: "eatensity",
    name: "Eatensity",
    category: "Product platform",
    featured: true,
    tagline: "Nutrition data for Indian food",
    summary:
      "3,300+ Indian and global foods in one searchable database. Includes a calorie tracker and Nutri-Score grading. Play Store and B2B API coming soon.",
    description:
      "3,300+ Indian and global foods with Nutri-Score grading and a daily calorie tracker. A full-stack Turborepo monorepo spanning web, mobile (coming soon), and a B2B API (coming soon).",
    tech: "Next.js 15 · React Native · Hono · Supabase",
    url: "https://eatensity.com",
    accent: "#b85b38",
    year: "2025",
    role: "Basically everything — data modeling, product decisions, web, mobile, API",
    focus: ["Data systems", "Full-stack delivery", "Platform design"],
    metrics: [
      {
        value: "3,300+",
        label: "Indian and global foods in one database",
      },
      {
        value: "Web",
        label: "live on browser, Play Store coming soon",
      },
      {
        value: "B2B API",
        label: "coming soon — so other apps can use the data too",
      },
    ],
    highlights: [
      "Combined IFCT 2017, Open Food Facts, and USDA into one searchable dataset.",
      "Thought of it as a platform early on, not just one app.",
      "Designed the calorie tracker to be fast and frictionless — log meals in seconds.",
    ],
    detail: {
      paragraphs: [
        "Eatensity started with a question that felt oddly unanswered: why is it so hard to find reliable nutritional data for Indian food? The global databases skew Western. The Indian ones are scattered across PDFs and academic papers. So I built the bridge.",
        "The platform indexes 3,300+ foods from IFCT 2017, Open Food Facts, and USDA — unified into a single searchable interface with Nutri-Score grading adapted for Indian dietary patterns. The calorie tracker lets you search and log meals quickly without hunting through ingredient lists.",
        "Architecturally, it's a Turborepo monorepo: Next.js 15 with React 19 for the web app on Vercel, React Native with Expo for the Android app on Google Play, a Hono edge API, and Supabase handling Postgres, Auth, and Realtime subscriptions.",
        "The B2B REST API is an intentional next step — the food data layer is useful beyond my own app. Third-party wellness platforms and fitness apps will be able to query it directly.",
      ],
      approach:
        "Data first. I built and validated the nutritional database before touching any UI. Every food entry is normalized across three sources with conflict resolution rules.",
      outcome:
        "Live on web. Play Store and B2B API are coming soon.",
    },
  },
  {
    slug: "figuretools",
    name: "figuretools",
    category: "Tool ecosystem",
    featured: true,
    tagline: "100 free calculators",
    summary:
      "Static collection of calculators and converters. No framework, no accounts, no ads. Built with Eleventy, builds in under a second.",
    description:
      "100 free calculators and converters across 8 categories, built for Indian users. No frameworks, no ads, no production dependencies.",
    tech: "Eleventy 3.x · Nunjucks · Vanilla JS/CSS",
    url: "https://figuretools.com",
    accent: "#2d6171",
    year: "2025",
    role: "Concept, information architecture, static site, UX",
    focus: ["Performance", "Utility products", "Information architecture"],
    metrics: [
      {
        value: "100",
        label: "tools, all free, no login needed",
      },
      {
        value: "117",
        label: "pages built in about 0.8 seconds",
      },
      {
        value: "0",
        label: "runtime dependencies in production",
      },
    ],
    highlights: [
      "Treated performance as a feature, not something to optimize later.",
      "Each page loads only its own CSS instead of a big global stylesheet.",
      "Adapted calculators for Indian tax, banking, and GST.",
    ],
    detail: {
      paragraphs: [
        "100 calculators with no framework, no bundler in production, no ads, and no login.",
        "Builds 117 pages in ~0.8 seconds using Eleventy 3.x. Each page loads only its own CSS. Every calculator auto-computes on type with a 300ms debounce.",
        "Mobile-first with 48px touch targets. Finance and tax calculators calibrated for Indian tax brackets, GST rates, and banking norms.",
      ],
      approach:
        "No JavaScript framework. Page-specific CSS. Static generation — every page is a pre-built HTML file from a CDN.",
      outcome:
        "117 pages, sub-second builds, zero runtime dependencies.",
    },
  },
  {
    slug: "kanso",
    name: "Kanso",
    category: "Internal finance tool",
    featured: true,
    tagline: "Personal finance tracker",
    summary:
      "CSV import, rule-based auto-categorization, and anomaly detection using mean + 2\u03c3. Built with Spring Boot and Thymeleaf.",
    description:
      "A personal finance tracker with CSV import, manual entry, and rule-based auto-categorization. Flags unusual expenses using mean + 2σ — just math, no black boxes.",
    tech: "Java 17 · Spring Boot 3 · Thymeleaf · Docker",
    url: "https://github.com/saiuttejr/kanso-note",
    accent: "#8a6239",
    year: "2025",
    role: "Domain modeling, rules engine, backend, deployment",
    focus: ["Backend systems", "Rules engines", "Explainable automation"],
    metrics: [
      {
        value: "2σ",
        label: "threshold for flagging unusual spending",
      },
      {
        value: "CSV → Insight",
        label: "import to categorized review in one step",
      },
      {
        value: "Dockerized",
        label: "repeatable deployment, nothing manual",
      },
    ],
    highlights: [
      "Kept categorization rule-based so you can actually understand why it tagged something.",
      "Built the detection model first, then the interface around it.",
      "Server-rendered pages to keep things simple and maintainable.",
    ],
    detail: {
      paragraphs: [
        "Kanso (Japanese for simplicity). Import transactions, auto-categorize them, flag the ones that don't fit the pattern.",
        "The auto-categorization engine uses configurable rules. Statistical detection flags transactions outside mean + 2σ for their category.",
        "Spring Boot 3 and Thymeleaf for server-rendered pages. Deployed via Docker with CI/CD on Render.",
      ],
      approach:
        "Detection logic prototyped and tested before any frontend. The rule engine is extensible — new categorization rules don't touch the detection logic.",
      outcome:
        "Open source on GitHub. Dockerized and deployed.",
    },
  },
  {
    slug: "totallynotinsta",
    name: "TotallyNotInsta",
    category: "Full-stack systems exercise",
    featured: false,
    tagline: "Full-stack social app",
    summary:
      "Instagram-style app with posts, likes, comments, follows, and feeds. 6+ MongoDB collections, Dockerized, running 24/7 on free-tier hosting.",
    description:
      "A full-stack Instagram-style app with real-time interactions across 6+ data models. Dockerized with zero-downtime releases.",
    tech: "Laravel · PHP · MongoDB · Docker",
    url: "https://github.com/saiuttejr/totallynotinsta",
    accent: "#43627c",
    year: "2025",
    role: "Data modeling, backend, deployment, operations",
    focus: ["Full-stack delivery", "Deployment", "Real-time interactions"],
    metrics: [
      {
        value: "6+",
        label: "data models working together",
      },
      {
        value: "24/7",
        label: "uptime on free-tier hosting",
      },
      {
        value: "Docker CI/CD",
        label: "repeatable deploys from local to production",
      },
    ],
    highlights: [
      "Built the full stack to actually own the whole pipeline, not just write features.",
      "Modeled a non-trivial social product with real-time interactions across collections.",
      "Kept it alive on free hosting with zero-downtime releases and health checks.",
    ],
    detail: {
      paragraphs: [
        "Full-stack social media app — posts, likes, comments, follows, feeds — with real-time interactions across 6+ MongoDB collections.",
        "Docker containers, CI/CD pipeline, zero-downtime releases on Render's free tier, 24/7 uptime via Uptime Robot health checks.",
        "Laravel backend, MongoDB data layer, full deployment pipeline.",
      ],
      approach:
        "End-to-end ownership. Data modeling in MongoDB, Laravel backend, deployment pipeline — all hand-built.",
      outcome:
        "Live with 24/7 uptime on free-tier hosting. Open source.",
    },
  },
];

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

export const experience: Experience[] = [
  {
    role: "Software Engineer 1",
    company: "MAQ Software",
    period: "Sept 2025 – Present",
    description:
      "Backend services in C# and .NET. Ingestion and reporting workflows. Automated Azure processes that cut operational work by 90%+. Azure DevOps CI/CD.",
  },
  {
    role: "Associate Software Engineer",
    company: "MAQ Software",
    period: "Aug 2024 – Aug 2025",
    description:
      "Converted from internship to full-time. Production backend features for Microsoft-aligned client environments.",
  },
];

export interface Education {
  degree: string;
  institution: string;
  period: string;
  note: string;
}

export const education: Education = {
  degree: "B.Tech in Computer Science and Engineering",
  institution: "CVR College of Engineering, JNTUH",
  period: "",
  note: "GATE CSE 2024 — top 8% nationwide",
};

export const socialLinks = {
  email: "saiuttej.r@gmail.com",
  linkedin: "https://linkedin.com/in/sai-uttej-r",
  github: "https://github.com/saiuttejr",
  lichess: "https://lichess.org/@/Haccnt",
};

export const siteMetadata = {
  title: "Sai Uttej Rajoju — Software Engineer",
  description:
    "Software engineer focused on backend systems and building useful things.",
  url: "https://saiuttej.com",
  ogImage: "/opengraph-image",
};
