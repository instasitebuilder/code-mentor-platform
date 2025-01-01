import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from "@/components/Navbar";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to fetch profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {profile?.name || 'User'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your coding progress overview
          </p>
        </div>

        <StatsGrid />
        <ActivityChart />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProfileCard profile={profile} onProfileUpdate={fetchProfile} />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;