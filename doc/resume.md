# Sai Uttej Rajoju

**Software Engineer**  
Hyderabad, India · [saiuttej.r@gmail.com](mailto:saiuttej.r@gmail.com) · [LinkedIn](https://linkedin.com/in/sai-uttej-r) · [GitHub](https://github.com/saiuttejr) · [saiuttej.com](https://saiuttej.com)

> Canonical printable PDF served by the site: [`/Sai_Uttej_Rajoju_Resume.pdf`](../public/Sai_Uttej_Rajoju_Resume.pdf)

---

## Summary

AI and Software Engineer with 2 years of experience at MAQ Software, part of the development team behind a live enterprise AI support agent (500+ daily active users). Works with Python RAG (FAISS, BM25), MCP tooling, and Azure AI Foundry; built FinPulse AI (FastAPI, LangGraph), Eatensity, FigureTools, and Kanso.

---

## Experience

### MAQ Software — Hyderabad, India

**Software Engineer I** · Sept 2025 – Present

- Part of the development team running a live enterprise AI support agent on Azure AI Foundry and Azure OpenAI (`gpt-4.1`, `gpt-4o`) with 500+ daily active users; added OpenTelemetry tracing.
- Prototyped Python RAG and ticket classification over 27,000+ tickets (`sentence-transformers` on ONNX Runtime, FAISS and BM25 fused with Reciprocal Rank Fusion, 9 MCP tools), reaching 93.8% L1 category match on a 210-case regression set.
- Delivered backend changes for the agent: fail-closed role entitlement with caller-bound citations, HMAC-hashed interaction logging, and a flag-gated Agent Framework router with concurrent retrieval and fallbacks.
- Built GitHub Copilot PR-review automation and custom MCP agents for the wider developer team (30% less review effort), plus a FastMCP agent-management server and an LLM-as-judge evaluation harness.
- Contributed to a C#/.NET event-driven integration service on Azure (Durable Functions, Event Grid, Service Bus, APIM), mostly in Function Apps; the team cut provisioning from 2 hours to 5 minutes.

**Associate Software Engineer** · Aug 2024 – Aug 2025

- Helped build the proof of concept and initial working prototype of a client team's finance web app (expense capture, cost calculation, role-based approvals), fixed 15+ defects found in user acceptance testing, and handed it to another team for further development.
- Refactored legacy C# handlers and JavaScript front-end modules and consolidated redundant API calls for faster page loads.

---

## Selected Projects

### [Eatensity](https://eatensity.com) · [GitHub](https://github.com/saiuttejr/Eatensity-source)
*TypeScript, Next.js 15, React Native, Hono, Gemini 2.0 Flash, PostgreSQL*

- Nutrition and food-quality app with a rule-based and Gemini 2.0 Flash natural-language meal parser (structured JSON outputs, OWASP LLM01 prompt-injection guards) and intent-classified search (`tsvector`, `pg_trgm`) over 3,070+ foods, backed by 375 Vitest tests across a 7-package monorepo.

### [FigureTools](https://figuretools.com)
*TypeScript, Next.js, Tailwind CSS, Playwright*

- Suite of 60+ instant, zero-signup calculators for Indian finance, tax, health, and everyday math (`SIP`, `EMI`, `Income Tax`, `HRA`, `BMI`), verified across browsers with Playwright.

### [FinPulse AI Agent](https://github.com/saiuttejr/finpulse-agent)
*Python, FastAPI, LangChain, LangGraph, FAISS, Pandas, NumPy, Streamlit, Docker*

- Containerized FastAPI and 4-node LangGraph agent service combining hybrid RAG (FAISS cosine search, BM25 Reciprocal Rank Fusion, prompt-injection guards) with Pandas/NumPy indicator and Black-Scholes option Greeks tools, OAuth2/JWT auth, a Streamlit evaluation UI, and pytest suites.

### [Kanso](https://github.com/saiuttejr/kanso-note)
*Java 17, Spring Boot 3, Spring Data JPA, H2, OpenAPI, JUnit*

- Offline-first personal finance tracker with a Spring Boot REST API (OpenAPI) for CSV statement import, rule-based categorization, and mean + 2σ spending-anomaly detection, with AES-256-GCM encrypted backups and JUnit integration tests.

---

## Education

### CVR College of Engineering, JNTUH — Hyderabad, India
**B.Tech in Computer Science & Engineering** · GPA: 8.23 / 10

---

## Certifications & Achievements

- **Microsoft Certified: Azure AI Apps and Agents Developer Associate (`AI-103`)** — [Verify](https://learn.microsoft.com/en-us/users/saiuttejr/credentials/bda9b87516bedcfa)
- **Microsoft Certified: Azure AI Cloud Developer Associate (`AI-200`)** — [Verify](https://learn.microsoft.com/en-us/users/saiuttejr/credentials/c9f0e29f5b053ff1)
- **Microsoft Certified: AI Agent Builder Associate (`AB-620`)** — [Verify](https://learn.microsoft.com/en-us/users/saiuttejr/credentials/a7f5ddd0f36216be)
- Qualified **GATE CSE 2024**
- Solved 550+ DSA problems across LeetCode, CodeChef, and Codeforces
- **EF SET Certificate, C2 Proficient (CEFR)** — [Verify](https://drive.google.com/file/d/1GZ8q5wGys2Sd3fDd1SMhrbllcC4b2Btc/view?usp=sharing)
