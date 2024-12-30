import { useState } from "react";
import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/use-toast";
import { CreateGroupDialog } from "../components/CreateGroupDialog";
import { ScheduleSessionDialog } from "../components/ScheduleSessionDialog";
import { JoinSessionDialog } from "../components/JoinSessionDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { SessionList } from "../components/SessionList";
import { useNavigate } from "react-router-dom";

export default function PeerPractice() {
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  if (!user) {
    navigate('/login');
    return null;
  }

  const { data: groups, isLoading: isLoadingGroups } = useQuery({
    queryKey: ['peer-groups', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('peer_groups')
        .select('*')
        .eq('created_by', user?.id);
      
      if (error) {
        console.error('Error fetching groups:', error);
        toast({
          title: "Error fetching groups",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data;
    },
    enabled: !!user,
  });

  const { data: sessions, isLoading: isLoadingSessions } = useQuery({
    queryKey: ['peer-sessions', user?.id],
    queryFn: async () => {
      // First fetch sessions with group data
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('peer_sessions')
        .select(`
          *,
          peer_groups (
            name,
            members
          )
        `)
        .eq('created_by', user?.id);
      
      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
        toast({
          title: "Error fetching sessions",
          description: sessionsError.message,
          variant: "destructive",
        });
        return [];
      }

      // Then fetch questions for each session
      const sessionsWithQuestions = await Promise.all(
        sessionsData.map(async (session) => {
          const { data: questionsData, error: questionsError } = await supabase
            .from('peer_questions')
            .select('*')
            .eq('session_id', session.id);

          if (questionsError) {
            console.error('Error fetching questions:', questionsError);
            return {
              ...session,
              peer_questions: [],
              memberEmails: session.peer_groups?.members || [],
            };
          }

          return {
            ...session,
            peer_questions: questionsData,
            memberEmails: session.peer_groups?.members || [],
          };
        })
      );

      return sessionsWithQuestions;
    },
    enabled: !!user,
  });

  const handleQuestionClick = (session: any, index: number) => {
    setSelectedSession(session);
    setSelectedQuestionIndex(index);
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Peer Practice</h1>
        <div className="space-x-4">
          <Button onClick={() => setCreateGroupOpen(true)}>Create Group</Button>
          <Button onClick={() => setJoinOpen(true)}>Join Session</Button>
        </div>
      </div>

      {isLoadingGroups ? (
        <div>Loading groups...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups?.map((group) => (
            <Card key={group.id} className="p-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <Button
                    onClick={() => {
                      setSelectedGroupId(group.id);
                      setScheduleOpen(true);
                    }}
                  >
                    Schedule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Members: {group.members.length}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isLoadingSessions ? (
        <div>Loading sessions...</div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Practice Sessions</h2>
          <SessionList
            sessions={sessions || []}
            onQuestionClick={handleQuestionClick}
            selectedSession={selectedSession}
            selectedQuestionIndex={selectedQuestionIndex}
          />

          {selectedSession && selectedSession.peer_questions && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>
                  Question {selectedQuestionIndex + 1}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{selectedSession.peer_questions[selectedQuestionIndex]?.question_text}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <CreateGroupDialog
        open={createGroupOpen}
        onOpenChange={setCreateGroupOpen}
      />
      
      <ScheduleSessionDialog
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        groupId={selectedGroupId}
      />

      <JoinSessionDialog
        open={joinOpen}
        onOpenChange={setJoinOpen}
      />
    </div>
  );
}