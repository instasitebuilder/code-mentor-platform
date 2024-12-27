import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/")}>
            CodePractice
          </Button>
        </div>
      </div>
    </nav>
  );
}