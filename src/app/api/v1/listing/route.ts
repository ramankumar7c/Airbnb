import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

interface CreateListingBody {
  title: string;
  description: string;
  imageSrc: string;
  category: string;
  roomCount: string | number;
  bathroomCount: string | number;
  guestCount: string | number;
  location: {
    value: string;
  };
  price: string | number;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body: CreateListingBody = await request.json();
    const {
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      location,
      price,
    } = body;

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        imageSrc,
        category,
        roomCount: parseInt(roomCount.toString(), 10),
        bathroomCount: parseInt(bathroomCount.toString(), 10),
        guestCount: parseInt(guestCount.toString(), 10),
        locationValue: location?.value,
        price: parseInt(price.toString(), 10),
        userId: session.user.id
      }
    });

    return NextResponse.json(listing);
  } catch (error) {
    console.error('LISTING_POST', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const guestCount = searchParams.get('guestCount');
    const roomCount = searchParams.get('roomCount');
    const bathroomCount = searchParams.get('bathroomCount');
    const locationValue = searchParams.get('locationValue');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const category = searchParams.get('category');

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

    return NextResponse.json(listings);
  } catch (error) {
    console.error('LISTING_GET', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
