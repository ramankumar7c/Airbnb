import { prisma } from '@/lib/prisma';

interface GetListingByIdParams {
  id: string;
}

export async function getListingById(params: GetListingByIdParams) {
  try {
    const { id } = params;

    const listing = await prisma.listing.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true
      }
    });

    if (!listing) {
      return null;
    }

    return listing;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Unknown error');
  }
}
