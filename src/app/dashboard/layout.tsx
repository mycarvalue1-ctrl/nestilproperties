'use client'; // This needs to be a client component for hooks

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { DashboardNav } from '@/components/dashboard-nav';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/user-login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="container py-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          <aside className="md:w-1/4 lg:w-1/5">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </aside>
          <main className="flex-1 w-full overflow-hidden">
             <Skeleton className="h-24 w-full mb-6" />
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
             </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        <aside className="md:w-1/4 lg:w-1/5">
          <DashboardNav />
        </aside>
        <main className="flex-1 w-full overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
