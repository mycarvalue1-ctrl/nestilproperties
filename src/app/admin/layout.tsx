'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user: currentUser, isUserLoading } = useUser();
  const router = useRouter();
  const adminEmail = 'helpnestil@gmail.com';

  useEffect(() => {
    // This effect runs once the user's status is determined.
    // If they are not the admin, it redirects them.
    if (!isUserLoading && currentUser?.email !== adminEmail) {
      router.replace('/admin/login');
    }
  }, [isUserLoading, currentUser, router, adminEmail]);

  // While loading, or if the user is confirmed to not be the admin,
  // show a loader and prevent any child components from rendering.
  // This is the crucial change to prevent unauthorized queries.
  if (isUserLoading || currentUser?.email !== adminEmail) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Only if the user is loaded AND is the admin, render the admin section.
  return <>{children}</>;
}
