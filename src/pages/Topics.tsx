import { Shield, Check, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { TopicProgress } from "@/components/TopicProgress";

const topics = [
  {
    id: 1,
    title: "Arrays",
    description: "Learn about arrays and basic operations",
    totalQuestions: 5,
    completedQuestions: 0,
    unlocked: true,
    achievement: "Array Master",
  },
  {
    id: 2,
    title: "Linked Lists",
    description: "Understanding linked lists and their operations",
    totalQuestions: 5,
    completedQuestions: 0,
    unlocked: false,
    achievement: "List Navigator",
  },
  {
    id: 3,
    title: "Trees",
    description: "Explore tree data structures",
    totalQuestions: 5,
    completedQuestions: 0,
    unlocked: false,
    achievement: "Tree Explorer",
  },
];

export default function Topics() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleTopicClick = (topic: typeof topics[0]) => {
    if (!topic.unlocked) {
      toast({
        title: "Topic Locked",
        description: "Complete the previous topic to unlock this one!",
        variant: "destructive",
      });
      return;
    }
    navigate(`/topic/${topic.id}`);
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Data Structures Learning Path</h1>
        <p className="text-muted-foreground">
          Master data structures step by step. Complete each topic to unlock the next one.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <Card
            key={topic.id}
            className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg ${
              topic.unlocked ? "opacity-100" : "opacity-70"
            }`}
            onClick={() => handleTopicClick(topic)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {topic.title}
                  {topic.unlocked ? (
                    topic.completedQuestions === topic.totalQuestions ? (
                      <Shield className="h-5 w-5 text-success" />
                    ) : (
                      <Check className="h-5 w-5 text-primary" />
                    )
                  ) : (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  )}
                </CardTitle>
                <Badge variant={topic.unlocked ? "default" : "secondary"}>
                  {topic.completedQuestions}/{topic.totalQuestions}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{topic.description}</p>
              <TopicProgress
                completed={topic.completedQuestions}
                total={topic.totalQuestions}
              />
              {topic.completedQuestions === topic.totalQuestions && (
                <Badge className="bg-success/10 text-success">
                  Achievement: {topic.achievement}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}