import { Card, CardContent } from "@/components/ui/card";
import { User, Target, TrendingUp, Code } from "lucide-react";

interface SummaryData {
  personalInfo: any;
  summary: any;
  currentFocus: any;
  stats: any;
}

interface SummarySectionProps {
  data: SummaryData;
}

export function SummarySection({ data }: SummarySectionProps) {
  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/50 backdrop-blur-sm rounded-ios p-4 text-center border border-white/20">
          <div className="text-3xl font-bold text-ios-blue mb-1">{data.stats.experience}</div>
          <div className="text-sm text-ios-subtle">Years Experience</div>
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-ios p-4 text-center border border-white/20">
          <div className="text-3xl font-bold text-ios-green mb-1">{data.stats.projects}</div>
          <div className="text-sm text-ios-subtle">Projects Built</div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="bg-white/70 backdrop-blur-sm rounded-ios p-6 border border-white/20">
        <h3 className="text-lg font-semibold mb-3 flex items-center text-ios-black">
          <User className="text-ios-blue mr-2 h-5 w-5" />
          About Me
        </h3>
        <p className="text-ios-black leading-relaxed mb-4">
          {data.summary.text}
        </p>
        
        {/* Key Highlights */}
        <div className="space-y-2">
          {data.summary.highlights.slice(0, 2).map((highlight: string, index: number) => (
            <div key={index} className="flex items-start text-sm">
              <TrendingUp className="text-ios-green mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
              <span className="text-ios-black">{highlight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Focus */}
      <div className="bg-gradient-to-br from-ios-blue/20 to-ios-green/20 backdrop-blur-sm rounded-ios p-6 border border-white/20">
        <h3 className="text-lg font-semibold mb-3 flex items-center text-ios-black">
          <Target className="text-ios-blue mr-2 h-5 w-5" />
          Current Focus
        </h3>
        <p className="text-ios-black leading-relaxed">
          {data.currentFocus.text}
        </p>
      </div>
    </div>
  );
}