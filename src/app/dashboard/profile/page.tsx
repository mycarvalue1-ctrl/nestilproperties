'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser, useAuth } from "@/firebase";
import { Badge } from "@/components/ui/badge";
import { sendEmailVerification } from 'firebase/auth';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, LoaderCircle } from "lucide-react";
import { useState } from 'react';

export default function ProfilePage() {
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);

  const handleResendVerification = async () => {
    if (!user || !auth) return;
    setIsResending(true);
    try {
      await sendEmailVerification(user);
      toast({
        title: "Email Sent",
        description: "A new verification email has been sent to your address.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error Sending Email",
        description: error.message,
      });
    } finally {
      setIsResending(false);
    }
  };


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
         {!user.emailVerified && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Email Not Verified</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              Please check your inbox to verify your email address.
              <Button variant="link" onClick={handleResendVerification} disabled={isResending} className="p-0 h-auto">
                {isResending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Resend Email"}
              </Button>
            </AlertDescription>
          </Alert>
        )}
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
               <div className="flex items-center gap-2">
                <Input id="email" type="email" defaultValue={user.email || ''} disabled />
                {user.emailVerified ? (
                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="h-4 w-4 mr-1"/> Verified
                    </Badge>
                ) : (
                     <Badge variant="destructive">
                        <AlertCircle className="h-4 w-4 mr-1"/> Unverified
                    </Badge>
                )}
              </div>
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
