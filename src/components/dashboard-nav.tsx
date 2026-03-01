'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { User, LogOut, LayoutGrid, List, Coins, CalendarCheck, Heart } from 'lucide-react';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export function DashboardNav() {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    router.push('/');
  };

  return (
    <nav className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground p-2">Dashboard has been disabled.</p>
    </nav>
  );
}
