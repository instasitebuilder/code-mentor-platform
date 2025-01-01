import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Profile {
  name?: string;
  email?: string;
  college?: string;
  profile_image_url?: string;
}

interface ProfileCardProps {
  profile: Profile | null;
  onProfileUpdate: () => Promise<void>;
}

export function ProfileCard({ profile, onProfileUpdate }: ProfileCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const uploadProfileImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const userId = user?.id;
      const filePath = `${userId}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile_images')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false
        });

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
      
      await onProfileUpdate();
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
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
  );
}