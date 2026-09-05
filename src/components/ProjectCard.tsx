import { Project } from "@/types";
import ProgressBar from "@/components/ProgressBar";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">
        {project.name}
      </h3>

      <p className="mt-2 text-sm text-gray-600">
        {project.description}
      </p>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Progress
          </span>

          <span className="text-sm font-medium text-gray-700">
            {project.progress}%
          </span>
        </div>

        <ProgressBar progress={project.progress} />
      </div>
    </div>
  );
}