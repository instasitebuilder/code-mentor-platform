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

export default function PeerPractice() {
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const { user } = useAuth();

  const { data: groups, isLoading: isLoadingGroups } = useQuery({
    queryKey: ['peer-groups', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('peer_groups')
        .select('*')
        .eq('created_by', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: sessions, isLoading: isLoadingSessions } = useQuery({
    queryKey: ['peer-sessions', user?.id],
    queryFn: async () => {
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('peer_sessions')
        .select(`
          *,
          peer_groups (
            name,
            members
          ),
          peer_questions (
            id,
            question_text
          )
        `);
      
      if (sessionsError) throw sessionsError;

      const memberIds = sessionsData?.flatMap(session => session.peer_groups?.members || []) || [];
      const uniqueMemberIds = [...new Set(memberIds)];
      
      if (uniqueMemberIds.length === 0) {
        return sessionsData?.map(session => ({
          ...session,
          memberEmails: []
        }));
      }

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', uniqueMemberIds);
      
      if (profilesError) throw profilesError;

      const emailMap = new Map(profilesData?.map(profile => [profile.id, profile.email]));
      
      return sessionsData?.map(session => ({
        ...session,
        memberEmails: (session.peer_groups?.members || []).map(id => emailMap.get(id) || 'Unknown')
      }));
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
            <div key={group.id} className="p-6 rounded-lg border bg-card">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{group.name}</h3>
                <Button
                  onClick={() => {
                    setSelectedGroupId(group.id);
                    setScheduleOpen(true);
                  }}
                >
                  Schedule
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Members: {group.members.length}
              </p>
            </div>
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