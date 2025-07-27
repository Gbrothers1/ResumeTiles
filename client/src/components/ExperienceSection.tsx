import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Check, Calendar, MapPin } from "lucide-react";

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
    <div className="space-y-6">
      {data.map((job, index) => (
        <div key={index} className="bg-white/70 backdrop-blur-sm rounded-ios p-6 border border-white/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-ios-black mb-1">{job.title}</h3>
              <p className="text-ios-blue font-semibold text-lg">{job.company}</p>
              
              <div className="flex items-center space-x-4 mt-2 text-sm text-ios-subtle">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {job.period}
                </div>
                {job.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Key Achievements */}
          <div className="mb-4">
            <h4 className="font-semibold text-ios-black mb-3 flex items-center">
              <Briefcase className="h-4 w-4 mr-2 text-ios-green" />
              Key Achievements
            </h4>
            <div className="space-y-2">
              {job.achievements.slice(0, 3).map((achievement, achievementIndex) => (
                <div key={achievementIndex} className="flex items-start">
                  <Check className="text-ios-green mr-2 mt-1 h-4 w-4 flex-shrink-0" />
                  <span className="text-sm text-ios-black leading-relaxed">{achievement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies */}
          {job.technologies && (
            <div className="flex flex-wrap gap-2">
              {job.technologies.slice(0, 6).map((tech, techIndex) => (
                <span 
                  key={techIndex}
                  className="text-xs bg-ios-blue/20 text-ios-blue px-3 py-1 rounded-full font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}