import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { AIInterviewer } from "@/components/AIInterviewer";
import { InterviewQuestionCard } from "@/components/InterviewQuestionCard";
import { supabase } from "@/integrations/supabase/client";

export default function HRInterviewSession() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [responses, setResponses] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchQuestions();
  }, [user, navigate]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("hr_questions")
        .select("question_text")
        .limit(5);

      if (error) throw error;

      setQuestions(data.map((q) => q.question_text));
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast({
        title: "Error",
        description: "Failed to load interview questions",
        variant: "destructive",
      });
    }
  };

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setResponses([...responses, transcription]);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTranscription("");
    }
  };

  const handleSubmit = async () => {
    try {
      const finalResponses = [...responses, transcription];
      
      const { error } = await supabase.from("interview_responses").insert({
        user_id: user?.id,
        responses: finalResponses,
        session_type: "HR",
        completed_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Interview responses submitted successfully",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting responses:", error);
      toast({
        title: "Error",
        description: "Failed to submit interview responses",
        variant: "destructive",
      });
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">HR Interview Session</h1>
        <button
          onClick={signOut}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          End Session
        </button>
      </div>

      <AIInterviewer
        question={currentQuestion}
        onQuestionRead={() => console.log("Question read")}
      />

      <InterviewQuestionCard
        questions={questions}
        currentQuestion={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        transcription={transcription}
        isRecording={isRecording}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onSubmit={() => {
          handleSubmit();
          console.log("Submitting interview responses");
        }}
        onNextQuestion={handleNextQuestion}
      />
    </div>
  );
}