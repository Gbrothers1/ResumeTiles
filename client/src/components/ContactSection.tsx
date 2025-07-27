import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Github, MapPin, ExternalLink, Download, Phone, MessageCircle } from "lucide-react";

interface Contact {
  email: string;
  linkedin: string;
  github: string;
  location: string;
  phone?: string;
  website?: string;
}

interface ContactSectionProps {
  data: Contact;
}

export function ContactSection({ data }: ContactSectionProps) {
  const handleDownloadResume = () => {
    window.print();
  };

  const contactMethods = [
    {
      icon: Mail,
      label: "Email",
      value: data.email,
      action: () => window.open(`mailto:${data.email}`, "_blank"),
      color: "bg-ios-blue",
      priority: "primary"
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "Professional Network",
      action: () => window.open(data.linkedin, "_blank"),
      color: "bg-blue-600",
      priority: "secondary"
    },
    {
      icon: Github,
      label: "GitHub",
      value: "Code Portfolio",
      action: () => window.open(data.github, "_blank"),
      color: "bg-gray-900",
      priority: "secondary"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Contact Actions */}
      <div className="bg-gradient-to-br from-ios-blue/20 to-ios-green/20 backdrop-blur-sm rounded-ios p-6 border border-white/20">
        <h3 className="font-semibold text-ios-black mb-4 flex items-center justify-center">
          <MessageCircle className="text-ios-blue mr-2 h-5 w-5" />
          Let's Connect
        </h3>
        <div className="space-y-3">
          {contactMethods.map((method, index) => (
            <button 
              key={index}
              onClick={method.action}
              className="w-full bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-md p-4 border border-white/20 active:scale-95 transition-all duration-200"
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 ${method.color} rounded-full flex items-center justify-center mr-4`}>
                  <method.icon className="text-white h-4 w-4" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-ios-black">{method.label}</p>
                  <p className="text-sm text-ios-subtle">{method.value}</p>
                </div>
                <ExternalLink className="text-ios-subtle h-4 w-4" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Location Info */}
      <div className="bg-white/70 backdrop-blur-sm rounded-ios p-6 border border-white/20">
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 bg-ios-green rounded-full flex items-center justify-center mr-4">
            <MapPin className="text-white h-5 w-5" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-ios-black">Location</p>
            <p className="text-ios-subtle">{data.location}</p>
          </div>
        </div>
      </div>

      {/* Download Resume */}
      <div className="bg-white/70 backdrop-blur-sm rounded-ios p-6 border border-white/20">
        <Button
          onClick={handleDownloadResume}
          className="w-full bg-gradient-to-r from-ios-blue to-ios-green hover:from-ios-blue/90 hover:to-ios-green/90 text-white py-4 rounded-ios font-semibold shadow-lg active:scale-95 transition-all duration-200"
        >
          <Download className="mr-2 h-5 w-5" />
          Download Resume PDF
        </Button>
      </div>

      {/* Contact Stats */}
      <div className="bg-gradient-to-br from-ios-green/10 to-ios-blue/10 backdrop-blur-sm rounded-ios p-6 border border-white/20">
        <h3 className="font-semibold text-ios-black mb-3 text-center">Response Time</h3>
        <div className="text-center">
          <div className="text-3xl font-bold text-ios-green mb-1">24h</div>
          <div className="text-sm text-ios-subtle">Average Response</div>
        </div>
      </div>
    </div>
  );
}