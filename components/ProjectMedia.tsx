import Image from "next/image";
import type { Project } from "@/lib/constants";
import ProjectCover from "@/components/ProjectCover";

interface ProjectMediaProps {
  project: Project;
  index: number;
  /** Drives the responsive `sizes` hint — featured cards are much wider. */
  variant: "featured" | "grid";
  className?: string;
}

/**
 * Renders a real screenshot when one exists and falls back to the generative
 * cover until it does, so the layout is identical either way.
 */
export default function ProjectMedia({
  project,
  index,
  variant,
  className = "",
}: ProjectMediaProps) {
  if (!project.cover) {
    return <ProjectCover project={project} index={index} />;
  }

  return (
    <div className={`project-media ${className}`}>
      <Image
        src={project.cover.src}
        alt={project.cover.alt}
        width={project.cover.width}
        height={project.cover.height}
        sizes={
          variant === "featured"
            ? "(max-width: 1024px) 100vw, 60vw"
            : "(max-width: 768px) 100vw, 45vw"
        }
        className="project-media__img"
        priority={variant === "featured" && index === 0}
      />
    </div>
  );
}
