'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useOptimistic, useCallback, MouseEvent } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  favoriteIds?: string[];
}

interface UseFavoriteProps {
  listingId: string;
  currentUser: User | null;
}

export const useFavorite = ({ listingId, currentUser }: UseFavoriteProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const hasFavorited = currentUser?.favoriteIds?.includes(listingId);
  
  const [optimisticFavorites, addOptimisticFavorite] = useOptimistic(
    currentUser?.favoriteIds || [],
    (state: string[], newFavoriteId: string) => {
      if (state.includes(newFavoriteId)) {
        return state.filter(id => id !== newFavoriteId);
      } else {
        return [...state, newFavoriteId];
      }
    }
  );

  const toggleFavorite = useCallback(async (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (!session?.user) {
      router.push('/sign-in');
      return;
    }

    try {
      addOptimisticFavorite(listingId);

      const response = await fetch('/api/v1/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listingId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update favorite');
      }

      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Error toggling favorite:', error);
    }
  }, [session?.user, listingId, router, addOptimisticFavorite]);

  return {
    hasFavorited: optimisticFavorites.includes(listingId),
    toggleFavorite,
  };
};
