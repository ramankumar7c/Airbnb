import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      }
    });

    if (!currentUser) {
      return null;
    }

    // Transform the data to match the expected User interface
    return {
      ...currentUser,
      name: currentUser.name || undefined, // Convert null to undefined
      image: currentUser.image || undefined, // Convert null to undefined
      emailVerified: currentUser.emailVerified || undefined // Convert null to undefined
    };
  } catch (error) {
    return null;
  }
}
