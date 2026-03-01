'use client';

import { useMemo, useCallback } from 'react';
import { useToast } from './use-toast';
import { useRouter } from 'next/navigation';

export function useFavorites() {
  const { toast } = useToast();
  const router = useRouter();

  const favoriteIds = useMemo(() => new Set<string>(), []);

  const toggleFavorite = useCallback((propertyId: string, isCurrentlyFavorited: boolean) => {
    toast({
      variant: "destructive",
      title: "Feature Disabled",
      description: "Favorites are currently not available.",
    });
  }, [toast, router]);

  return { favoriteIds, toggleFavorite, isLoadingFavorites: false };
}
