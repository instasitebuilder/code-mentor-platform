import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeEditor } from "@/components/CodeEditor";
import { StepProgress } from "@/components/StepProgress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from "@/components/Navbar";

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

const practiceQuestions = {
  "self-practice": {
    title: "Array Manipulation",
    description: "Write a function that takes an array of integers and returns the sum of all positive numbers.",
    examples: [
      {
        input: "[1, -4, 7, 12]",
        output: "20",
        explanation: "1 + 7 + 12 = 20",
      },
    ],
  },
  "peer-practice": {
    title: "String Reversal",
    description: "Write a function that reverses a string without using built-in reverse methods.",
    examples: [
      {
        input: '"hello"',
        output: '"olleh"',
        explanation: "Characters are reversed",
      },
    ],
  },
  "mentor-practice": {
    title: "Binary Search",
    description: "Implement binary search algorithm to find a target number in a sorted array.",
    examples: [
      {
        input: "array = [1,2,3,4,5], target = 3",
        output: "2",
        explanation: "Index of target number 3 is 2",
      },
    ],
  },
  "org-practice": {
    title: "Palindrome Check",
    description: "Write a function that checks if a given string is a palindrome.",
    examples: [
      {
        input: '"racecar"',
        output: "true",
        explanation: "Reads the same forwards and backwards",
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
  
  // Get the current path to determine which practice mode we're in
  const path = window.location.pathname.split('/')[1];
  
  // Get the appropriate question based on whether we're accessing via ID or practice mode
  const question = id ? questions[Number(id) as keyof typeof questions] : practiceQuestions[path as keyof typeof practiceQuestions];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(current => current + 1);
      toast({
        title: "Step completed!",
        description: "Moving to the next step...",
      });
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
    </div>
  );
}