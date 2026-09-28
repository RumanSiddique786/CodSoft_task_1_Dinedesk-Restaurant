import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dataStore } from '@/lib/dataStore';

export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            menuItems: true,
            tables: true,
            categories: true,
          },
        },
      },
    });

    if (!restaurants || restaurants.length === 0) {
      return NextResponse.json(dataStore.getRestaurants());
    }

    return NextResponse.json(restaurants);
  } catch (error) {
    console.warn('Prisma fetch restaurants failed, using dataStore fallback:', error);
    return NextResponse.json(dataStore.getRestaurants());
  }
}
