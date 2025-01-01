import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Book, Code, Trophy, Clock, Target } from 'lucide-react';
import { Navbar } from "@/components/Navbar";

const mockActivityData = [
  { name: 'Mon', problems: 4 },
  { name: 'Tue', problems: 3 },
  { name: 'Wed', problems: 7 },
  { name: 'Thu', problems: 5 },
  { name: 'Fri', problems: 6 },
  { name: 'Sat', problems: 8 },
  { name: 'Sun', problems: 9 },
];

const statsCards = [
  {
    title: "Problems Solved",
    value: "125",
    icon: Code,
    description: "Total problems completed",
  },
  {
    title: "Practice Sessions",
    value: "48",
    icon: Clock,
    description: "Hours of practice",
  },
  {
    title: "Current Streak",
    value: "7",
    icon: Activity,
    description: "Days in a row",
  },
  {
    title: "Achievement Points",
    value: "850",
    icon: Trophy,
    description: "Points earned",
  },
];

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

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

  const uploadProfileImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image_url: publicUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Profile image updated successfully",
      });
      
      await fetchProfile();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {profile?.name || 'User'}!</h1>
          <p className="text-gray-600 dark:text-gray-400">Here's your coding progress overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Activity Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="problems" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Profile and Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative w-24 h-24">
                    <img
                      src={profile?.profile_image_url || '/placeholder.svg'}
                      alt="Profile"
                      className="rounded-full w-full h-full object-cover"
                    />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={uploadProfileImage}
                      disabled={uploading}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <Button
                    variant="outline"
                    disabled={uploading}
                    onClick={() => {
                      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                      if (fileInput) fileInput.click();
                    }}
                  >
                    {uploading ? 'Uploading...' : 'Change Photo'}
                  </Button>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-lg">{profile?.name || 'Not set'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-lg">{profile?.email || user?.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">College</label>
                  <p className="text-lg">{profile?.college || 'Not set'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
                    <Code className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <p className="font-medium">Completed Array Challenge</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 mr-4">
                    <Book className="h-4 w-4 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <p className="font-medium">Started Learning Path: DSA</p>
                    <p className="text-sm text-gray-500">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
                    <Target className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <p className="font-medium">Achieved 7-Day Streak</p>
                    <p className="text-sm text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
