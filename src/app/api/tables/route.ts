import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dataStore } from '@/lib/dataStore';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const restaurantSlug = searchParams.get('restaurant') || searchParams.get('slug');
  const restaurantId = searchParams.get('restaurantId');

  try {
    let currentRestaurant = null;
    if (restaurantSlug) {
      currentRestaurant = await prisma.restaurant.findUnique({
        where: { slug: restaurantSlug },
      });
    } else if (restaurantId) {
      currentRestaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
      });
    }

    const whereClause: Record<string, unknown> = {};
    if (currentRestaurant) {
      whereClause.restaurantId = currentRestaurant.id;
    }

    const tables = await prisma.table.findMany({
      where: whereClause,
      orderBy: { number: 'asc' },
      include: {
        orders: {
          where: {
            status: { in: ['PLACED', 'CONFIRMED', 'PREPARING', 'READY'] },
          },
          include: {
            items: {
              include: { menuItem: true },
            },
          },
        },
        waiterCalls: {
          where: { status: 'ACTIVE' },
        },
      },
    });

    if (!tables || tables.length === 0) {
      return NextResponse.json(dataStore.getTables(restaurantSlug, restaurantId));
    }

    return NextResponse.json(tables);
  } catch (error) {
    console.warn('Prisma tables fetch failed, using fallback dataStore:', error);
    return NextResponse.json(dataStore.getTables(restaurantSlug, restaurantId));
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    try {
      const updated = await prisma.table.update({
        where: { id },
        data: { status },
      });
      return NextResponse.json(updated);
    } catch {
      const fallbackUpdated = dataStore.updateTableStatus(id, status);
      return NextResponse.json(fallbackUpdated || { id, status });
    }
  } catch (error) {
    console.error('Error updating table:', error);
    return NextResponse.json({ error: 'Failed to update table' }, { status: 500 });
  }
}
