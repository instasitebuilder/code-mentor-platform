import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const topics = [
  "CI/CD Pipelines",
  "Containerization and Orchestration",
  "Infrastructure as Code (IaC)",
  "Cloud Computing and DevOps",
  "Monitoring and Logging",
  "Configuration Management",
  "Security in DevOps (DevSecOps)",
  "Version Control and Collaboration",
  "Automation",
  "Microservices and DevOps",
  "DevOps and Agile Integration",
  "Serverless Architecture and DevOps",
  "Site Reliability Engineering (SRE)",
  "DevOps Metrics and KPIs",
  "Emerging Trends in DevOps",
];

const topicContent = {
  "CI/CD Pipelines": {
    title: "CI/CD Pipelines",
    content: `Continuous Integration and Continuous Delivery (CI/CD) pipelines are a series of automated steps that code goes through from development to production. 

Key Components:
- Source Control Integration
- Automated Building
- Automated Testing
- Deployment Automation
- Environment Management

Best Practices:
1. Automate everything possible
2. Maintain fast feedback loops
3. Build once, deploy many times
4. Keep pipelines simple and focused
5. Implement proper security checks`,
  },
  // ... Add content for other topics similarly
};

interface AIExplanationResponse {
  explanation: string;
  videos: { title: string; url: string }[];
  relatedQuestions: string[];
}

export default function DevOpsPractice() {
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const [selectedWord, setSelectedWord] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: aiExplanation, isLoading } = useQuery({
    queryKey: ["aiExplanation", selectedWord],
    queryFn: async (): Promise<AIExplanationResponse> => {
      if (!selectedWord) return null;
      
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
    <div className="flex h-screen">
      {/* Topics Sidebar */}
      <div className="w-64 border-r bg-gray-50 dark:bg-gray-900">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-2">
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  selectedTopic === topic
                    ? "bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6">
        <div
          className="prose dark:prose-invert max-w-none"
          onMouseUp={handleTextSelection}
        >
          <h1 className="text-3xl font-bold mb-6">{topicContent[selectedTopic]?.title}</h1>
          <div className="whitespace-pre-wrap">{topicContent[selectedTopic]?.content}</div>
        </div>
      </div>

      {/* AI Explanation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Understanding: {selectedWord}</DialogTitle>
          </DialogHeader>
          
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
            </div>
          ) : (
            <div className="space-y-4">
              {aiExplanation && (
                <>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Explanation</h3>
                    <p>{aiExplanation.explanation}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Recommended Videos</h3>
                    <ul className="list-disc pl-4">
                      {aiExplanation.videos.map((video, index) => (
                        <li key={index}>
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {video.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Related Questions</h3>
                    <ul className="list-disc pl-4">
                      {aiExplanation.relatedQuestions.map((question, index) => (
                        <li key={index}>{question}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}