import { getCurrentUser } from '@/app/actions/getCurrentUser';
import { getListings } from '@/app/actions/getListings';
import { EmptyPage } from '@/components/empty-page';
import { ListingsCard } from '@/components/listings-card';

export default async function FavoritesPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyPage title="Unauthorized" subtitle="Please sign in" />;
  }

  const listings = await getListings({
    userId: currentUser.id
  });

  const favoritedListings = listings.filter((listing) =>
    currentUser.favoriteIds.includes(listing.id)
  );

  if (favoritedListings.length === 0) {
    return (
      <EmptyPage
        title="No favorites found"
        subtitle="Looks like you have no favorite listings."
      />
    );
  }

  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Favorites</h1>
        <p className="text-gray-600 mt-2">List of places you have favorited</p>
      </div>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {favoritedListings.map((listing) => (
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
