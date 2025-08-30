import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface RegisterBody {
  email: string;
  name: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterBody = await request.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return new NextResponse('Missing info', { status: 400 });
    }

    const exist = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (exist) {
      return new NextResponse('User already exists', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
        favoriteIds: [],
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log(error, 'REGISTRATION_ERROR');
    return new NextResponse('Internal Error', { status: 500 });
  }
}
