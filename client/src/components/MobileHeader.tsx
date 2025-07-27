import { Button } from "@/components/ui/button";
import { Mail, User } from "lucide-react";

interface PersonalInfo {
  name: string;
  title: string;
  email: string;
}

interface MobileHeaderProps {
  personalInfo: PersonalInfo;
  isTransparent?: boolean;
}

export function MobileHeader({ personalInfo, isTransparent = false }: MobileHeaderProps) {
  const handleContactClick = () => {
    window.open(`mailto:${personalInfo.email}`, "_blank");
  };

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
      isTransparent ? 'bg-white/80' : 'bg-white'
    } border-b border-ios-gray/30`}>
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-ios-blue to-ios-green rounded-full flex items-center justify-center shadow-lg">
              <User className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-ios-black">{personalInfo.name}</h1>
              <p className="text-sm text-ios-subtle">{personalInfo.title}</p>
            </div>
          </div>
          <Button
            onClick={handleContactClick}
            className="w-10 h-10 bg-ios-blue hover:bg-ios-blue/90 text-white rounded-full shadow-lg active:scale-95 transition-transform"
            size="icon"
          >
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}