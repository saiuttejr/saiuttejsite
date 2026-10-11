export interface Metric {
  value: string;
  label: string;
}

/** A screenshot or diagram. Width/height are required so pages never shift. */
export interface Figure {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

/** A decision worth defending, and the reasoning behind it. */
export interface Decision {
  title: string;
  rationale: string;
}

export interface Project {
  slug: string;
  name: string;
  category: string;
  featured: boolean;
  tagline: string;
  summary: string;
  description: string;
  /** Structured so the UI can render each item, rather than splitting a string. */
  stack: string[];
  url: string;
  accent: string;
  year: string;
  status: string;
  role: string;
  liveUrl?: string;
  repoUrl?: string;
  feedbackUrl?: string;
  focus: string[];
  metrics: Metric[];
  highlights: string[];
  /** Optional until real screenshots land; ProjectCover is the fallback. */
  cover?: Figure;
  gallery?: Figure[];
  detail: {
    problem: string;
    constraints: string[];
    paragraphs: string[];
    decisions: Decision[];
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
      "3,300+ Indian and global foods in one searchable database, with natural-language meal logging powered by Gemini. Calorie tracking and Nutri-Score grading built in. Play Store and B2B API coming soon.",
    description:
      "3,300+ Indian and global foods with Nutri-Score grading and a daily calorie tracker. A full-stack Turborepo monorepo spanning web, mobile (coming soon), and a B2B API (coming soon).",
    stack: ["Next.js 15", "React 19", "React Native + Expo", "Hono", "Supabase", "Postgres", "Gemini"],
    url: "https://eatensity.com",
    liveUrl: "https://eatensity.com",
    feedbackUrl: "https://github.com/Eatensity/Eatensity-feedback/",
    accent: "#b85b38",
    year: "2025",
    status: "Live on web",
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
      problem:
        "Reliable nutritional data for Indian food is effectively unavailable. Global databases skew Western; the Indian sources that exist are locked in PDFs and academic papers. Anyone tracking what they actually eat in India is guessing.",
      constraints: [
        "Three source datasets that disagree with each other on the same food.",
        "Solo build — every hour spent on infrastructure is an hour not spent on data quality.",
        "Had to work as a web app, an Android app, and a third-party API without forking the logic three ways.",
      ],
      paragraphs: [
        "Eatensity started with a question that felt oddly unanswered: why is it so hard to find reliable nutritional data for Indian food? The global databases skew Western. The Indian ones are scattered across PDFs and academic papers. So I built the bridge.",
        "The platform indexes 3,300+ foods from IFCT 2017, Open Food Facts, and USDA — unified into a single searchable interface with Nutri-Score grading adapted for Indian dietary patterns. The calorie tracker lets you search and log meals quickly without hunting through ingredient lists.",
        "Architecturally, it's a Turborepo monorepo: Next.js 15 with React 19 for the web app on Vercel, React Native with Expo for the Android app, a Hono edge API, and Supabase handling Postgres, Auth, and Realtime subscriptions.",
        "The B2B REST API is an intentional next step — the food data layer is useful beyond my own app. Third-party wellness platforms and fitness apps will be able to query it directly.",
      ],
      decisions: [
        {
          title: "Build the database before the interface",
          rationale:
            "A nutrition app is only as good as its worst record. Normalising and conflict-resolving three sources first meant the UI could stay thin, and the data became the asset rather than a by-product.",
        },
        {
          title: "One monorepo, one API, three surfaces",
          rationale:
            "Web, mobile, and the future B2B API all read the same Hono edge layer. Sharing the contract rather than the codebase kept the clients independent without three copies of the domain logic.",
        },
        {
          title: "Natural-language logging over form-filling",
          rationale:
            "Meal logging fails when it takes longer than eating. Letting Gemini parse a typed sentence removed the step most calorie trackers lose their users on.",
        },
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
    stack: ["Eleventy 3.x", "Nunjucks", "Vanilla JS", "Vanilla CSS"],
    url: "https://figuretools.com",
    liveUrl: "https://figuretools.com",
    feedbackUrl: "https://github.com/saiuttejr/figuretools-feedback",
    accent: "#2d6171",
    year: "2025",
    status: "Live",
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
      problem:
        "Online calculators are a hostile category: ad-choked, login-gated, and calibrated for the wrong country. Working out Indian income tax or a GST split usually means fighting the page before you get an answer.",
      constraints: [
        "Any page weight spent on frameworks is weight not spent on the answer.",
        "100 tools across 8 categories still had to stay findable.",
        "Most traffic is mobile, often on slow connections.",
      ],
      paragraphs: [
        "100 calculators with no framework, no bundler in production, no ads, and no login.",
        "Builds 117 pages in ~0.8 seconds using Eleventy 3.x. Each page loads only its own CSS. Every calculator auto-computes on type with a 300ms debounce.",
        "Mobile-first with 48px touch targets. Finance and tax calculators calibrated for Indian tax brackets, GST rates, and banking norms.",
      ],
      decisions: [
        {
          title: "No framework in production",
          rationale:
            "A calculator is a form and some arithmetic. Shipping a runtime to do that would have cost more bytes than the entire rest of the page, on the exact connections that can least afford it.",
        },
        {
          title: "Per-page CSS instead of one global sheet",
          rationale:
            "With 100 tools, a shared stylesheet means every visitor downloads 99 tools they did not ask for. Page-scoped CSS keeps each page paying only its own cost.",
        },
        {
          title: "Calculate on type, not on submit",
          rationale:
            "A 300ms debounce makes the result feel like a consequence of typing rather than a transaction. It removes the one interaction people most often abandon.",
        },
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
    stack: ["Java 17", "Spring Boot 3", "Thymeleaf", "AES-256-GCM", "Docker"],
    url: "https://github.com/saiuttejr/kanso-note",
    repoUrl: "https://github.com/saiuttejr/kanso-note",
    accent: "#8a6239",
    year: "2025",
    status: "Open source",
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
      problem:
        "Budgeting apps either want your bank credentials or they want you to categorise everything by hand. Both are a bad trade for a file you already have: a CSV of your own transactions.",
      constraints: [
        "Financial records, so the data had to be encrypted at rest — not merely access-controlled.",
        "An unusual-spend flag nobody can explain is a flag nobody trusts.",
        "Small enough to self-host without operating a service.",
      ],
      paragraphs: [
        "Kanso (Japanese for simplicity). Import transactions, auto-categorize them, flag the ones that don't fit the pattern.",
        "The auto-categorization engine uses configurable rules. Statistical detection flags transactions outside mean + 2σ for their category.",
        "Spring Boot 3 and Thymeleaf for server-rendered pages, with transaction data encrypted at rest using AES-256-GCM. Deployed via Docker with CI/CD on Render.",
      ],
      decisions: [
        {
          title: "Statistics, not a model",
          rationale:
            "Mean + 2σ per category is a rule you can check by hand. A trained classifier would have been more fashionable and less useful — you cannot act on an anomaly you cannot explain.",
        },
        {
          title: "Rules engine kept separate from detection",
          rationale:
            "Categorisation changes often; the statistical layer almost never does. Splitting them means adding a rule is a config change, not a regression risk.",
        },
        {
          title: "Server-rendered, not a SPA",
          rationale:
            "The whole app is forms and tables over your own data. Thymeleaf keeps the deployment a single container and removes an entire client-side state problem.",
        },
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
    stack: ["Laravel", "PHP", "MongoDB", "Docker"],
    url: "https://github.com/saiuttejr/totallynotinsta",
    repoUrl: "https://github.com/saiuttejr/totallynotinsta",
    accent: "#43627c",
    year: "2025",
    status: "Open source",
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
      problem:
        "I had written plenty of features inside systems other people had designed. I wanted to find out what I did not know by owning every layer of one — schema, backend, deploy pipeline, and the 3am uptime problem.",
      constraints: [
        "Free-tier hosting that sleeps idle containers.",
        "A social graph is the classic case where a naive schema stops scaling early.",
        "No fallback environment — a bad deploy is the outage.",
      ],
      paragraphs: [
        "Full-stack social media app — posts, likes, comments, follows, feeds — with real-time interactions across 6+ MongoDB collections.",
        "Docker containers, CI/CD pipeline, zero-downtime releases on Render's free tier, 24/7 uptime via Uptime Robot health checks.",
        "Laravel backend, MongoDB data layer, full deployment pipeline.",
      ],
      decisions: [
        {
          title: "Model the social graph before writing a route",
          rationale:
            "Feeds, follows, and likes are where a naive schema falls apart. Getting the six collections and their access patterns right first meant the read paths never needed rescuing later.",
        },
        {
          title: "Zero-downtime releases on free-tier hosting",
          rationale:
            "The constraint was the point. Health checks and container swaps are cheap to add early and impossible to retrofit calmly during an outage.",
        },
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
      "Backend services in C# and .NET. Ingestion and reporting workflows, automated Azure processes that cut operational work by 90%+, and Azure DevOps CI/CD. Increasingly building with Copilot and MCP tooling as part of the day job rather than alongside it.",
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
  period: "2021 – 2025",
  note: "GPA 8.13/10 · GATE CSE 2024 — top 8% nationwide",
};

/** How I work. Three claims the projects on this site have to back up. */
export interface Principle {
  title: string;
  body: string;
}

export const principles: Principle[] = [
  {
    title: "The data model is the product",
    body: "Interfaces are cheap to change and schemas are not. On every project here the hard thinking happened in the data layer first, before a single screen existed.",
  },
  {
    title: "Explainable beats clever",
    body: "A threshold you can check by hand earns more trust than a model you cannot interrogate. I reach for the simplest mechanism that survives being questioned.",
  },
  {
    title: "Shipped and maintained, not shipped and abandoned",
    body: "Uptime checks, repeatable deploys, and encryption at rest are not polish. They are the difference between a demo and something a person can rely on.",
  },
];

export interface Certification {
  name: string;
  issuer: string;
  exam?: string;
  date: string;
  credentialId: string;
  verifyUrl: string;
}

export const certifications: Certification[] = [
  {
    name: "Azure AI Cloud Developer Associate",
    issuer: "Microsoft",
    exam: "AI-200",
    date: "July 2026",
    credentialId: "",
    verifyUrl: "https://learn.microsoft.com/en-us/users/saiuttejr/credentials",
  },
  {
    name: "Azure AI Apps and Agents Developer Associate",
    issuer: "Microsoft",
    exam: "AI-103",
    date: "June 2026",
    credentialId: "BDA9B87516BEDCFA",
    verifyUrl:
      "https://learn.microsoft.com/api/credentials/share/en-us/saiuttejr/BDA9B87516BEDCFA?sharingId=A94BE217925685CA",
  },
  {
    name: "AI Agent Builder Associate",
    issuer: "Microsoft",
    date: "June 2026",
    credentialId: "A7F5DDD0F36216BE",
    verifyUrl:
      "https://learn.microsoft.com/api/credentials/share/en-us/saiuttejr/A7F5DDD0F36216BE?sharingId=A94BE217925685CA",
  },
];

/** Compact credential strip on the home page. Certifications stay the long form. */
export interface Signal {
  value: string;
  label: string;
}

export const signals: Signal[] = [
  { value: "3", label: "Microsoft Azure AI certifications" },
  { value: "Top 8%", label: "GATE CSE 2024, nationwide" },
  { value: "550+", label: "data structures and algorithms problems solved" },
  { value: "C2", label: "EF SET English proficiency" },
];

export const socialLinks = {
  email: "saiuttej.r@gmail.com",
  linkedin: "https://linkedin.com/in/sai-uttej-r",
  github: "https://github.com/saiuttejr",
  lichess: "https://lichess.org/@/Haccnt",
  letterboxd: "https://letterboxd.com/contra156/",
  resume: "https://drive.google.com/file/d/1pUT97nHqqqfiRdWjdZq5edfEZPZA3wtG/view?usp=drive_link",
};

export const siteMetadata = {
  title: "Sai Uttej Rajoju — Software Engineer",
  description:
    "Software engineer working across backend systems and AI/agent tooling — and building useful things.",
  url: "https://saiuttej.com",
  ogImage: "/opengraph-image",
};
