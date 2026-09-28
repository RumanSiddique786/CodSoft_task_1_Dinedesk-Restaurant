import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dataStore } from '@/lib/dataStore';

export async function GET() {
  try {
    const calls = await prisma.waiterCall.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      include: { table: true },
    });
    return NextResponse.json(calls);
  } catch (error) {
    console.warn('Prisma waiter calls fetch failed, using fallback dataStore:', error);
    return NextResponse.json(dataStore.getWaiterCalls());
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tableId, reason = 'Water' } = body;

    try {
      let targetTableId = tableId;
      const foundTable = await prisma.table.findFirst({
        where: { OR: [{ id: tableId }, { number: tableId }] },
      });
      if (foundTable) targetTableId = foundTable.id;

      const call = await prisma.waiterCall.create({
        data: {
          tableId: targetTableId,
          reason,
        },
        include: { table: true },
      });
      return NextResponse.json(call, { status: 201 });
    } catch (prismaErr) {
      console.warn('Prisma waiter call create failed, using dataStore:', prismaErr);
      const fallback = dataStore.createWaiterCall({ tableId, reason });
      return NextResponse.json(fallback, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating waiter call:', error);
    return NextResponse.json({ error: 'Failed to create waiter call' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    try {
      const updated = await prisma.waiterCall.update({
        where: { id },
        data: { status },
      });
      return NextResponse.json(updated);
    } catch {
      const fallback = dataStore.resolveWaiterCall(id);
      return NextResponse.json(fallback || { id, status });
    }
  } catch (error) {
    console.error('Error resolving waiter call:', error);
    return NextResponse.json({ error: 'Failed to resolve waiter call' }, { status: 500 });
  }
}
