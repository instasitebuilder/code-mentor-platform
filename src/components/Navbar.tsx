import { Link } from "react-router-dom";
import { NavigationMenu, NavigationMenuItem } from "@/components/ui/navigation-menu";
import { Code, Home, Users, BookOpen, Settings } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

export function Navbar() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Link to="/" className="font-bold text-xl">
          CodePair
        </Link>

        <NavigationMenu className="mx-6">
          <NavigationMenuItem className="flex space-x-4">
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link to="/practice" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Practice
            </Link>
            <Link to="/together" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Together
            </Link>
            <Link to="/technical" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Technical Interview
            </Link>
          </NavigationMenuItem>
        </NavigationMenu>

        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata.avatar_url} alt={user.email} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}