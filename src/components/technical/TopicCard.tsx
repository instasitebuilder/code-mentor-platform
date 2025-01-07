import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopicCardProps {
  topic: {
    id: string;
    title: string;
    description: string | null;
  };
  onClick: () => void;
}

export function TopicCard({ topic, onClick }: TopicCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle>{topic.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {topic.description || 'Practice technical interview questions on this topic'}
        </p>
      </CardContent>
    </Card>
  );
}