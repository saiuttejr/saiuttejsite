import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/lib/constants";
import SiteHeader from "@/components/SiteHeader";
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
    <main id="main" className="site-stage min-h-screen bg-transparent">
      <SiteHeader label="Case study" />
      <ProjectDetailContent project={project} />
    </main>
  );
}
