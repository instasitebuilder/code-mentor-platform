import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, Eye } from "lucide-react";

interface Organization {
  id: string;
  org_name: string;
  org_email: string;
  org_address: string;
  csv_file_url: string;
  unique_code: string;
  created_at: string;
}

export default function TeamCoding() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [formData, setFormData] = useState({
    orgName: "",
    orgEmail: "",
    orgAddress: "",
    csvFile: null as File | null,
  });

  // Fetch organizations on component mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "Please login to continue",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    const { data, error } = await supabase
      .from("organization_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch organizations",
        variant: "destructive",
      });
      return;
    }

    setOrganizations(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "Please login to continue",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      if (!formData.csvFile) {
        toast({
          title: "Error",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
        return;
      }

      // Upload CSV file
      const fileExt = formData.csvFile.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("org_csv_files")
        .upload(fileName, formData.csvFile);

      if (uploadError) throw uploadError;

      // Get file URL
      const { data: { publicUrl } } = supabase.storage
        .from("org_csv_files")
        .getPublicUrl(fileName);

      // Generate unique 6-digit code
      const uniqueCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Save organization details with created_by field
      const { error: insertError } = await supabase
        .from("organization_registrations")
        .insert({
          org_name: formData.orgName,
          org_email: formData.orgEmail,
          org_address: formData.orgAddress,
          csv_file_url: publicUrl,
          unique_code: uniqueCode,
          created_by: user.id, // Add the created_by field with user's ID
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Organization registered successfully",
      });

      // Reset form and refresh data
      setFormData({
        orgName: "",
        orgEmail: "",
        orgAddress: "",
        csvFile: null,
      });
      fetchOrganizations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Register Organization</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  value={formData.orgName}
                  onChange={(e) =>
                    setFormData({ ...formData, orgName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="orgEmail">Organization Email</Label>
                <Input
                  id="orgEmail"
                  type="email"
                  value={formData.orgEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, orgEmail: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="orgAddress">Organization Address</Label>
                <Input
                  id="orgAddress"
                  value={formData.orgAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, orgAddress: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="csvFile">Upload CSV File</Label>
                <Input
                  id="csvFile"
                  type="file"
                  accept=".csv"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      csvFile: e.target.files ? e.target.files[0] : null,
                    })
                  }
                  required
                />
                <p className="text-sm text-muted-foreground mt-2">
                  CSV must include columns: name, email, date, time
                </p>
              </div>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Register Organization
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>Prepare a CSV file with the following columns:
                <ul className="list-disc list-inside ml-4">
                  <li>name</li>
                  <li>email</li>
                  <li>date</li>
                  <li>time</li>
                </ul>
              </li>
              <li>Fill in your organization details in the form</li>
              <li>Upload the CSV file with team member information</li>
              <li>After registration, each team member will receive a unique 6-digit code</li>
              <li>Team members can use their code to access the practice session</li>
            </ul>
          </CardContent>
        </Card>

        {/* Organizations List */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Registered Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{org.org_name}</h3>
                    <p className="text-sm text-muted-foreground">{org.org_email}</p>
                    <p className="text-sm text-muted-foreground">{org.org_address}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(org.csv_file_url, "_blank")}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = org.csv_file_url;
                        link.download = "team_members.csv";
                        link.click();
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}