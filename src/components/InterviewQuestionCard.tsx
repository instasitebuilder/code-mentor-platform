import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface InterviewQuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  currentQuestion: string;
  transcription: string;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onNextQuestion: () => void;
}

export function InterviewQuestionCard({
  questionNumber,
  totalQuestions,
  currentQuestion,
  transcription,
  isRecording,
  onStartRecording,
  onStopRecording,
  onNextQuestion,
}: InterviewQuestionCardProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasReadQuestion, setHasReadQuestion] = useState(false);
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [timer, setTimer] = useState(60);
  const [userResponse, setUserResponse] = useState<string[]>([]);

  const currentQuestionText = currentQuestion;
  const totalQuestionsCount = totalQuestions;

  useEffect(() => {
    const readQuestion = async () => {
      if (!currentQuestionText || hasReadQuestion) return;

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
              text: currentQuestionText,
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
  }, [currentQuestionText, hasReadQuestion]);

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
      updatedResponses[questionNumber - 1] = speechToText;
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
  }, [isPromptVisible, questionNumber, userResponse, onStopRecording]);

  const handleNextQuestion = () => {
    if (questionNumber < totalQuestionsCount) {
      onNextQuestion();
      setHasReadQuestion(false);
      setIsPromptVisible(false);
      setTimer(60);
    }
  };

  const isLastQuestion = questionNumber === totalQuestionsCount;

  return (
    <div className="flex flex-col items-center space-y-8">
      <Card className="p-6 space-y-4 bg-gradient-to-r from-gray-800 to-gray-900 border-purple-500 w-full max-w-3xl">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Question {questionNumber} of {totalQuestionsCount}
          </h2>
          <Progress
            value={(questionNumber / totalQuestionsCount) * 100}
            className="w-full bg-gray-700"
          />
        </div>

        <p className="text-lg text-white">{currentQuestionText}</p>

        {isPromptVisible && (
          <>
            <label className="text-md text-white">Your Response:</label>
            <Textarea
              value={userResponse[questionNumber - 1] || ""}
              readOnly
              className="w-full mt-2 bg-gray-700 text-white border-purple-500 rounded-lg"
              rows={4}
            />
          </>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleNextQuestion}
            disabled={!userResponse[questionNumber - 1]}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
          >
            {isLastQuestion ? "Submit" : "Next Question"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
