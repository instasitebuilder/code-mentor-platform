import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiSun, FiMoon, FiUser } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    if (savedMode === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="border-b bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
      <div className="container flex h-16 items-center px-4 justify-between">
        <div className="flex items-center">
          <SidebarTrigger className="mr-4" />
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"
          >
            CodeVite
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={toggleDarkMode} 
            className="text-lg font-semibold text-gray-800 dark:text-white"
          >
            {isDarkMode ? (
              <FiSun className="w-6 h-6" />
            ) : (
              <FiMoon className="w-6 h-6" />
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <FiUser className="w-5 h-5" />
                  <span>{profile?.name || user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}