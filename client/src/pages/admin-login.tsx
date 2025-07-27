import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { loginSchema, type LoginData } from "@shared/schema";
import { Lock, Shield, User } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      return apiRequest(`/api/auth/${isRegistering ? 'register' : 'login'}`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: isRegistering ? "Registration Successful" : "Login Successful",
        description: "Welcome to the admin dashboard!",
      });
      onLoginSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Authentication Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-ios-gray/20 to-white flex items-center justify-center p-5">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-ios">
        <CardHeader className="text-center pb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-ios-blue to-ios-green rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-white h-10 w-10" />
          </div>
          <CardTitle className="text-2xl font-bold text-ios-black">
            Admin Access
          </CardTitle>
          <CardDescription className="text-ios-subtle">
            {isRegistering 
              ? "Create your admin account to manage your resume"
              : "Login to access your resume management dashboard"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-ios-black font-medium">Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ios-subtle h-5 w-5" />
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your username"
                          className="pl-10 h-12 rounded-ios border-ios-gray/30 focus:border-ios-blue focus:ring-ios-blue"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-ios-black font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ios-subtle h-5 w-5" />
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10 h-12 rounded-ios border-ios-gray/30 focus:border-ios-blue focus:ring-ios-blue"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full h-12 bg-gradient-to-r from-ios-blue to-ios-green hover:from-ios-blue/90 hover:to-ios-green/90 text-white font-semibold rounded-ios shadow-lg transition-all duration-200 active:scale-95"
              >
                {loginMutation.isPending 
                  ? "Processing..." 
                  : isRegistering 
                    ? "Create Admin Account" 
                    : "Login to Dashboard"
                }
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-ios-blue hover:text-ios-blue/80 hover:bg-ios-blue/10 rounded-ios"
            >
              {isRegistering 
                ? "Already have an account? Login" 
                : "Need to create an admin account? Register"
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}