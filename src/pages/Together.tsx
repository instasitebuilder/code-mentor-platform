import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StepProgress } from "@/components/StepProgress";
import { SolutionForm } from "@/components/SolutionForm";
import { FeedbackDisplay } from "@/components/FeedbackDisplay";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Together() {
  const { sessionCode } = useParams();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [approach, setApproach] = useState("");
  const [testCases, setTestCases] = useState("");
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState<any>(null);

  const steps = [
    {
      title: "Review Question",
      description: "Understand the problem and example",
      completed: currentStep > 0,
      current: currentStep === 0,
    },
    {
      title: "Solution Approach",
      description: "Explain your solution strategy",
      completed: currentStep > 1,
      current: currentStep === 1,
    },
    {
      title: "Test Cases",
      description: "Write test cases for validation",
      completed: currentStep > 2,
      current: currentStep === 2,
    },
    {
      title: "Implementation",
      description: "Write your solution code",
      completed: currentStep > 3,
      current: currentStep === 3,
    },
    {
      title: "Complexity Analysis",
      description: "Specify time and space complexity",
      completed: currentStep > 4,
      current: currentStep === 4,
    },
  ];

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const { data: sessions, error } = await supabase
          .from("peer_sessions")
          .select("*")
          .eq("session_code", sessionCode)
          .single();

        if (error) throw error;
        setSessionDetails(sessions);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to fetch session details",
          variant: "destructive",
        });
      }
    };

    if (sessionCode) {
      fetchSessionDetails();
    }
  }, [sessionCode]);

  const handleNext = async () => {
    if (currentStep === 4) {
      // Final submission
      try {
        const { data, error } = await supabase.functions.invoke("evaluate-submission", {
          body: {
            approach,
            testCases,
            code,
            questionId: sessionDetails?.questions[currentQuestionIndex],
          },
        });

        if (error) throw error;

        setFeedback(data);
        toast({
          title: "Submission evaluated",
          description: "Your solution has been evaluated successfully",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to evaluate submission",
          variant: "destructive",
        });
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  if (!sessionDetails) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="p-6">
            <p>Loading session details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="grid gap-6 lg:grid-cols-[1fr,300px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Practice Session: {sessionDetails.session_code}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                {sessionDetails.questions.map((_, index: number) => (
                  <Button
                    key={index}
                    variant={currentQuestionIndex === index ? "default" : "outline"}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    Question {index + 1}
                  </Button>
                ))}
              </div>

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

              {feedback && <FeedbackDisplay feedback={feedback} />}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <StepProgress steps={steps} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}