import { prisma } from '@/lib/prisma';

interface GetListingsParams {
  userId?: string;
  guestCount?: string | number;
  roomCount?: string | number;
  bathroomCount?: string | number;
  locationValue?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
}

export async function getListings(params: GetListingsParams = {}) {
  try {
    const {
      userId,
      guestCount,
      roomCount,
      bathroomCount,
      locationValue,
      startDate,
      endDate,
      category,
    } = params;

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    if (roomCount) {
      query.roomCount = {
        gte: +roomCount
      };
    }

    if (guestCount) {
      query.guestCount = {
        gte: +guestCount
      };
    }

    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount
      };
    }

    if (locationValue) {
      query.locationValue = locationValue;
    }

    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate }
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate }
              }
            ]
          }
        }
      };
    }

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return listings;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Unknown error');
  }
}
