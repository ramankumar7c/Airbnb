import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = params;

    if (!id) {
      return new NextResponse('Missing reservation ID', { status: 400 });
    }

    const reservation = await prisma.reservation.findUnique({
      where: {
        id
      },
      include: {
        listing: true
      }
    });

    if (!reservation) {
      return new NextResponse('Reservation not found', { status: 404 });
    }

    if (reservation.userId !== session.user.id && reservation.listing.userId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.reservation.delete({
      where: {
        id
      }
    });

    return NextResponse.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error('RESERVATION_DELETE', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
