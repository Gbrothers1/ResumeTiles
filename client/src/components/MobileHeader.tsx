import { Button } from "@/components/ui/button";
import { Mail, User } from "lucide-react";

interface PersonalInfo {
  name: string;
  title: string;
  email: string;
}

interface MobileHeaderProps {
  personalInfo: PersonalInfo;
}

export function MobileHeader({ personalInfo }: MobileHeaderProps) {
  const handleContactClick = () => {
    window.open(`mailto:${personalInfo.email}`, "_blank");
  };

  return (
    <header className="bg-white border-b border-ios-gray sticky top-0 z-50">
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-ios-gray rounded-full flex items-center justify-center">
              <User className="text-ios-subtle text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-ios-black">{personalInfo.name}</h1>
              <p className="text-sm text-ios-subtle">{personalInfo.title}</p>
            </div>
          </div>
          <Button
            onClick={handleContactClick}
            className="w-10 h-10 bg-ios-blue hover:bg-ios-blue/90 text-white rounded-full"
            size="icon"
          >
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
