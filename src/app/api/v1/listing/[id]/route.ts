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
      return new NextResponse('Missing listing ID', { status: 400 });
    }

    const listing = await prisma.listing.findUnique({
      where: {
        id
      }
    });

    if (!listing) {
      return new NextResponse('Listing not found', { status: 404 });
    }

    if (listing.userId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.listing.delete({
      where: {
        id
      }
    });

    return NextResponse.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('LISTING_DELETE', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
