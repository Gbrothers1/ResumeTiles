import { GraduationCap, Award, BookOpen } from "lucide-react";

interface Education {
  degree: string;
  institution: string;
  year: string;
  details: string;
  coursework?: string[];
}

interface Certification {
  name: string;
  issuer: string;
  year: string;
  credentialId?: string;
}

interface EducationSectionProps {
  data: Education[];
  certifications: Certification[];
}

export function EducationSection({ data, certifications }: EducationSectionProps) {
  return (
    <div className="space-y-6">
      {/* Education */}
      {data.slice(0, 1).map((item, index) => (
        <div key={index} className="bg-white/70 backdrop-blur-sm rounded-ios p-6 border border-white/20">
          <div className="flex items-start mb-4">
            <div className="w-12 h-12 bg-ios-blue rounded-full flex items-center justify-center mr-4">
              <GraduationCap className="text-white h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-ios-black mb-1">{item.degree}</h3>
              <p className="text-ios-blue font-semibold">{item.institution}</p>
              <span className="text-sm text-ios-subtle bg-ios-gray px-3 py-1 rounded-full mt-2 inline-block">
                {item.year}
              </span>
            </div>
          </div>
          <p className="text-ios-subtle mb-4 leading-relaxed">
            {item.details}
          </p>
          {item.coursework && (
            <div>
              <h4 className="font-semibold text-ios-black mb-2 flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-ios-green" />
                Key Coursework
              </h4>
              <div className="flex flex-wrap gap-2">
                {item.coursework.slice(0, 4).map((course, courseIndex) => (
                  <span 
                    key={courseIndex}
                    className="text-xs bg-ios-blue/20 text-ios-blue px-3 py-1 rounded-full font-medium"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Certifications */}
      <div className="bg-gradient-to-br from-ios-green/20 to-ios-blue/20 backdrop-blur-sm rounded-ios p-6 border border-white/20">
        <h3 className="font-semibold text-ios-black mb-4 flex items-center justify-center">
          <Award className="text-ios-green mr-2 h-5 w-5" />
          Professional Certifications
        </h3>
        <div className="space-y-3">
          {certifications.slice(0, 3).map((cert, index) => (
            <div key={index} className="flex items-center justify-between bg-white/50 rounded-md p-3">
              <div className="flex-1">
                <div className="font-medium text-ios-black text-sm">{cert.name}</div>
                <div className="text-xs text-ios-subtle">{cert.issuer}</div>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                index % 2 === 0 ? "bg-ios-green text-white" : "bg-ios-blue text-white"
              }`}>
                {cert.year}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Education Stats */}
      <div className="bg-white/70 backdrop-blur-sm rounded-ios p-6 border border-white/20">
        <h3 className="font-semibold text-ios-black mb-3 text-center">Academic Achievements</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-ios-blue mb-1">{data.length}</div>
            <div className="text-sm text-ios-subtle">Degrees</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-ios-green mb-1">{certifications.length}</div>
            <div className="text-sm text-ios-subtle">Certifications</div>
          </div>
        </div>
      </div>
    </div>
  );
}