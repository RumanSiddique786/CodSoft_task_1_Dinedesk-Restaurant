import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const tableId = searchParams.get('tableId');
    const restaurantSlug = searchParams.get('restaurant') || searchParams.get('slug');
    const restaurantId = searchParams.get('restaurantId');

    const whereClause: Record<string, unknown> = {};
    if (status === 'ACTIVE') {
      whereClause.status = { in: ['PLACED', 'CONFIRMED', 'PREPARING', 'READY'] };
    } else if (status) {
      whereClause.status = status;
    }
    if (tableId) {
      whereClause.tableId = tableId;
    }
    if (restaurantSlug) {
      const rest = await prisma.restaurant.findUnique({ where: { slug: restaurantSlug } });
      if (rest) whereClause.restaurantId = rest.id;
    } else if (restaurantId) {
      whereClause.restaurantId = restaurantId;
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        table: true,
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      type = 'DINE_IN',
      tableNumber,
      items,
      customerName = 'Guest Customer',
      customerPhone,
      guestNotes,
      discountAmount = 0,
      paymentMethod = 'CARD',
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

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 400 });
    }

    let table = null;
    if (tableNumber) {
      table = await prisma.table.findFirst({
        where: { number: tableNumber, restaurantId: restaurant.id },
      });
      if (!table) {
        table = await prisma.table.findFirst({
          where: { number: tableNumber },
        });
      }
    }

    // Calculate subtotal
    let subtotal = 0;
    const orderItemsData = items.map((item: { menuItemId: string; quantity: number; unitPrice: number; selectedOptions?: string[]; notes?: string }) => {
      const itemSubtotal = item.unitPrice * item.quantity;
      subtotal += itemSubtotal;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: itemSubtotal,
        selectedOptions: item.selectedOptions ? JSON.stringify(item.selectedOptions) : null,
        notes: item.notes || null,
      };
    });

    const tax = Number((subtotal * 0.05).toFixed(2));
    const total = Number((subtotal - discountAmount + tax).toFixed(2));
    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        type,
        status: 'PLACED',
        paymentStatus: 'PAID',
        tableId: table ? table.id : null,
        totalAmount: total,
        discountAmount,
        taxAmount: tax,
        guestNotes,
        customerName,
        customerPhone,
        estimatedMinutes: 20,
        restaurantId: restaurant.id,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        table: true,
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: total,
        method: paymentMethod,
        status: 'SUCCESS',
        transactionRef: `TXN-${Date.now().toString().slice(-6)}`,
      },
    });

    // Mark table OCCUPIED if dine-in
    if (table) {
      await prisma.table.update({
        where: { id: table.id },
        data: { status: 'OCCUPIED' },
      });
    }

    // Notify connected clients via global.io
    const g = global as unknown as { io?: { emit: (event: string, data: unknown) => void } };
    if (g.io) {
      g.io.emit('order:incoming', order);
      if (table) {
        g.io.emit('table:status_changed', { tableId: table.id, number: table.number, status: 'OCCUPIED' });
      }
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { orderId, status, paymentStatus } = body;

    const dataToUpdate: Record<string, unknown> = {};
    if (status) dataToUpdate.status = status;
    if (paymentStatus) dataToUpdate.paymentStatus = paymentStatus;

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: dataToUpdate,
      include: {
        table: true,
        items: {
          include: { menuItem: true },
        },
      },
    });

    // If order is served, table can transition or be notified
    const g = global as unknown as { io?: { emit: (event: string, data: unknown) => void; to: (room: string) => { emit: (event: string, data: unknown) => void } } };
    if (g.io) {
      g.io.emit('order:status_changed', { orderId: updated.id, status: updated.status, order: updated });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
