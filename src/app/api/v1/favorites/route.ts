import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

interface FavoriteBody {
  listingId: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body: FavoriteBody = await request.json();
    const { listingId } = body;

    if (!listingId) {
      return new NextResponse('Missing listingId', { status: 400 });
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        id: session.user.id
      }
    });

    if (!currentUser) {
      return new NextResponse('User not found', { status: 404 });
    }

    let favoriteIds = [...(currentUser.favoriteIds || [])];

    if (favoriteIds.includes(listingId)) {
      favoriteIds = favoriteIds.filter((id) => id !== listingId);
    } else {
      favoriteIds.push(listingId);
    }

    const user = await prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        favoriteIds
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('FAVORITES_POST', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
