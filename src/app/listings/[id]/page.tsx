import { getCurrentUser } from '@/app/actions/getCurrentUser';
import { getListingById } from '@/app/actions/getListingById';
import { getReservations } from '@/app/actions/getReservations';
import { EmptyPage } from '@/components/empty-page';
import { ListingClient } from './ListingClient';

interface ListingPageProps {
  params: {
    id: string;
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const listing = await getListingById(params);
  const reservations = await getReservations({ listingId: params.id });
  const currentUser = await getCurrentUser();

  if (!listing) {
    return <EmptyPage />;
  }

  return (
    <ListingClient
      listing={listing}
      reservations={reservations}
      currentUser={currentUser}
    />
  );
}
