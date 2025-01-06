import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Welcome to Interview Practice</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/hr-interview">
          <Button className="w-full h-32 text-xl">
            Start HR Interview
          </Button>
        </Link>
        <Link to="/another-feature">
          <Button className="w-full h-32 text-xl">
            Another Feature
          </Button>
        </Link>
        <Link to="/yet-another-feature">
          <Button className="w-full h-32 text-xl">
            Yet Another Feature
          </Button>
        </Link>
      </div>
    </div>
  );
}
