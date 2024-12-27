import { QuestionCard } from "@/components/QuestionCard";

const questions = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Arrays", "Hash Table"],
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["Stack", "String"],
  },
  {
    id: 3,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    tags: ["Linked List", "Recursion"],
  },
  {
    id: 4,
    title: "Maximum Subarray",
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming"],
  },
  {
    id: 5,
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    tags: ["Tree", "BFS"],
  },
] as const;

export default function Index() {
  return (
    <div className="container py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Coding Practice</h1>
          <p className="text-muted-foreground mt-2">
            Solve coding challenges to improve your skills
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {questions.map((question) => (
            <QuestionCard key={question.id} {...question} />
          ))}
        </div>
      </div>
    </div>
  );
}