import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeEditor } from "@/components/CodeEditor";
import { StepProgress } from "@/components/StepProgress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const questions = {
  1: {
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers in nums such that they add up to target.
    
You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
    ],
  },
};

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
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [code, setCode] = useState("");
  const [approach, setApproach] = useState("");
  const [testCases, setTestCases] = useState("");
  
  const question = questions[Number(id) as keyof typeof questions];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(current => current + 1);
      toast({
        title: "Step completed!",
        description: "Moving to the next step...",
      });
    }
  };

  return (
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
              {currentStep === 0 && (
                <div className="space-y-4">
                  <p>Review the example above and make sure you understand the problem.</p>
                  <Button onClick={handleNext}>I understand</Button>
                </div>
              )}
              
              {currentStep === 1 && (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Explain your approach to solving this problem..."
                    value={approach}
                    onChange={(e) => setApproach(e.target.value)}
                  />
                  <Button onClick={handleNext}>Next</Button>
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Add your test cases here..."
                    value={testCases}
                    onChange={(e) => setTestCases(e.target.value)}
                  />
                  <Button onClick={handleNext}>Next</Button>
                </div>
              )}
              
              {currentStep === 3 && (
                <div className="space-y-4">
                  <CodeEditor
                    value={code}
                    onChange={(value) => setCode(value || "")}
                  />
                  <Button onClick={handleNext}>Next</Button>
                </div>
              )}
              
              {currentStep === 4 && (
                <div className="space-y-4">
                  <p>Review your solution before submitting:</p>
                  <div className="space-y-2">
                    <h4 className="font-medium">Your Approach:</h4>
                    <p className="text-sm">{approach}</p>
                    <h4 className="font-medium">Your Test Cases:</h4>
                    <p className="text-sm">{testCases}</p>
                    <h4 className="font-medium">Your Code:</h4>
                    <pre className="text-sm bg-muted p-4 rounded-md">{code}</pre>
                  </div>
                  <Button onClick={() => {
                    toast({
                      title: "Solution submitted!",
                      description: "Your solution has been submitted for evaluation.",
                    });
                  }}>
                    Submit Solution
                  </Button>
                </div>
              )}
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
  );
}