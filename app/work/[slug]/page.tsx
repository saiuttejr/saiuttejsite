import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { projects } from "@/lib/constants";
import ProjectDetailContent from "./ProjectDetailContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: project.name,
    description: project.summary,
    alternates: {
      canonical: `/work/${project.slug}`,
    },
    openGraph: {
      title: `${project.name} | Sai Uttej Rajoju`,
      description: project.summary,
      url: `/work/${project.slug}`,
      type: "article",
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="site-stage min-h-screen bg-transparent">
      <nav className="fixed top-0 left-0 right-0 z-40 px-4 pt-4 md:px-8 lg:px-12">
        <div className="editorial-shell">
          <div className="nav-pill nav-pill--glass flex items-center justify-between gap-4 px-4 py-3.5 md:px-5 md:py-4">
            <Link
              href="/"
              className="flex min-w-0 flex-col items-start text-text transition-colors duration-300 hover:text-accent"
              data-cursor-hover
              data-cursor-label="home"
            >
              <span className="font-logo whitespace-nowrap text-[1.05rem] tracking-[0.22em] md:text-[1.14rem]">
                SAI UTTEJ R
              </span>
              <span className="hidden font-mono text-[10px] tracking-[0.12em] text-text-dim md:block">
                project dossier
              </span>
            </Link>

            <Link
              href="/"
              className="button-secondary min-h-0 whitespace-nowrap px-3 py-2 md:px-4"
              data-cursor-hover
              data-cursor-label="back"
            >
              All work
            </Link>
          </div>
        </div>
      </nav>

      <ProjectDetailContent project={project} />
    </main>
  );
}
