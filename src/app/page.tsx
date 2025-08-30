import { Suspense } from 'react';
import { getCurrentUser } from './actions/getCurrentUser';
import { getListings } from './actions/getListings';
import { EmptyPage } from '@/components/empty-page';
import { ListingsCard } from '@/components/listings-card';
import { CategoryHandler } from '@/components/category-handler';

interface HomeProps {
  searchParams: Promise<{
    userId?: string;
    guestCount?: number;
    roomCount?: number;
    bathroomCount?: number;
    startDate?: string;
    endDate?: string;
    locationValue?: string;
    category?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const listings = await getListings(params);
  const currentUser = await getCurrentUser();

  const isEmpty = listings.length === 0;

  if (isEmpty) {
    return (
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
        <Suspense fallback={<div>Loading categories...</div>}>
          <CategoryHandler />
        </Suspense>
        <EmptyPage showReset />
      </div>
    );
  }

  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      <Suspense fallback={<div>Loading categories...</div>}>
        <CategoryHandler />
      </Suspense>
      <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {listings.map((listing: any) => (
          <ListingsCard
            currentUser={currentUser}
            key={listing.id}
            data={listing}
          />
        ))}
      </div>
    </div>
  );
}