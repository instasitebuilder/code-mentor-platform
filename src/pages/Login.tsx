import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Login Failed",
            description: "Please check your email and password and try again.",
            variant: "destructive",
          });
        } else if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Email Not Verified",
            description: "Please check your email and verify your account before logging in.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      if (user) {
        toast({
          title: "Success!",
          description: "You have successfully logged in.",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;

      toast({
        title: "Verification Email Sent",
        description: "Please check your email for the verification link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="flex-1 container flex items-center justify-center py-12">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to login
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="button"
                variant="link"
                className="px-0 text-sm"
                onClick={handleResendVerification}
              >
                Resend verification email
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/signup")}
              >
                Don't have an account? Sign up
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}