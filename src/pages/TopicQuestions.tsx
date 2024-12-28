import { useParams } from "react-router-dom";
import { QuestionCard } from "@/components/QuestionCard";

const questionsData = {
  1: [ // Arrays
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy" as const,
      tags: ["Arrays", "Hash Table"],
    },
    {
      id: 2,
      title: "Maximum Subarray",
      difficulty: "Medium" as const,
      tags: ["Arrays", "Dynamic Programming"],
    },
  ],
  2: [ // Linked Lists
    {
      id: 3,
      title: "Reverse Linked List",
      difficulty: "Easy" as const,
      tags: ["Linked List"],
    },
  ],
  3: [ // Trees
    {
      id: 4,
      title: "Binary Tree Traversal",
      difficulty: "Medium" as const,
      tags: ["Tree", "DFS"],
    },
  ],
};

export default function TopicQuestions() {
  const { id } = useParams();
  const questions = questionsData[Number(id) as keyof typeof questionsData] || [];

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">Practice Questions</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {questions.map((question) => (
          <QuestionCard key={question.id} {...question} />
        ))}
      </div>
    </div>
  );
}