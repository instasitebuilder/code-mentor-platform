import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Users, FileText } from 'lucide-react';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: { user: { email } } } = await supabase.auth.getUser();
      
      if (email !== 'raushan22882917@gmail.com') {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page",
          variant: "destructive"
        });
        navigate('/');
      }
    };

    checkAdminAccess();
  }, [user, navigate]);

  const createNotification = async (title: string, message: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          title,
          message,
          created_by: user?.id,
          is_admin_notification: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification created successfully",
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      toast({
        title: "Error",
        description: "Failed to create notification",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="notifications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="interviews" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Interviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            <div className="grid gap-4">
              <Button
                onClick={() => createNotification(
                  "System Maintenance",
                  "The system will undergo maintenance tonight at 10 PM UTC"
                )}
              >
                Send System Maintenance Alert
              </Button>
              <Button
                onClick={() => createNotification(
                  "New Feature Available",
                  "Check out our new HR Interview simulation feature!"
                )}
              >
                Announce New Feature
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <p>User management coming soon...</p>
          </TabsContent>

          <TabsContent value="interviews">
            <p>Interview management coming soon...</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}