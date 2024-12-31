import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StepProgress } from "@/components/StepProgress";
import { SolutionForm } from "@/components/SolutionForm";
import { FeedbackDisplay } from "@/components/FeedbackDisplay";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { practiceQuestions } from "@/data/questions";

export default function Together() {
  const { sessionCode } = useParams();
  const { user } = useAuth();
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
      if (!sessionCode) return;

      try {
        const { data: session, error } = await supabase
          .from("peer_sessions")
          .select(`
            *,
            peer_groups (
              name,
              members
            )
          `)
          .eq('session_code', sessionCode)
          .single();

        if (error) throw error;
        setSessionDetails(session);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to fetch session details",
          variant: "destructive",
        });
      }
    };

    fetchSessionDetails();
  }, [sessionCode]);

  const handleNext = async () => {
    if (currentStep === 4) {
      try {
        const { data, error } = await supabase.functions.invoke("evaluate-submission", {
          body: {
            approach,
            testCases,
            code,
            questionId: sessionDetails?.questions[currentQuestionIndex],
            sessionId: sessionDetails?.id,
            userId: user?.id,
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

  const currentQuestion = practiceQuestions["peer-practice"];

  return (
    <div className="container py-8">
      <div className="grid gap-6 lg:grid-cols-[1fr,300px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Session: {sessionDetails.session_code}</span>
                <span className="text-sm text-muted-foreground">
                  {user?.email}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{currentQuestion.title}</h3>
                  <p className="text-muted-foreground">{currentQuestion.description}</p>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Examples:</h4>
                    {currentQuestion.examples.map((example, index) => (
                      <div key={index} className="bg-muted p-4 rounded-md mb-4">
                        <p><strong>Input:</strong> {example.input}</p>
                        <p><strong>Output:</strong> {example.output}</p>
                        {example.explanation && (
                          <p><strong>Explanation:</strong> {example.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>
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
              </div>
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
          <Card>
            <CardHeader>
              <CardTitle>Session Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Date:</strong> {new Date(sessionDetails.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {sessionDetails.start_time} - {sessionDetails.end_time}</p>
              <p><strong>Group:</strong> {sessionDetails.peer_groups?.name}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}