export const SITE_PROFILE = {
  name: "Sai Uttej Rajoju",
  shortName: "Sai Uttej",
  role: "Software Engineer",
  summary:
    "Software Engineer at MAQ Software in Hyderabad. Building AI agents and web software — Eatensity, FigureTools, FinPulse AI, and Kanso.",
  location: "Hyderabad, India",
  links: {
    email: "mailto:saiuttej.r@gmail.com",
    emailAddress: "saiuttej.r@gmail.com",
    resume: "/Sai_Uttej_Rajoju_Resume.pdf",
    github: "https://github.com/saiuttejr",
    linkedin: "https://linkedin.com/in/sai-uttej-r",
    letterboxd: "https://letterboxd.com/contra156/",
    myanimelist: "https://myanimelist.net/profile/Contra156",
    goodreads: "https://www.goodreads.com/user/show/195818008",
  },
} as const;

export interface EditorialProject {
  id: "eatensity" | "figuretools" | "finpulse" | "kanso";
  numeral: string;
  title: string;
  year: string;
  line: string;
  stack: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  image?: string;
  liveIframe?: string;
  pullQuote: string;
}

export const PROJECTS: EditorialProject[] = [
  {
    id: "eatensity",
    numeral: "I",
    title: "Eatensity",
    year: "2026",
    line: "An Indian & global food-quality checker and natural-language meal logger.",
    stack: "Next.js · React Native · Hono · PostgreSQL · Gemini 2.0 Flash",
    primaryLabel: "eatensity.com ↗",
    primaryHref: "https://eatensity.com",
    secondaryLabel: "GitHub ↗",
    secondaryHref: "https://github.com/saiuttejr/Eatensity-source",
    image: "/images/eatensity-search.jpg",
    liveIframe: "https://eatensity.com",
    pullQuote: "Type “two idli and sambar” — graded A to E in seconds.",
  },
  {
    id: "figuretools",
    numeral: "II",
    title: "FigureTools",
    year: "2026",
    line: "Sixty-plus instant calculators for Indian finance, tax, health, and math.",
    stack: "TypeScript · Next.js · Tailwind · Playwright",
    primaryLabel: "figuretools.com ↗",
    primaryHref: "https://figuretools.com",
    secondaryLabel: "SIP Calculator ↗",
    secondaryHref: "https://figuretools.com/finance/sip-calculator/",
    image: "/images/figuretools-sip.jpg",
    pullQuote: "Zero sign-up walls — instant client-side breakdowns.",
  },
  {
    id: "finpulse",
    numeral: "III",
    title: "FinPulse AI",
    year: "2026",
    line: "A four-node LangGraph market agent fusing FAISS + BM25 retrieval with Black-Scholes Greeks.",
    stack: "Python · FastAPI · LangGraph · FAISS · NumPy · Docker",
    primaryLabel: "GitHub ↗",
    primaryHref: "https://github.com/saiuttejr/finpulse-agent",
    pullQuote: "Classify → Hybrid RRF Retrieval → Quant & Option Greeks → Cited synthesis.",
  },
  {
    id: "kanso",
    numeral: "IV",
    title: "Kanso",
    year: "2026",
    line: "An offline-first personal finance engine with spend-anomaly detection and AES-256-GCM backups.",
    stack: "Java 17 · Spring Boot 3 · JPA · OpenAPI · JUnit",
    primaryLabel: "GitHub ↗",
    primaryHref: "https://github.com/saiuttejr/kanso-note",
    pullQuote: "CSV statement import → Rule categorization → Mean + 2σ anomaly flag.",
  },
];

export const CREDENTIALS = [
  {
    code: "AI-103",
    title: "Azure AI Apps & Agents Developer",
    href: "https://learn.microsoft.com/en-us/users/saiuttejr/credentials/bda9b87516bedcfa",
  },
  {
    code: "AI-200",
    title: "Azure AI Cloud Developer",
    href: "https://learn.microsoft.com/en-us/users/saiuttejr/credentials/c9f0e29f5b053ff1",
  },
  {
    code: "AB-620",
    title: "AI Agent Builder Associate",
    href: "https://learn.microsoft.com/en-us/users/saiuttejr/credentials/a7f5ddd0f36216be",
  },
] as const;
