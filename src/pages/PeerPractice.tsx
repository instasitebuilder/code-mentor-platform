import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CreateGroupDialog } from "@/components/CreateGroupDialog";
import { ScheduleSessionDialog } from "@/components/ScheduleSessionDialog";
import { JoinSessionDialog } from "@/components/JoinSessionDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export default function PeerPractice() {
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: groups, isLoading } = useQuery({
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

  return (
    <div className="container py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Peer Practice</h1>
        <div className="space-x-4">
          <Button onClick={() => setCreateGroupOpen(true)}>Create Group</Button>
          <Button onClick={() => setJoinOpen(true)}>Join Session</Button>
        </div>
      </div>

      {isLoading ? (
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