import { Card, CardContent } from "@/components/ui/card";
import { Code, Layers, Wrench, Star, Check } from "lucide-react";

interface Skill {
  name: string;
  level: number;
}

interface Skills {
  programming: Skill[];
  frameworks: string[];
  tools: string[];
  categories: {
    frontend: string[];
    backend: string[];
    tools: string[];
    soft: string[];
  };
}

interface SkillsSectionProps {
  data: Skills;
}

export function SkillsSection({ data }: SkillsSectionProps) {
  const renderStars = (level: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-3 w-3 ${
          index < level ? "text-ios-blue fill-current" : "text-ios-subtle"
        }`}
      />
    ));
  };

  return (
    <section className="px-5 py-6 space-y-5">
      <h2 className="text-xl font-bold text-ios-black flex items-center">
        <Code className="text-ios-blue mr-2 h-6 w-6" />
        Technical Skills
      </h2>

      {/* Programming Languages */}
      <Card className="bg-white border border-ios-gray rounded-ios shadow-sm">
        <CardContent className="p-5">
          <h3 className="font-semibold text-ios-black mb-3 flex items-center">
            <Code className="text-ios-blue mr-2 h-4 w-4" />
            Programming Languages
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {data.programming.map((skill, index) => (
              <div key={index} className="flex items-center justify-between bg-ios-gray rounded-md p-3">
                <span className="text-sm font-medium">{skill.name}</span>
                <div className="flex gap-1">
                  {renderStars(skill.level)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Frameworks & Libraries */}
      <Card className="bg-white border border-ios-gray rounded-ios shadow-sm">
        <CardContent className="p-5">
          <h3 className="font-semibold text-ios-black mb-3 flex items-center">
            <Layers className="text-ios-green mr-2 h-4 w-4" />
            Frameworks & Libraries
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.frameworks.map((framework, index) => (
              <span 
                key={index}
                className={`text-xs px-3 py-1 rounded-full text-white ${
                  index % 2 === 0 ? "bg-ios-blue" : "bg-ios-green"
                }`}
              >
                {framework}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tools & Technologies */}
      <Card className="bg-white border border-ios-gray rounded-ios shadow-sm">
        <CardContent className="p-5">
          <h3 className="font-semibold text-ios-black mb-3 flex items-center">
            <Wrench className="text-ios-subtle mr-2 h-4 w-4" />
            Tools & Technologies
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {data.tools.map((tool, index) => (
              <div key={index} className="flex items-center">
                <Check className="text-ios-green mr-2 h-3 w-3" />
                <span>{tool}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skill Categories */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-ios-blue/10 rounded-ios">
          <CardContent className="p-4">
            <h4 className="font-medium text-ios-blue mb-2">Frontend</h4>
            <div className="space-y-1">
              {data.categories.frontend.slice(0, 3).map((skill, index) => (
                <div key={index} className="text-xs text-ios-black">{skill}</div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-ios-green/10 rounded-ios">
          <CardContent className="p-4">
            <h4 className="font-medium text-ios-green mb-2">Backend</h4>
            <div className="space-y-1">
              {data.categories.backend.slice(0, 3).map((skill, index) => (
                <div key={index} className="text-xs text-ios-black">{skill}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
