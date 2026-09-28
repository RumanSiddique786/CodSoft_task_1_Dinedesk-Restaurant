import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dataStore } from '@/lib/dataStore';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { menuItem: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const inventory = await prisma.inventoryItem.findMany();
    const happyHours = await prisma.happyHourRule.findMany({ where: { isActive: true } });

    if (!orders || orders.length === 0) {
      return NextResponse.json(dataStore.getAnalytics());
    }

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const activeTickets = orders.filter((o) => ['PLACED', 'CONFIRMED', 'PREPARING', 'READY'].includes(o.status)).length;

    return NextResponse.json({
      orders,
      inventory,
      happyHours,
      metrics: {
        totalOrders,
        totalRevenue: Math.round(totalRevenue),
        activeTickets,
        avgOrderValue: totalOrders ? Math.round(totalRevenue / totalOrders) : 0,
      },
    });
  } catch (error) {
    console.warn('Prisma analytics fetch failed, using fallback dataStore:', error);
    return NextResponse.json(dataStore.getAnalytics());
  }
}
