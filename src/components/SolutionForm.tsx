import { useState } from "react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { CodeEditor } from "../components/CodeEditor";
import { useToast } from "../hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error("Authentication error. Please try logging in again.");
      }

      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to submit your solution.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const { data, error } = await supabase.functions.invoke('evaluate-submission', {
        body: {
          approach,
          testCases,
          code,
          timeComplexity: "O(n)", // You might want to make these dynamic
          spaceComplexity: "O(1)",
          questionId: "1", // This should come from props
          sessionId: "1", // This should come from props
          userId: session.user.id
        },
      });

      if (error) {
        console.error("Function invocation error:", error);
        throw new Error(error.message || "Failed to evaluate submission");
      }

      if (!data) {
        throw new Error("No response from evaluation service");
      }

      toast({
        title: "Success!",
        description: "Your solution has been submitted for evaluation.",
      });
    } catch (error) {
      console.error("Submission error:", error);
      
      // Handle specific error cases
      if (error instanceof Error && error.message.includes("refresh_token")) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      toast({
        title: "Something went wrong",
        description: error instanceof Error 
          ? error.message 
          : "An unexpected error occurred while submitting your solution. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Solution"}
          </Button>
        </div>
      )}
    </div>
  );
}