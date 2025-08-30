import { getCurrentUser } from '@/app/actions/getCurrentUser';
import { getReservations } from '@/app/actions/getReservations';
import { EmptyPage } from '@/components/empty-page';
import { BookingsClient } from './BookingsClient';

export default async function BookingsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyPage title="Unauthorized" subtitle="Please sign in" />;
  }

  const reservations = await getReservations({ userId: currentUser.id });

  if (reservations.length === 0) {
    return (
      <EmptyPage
        title="No trips found"
        subtitle="Looks like you havent reserved any trips."
        showReset
      />
    );
  }

  return (
    <BookingsClient
      reservations={reservations}
      currentUser={currentUser}
    />
  );
}
