
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

interface RouteParams {
  params: {
    listingId: string;
  };
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== 'string') {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    const listing = await prisma.listing.deleteMany({
      where: {
        id: listingId,
        userId: session.user.id
      }
    });

    return NextResponse.json(listing);
  } catch (error) {
    console.error('LISTING_DELETE', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
