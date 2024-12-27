import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PracticeModeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  route: string;
}

export function PracticeModeCard({ title, description, icon: Icon, route }: PracticeModeCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <Icon className="h-8 w-8 mb-2" />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => navigate(route)}>
          Start Practice
        </Button>
      </CardFooter>
    </Card>
  );
}