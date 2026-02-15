'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/firebase";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { user } = useUser();

  if (!user) {
    // This should technically be handled by the layout's auth protection
    return <div>User not found. Please log in.</div>;
  }

  // We don't have a 'role' on the Firebase user object by default.
  // This would need to be stored in Firestore and fetched. For now, we'll hide it.
  const userRole = 'Owner'; // Placeholder

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>View and manage your personal details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={user.displayName || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user.email || ''} disabled />
            </div>
             <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue={user.phoneNumber || 'Not provided'} disabled />
            </div>
             <div className="space-y-2">
              <Label>User Type</Label>
              <div>
                <Badge variant="secondary">{userRole}</Badge>
              </div>
            </div>
             <Button>Update Profile</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password. It's a good idea to use a strong password that you're not using anywhere else.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
             <Button>Change Password</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
