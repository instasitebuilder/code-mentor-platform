import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FiInfo } from "react-icons/fi"; // Icon for explanation
import { FaBook } from "react-icons/fa"; // Icon for articles
import ReactMarkdown from "react-markdown"; // Import react-markdown

const topics = [
  { id: "ci_cd_pipelines", name: "CI/CD Pipelines", icon: <FaBook /> },
  { id: "containerization", name: "Containerization and Orchestration", icon: <FaBook /> },
  { id: "iac", name: "Infrastructure as Code (IaC)", icon: <FaBook /> },
  { id: "cloud_computing", name: "Cloud Computing and DevOps", icon: <FaBook /> },
  // Add other topics with unique IDs
];

interface TopicContent {
  title: string;
  content: string;
}

interface AIExplanationResponse {
  explanation: string | { section: string, text: string }[]; // Explanation can be string or array of objects with section and text
}

export default function DevOpsPractice() {
  const [selectedTopicId, setSelectedTopicId] = useState(topics[0].id);
  const [topicContent, setTopicContent] = useState<TopicContent | null>(null);
  const [selectedWord, setSelectedWord] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch topic content dynamically
  useEffect(() => {
    const fetchTopicContent = async () => {
      const response = await fetch(`/data/topics/${selectedTopicId}.json`);
      const data = await response.json();
      setTopicContent(data);
    };

    fetchTopicContent();
  }, [selectedTopicId]);

  const { data: aiExplanation, isLoading } = useQuery({
    queryKey: ["aiExplanation", selectedWord],
    queryFn: async (): Promise<AIExplanationResponse> => {
      if (!selectedWord) return { explanation: "" };

      const { data, error } = await supabase.functions.invoke("explain-devops-term", {
        body: { term: selectedWord },
      });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedWord,
  });

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (selectedText && selectedText.length > 0) {
      setSelectedWord(selectedText);
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Topics Sidebar */}
      <div className="w-64 border-r bg-gray-100 dark:bg-gray-800">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-2">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedTopicId === topic.id
                    ? "bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
              >
                <span className="mr-2">{topic.icon}</span>
                {topic.name}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6">
        {topicContent ? (
          <div
            className="prose dark:prose-invert max-w-none"
            onMouseUp={handleTextSelection}
          >
            <article className="space-y-6">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                {topicContent.title}
              </h1>
              <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {topicContent.content}
              </div>
            </article>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Loading...</p>
          </div>
        )}
      </div>

      {/* AI Explanation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-lg p-6">
          <DialogHeader className="flex items-center space-x-2">
            <FiInfo className="text-purple-500" />
            <DialogTitle className="text-xl font-semibold">Understanding: {selectedWord}</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
            </div>
          ) : (
            <div className="space-y-4">
              {aiExplanation && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Explanation</h3>
                  <div
                    className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white p-4 rounded-lg max-h-80 overflow-auto"
                    style={{ height: "300px" }}
                  >
                    {/* Check if the explanation is an array of objects */}
                    {Array.isArray(aiExplanation.explanation) ? (
                      aiExplanation.explanation.map((item, index) => (
                        <div key={index}>
                          <h4 className="font-semibold">{item.section}</h4>
                          <p>{item.text}</p>
                        </div>
                      ))
                    ) : (
                      <ReactMarkdown>{aiExplanation.explanation}</ReactMarkdown>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
