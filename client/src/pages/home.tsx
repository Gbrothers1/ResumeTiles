import { useState } from "react";
import { MobileHeader } from "@/components/MobileHeader";
import { NavigationTabs } from "@/components/NavigationTabs";
import { SwipeableTiles, TileSection } from "@/components/SwipeableTiles";
import { SummarySection } from "@/components/SummarySection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SkillsSection } from "@/components/SkillsSection";
import { EducationSection } from "@/components/EducationSection";
import { ContactSection } from "@/components/ContactSection";
import { useMobileDetection } from "@/hooks/use-mobile-detection";
import { useToast } from "@/hooks/use-toast";
import { User, Briefcase, Code, Layers, GraduationCap, Phone } from "lucide-react";
import resumeData from "@/data/resume.json";

export type TabType = "summary" | "experience" | "projects" | "skills" | "education" | "contact";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("summary");
  const { isMobile, deviceType } = useMobileDetection();
  const { toast } = useToast();

  // Handle reward unlock when user completes the tile journey
  const handleRewardUnlocked = () => {
    toast({
      title: "🎉 Journey Complete!",
      description: "You've explored everything! Ready to connect?",
      duration: 4000,
    });
  };

  // Define tile sections for the swipeable interface
  const tileSections: TileSection[] = [
    {
      id: "summary",
      title: "About Me",
      icon: User,
      description: "Professional summary and key stats",
      content: <SummarySection data={resumeData} />,
      color: "bg-gradient-to-br from-white/90 to-ios-blue/10",
      accentColor: "bg-ios-blue"
    },
    {
      id: "experience",
      title: "Experience",
      icon: Briefcase,
      description: "Work history and achievements",
      content: <ExperienceSection data={resumeData.experience} />,
      color: "bg-gradient-to-br from-white/90 to-ios-green/10",
      accentColor: "bg-ios-green"
    },
    {
      id: "projects",
      title: "Projects",
      icon: Code,
      description: "Featured work and portfolio",
      content: <ProjectsSection data={resumeData.projects} />,
      color: "bg-gradient-to-br from-white/90 to-purple-500/10",
      accentColor: "bg-purple-500"
    },
    {
      id: "skills",
      title: "Skills",
      icon: Layers,
      description: "Technical expertise and tools",
      content: <SkillsSection data={resumeData.skills} />,
      color: "bg-gradient-to-br from-white/90 to-orange-500/10",
      accentColor: "bg-orange-500"
    },
    {
      id: "education",
      title: "Education",
      icon: GraduationCap,
      description: "Academic background and certifications",
      content: <EducationSection data={resumeData.education} certifications={resumeData.certifications} />,
      color: "bg-gradient-to-br from-white/90 to-teal-500/10",
      accentColor: "bg-teal-500"
    },
    {
      id: "contact",
      title: "Contact",
      icon: Phone,
      description: "Get in touch and connect",
      content: <ContactSection data={resumeData.contact} />,
      color: "bg-gradient-to-br from-white/90 to-ios-green/10",
      accentColor: "bg-ios-green"
    }
  ];

  // Render traditional sections for desktop fallback
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

  // Use swipeable tiles for mobile, traditional navigation for desktop
  if (isMobile) {
    return (
      <div className="bg-gradient-to-br from-white via-ios-gray/10 to-white min-h-screen">
        <MobileHeader personalInfo={resumeData.personalInfo} isTransparent />
        <SwipeableTiles 
          sections={tileSections}
          onRewardUnlocked={handleRewardUnlocked}
          personalInfo={{ 
            name: resumeData.personalInfo.name, 
            email: resumeData.contact.email 
          }}
        />
      </div>
    );
  }

  // Desktop fallback with traditional navigation
  return (
    <div className="bg-white min-h-screen">
      <MobileHeader personalInfo={resumeData.personalInfo} />
      <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="px-5 py-6 pb-20">
        {renderActiveSection()}
      </main>
    </div>
  );
}
