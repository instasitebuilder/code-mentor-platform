import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();

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
            CodePractice
          </Button>
        </div>
      </div>
    </nav>
  );
}