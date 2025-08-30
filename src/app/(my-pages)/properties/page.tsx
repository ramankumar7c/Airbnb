import { getCurrentUser } from '@/app/actions/getCurrentUser';
import { getListings } from '@/app/actions/getListings';
import { getReservationsForOwner } from '@/app/actions/getReservationsForOwner';
import { EmptyPage } from '@/components/empty-page';
import { PropertiesClient } from './PropertiesClient';

export default async function PropertiesPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyPage title="Unauthorized" subtitle="Please sign in" />;
  }

  const listings = await getListings({ userId: currentUser.id });
  const reservations = await getReservationsForOwner(currentUser.id);

  if (listings.length === 0) {
    return (
      <EmptyPage
        title="No properties found"
        subtitle="Looks like you have no properties."
      />
    );
  }

  return (
    <PropertiesClient
      listings={listings}
      reservations={reservations}
      currentUser={currentUser}
    />
  );
}
