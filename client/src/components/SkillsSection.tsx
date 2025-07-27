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
    robotics: string[];
    networking: string[];
    embedded: string[];
    infrastructure: string[];
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
      <div className="bg-ios-gray rounded-ios p-6 border border-gray-300">
        <h3 className="font-semibold text-ios-black mb-4 flex items-center justify-center">
          <Code className="text-ios-blue mr-2 h-5 w-5" />
          Top Programming Skills
        </h3>
        <div className="space-y-3">
          {topSkills.map((skill, index) => (
            <div key={index} className="flex items-center justify-between bg-white rounded-md p-3 border border-gray-200">
              <span className="font-medium text-ios-black">{skill.name}</span>
              <div className="flex gap-1">
                {renderStars(skill.level)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frameworks & Libraries */}
      <div className="bg-white rounded-ios p-6 border border-gray-300">
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
        <div className="bg-blue-50 rounded-ios p-4 border border-blue-200">
          <h4 className="font-semibold text-ios-blue mb-3 text-center">Robotics</h4>
          <div className="space-y-2">
            {data.categories.robotics.slice(0, 4).map((skill, index) => (
              <div key={index} className="text-xs text-ios-black text-center bg-white rounded-md py-1 border border-gray-200">
                {skill}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-green-50 rounded-ios p-4 border border-green-200">
          <h4 className="font-semibold text-ios-green mb-3 text-center">Networking</h4>
          <div className="space-y-2">
            {data.categories.networking.slice(0, 4).map((skill, index) => (
              <div key={index} className="text-xs text-ios-black text-center bg-white rounded-md py-1 border border-gray-200">
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Additional Skill Categories */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-orange-50 rounded-ios p-4 border border-orange-200">
          <h4 className="font-semibold text-orange-600 mb-3 text-center">Embedded</h4>
          <div className="space-y-2">
            {data.categories.embedded.slice(0, 4).map((skill, index) => (
              <div key={index} className="text-xs text-ios-black text-center bg-white rounded-md py-1 border border-gray-200">
                {skill}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-ios p-4 border border-purple-200">
          <h4 className="font-semibold text-purple-600 mb-3 text-center">Infrastructure</h4>
          <div className="space-y-2">
            {data.categories.infrastructure.slice(0, 4).map((skill, index) => (
              <div key={index} className="text-xs text-ios-black text-center bg-white rounded-md py-1 border border-gray-200">
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tools Summary */}
      <div className="bg-white rounded-ios p-6 border border-gray-300">
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