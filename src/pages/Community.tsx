import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Community() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Community</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Discussion Forums</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Connect with other developers and share your experiences.</p>
            <p className="text-muted-foreground mt-2">Coming soon!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Study Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Join or create study groups to learn together.</p>
            <p className="text-muted-foreground mt-2">Coming soon!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Participate in coding events and competitions.</p>
            <p className="text-muted-foreground mt-2">Coming soon!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}