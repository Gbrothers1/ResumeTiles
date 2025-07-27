import { Card, CardContent } from "@/components/ui/card";
import { User, Target } from "lucide-react";

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
    <section className="px-5 py-6 space-y-5">
      {/* Quick Stats Tiles */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-ios-gray rounded-ios p-4 text-center">
          <div className="text-2xl font-bold text-ios-blue">{data.stats.experience}</div>
          <div className="text-sm text-ios-subtle">Years Experience</div>
        </div>
        <div className="bg-ios-gray rounded-ios p-4 text-center">
          <div className="text-2xl font-bold text-ios-green">{data.stats.projects}</div>
          <div className="text-sm text-ios-subtle">Projects Built</div>
        </div>
      </div>

      {/* Professional Summary Card */}
      <Card className="bg-white border border-ios-gray rounded-ios shadow-sm">
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <User className="text-ios-blue mr-2 h-5 w-5" />
            Professional Summary
          </h2>
          <p className="text-ios-black leading-relaxed">
            {data.summary.text}
          </p>
        </CardContent>
      </Card>

      {/* Current Focus Card */}
      <Card className="bg-gradient-to-r from-ios-blue/10 to-ios-green/10 rounded-ios">
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Target className="text-ios-blue mr-2 h-5 w-5" />
            Current Focus
          </h3>
          <p className="text-ios-black">
            {data.currentFocus.text}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
