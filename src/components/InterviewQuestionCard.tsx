import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface InterviewQuestionCardProps {
  currentQuestion: string;
  questionNumber: number;
  totalQuestions: number;
  transcription: string;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onNextQuestion: () => void;
}

export function InterviewQuestionCard({
  currentQuestion,
  questionNumber,
  totalQuestions,
  transcription,
  isRecording,
  onStartRecording,
  onStopRecording,
  onNextQuestion,
}: InterviewQuestionCardProps) {
  return (
    <Card className="p-6 space-y-4 bg-gradient-to-r from-gray-800 to-gray-900 border-purple-500">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Question {questionNumber} of {totalQuestions}
        </h2>
        <Progress value={(questionNumber / totalQuestions) * 100} className="w-full bg-gray-700" />
      </div>

      <p className="text-lg text-white">{currentQuestion}</p>

      <div className="space-y-4">
        <div className="flex justify-center space-x-4">
          <Button
            onClick={isRecording ? onStopRecording : onStartRecording}
            variant={isRecording ? "destructive" : "default"}
            className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-500 hover:bg-purple-600'} transition-all duration-300`}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
        </div>

        {transcription && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-300">Your Response:</label>
            <Textarea
              value={transcription}
              readOnly
              className="w-full mt-2 bg-gray-700 text-white border-purple-500 rounded-lg"
              rows={4}
            />
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={onNextQuestion}
            disabled={!transcription}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
          >
            Next Question
          </Button>
        </div>
      </div>
    </Card>
  );
}