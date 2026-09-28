import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const calls = await prisma.waiterCall.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      include: { table: true },
    });

    return NextResponse.json(calls);
  } catch (error) {
    console.error('Error fetching waiter calls:', error);
    return NextResponse.json({ error: 'Failed to fetch waiter calls' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tableNumber, reason = 'Assistance' } = body;

    let table = await prisma.table.findFirst({
      where: { number: tableNumber },
    });

    if (!table) {
      // Default to first table if not found
      table = await prisma.table.findFirst();
    }

    if (!table) {
      return NextResponse.json({ error: 'No table configured' }, { status: 400 });
    }

    const call = await prisma.waiterCall.create({
      data: {
        tableId: table.id,
        reason,
        status: 'ACTIVE',
      },
      include: { table: true },
    });

    const g = global as unknown as { io?: { emit: (event: string, data: unknown) => void } };
    if (g.io) {
      g.io.emit('waiter:buzzer', {
        id: call.id,
        tableNumber: table.number,
        section: table.section,
        reason: call.reason,
        createdAt: call.createdAt,
      });
    }

    return NextResponse.json(call, { status: 201 });
  } catch (error) {
    console.error('Error calling waiter:', error);
    return NextResponse.json({ error: 'Failed to call waiter' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { callId } = body;

    const call = await prisma.waiterCall.update({
      where: { id: callId },
      data: { status: 'RESOLVED' },
      include: { table: true },
    });

    const g = global as unknown as { io?: { emit: (event: string, data: unknown) => void } };
    if (g.io) {
      g.io.emit('waiter:call_cleared', call.id);
    }

    return NextResponse.json(call);
  } catch (error) {
    console.error('Error resolving waiter call:', error);
    return NextResponse.json({ error: 'Failed to resolve waiter call' }, { status: 500 });
  }
}
