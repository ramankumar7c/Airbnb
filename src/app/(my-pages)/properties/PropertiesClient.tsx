'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ListingsCard } from '@/components/listings-card';
import { formatMoney } from '@/utils/formatMoney';

interface Listing {
  id: string;
  title: string;
  imageSrc: string;
  locationValue: string;
  price: number;
  category: string;
}

interface User {
  id: string;
  name?: string;
  email: string;
  image?: string;
}

interface Reservation {
  id: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  createdAt: Date;
  user: User;
  listing: Listing;
}

interface PropertiesClientProps {
  listings: Listing[];
  reservations: Reservation[];
  currentUser: User | null;
}

export function PropertiesClient({
  listings,
  reservations,
  currentUser
}: PropertiesClientProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');

  const onDelete = async (id: string) => {
    setDeletingId(id);

    try {
      const response = await fetch(`/api/v1/listing/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete property');
      }

      toast.success('Property deleted successfully');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Properties</h1>
        <p className="text-gray-600 mt-2">List of places you have listed</p>
      </div>
      
      {/* Properties Grid */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {listings.map((listing) => (
          <div key={listing.id} className="relative">
            <ListingsCard
              currentUser={currentUser}
              data={listing}
              actionId={listing.id}
              onAction={onDelete}
              actionLabel="Delete property"
              disabled={deletingId === listing.id}
            />
            <div className="absolute top-4 right-4">
              <Button
                onClick={() => router.push(`/listings/${listing.id}/edit`)}
                size="sm"
                variant="outline"
                className="mr-2"
              >
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Reservations Section */}
      {reservations.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Bookings on Your Properties</h2>
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      <img
                        src={reservation.listing.imageSrc}
                        alt={reservation.listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{reservation.listing.title}</h3>
                      <p className="text-sm text-gray-600">
                        Booked by {reservation.user.name || reservation.user.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatMoney(reservation.totalPrice)}</div>
                    <div className="text-sm text-gray-600">
                      {reservation.guestCount ? `${reservation.guestCount} guests` : 'Guests not specified'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(reservation.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
