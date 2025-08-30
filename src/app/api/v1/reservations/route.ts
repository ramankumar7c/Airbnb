import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

interface CreateReservationBody {
  listingId: string;
  startDate: string;
  endDate: string;
  totalPrice: string | number;
  guestCount: string | number;
  roomCount: string | number;
  bathroomCount: string | number;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body: CreateReservationBody = await request.json();
    const {
      listingId,
      startDate,
      endDate,
      totalPrice,
      guestCount,
      roomCount,
      bathroomCount
    } = body;

    if (!listingId || !startDate || !endDate || !totalPrice) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const listingAndReservation = await prisma.listing.update({
      where: {
        id: listingId
      },
      data: {
        reservations: {
          create: {
            userId: session.user.id,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            totalPrice: parseInt(totalPrice.toString(), 10),
            guestCount: parseInt(guestCount.toString(), 10),
            roomCount: parseInt(roomCount.toString(), 10),
            bathroomCount: parseInt(bathroomCount.toString(), 10)
          }
        }
      },
      include: {
        reservations: {
          where: {
            userId: session.user.id
          }
        }
      }
    });

    return NextResponse.json(listingAndReservation);
  } catch (error) {
    console.error('RESERVATIONS_POST', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reservationId = searchParams.get('reservationId');

    if (!reservationId || typeof reservationId !== 'string') {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    const reservation = await prisma.reservation.deleteMany({
      where: {
        id: reservationId,
        OR: [
          { userId: session.user.id },
          { listing: { userId: session.user.id } }
        ]
      }
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('RESERVATIONS_DELETE', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
