import { prisma } from '@/lib/prisma';

export async function getReservationsForOwner(userId: string) {
  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        listing: {
          userId: userId
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
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

    // Transform the data to match the expected interface
    return reservations.map(reservation => ({
      ...reservation,
      user: {
        ...reservation.user,
        name: reservation.user.name || undefined, // Convert null to undefined
        image: reservation.user.image || undefined // Convert null to undefined
      }
    }));
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Unknown error');
  }
}
