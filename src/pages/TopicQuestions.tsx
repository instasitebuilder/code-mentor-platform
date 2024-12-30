import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

interface Question {
  id: number;
  title: string;
  difficulty: string;
  tags: string[];
}

interface TopicData {
  topicName: string;
  questions: Question[];
}

export default function TopicQuestions() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState<TopicData>({ topicName: '', questions: [] });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/questionsData.json");
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setTopic(data[1] || { topicName: "Algorithms", questions: [] });
      } catch (error) {
        console.error("Failed to load questions:", error);
        // Set default data if fetch fails
        setTopic({
          topicName: "Algorithms",
          questions: [
            {
              id: 1,
              title: "Two Sum",
              difficulty: "Easy",
              tags: ["Arrays", "Hash Table"]
            }
          ]
        });
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">Practice Questions</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-bold">{topic.topicName}</h2>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topic.questions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell>{question.title}</TableCell>
                  <TableCell>
                    <Badge variant={
                      question.difficulty === 'Easy' ? 'default' :
                      question.difficulty === 'Medium' ? 'secondary' : 'destructive'
                    }>
                      {question.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {question.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => navigate(`/solve/${question.id}`)}
                    >
                      Solve Challenge
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}