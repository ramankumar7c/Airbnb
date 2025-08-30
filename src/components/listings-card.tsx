'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCountries } from '@/hooks/useCountries';
import { formatMoney } from '@/utils/formatMoney';
import { FavoriteBtn } from './favorite-btn';
import { Button } from '@/components/ui/button';

interface Listing {
  id: string;
  title: string;
  imageSrc: string;
  locationValue: string;
  price: number;
  category: string;
}

interface Reservation {
  id: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
}

interface User {
  id: string;
  favoriteIds?: string[];
}

interface ListingsCardProps {
  data: Listing;
  reservation?: Reservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser: User | null;
}

export function ListingsCard({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = '',
  currentUser
}: ListingsCardProps) {
  const router = useRouter();
  const { getByValue } = useCountries();

  const location = getByValue(data.locationValue);

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (disabled) {
      return;
    }

    onAction?.(actionId);
  };

  const price = () => {
    if (reservation) {
      return reservation.totalPrice;
    }

    return data.price;
  };

  const reservationDate = () => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${start.toDateString()} - ${end.toDateString()}`;
  };

  return (
    <div 
      onClick={() => router.push(`/listings/${data.id}`)} 
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <Image
            fill
            className="object-cover h-full w-full group-hover:scale-110 transition"
            src={data.imageSrc}
            alt="Listing"
          />
          <div className="absolute top-3 right-3">
            <FavoriteBtn 
              listingId={data.id} 
              currentUser={currentUser}
            />
          </div>
        </div>
        <div className="font-semibold text-lg">
          {location?.region}, {location?.label}
        </div>
        <div className="font-light text-neutral-500">
          {reservationDate() || data.category}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">
            {formatMoney(price())}
          </div>
          {!reservation && (
            <div className="font-light">night</div>
          )}
        </div>
        {onAction && actionLabel && (
          <Button 
            disabled={disabled} 
            size="sm" 
            onClick={handleCancel}
            className="mt-2"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
