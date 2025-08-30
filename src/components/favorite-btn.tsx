'use client';

import { Heart } from 'lucide-react';
import { useFavorite } from '@/hooks/use-favorite';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  favoriteIds?: string[];
}

interface FavoriteBtnProps {
  listingId: string;
  currentUser: User | null;
}

export function FavoriteBtn({ listingId, currentUser }: FavoriteBtnProps) {
  const { hasFavorited, toggleFavorite } = useFavorite({
    listingId,
    currentUser
  });

  return (
    <div
      onClick={toggleFavorite}
      className="relative hover:opacity-80 transition cursor-pointer"
    >
      <Heart
        size={28}
        className={cn(
          'fill-white absolute -top-[2px] -right-[2px]',
        )}
      />
      <Heart
        size={24}
        className={cn(
          hasFavorited ? 'fill-rose-500' : 'fill-neutral-500/70'
        )}
      />
    </div>
  );
}
