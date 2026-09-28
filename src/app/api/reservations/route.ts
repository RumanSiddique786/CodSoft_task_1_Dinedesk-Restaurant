import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dataStore } from '@/lib/dataStore';

export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { date: 'asc' },
      include: { table: true },
    });
    if (!reservations || reservations.length === 0) {
      return NextResponse.json(dataStore.getReservations());
    }
    return NextResponse.json(reservations);
  } catch (error) {
    console.warn('Prisma reservations fetch failed, using fallback dataStore:', error);
    return NextResponse.json(dataStore.getReservations());
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerEmail, customerPhone, partySize, date, timeSlot, notes, tableId } = body;

    try {
      const reservation = await prisma.reservation.create({
        data: {
          customerName,
          customerEmail,
          customerPhone,
          partySize: parseInt(partySize, 10),
          date,
          timeSlot,
          notes,
          tableId: tableId || null,
        },
      });
      return NextResponse.json(reservation, { status: 201 });
    } catch (prismaErr) {
      console.warn('Prisma reservation create failed, using dataStore:', prismaErr);
      const fallback = dataStore.createReservation({
        customerName,
        customerEmail,
        customerPhone,
        partySize,
        date,
        timeSlot,
        notes,
      });
      return NextResponse.json(fallback, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}
