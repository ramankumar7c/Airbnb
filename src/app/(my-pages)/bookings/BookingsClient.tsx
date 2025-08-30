'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ListingsCard } from '@/components/listings-card';
import { formatMoney } from '@/utils/formatMoney';

interface Reservation {
  id: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  listing: {
    id: string;
    title: string;
    imageSrc: string;
    locationValue: string;
    price: number;
    category: string;
  };
}

interface User {
  id: string;
  // Add other user properties as needed
}

interface BookingsClientProps {
  reservations: Reservation[];
  currentUser: User | null;
}

export function BookingsClient({
  reservations,
  currentUser
}: BookingsClientProps) {
  const router = useRouter();

  const onCancel = async (reservationId: string) => {
    try {
      const response = await fetch(`/api/v1/reservations/${reservationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel reservation');
      }

      toast.success('Reservation cancelled successfully');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Trips</h1>
        <p className="text-gray-600 mt-2">List of places you have reserved</p>
      </div>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="relative">
            <ListingsCard
              currentUser={currentUser}
              data={reservation.listing}
              reservation={reservation}
              actionId={reservation.id}
              onAction={onCancel}
              actionLabel="Cancel reservation"
            />
            <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-semibold shadow-md">
              {formatMoney(reservation.totalPrice)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
