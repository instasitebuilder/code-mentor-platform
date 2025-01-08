import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Search, Mail } from 'lucide-react';

interface UserData {
  user_id: string;
  name: string | null;
  email: string | null;
  college: string | null;
  total_submissions: number;
  total_practice_sessions: number;
  total_interviews: number;
}

export function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_statistics')
        .select('*');

      if (error) throw error;
      
      // Ensure we handle null values and type the data correctly
      const typedData = (data || []).map(user => ({
        user_id: user.user_id,
        name: user.name || 'N/A',
        email: user.email || 'N/A',
        college: user.college || 'N/A',
        total_submissions: Number(user.total_submissions) || 0,
        total_practice_sessions: Number(user.total_practice_sessions) || 0,
        total_interviews: Number(user.total_interviews) || 0
      }));
      
      setUsers(typedData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.college?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>College</TableHead>
              <TableHead>Submissions</TableHead>
              <TableHead>Practice Sessions</TableHead>
              <TableHead>Interviews</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.college}</TableCell>
                  <TableCell>{user.total_submissions}</TableCell>
                  <TableCell>{user.total_practice_sessions}</TableCell>
                  <TableCell>{user.total_interviews}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => {
                        toast({
                          title: "Coming Soon",
                          description: "Individual messaging will be available soon",
                        });
                      }}
                    >
                      <Mail className="h-4 w-4" />
                      Message
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}