import { useState } from "react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { CodeEditor } from "../components/CodeEditor";
import { useToast } from "../components/ui/use-toast";

interface SolutionFormProps {
  currentStep: number;
  onNext: () => void;
  approach: string;
  setApproach: (value: string) => void;
  testCases: string;
  setTestCases: (value: string) => void;
  code: string;
  setCode: (value: string) => void;
}

export function SolutionForm({
  currentStep,
  onNext,
  approach,
  setApproach,
  testCases,
  setTestCases,
  code,
  setCode,
}: SolutionFormProps) {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      {currentStep === 0 && (
        <div className="space-y-4">
          <p>Review the example above and make sure you understand the problem.</p>
          <Button onClick={onNext}>I understand</Button>
        </div>
      )}

      {currentStep === 1 && (
        <div className="space-y-4">
          <Textarea
            placeholder="Explain your approach to solving this problem..."
            value={approach}
            onChange={(e) => setApproach(e.target.value)}
          />
          <Button onClick={onNext}>Next</Button>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          <Textarea
            placeholder="Add your test cases here..."
            value={testCases}
            onChange={(e) => setTestCases(e.target.value)}
          />
          <Button onClick={onNext}>Next</Button>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-4">
          <CodeEditor
            value={code}
            onChange={(value) => setCode(value || "")}
          />
          <Button onClick={onNext}>Next</Button>
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
    </div>
  );
}