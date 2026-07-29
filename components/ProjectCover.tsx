import type { CSSProperties } from "react";
import type { Project } from "@/lib/constants";

interface ProjectCoverProps {
  project: Project;
  index: number;
}

export default function ProjectCover({ project, index }: ProjectCoverProps) {
  return (
    <div
      className="project-cover"
      style={{ "--cover": project.accent } as CSSProperties}
      aria-hidden="true"
    >
      <span className="project-cover__index">
        {String(index + 1).padStart(2, "0")} · {project.year}
      </span>
      <span className="project-cover__mark">{project.name.charAt(0)}</span>
    </div>
  );
}
