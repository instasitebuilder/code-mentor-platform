import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface InterviewQuestionCardProps {
  questions: string[];
  transcription: string;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSubmit: () => void;
}

export function InterviewQuestionCard({
  questions,
  transcription,
  isRecording,
  onStartRecording,
  onStopRecording,
  onSubmit,
}: InterviewQuestionCardProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasReadQuestion, setHasReadQuestion] = useState(false);
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [timer, setTimer] = useState(60);
  const [userResponse, setUserResponse] = useState<string[]>([]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  useEffect(() => {
    const readQuestion = async () => {
      if (!currentQuestion || hasReadQuestion) return;

      try {
        const ELEVEN_LABS_API_KEY = import.meta.env.VITE_ELEVEN_LABS_API_KEY;
        if (!ELEVEN_LABS_API_KEY) {
          throw new Error("Eleven Labs API key is not configured");
        }

        const response = await fetch(
          "https://api.elevenlabs.io/v1/text-to-speech/9BWtsMINqrJLrRacOk9x/stream",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "xi-api-key": ELEVEN_LABS_API_KEY,
            },
            body: JSON.stringify({
              text: currentQuestion,
              model_id: "eleven_multilingual_v2",
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to generate speech");
        }

        const blob = await response.blob();
        const audio = new Audio(URL.createObjectURL(blob));

        setIsSpeaking(true);
        audio.onended = () => {
          setIsSpeaking(false);
          setHasReadQuestion(true);
          setIsPromptVisible(true);
        };

        await audio.play();
      } catch (error) {
        console.error("Error reading question:", error);
      }
    };

    if (!hasReadQuestion) {
      readQuestion();
    }
  }, [currentQuestion, hasReadQuestion]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (timer > 0 && isPromptVisible) {
        setTimer((prevTimer) => prevTimer - 1);
      } else if (timer === 0) {
        clearInterval(timerInterval);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timer, isPromptVisible]);

  useEffect(() => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const speechToText = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      const updatedResponses = [...userResponse];
      updatedResponses[currentQuestionIndex] = speechToText;
      setUserResponse(updatedResponses);
    };

    recognition.onend = () => {
      onStopRecording();
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error: ", event);
    };

    if (isPromptVisible) {
      recognition.start();
    }

    return () => {
      recognition.abort();
    };
  }, [isPromptVisible, currentQuestionIndex, userResponse, onStopRecording]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setHasReadQuestion(false);
      setIsPromptVisible(false);
      setTimer(60);
    }
  };

  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="flex flex-col items-center space-y-8">
      <Card className="p-6 space-y-4 bg-gradient-to-r from-gray-800 to-gray-900 border-purple-500 w-full max-w-3xl">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </h2>
          <Progress
            value={((currentQuestionIndex + 1) / totalQuestions) * 100}
            className="w-full bg-gray-700"
          />
        </div>

        <p className="text-lg text-white">{currentQuestion}</p>

        {isPromptVisible && (
          <>
            <label className="text-md text-white">Your Response:</label>
            <Textarea
              value={userResponse[currentQuestionIndex] || ""}
              readOnly
              className="w-full mt-2 bg-gray-700 text-white border-purple-500 rounded-lg"
              rows={4}
            />
          </>
        )}

        <div className="flex justify-end">
          {isLastQuestion ? (
            <Button
              onClick={onSubmit}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
            >
              Submit
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              disabled={!userResponse[currentQuestionIndex]}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
            >
              Next Question
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
