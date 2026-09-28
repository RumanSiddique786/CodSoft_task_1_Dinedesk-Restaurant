import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { date: 'asc' },
      include: { table: true },
    });
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      partySize = 2,
      date,
      timeSlot,
      notes,
      restaurantSlug,
      restaurantId,
    } = body;

    let restaurant = null;
    if (restaurantSlug) {
      restaurant = await prisma.restaurant.findUnique({ where: { slug: restaurantSlug } });
    } else if (restaurantId) {
      restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    }
    if (!restaurant) {
      restaurant = await prisma.restaurant.findFirst({ orderBy: { createdAt: 'asc' } });
    }

    // Find a matching free table for this specific restaurant
    const tableWhere: Record<string, unknown> = {
      capacity: { gte: parseInt(partySize, 10) },
      status: 'FREE',
    };
    if (restaurant) {
      tableWhere.restaurantId = restaurant.id;
    }

    let matchingTable = await prisma.table.findFirst({
      where: tableWhere,
    });

    // Fallback if none strictly matching capacity
    if (!matchingTable && restaurant) {
      matchingTable = await prisma.table.findFirst({
        where: { restaurantId: restaurant.id, status: 'FREE' },
      });
    }

    const resv = await prisma.reservation.create({
      data: {
        customerName: customerName || 'Guest Diner',
        customerEmail: customerEmail || 'guest@example.com',
        customerPhone: customerPhone || '+91 98201 23456',
        partySize: parseInt(partySize, 10),
        date: date || new Date().toISOString().split('T')[0],
        timeSlot: timeSlot || '19:30',
        notes: notes || '',
        status: 'CONFIRMED',
        tableId: matchingTable ? matchingTable.id : null,
      },
      include: { table: true },
    });

    if (matchingTable) {
      await prisma.table.update({
        where: { id: matchingTable.id },
        data: { status: 'RESERVED' },
      });

      const g = global as unknown as { io?: { emit: (event: string, data: unknown) => void } };
      if (g.io) {
        g.io.emit('table:status_changed', { tableId: matchingTable.id, number: matchingTable.number, status: 'RESERVED' });
        g.io.emit('reservation:created', resv);
      }
    }

    return NextResponse.json(resv, { status: 201 });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { reservationId, status } = body;

    const updated = await prisma.reservation.update({
      where: { id: reservationId },
      data: { status },
      include: { table: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json({ error: 'Failed to update reservation' }, { status: 500 });
  }
}
