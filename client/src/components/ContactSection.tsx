import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Github, MapPin, ExternalLink, Download, Phone, ChevronRight } from "lucide-react";

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
    // In a real implementation, this would trigger a PDF download
    window.print();
  };

  const contactItems = [
    {
      icon: Mail,
      label: "Email",
      value: data.email,
      action: () => window.open(`mailto:${data.email}`, "_blank"),
      color: "bg-ios-blue",
      showChevron: true,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "Connect with me",
      action: () => window.open(data.linkedin, "_blank"),
      color: "bg-blue-600",
      showExternal: true,
    },
    {
      icon: Github,
      label: "GitHub",
      value: "View my projects",
      action: () => window.open(data.github, "_blank"),
      color: "bg-gray-900",
      showExternal: true,
    },
  ];

  return (
    <section className="px-5 py-6 space-y-5">
      <h2 className="text-xl font-bold text-ios-black flex items-center">
        <Phone className="text-ios-blue mr-2 h-6 w-6" />
        Get In Touch
      </h2>

      {/* Contact Cards */}
      <div className="space-y-3">
        {contactItems.map((item, index) => (
          <Card 
            key={index}
            className="bg-white border border-ios-gray rounded-ios shadow-sm cursor-pointer active:bg-ios-gray transition-colors"
            onClick={item.action}
          >
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center mr-3`}>
                  <item.icon className="text-white h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-ios-black">{item.label}</p>
                  <p className="text-sm text-ios-subtle">{item.value}</p>
                </div>
                {item.showChevron && <ChevronRight className="text-ios-subtle h-4 w-4" />}
                {item.showExternal && <ExternalLink className="text-ios-subtle h-3 w-3" />}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Location Card */}
        <Card className="bg-white border border-ios-gray rounded-ios shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-ios-green rounded-full flex items-center justify-center mr-3">
                <MapPin className="text-white h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-ios-black">Location</p>
                <p className="text-sm text-ios-subtle">{data.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Download Resume */}
      <Button
        onClick={handleDownloadResume}
        className="w-full bg-ios-blue hover:bg-ios-blue/90 text-white py-4 rounded-ios font-medium active:scale-95 transition-transform"
      >
        <Download className="mr-2 h-4 w-4" />
        Download Resume PDF
      </Button>
    </section>
  );
}
