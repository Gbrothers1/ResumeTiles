// Desktop fallback navigation component (used when swipeable tiles are not active)
import { TabType } from "@/pages/home";

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  const tabs: { id: TabType; label: string }[] = [
    { id: "summary", label: "Summary" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "education", label: "Education" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-ios-gray/30 sticky top-16 z-40">
      <div className="overflow-x-auto">
        <div className="flex px-5 space-x-6 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "text-ios-blue border-b-2 border-ios-blue"
                  : "text-ios-subtle hover:text-ios-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}