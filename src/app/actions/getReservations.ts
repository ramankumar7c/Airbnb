import { prisma } from '@/lib/prisma';

interface GetReservationsParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

export async function getReservations(params: GetReservationsParams = {}) {
  try {
    const { listingId, userId, authorId } = params;

    const query: any = {};

    if (listingId) {
      query.listingId = listingId;
    }

    if (userId) {
      query.userId = userId;
    }

    if (authorId) {
      query.listing = { userId: authorId };
    }

    const reservations = await prisma.reservation.findMany({
      where: query,
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            imageSrc: true,
            locationValue: true,
            price: true,
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return reservations;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Unknown error');
  }
}
