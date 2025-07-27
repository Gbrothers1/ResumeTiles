import { Code, Layers, Wrench, Star } from "lucide-react";

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

  const topSkills = data.programming.filter(skill => skill.level >= 4).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Top Skills Highlight */}
      <div className="bg-gradient-to-br from-ios-blue/20 to-ios-green/20 backdrop-blur-sm rounded-ios p-6 border border-white/20">
        <h3 className="font-semibold text-ios-black mb-4 flex items-center justify-center">
          <Code className="text-ios-blue mr-2 h-5 w-5" />
          Top Programming Skills
        </h3>
        <div className="space-y-3">
          {topSkills.map((skill, index) => (
            <div key={index} className="flex items-center justify-between bg-white/50 rounded-md p-3">
              <span className="font-medium text-ios-black">{skill.name}</span>
              <div className="flex gap-1">
                {renderStars(skill.level)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frameworks & Libraries */}
      <div className="bg-white/70 backdrop-blur-sm rounded-ios p-6 border border-white/20">
        <h3 className="font-semibold text-ios-black mb-4 flex items-center">
          <Layers className="text-ios-green mr-2 h-5 w-5" />
          Frameworks & Libraries
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.frameworks.slice(0, 8).map((framework, index) => (
            <span 
              key={index}
              className={`text-xs px-3 py-2 rounded-full font-medium ${
                index % 3 === 0 ? "bg-ios-blue text-white" : 
                index % 3 === 1 ? "bg-ios-green text-white" : 
                "bg-ios-gray text-ios-black"
              }`}
            >
              {framework}
            </span>
          ))}
        </div>
      </div>

      {/* Skill Categories Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-ios-blue/10 backdrop-blur-sm rounded-ios p-4 border border-white/20">
          <h4 className="font-semibold text-ios-blue mb-3 text-center">Frontend</h4>
          <div className="space-y-2">
            {data.categories.frontend.slice(0, 4).map((skill, index) => (
              <div key={index} className="text-xs text-ios-black text-center bg-white/50 rounded-md py-1">
                {skill}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-ios-green/10 backdrop-blur-sm rounded-ios p-4 border border-white/20">
          <h4 className="font-semibold text-ios-green mb-3 text-center">Backend</h4>
          <div className="space-y-2">
            {data.categories.backend.slice(0, 4).map((skill, index) => (
              <div key={index} className="text-xs text-ios-black text-center bg-white/50 rounded-md py-1">
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tools Summary */}
      <div className="bg-white/70 backdrop-blur-sm rounded-ios p-6 border border-white/20">
        <h3 className="font-semibold text-ios-black mb-3 flex items-center justify-center">
          <Wrench className="text-ios-subtle mr-2 h-5 w-5" />
          Development Tools
        </h3>
        <div className="text-center">
          <div className="text-2xl font-bold text-ios-blue mb-1">{data.tools.length}+</div>
          <div className="text-sm text-ios-subtle">Professional Tools</div>
        </div>
      </div>
    </div>
  );
}