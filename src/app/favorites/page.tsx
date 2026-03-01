
'use client';

import { Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FavoritesPage() {
  
  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Heart className="text-destructive fill-destructive" />
          My Favorite Properties
        </h1>
      </div>
      <div className="text-center py-16 border-dashed border-2 rounded-lg">
          <h2 className="text-xl font-semibold">Feature Disabled</h2>
          <p className="text-muted-foreground mt-2">The favorites feature is currently not available.</p>
           <Button asChild className="mt-4">
              <Link href="/properties">Explore Properties</Link>
          </Button>
      </div>
    </div>
  );
}
