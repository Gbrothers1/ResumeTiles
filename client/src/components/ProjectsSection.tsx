import { Button } from "@/components/ui/button";
import { Code, Github, ExternalLink, Star } from "lucide-react";

interface Project {
  name: string;
  description: string;
  status: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

interface ProjectsSectionProps {
  data: Project[];
}

export function ProjectsSection({ data }: ProjectsSectionProps) {
  const featuredProjects = data.filter(project => project.featured).slice(0, 2);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-ios-green text-white";
      case "in progress":
        return "bg-ios-blue text-white";
      default:
        return "bg-ios-gray text-ios-black";
    }
  };

  return (
    <div className="space-y-6">
      {featuredProjects.map((project, index) => (
        <div key={index} className="bg-white/70 backdrop-blur-sm rounded-ios p-6 border border-white/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Star className="text-ios-blue h-5 w-5 mr-2" />
                <h3 className="text-xl font-bold text-ios-black">{project.name}</h3>
              </div>
              <p className="text-ios-subtle mb-3 leading-relaxed">
                {project.description}
              </p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>

          {/* Technologies */}
          <div className="mb-4">
            <h4 className="font-semibold text-ios-black mb-2 flex items-center">
              <Code className="h-4 w-4 mr-2 text-ios-green" />
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, techIndex) => (
                <span 
                  key={techIndex}
                  className="text-xs bg-gradient-to-r from-ios-blue/20 to-ios-green/20 text-ios-black px-3 py-1 rounded-full font-medium border border-white/30"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {project.githubUrl && project.githubUrl !== "#" && (
              <Button
                onClick={() => window.open(project.githubUrl, "_blank")}
                variant="outline"
                size="sm"
                className="flex items-center bg-white/50 hover:bg-white/70 border-ios-gray"
              >
                <Github className="mr-2 h-4 w-4" />
                View Code
              </Button>
            )}
            {project.liveUrl && project.liveUrl !== "#" && (
              <Button
                onClick={() => window.open(project.liveUrl, "_blank")}
                variant="outline"
                size="sm"
                className="flex items-center bg-ios-blue/10 hover:bg-ios-blue/20 text-ios-blue border-ios-blue/30"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Live Demo
              </Button>
            )}
          </div>
        </div>
      ))}

      {/* Quick Stats */}
      <div className="bg-gradient-to-br from-ios-blue/20 to-ios-green/20 backdrop-blur-sm rounded-ios p-6 border border-white/20">
        <h3 className="font-semibold text-ios-black mb-3 text-center">Project Portfolio</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-ios-blue mb-1">{data.length}</div>
            <div className="text-sm text-ios-subtle">Total Projects</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-ios-green mb-1">{featuredProjects.length}</div>
            <div className="text-sm text-ios-subtle">Featured</div>
          </div>
        </div>
      </div>
    </div>
  );
}