import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Check } from "lucide-react";

interface Experience {
  title: string;
  company: string;
  period: string;
  location?: string;
  achievements: string[];
  technologies?: string[];
}

interface ExperienceSectionProps {
  data: Experience[];
}

export function ExperienceSection({ data }: ExperienceSectionProps) {
  return (
    <section className="px-5 py-6 space-y-5">
      <h2 className="text-xl font-bold text-ios-black flex items-center">
        <Briefcase className="text-ios-blue mr-2 h-6 w-6" />
        Work Experience
      </h2>

      {data.map((job, index) => (
        <Card key={index} className="bg-white border border-ios-gray rounded-ios shadow-sm">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-ios-black">{job.title}</h3>
                <p className="text-ios-blue font-medium">{job.company}</p>
                {job.location && (
                  <p className="text-xs text-ios-subtle">{job.location}</p>
                )}
              </div>
              <span className="text-sm text-ios-subtle bg-ios-gray px-2 py-1 rounded-md">
                {job.period}
              </span>
            </div>
            
            <ul className="space-y-2 mb-4">
              {job.achievements.map((achievement, achievementIndex) => (
                <li key={achievementIndex} className="flex items-start">
                  <Check className="text-ios-green mr-2 mt-1 h-3 w-3 flex-shrink-0" />
                  <span className="text-sm text-ios-black">{achievement}</span>
                </li>
              ))}
            </ul>

            {job.technologies && (
              <div className="flex flex-wrap gap-2">
                {job.technologies.map((tech, techIndex) => (
                  <span 
                    key={techIndex}
                    className="text-xs bg-ios-blue/10 text-ios-blue px-2 py-1 rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
