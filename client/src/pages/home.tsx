import { useState, useEffect } from "react";
import { MobileHeader } from "@/components/MobileHeader";
import { NavigationTabs } from "@/components/NavigationTabs";
import { SummarySection } from "@/components/SummarySection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SkillsSection } from "@/components/SkillsSection";
import { EducationSection } from "@/components/EducationSection";
import { ContactSection } from "@/components/ContactSection";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import resumeData from "@/data/resume.json";

export type TabType = "summary" | "experience" | "projects" | "skills" | "education" | "contact";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("summary");

  const handleQuickContact = () => {
    window.open(`mailto:${resumeData.contact.email}`, "_blank");
  };

  const renderActiveSection = () => {
    switch (activeTab) {
      case "summary":
        return <SummarySection data={resumeData} />;
      case "experience":
        return <ExperienceSection data={resumeData.experience} />;
      case "projects":
        return <ProjectsSection data={resumeData.projects} />;
      case "skills":
        return <SkillsSection data={resumeData.skills} />;
      case "education":
        return <EducationSection data={resumeData.education} certifications={resumeData.certifications} />;
      case "contact":
        return <ContactSection data={resumeData.contact} />;
      default:
        return <SummarySection data={resumeData} />;
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <MobileHeader personalInfo={resumeData.personalInfo} />
      <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="pb-20">
        {renderActiveSection()}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-5 z-50">
        <Button
          onClick={handleQuickContact}
          className="w-14 h-14 bg-ios-green hover:bg-ios-green/90 text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
          size="icon"
        >
          <Phone className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
