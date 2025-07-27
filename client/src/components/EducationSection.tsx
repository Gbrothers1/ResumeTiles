import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Award } from "lucide-react";

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
    <section className="px-5 py-6 space-y-5">
      <h2 className="text-xl font-bold text-ios-black flex items-center">
        <GraduationCap className="text-ios-blue mr-2 h-6 w-6" />
        Education & Certifications
      </h2>

      {/* Education */}
      {data.map((item, index) => (
        <Card key={index} className="bg-white border border-ios-gray rounded-ios shadow-sm">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-ios-black">{item.degree}</h3>
                <p className="text-ios-blue font-medium">{item.institution}</p>
              </div>
              <span className="text-sm text-ios-subtle bg-ios-gray px-2 py-1 rounded-md">
                {item.year}
              </span>
            </div>
            <p className="text-sm text-ios-subtle mb-3">
              {item.details}
            </p>
            {item.coursework && (
              <div className="flex flex-wrap gap-2">
                {item.coursework.map((course, courseIndex) => (
                  <span 
                    key={courseIndex}
                    className="text-xs bg-ios-gray text-ios-black px-2 py-1 rounded-md"
                  >
                    {course}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Certifications */}
      <Card className="bg-white border border-ios-gray rounded-ios shadow-sm">
        <CardContent className="p-5">
          <h3 className="font-semibold text-ios-black mb-3 flex items-center">
            <Award className="text-ios-green mr-2 h-4 w-4" />
            Professional Certifications
          </h3>
          <div className="space-y-3">
            {certifications.map((cert, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm text-ios-black font-medium">{cert.name}</div>
                  <div className="text-xs text-ios-subtle">{cert.issuer}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-md ${
                  index % 2 === 0 ? "bg-ios-green text-white" : "bg-ios-blue text-white"
                }`}>
                  {cert.year}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
