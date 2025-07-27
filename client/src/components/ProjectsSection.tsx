import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Github, ExternalLink } from "lucide-react";

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
  const featuredProjects = data.filter(project => project.featured);

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
    <section className="px-5 py-6 space-y-5">
      <h2 className="text-xl font-bold text-ios-black flex items-center">
        <Code className="text-ios-blue mr-2 h-6 w-6" />
        Featured Projects
      </h2>

      {/* GitHub Integration Card - Featured Project */}
      {featuredProjects.length > 0 && featuredProjects[0].name === "Digital Resume Terminal" && (
        <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-ios">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center">
                <Github className="mr-2 h-5 w-5" />
                {featuredProjects[0].name}
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="text-xs bg-white/20 border-white/20 text-white hover:bg-white/30"
                onClick={() => window.open(featuredProjects[0].githubUrl, "_blank")}
              >
                View Code
              </Button>
            </div>
            <p className="text-sm text-gray-300 mb-3">
              {featuredProjects[0].description}
            </p>
            <div className="flex flex-wrap gap-2">
              {featuredProjects[0].technologies.map((tech, index) => (
                <span 
                  key={index}
                  className="text-xs bg-white/20 px-2 py-1 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Other Projects */}
      {featuredProjects.slice(1).map((project, index) => (
        <Card key={index} className="bg-white border border-ios-gray rounded-ios shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-ios-black">{project.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-md ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
            <p className="text-sm text-ios-subtle mb-3">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech, techIndex) => (
                <span 
                  key={techIndex}
                  className="text-xs bg-ios-gray text-ios-black px-2 py-1 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              {project.githubUrl && project.githubUrl !== "#" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => window.open(project.githubUrl, "_blank")}
                >
                  <Github className="mr-1 h-3 w-3" />
                  Code
                </Button>
              )}
              {project.liveUrl && project.liveUrl !== "#" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => window.open(project.liveUrl, "_blank")}
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Live Demo
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
