'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { differenceInCalendarDays, eachDayOfInterval } from 'date-fns';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useCountries } from '@/hooks/useCountries';
import { formatMoney } from '@/utils/formatMoney';
import { FavoriteBtn } from '@/components/favorite-btn';
import { CountrySelect } from '@/components/country-select';
import { CounterInput } from '@/components/counter-input';
import { ImageUpload } from '@/components/image-upload';
import { ListingsCard } from '@/components/listings-card';

interface Listing {
  id: string;
  title: string;
  price: number;
  imageSrc: string;
  roomCount: number;
  guestCount: number;
  bathroomCount: number;
  description: string;
  locationValue: string;
  userId: string;
}

interface Reservation {
  startDate: Date;
  endDate: Date;
}

interface User {
  id: string;
  // Add other user properties as needed
}

interface ListingClientProps {
  listing: Listing;
  reservations?: Reservation[];
  currentUser: User | null;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

const initialDateRange: DateRange = {
  from: undefined,
  to: undefined
};

export function ListingClient({
  listing,
  reservations = [],
  currentUser
}: ListingClientProps) {
  const router = useRouter();
  const { getByValue } = useCountries();

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(listing.roomCount);
  const [bathroomCount, setBathroomCount] = useState(listing.bathroomCount);

  const location = getByValue(listing.locationValue);

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    reservations.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate)
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  const onCreateReservation = useCallback(async () => {
    if (!currentUser) {
      return router.push('/sign-in');
    }

    if (!dateRange.from || !dateRange.to) {
      toast.error('Please select both check-in and check-out dates');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalPrice,
          startDate: dateRange.from,
          endDate: dateRange.to,
          listingId: listing?.id,
          guestCount,
          roomCount,
          bathroomCount
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create reservation');
      }

      toast.success('Reservation created successfully!');
      setDateRange(initialDateRange);
      router.push('/bookings');
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [
    totalPrice,
    dateRange,
    listing?.id,
    guestCount,
    roomCount,
    bathroomCount,
    currentUser,
    router
  ]);

  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      const dayCount = differenceInCalendarDays(
        dateRange.to,
        dateRange.from
      );

      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price);
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange, listing.price]);

  if (!listing) {
    return null;
  }

  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      <div className="flex flex-col gap-6">
        <div className="text-2xl font-bold">
          {listing.title}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="aspect-square w-full relative overflow-hidden rounded-xl">
              <img
                src={listing.imageSrc}
                alt="Listing"
                className="object-cover h-full w-full"
              />
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-semibold">
                {formatMoney(listing.price)} night
              </div>
              <FavoriteBtn 
                listingId={listing.id} 
                currentUser={currentUser}
              />
            </div>
            <div className="flex items-center gap-4 text-neutral-600">
              <div>{listing.roomCount} rooms</div>
              <div>•</div>
              <div>{listing.guestCount} guests</div>
              <div>•</div>
              <div>{listing.bathroomCount} bathrooms</div>
            </div>
            <div className="text-neutral-600">
              {listing.description}
            </div>
            <div className="text-neutral-600">
              Located in {location?.label}, {location?.region}
            </div>
          </div>
        </div>
        
        <div className="border-t pt-8">
          {currentUser?.id === listing.userId ? (
            <div className="text-center py-8">
              <div className="text-2xl font-semibold mb-2">
                This is your property
              </div>
              <div className="text-neutral-600 mb-4">
                You cannot book your own property
              </div>
              <Button
                onClick={() => router.push('/properties')}
                className="bg-rose-500 hover:bg-rose-600"
              >
                Manage Your Property
              </Button>
            </div>
          ) : (
            <>
              <div className="text-2xl font-semibold mb-4">
                Reserve this place
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Select your dates</div>
                  <div className="text-sm text-neutral-500">
                    Choose your check-in and check-out dates
                  </div>
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(value) => {
                      if (value && 'from' in value && 'to' in value) {
                        setDateRange({
                          from: value.from,
                          to: value.to
                        });
                      }
                    }}
                    disabled={disabledDates}
                    fromDate={new Date()}
                    numberOfMonths={2}
                    className="rounded-md border"
                  />
                  {dateRange.from && dateRange.to && (
                    <div className="flex items-center gap-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-green-800">Check-in:</span>
                        <span className="text-sm text-green-700">
                          {dateRange.from?.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-green-800">Check-out:</span>
                        <span className="text-sm text-green-700">
                          {dateRange.to?.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-green-800">Nights:</span>
                        <span className="text-sm text-green-700">
                          {differenceInCalendarDays(dateRange.to, dateRange.from)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <CounterInput
                  title="Guests"
                  subtitle="How many guests are coming?"
                  value={guestCount}
                  onChange={(value) => setGuestCount(value)}
                />
                <CounterInput
                  title="Rooms"
                  subtitle="How many rooms do you need?"
                  value={roomCount}
                  onChange={(value) => setRoomCount(value)}
                />
                <CounterInput
                  title="Bathrooms"
                  subtitle="How many bathrooms do you need?"
                  value={bathroomCount}
                  onChange={(value) => setBathroomCount(value)}
                />
                <div className="pt-4">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <div>Total</div>
                    <div>{formatMoney(totalPrice)}</div>
                  </div>
                  <Button
                    disabled={isLoading || !dateRange.from || !dateRange.to}
                    onClick={onCreateReservation}
                    className="w-full mt-4"
                    size="lg"
                  >
                    {isLoading ? 'Creating...' : 'Reserve'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
