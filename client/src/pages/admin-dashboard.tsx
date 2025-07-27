import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { gpgSettingsSchema, type GpgSettings } from "@shared/schema";
import { Settings, Key, Shield, LogOut, FileText, Cpu, Copy } from "lucide-react";
import { z } from "zod";
import resumeData from "@/data/resume.json";

interface AdminDashboardProps {
  onLogout: () => void;
}

// Schema for resume editing form
const resumeFormSchema = z.object({
  personalInfo: z.object({
    name: z.string().min(1, "Name is required"),
    title: z.string().min(1, "Title is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(1, "Phone is required"),
    location: z.string().min(1, "Location is required"),
  }),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  experience: z.string().min(10, "Experience must be at least 10 characters"),
  projects: z.string().min(10, "Projects must be at least 10 characters"),
  skills: z.string().min(10, "Skills must be at least 10 characters"),
  education: z.string().min(10, "Education must be at least 10 characters"),
  contact: z.string().min(10, "Contact info must be at least 10 characters"),
});

type ResumeFormData = z.infer<typeof resumeFormSchema>;

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("resume");
  const [newApiKeyName, setNewApiKeyName] = useState("");
  const [generatedApiKey, setGeneratedApiKey] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // GPG Settings Form
  const gpgForm = useForm<GpgSettings>({
    resolver: zodResolver(gpgSettingsSchema),
    defaultValues: {
      gpgPublicKey: "",
      gpgEnabled: false,
    },
  });

  // Resume Edit Form - Convert resume.json to form data
  const resumeForm = useForm<ResumeFormData>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      personalInfo: {
        name: resumeData.personalInfo.name,
        title: resumeData.personalInfo.title,
        email: resumeData.personalInfo.email,
        phone: resumeData.personalInfo.phone,
        location: resumeData.personalInfo.location,
      },
      summary: JSON.stringify(resumeData.summary, null, 2),
      experience: JSON.stringify(resumeData.experience, null, 2),
      projects: JSON.stringify(resumeData.projects, null, 2),
      skills: JSON.stringify(resumeData.skills, null, 2),
      education: JSON.stringify(resumeData.education, null, 2),
      contact: JSON.stringify(resumeData.contact, null, 2),
    },
  });

  // Fetch API keys
  const { data: apiKeys = [] } = useQuery({
    queryKey: ["/api/admin/api-keys"],
    enabled: !!user,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("/api/auth/logout", { method: "POST" }),
    onSuccess: () => {
      queryClient.clear();
      onLogout();
    },
  });

  // GPG settings mutation
  const gpgMutation = useMutation({
    mutationFn: (data: GpgSettings) =>
      apiRequest("/api/admin/gpg-settings", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({
        title: "GPG Settings Updated",
        description: "Your GPG configuration has been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Resume update mutation
  const resumeMutation = useMutation({
    mutationFn: (data: ResumeFormData) => {
      // Convert form data back to JSON structure
      const resumeData = {
        personalInfo: data.personalInfo,
        summary: JSON.parse(data.summary),
        experience: JSON.parse(data.experience),
        projects: JSON.parse(data.projects),
        skills: JSON.parse(data.skills),
        education: JSON.parse(data.education),
        contact: JSON.parse(data.contact),
      };
      
      return apiRequest("/api/admin/resume", {
        method: "PUT",
        body: JSON.stringify(resumeData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Resume Updated",
        description: "Your resume has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // API key creation mutation
  const createApiKeyMutation = useMutation({
    mutationFn: (keyName: string) =>
      apiRequest("/api/admin/api-keys", {
        method: "POST",
        body: JSON.stringify({ keyName }),
      }),
    onSuccess: (data: any) => {
      setGeneratedApiKey(data.apiKey);
      setNewApiKeyName("");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/api-keys"] });
      toast({
        title: "API Key Created",
        description: "Your new API key has been generated. Copy it now!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "API key copied to clipboard.",
    });
  };

  const onGpgSubmit = (data: GpgSettings) => {
    gpgMutation.mutate(data);
  };

  const onResumeSubmit = (data: ResumeFormData) => {
    try {
      // Validate JSON fields
      JSON.parse(data.summary);
      JSON.parse(data.experience);
      JSON.parse(data.projects);
      JSON.parse(data.skills);
      JSON.parse(data.education);
      JSON.parse(data.contact);
      
      resumeMutation.mutate(data);
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON formatting in the fields.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-ios-gray/20 to-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-ios-gray/30">
        <div className="max-w-7xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="text-ios-blue h-8 w-8 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-ios-black">Admin Dashboard</h1>
                <p className="text-sm text-ios-subtle">Welcome back, {(user as any)?.username || 'Admin'}</p>
              </div>
            </div>
            <Button
              onClick={() => logoutMutation.mutate()}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-5">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/50 rounded-ios">
            <TabsTrigger value="resume" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Resume Editor
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center">
              <Key className="h-4 w-4 mr-2" />
              API Keys
            </TabsTrigger>
          </TabsList>

          {/* Resume Editor Tab */}
          <TabsContent value="resume">
            <Card className="bg-white/95 backdrop-blur-md border-0 shadow-lg rounded-ios">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-ios-blue" />
                  Resume Content Editor
                </CardTitle>
                <CardDescription>
                  Edit your resume content. JSON fields allow for complex data structures.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...resumeForm}>
                  <form onSubmit={resumeForm.handleSubmit(onResumeSubmit)} className="space-y-6">
                    {/* Personal Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-ios-black">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={resumeForm.control}
                          name="personalInfo.name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} className="rounded-ios" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={resumeForm.control}
                          name="personalInfo.title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Professional Title</FormLabel>
                              <FormControl>
                                <Input {...field} className="rounded-ios" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={resumeForm.control}
                          name="personalInfo.email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" className="rounded-ios" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={resumeForm.control}
                          name="personalInfo.phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input {...field} className="rounded-ios" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* JSON Fields */}
                    {[
                      { name: "summary", label: "Summary" },
                      { name: "experience", label: "Experience" },
                      { name: "projects", label: "Projects" },
                      { name: "skills", label: "Skills" },
                      { name: "education", label: "Education" },
                      { name: "contact", label: "Contact" },
                    ].map((field) => (
                      <FormField
                        key={field.name}
                        control={resumeForm.control}
                        name={field.name as any}
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormLabel>{field.label} (JSON)</FormLabel>
                            <FormControl>
                              <Textarea
                                {...formField}
                                rows={8}
                                className="rounded-ios font-mono text-sm"
                                placeholder={`Enter ${field.label.toLowerCase()} data in JSON format...`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}

                    <Button
                      type="submit"
                      disabled={resumeMutation.isPending}
                      className="w-full bg-gradient-to-r from-ios-blue to-ios-green text-white rounded-ios"
                    >
                      {resumeMutation.isPending ? "Updating..." : "Update Resume"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="bg-white/95 backdrop-blur-md border-0 shadow-lg rounded-ios">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-ios-blue" />
                  GPG Security Settings
                </CardTitle>
                <CardDescription>
                  Configure GPG encryption for secure API access.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...gpgForm}>
                  <form onSubmit={gpgForm.handleSubmit(onGpgSubmit)} className="space-y-6">
                    <FormField
                      control={gpgForm.control}
                      name="gpgEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base font-medium">
                              Enable GPG Verification
                            </FormLabel>
                            <div className="text-sm text-ios-subtle">
                              Require GPG signatures for API requests
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={gpgForm.control}
                      name="gpgPublicKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GPG Public Key</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={10}
                              className="rounded-ios font-mono text-sm"
                              placeholder="-----BEGIN PGP PUBLIC KEY BLOCK-----&#10;&#10;Your GPG public key here...&#10;&#10;-----END PGP PUBLIC KEY BLOCK-----"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={gpgMutation.isPending}
                      className="w-full bg-gradient-to-r from-ios-blue to-ios-green text-white rounded-ios"
                    >
                      {gpgMutation.isPending ? "Updating..." : "Update GPG Settings"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api">
            <div className="space-y-6">
              {/* Create New API Key */}
              <Card className="bg-white/95 backdrop-blur-md border-0 shadow-lg rounded-ios">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="h-5 w-5 mr-2 text-ios-blue" />
                    Create New API Key
                  </CardTitle>
                  <CardDescription>
                    Generate secure API keys for programmatic access.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <Input
                      placeholder="API key name (e.g., 'Mobile App', 'CI/CD')"
                      value={newApiKeyName}
                      onChange={(e) => setNewApiKeyName(e.target.value)}
                      className="rounded-ios"
                    />
                    <Button
                      onClick={() => createApiKeyMutation.mutate(newApiKeyName)}
                      disabled={!newApiKeyName || createApiKeyMutation.isPending}
                      className="bg-ios-blue hover:bg-ios-blue/90 rounded-ios"
                    >
                      Generate
                    </Button>
                  </div>

                  {generatedApiKey && (
                    <div className="p-4 bg-ios-green/10 border border-ios-green/30 rounded-ios">
                      <p className="text-sm font-medium text-ios-green mb-2">
                        New API Key Generated - Copy it now!
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 p-2 bg-white rounded text-sm font-mono break-all">
                          {generatedApiKey}
                        </code>
                        <Button
                          size="sm"
                          onClick={() => copyToClipboard(generatedApiKey)}
                          className="shrink-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-ios-subtle mt-2">
                        This key will only be shown once. Save it securely!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Existing API Keys */}
              <Card className="bg-white/95 backdrop-blur-md border-0 shadow-lg rounded-ios">
                <CardHeader>
                  <CardTitle>Your API Keys</CardTitle>
                  <CardDescription>
                    Manage your existing API keys and their status.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(!apiKeys || (apiKeys as any[]).length === 0) ? (
                    <p className="text-ios-subtle text-center py-8">
                      No API keys created yet. Generate one above to get started.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {(apiKeys as any[]).map((key: any) => (
                        <div
                          key={key.id}
                          className="flex items-center justify-between p-4 border border-ios-gray/30 rounded-ios"
                        >
                          <div>
                            <h4 className="font-medium text-ios-black">{key.keyName}</h4>
                            <p className="text-sm text-ios-subtle">
                              Created: {new Date(key.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={key.isActive ? "default" : "secondary"}>
                              {key.isActive ? "Active" : "Inactive"}
                            </Badge>
                            {key.isActive && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  // TODO: Implement deactivation
                                }}
                              >
                                Deactivate
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}