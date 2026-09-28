import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantSlug = searchParams.get('restaurant') || searchParams.get('slug');
    const restaurantId = searchParams.get('restaurantId');

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

    return NextResponse.json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json({ error: 'Failed to fetch tables' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const restaurant = await prisma.restaurant.findFirst();
    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 400 });
    }

    const table = await prisma.table.create({
      data: {
        number: body.number,
        capacity: parseInt(body.capacity || '4', 10),
        section: body.section || 'Main Floor',
        status: body.status || 'FREE',
        restaurantId: restaurant.id,
        qrCodeUrl: `http://localhost:3000/?table=${body.number}`,
      },
    });

    return NextResponse.json(table, { status: 201 });
  } catch (error) {
    console.error('Error creating table:', error);
    return NextResponse.json({ error: 'Failed to create table' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { tableId, status } = body;

    const table = await prisma.table.update({
      where: { id: tableId },
      data: { status },
    });

    const g = global as unknown as { io?: { emit: (event: string, data: unknown) => void } };
    if (g.io) {
      g.io.emit('table:status_changed', { tableId: table.id, number: table.number, status });
    }

    return NextResponse.json(table);
  } catch (error) {
    console.error('Error updating table:', error);
    return NextResponse.json({ error: 'Failed to update table' }, { status: 500 });
  }
}
