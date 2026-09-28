import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dataStore } from '@/lib/dataStore';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const tableId = searchParams.get('tableId');
  const restaurantSlug = searchParams.get('restaurant') || searchParams.get('slug');
  const restaurantId = searchParams.get('restaurantId');

  try {
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

    if (!orders || orders.length === 0) {
      const fallbackOrders = dataStore.getOrders(restaurantSlug, status, tableId, restaurantId);
      if (fallbackOrders.length > 0) return NextResponse.json(fallbackOrders);
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.warn('Prisma orders fetch failed, using fallback dataStore:', error);
    return NextResponse.json(dataStore.getOrders(restaurantSlug, status, tableId, restaurantId));
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

    try {
      let restaurant = null;
      if (restaurantSlug) {
        restaurant = await prisma.restaurant.findUnique({ where: { slug: restaurantSlug } });
      } else if (restaurantId) {
        restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
      }
      if (!restaurant) {
        restaurant = await prisma.restaurant.findFirst({ orderBy: { createdAt: 'asc' } });
      }

      if (restaurant) {
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

        let subtotal = 0;
        const orderItemsData = items.map((item: any) => {
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
        const orderNumber = 'ORD-' + Math.floor(1000 + Math.random() * 9000);

        const order = await prisma.order.create({
          data: {
            orderNumber,
            type,
            status: 'PLACED',
            paymentStatus: paymentMethod === 'CASH' ? 'PENDING' : 'PAID',
            tableId: table ? table.id : null,
            totalAmount: total,
            discountAmount,
            taxAmount: tax,
            guestNotes,
            customerName,
            customerPhone,
            restaurantId: restaurant.id,
            items: {
              create: orderItemsData,
            },
          },
          include: {
            table: true,
            items: {
              include: { menuItem: true },
            },
          },
        });

        if (table) {
          await prisma.table.update({
            where: { id: table.id },
            data: { status: 'OCCUPIED' },
          });
        }

        return NextResponse.json(order, { status: 201 });
      }
    } catch (prismaErr) {
      console.warn('Prisma order creation failed, falling back to dataStore:', prismaErr);
    }

    // Fallback store creation
    const fallbackOrder = dataStore.createOrder({
      restaurantId,
      tableNumber,
      customerName,
      customerPhone,
      guestNotes,
      items,
    });

    return NextResponse.json(fallbackOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, paymentStatus } = body;

    try {
      const updateData: Record<string, unknown> = {};
      if (status) updateData.status = status;
      if (paymentStatus) updateData.paymentStatus = paymentStatus;

      const updated = await prisma.order.update({
        where: { id },
        data: updateData,
        include: {
          table: true,
          items: {
            include: { menuItem: true },
          },
        },
      });

      return NextResponse.json(updated);
    } catch {
      const fallbackUpdated = dataStore.updateOrderStatus(id, status);
      return NextResponse.json(fallbackUpdated || { id, status, paymentStatus });
    }
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
