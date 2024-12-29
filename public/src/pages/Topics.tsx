import { Shield, Check, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { TopicProgress } from "@/components/TopicProgress";

const topics = [
  { id: 1, title: "Arrays", description: "Learn about arrays and basic operations", totalQuestions: 5, completedQuestions: 0, unlocked: true, achievement: "Array Master" },
  { id: 2, title: "Linked Lists", description: "Understanding linked lists and their operations", totalQuestions: 5, completedQuestions: 0, unlocked: false, achievement: "List Navigator" },
  { id: 3, title: "Stacks", description: "Explore stacks and their applications", totalQuestions: 5, completedQuestions: 0, unlocked: false, achievement: "Stack Specialist" },
  { id: 4, title: "Queues", description: "Learn about queues and their operations", totalQuestions: 5, completedQuestions: 0, unlocked: false, achievement: "Queue Commander" },
  { id: 5, title: "Hashing", description: "Dive into hashing techniques", totalQuestions: 5, completedQuestions: 0, unlocked: false, achievement: "Hash Hero" },
  { id: 6, title: "Trees", description: "Explore tree data structures", totalQuestions: 5, completedQuestions: 0, unlocked: false, achievement: "Tree Explorer" },
  { id: 7, title: "Binary Search Trees", description: "Understand BST operations", totalQuestions: 5, completedQuestions: 0, unlocked: false, achievement: "BST Expert" },
  { id: 8, title: "Heaps", description: "Learn about heaps and priority queues", totalQuestions: 5, completedQuestions: 0, unlocked: false, achievement: "Heap Handler" },
  { id: 9, title: "Graphs", description: "Master graph algorithms", totalQuestions: 5, completedQuestions: 0, unlocked: false, achievement: "Graph Guru" },
  { id: 10, title: "Sorting Algorithms", description: "Understand and implement sorting techniques", totalQuestions: 5, completedQuestions: 0, unlocked: false, achievement: "Sorting Savant" },
  { id: 11, title: "Searching Algorithms", description: "Dive into searching techniques", totalQuestions: 5, completedQuestions: 0, unlocked: false, achievement: "Search Strategist" },
  { id: 12, title: "Dynamic Programming", description: "Learn dynamic programming concepts", totalQuestions: 5, completedQuestions: 0, unlocked: false, achievement: "DP Dynamo" },
  { id: 13, title: "Greedy Algorithms", description: "Explore greedy algorithm techniques", totalQuestions: 5, completedQuestions: 0, unlocked: false, achievement: "Greedy Genius" },
  { id: 14, title: "Backtracking", description: "Master backtracking methods", totalQuestions: 5, completedQuestions: 0, unlocked: false, achievement: "Backtracking Boss" },
  { id: 15, title: "Bit Manipulation", description: "Understand bitwise operations", totalQuestions: 5, completedQuestions: 0, unlocked: false, achievement: "Bitwise Brain" },
  { id: 16, title: "Trie", description: "Learn about trie data structure", totalQuestions: 5, completedQuestions: 0, unlocked: false, achievement: "Trie Technician" },
  { id: 17, title: "Segment Trees", description: "Explore segment trees and range queries", totalQuestions: 5, completedQuestions: 0, unlocked: false, achievement: "Segment Specialist" },
  { id: 18, title: "Fenwick Trees", description: "Learn about Fenwick trees", totalQuestions: 5, completedQuestions: 0, unlocked: false, achievement: "Fenwick Fanatic" },
  { id: 19, title: "Disjoint Sets", description: "Understand union-find algorithms", totalQuestions: 5, completedQuestions: 0, unlocked: false, achievement: "Disjoint Dynamo" },
  { id: 20, title: "Advanced Graph Algorithms", description: "Master advanced graph techniques", totalQuestions: 5, completedQuestions: 0, unlocked: false, achievement: "Graph God" },
];

export default function Topics() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleTopicClick = (topic) => {
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

  const getCardBackground = (index) => {
    const colors = [
      "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
      "bg-gradient-to-r from-green-400 to-blue-500",
      "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500",
      "bg-gradient-to-r from-teal-400 to-cyan-500",
      "bg-gradient-to-r from-indigo-500 to-purple-700",
    ];
    return colors[index % colors.length];
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
        {topics.map((topic, index) => (
          <Card
            key={topic.id}
            className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg ${
              topic.unlocked ? "opacity-100" : "opacity-70"
            } ${getCardBackground(index)}`}
            onClick={() => handleTopicClick(topic)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white">
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
            <CardContent className="space-y-4 text-white">
              <p>{topic.description}</p>
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