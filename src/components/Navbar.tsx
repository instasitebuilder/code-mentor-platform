import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi"; // Importing icons for dark and light mode

export function Navbar() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load the theme preference from localStorage on mount
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

  // Toggle dark mode
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

  return (
    <nav className="border-b bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
      <div className="container flex h-16 items-center px-4">
        <SidebarTrigger className="mr-4" />
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"
          >
            CodeVite
          </Button>
        </div>
      </div>
      
      {/* Dark mode toggle button */}
      <Button 
        variant="ghost" 
        onClick={toggleDarkMode} 
        className="absolute top-4 right-4 text-lg font-semibold text-gray-800 dark:text-white"
      >
        {isDarkMode ? (
          <FiSun className="w-6 h-6" /> // Sun icon for light mode
        ) : (
          <FiMoon className="w-6 h-6" /> // Moon icon for dark mode
        )}
      </Button>
    </nav>
  );
}
