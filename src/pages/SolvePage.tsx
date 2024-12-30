import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { StepProgress } from "../components/StepProgress";
import { Navbar } from "../components/Navbar";
import { questions, practiceQuestions } from "../data/questions";
import { SolutionForm } from "../components/SolutionForm";

const steps = [
  {
    title: "Understand the Example",
    description: "Review the example and make sure you understand the problem",
  },
  {
    title: "Write Approach",
    description: "Explain your solution approach in plain words",
  },
  {
    title: "Add Test Cases",
    description: "Write additional test cases to validate your solution",
  },
  {
    title: "Implement Solution",
    description: "Write your code solution",
  },
  {
    title: "Submit",
    description: "Submit your solution for evaluation",
  },
];

export default function SolvePage() {
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [code, setCode] = useState("");
  const [approach, setApproach] = useState("");
  const [testCases, setTestCases] = useState("");
  
  const path = window.location.pathname.split('/')[1];
  const question = id ? questions[Number(id) as keyof typeof questions] : practiceQuestions[path as keyof typeof practiceQuestions];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(current => current + 1);
    }
  };

  if (!question) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Question not found</h2>
            <p>The requested question could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr,300px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{question.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert">
                  <p>{question.description}</p>
                  <h3>Example:</h3>
                  {question.examples.map((example, index) => (
                    <div key={index} className="space-y-2">
                      <p><strong>Input:</strong> {example.input}</p>
                      <p><strong>Output:</strong> {example.output}</p>
                      <p><strong>Explanation:</strong> {example.explanation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <SolutionForm
                  currentStep={currentStep}
                  onNext={handleNext}
                  approach={approach}
                  setApproach={setApproach}
                  testCases={testCases}
                  setTestCases={setTestCases}
                  code={code}
                  setCode={setCode}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <StepProgress
                  steps={steps.map((step, index) => ({
                    ...step,
                    completed: index < currentStep,
                    current: index === currentStep,
                  }))}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}