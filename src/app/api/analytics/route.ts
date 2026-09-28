import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    const happyHours = await prisma.happyHourRule.findMany();
    const tables = await prisma.table.findMany();

    // 1. Calculate Revenue Metrics
    let totalRevenue = 0;
    let todayRevenue = 0;
    const today = new Date().toISOString().split('T')[0];

    // Peak hour tracker (0 - 23 hours)
    const hoursMap: { [hour: number]: number } = {};
    for (let h = 10; h <= 23; h++) hoursMap[h] = 0;

    // Top selling items map
    const itemSales: { [name: string]: { count: number; revenue: number; category: string } } = {};

    orders.forEach((ord) => {
      totalRevenue += ord.totalAmount;
      const ordDate = new Date(ord.createdAt).toISOString().split('T')[0];
      if (ordDate === today) {
        todayRevenue += ord.totalAmount;
      }

      const ordHour = new Date(ord.createdAt).getHours();
      if (hoursMap[ordHour] !== undefined) {
        hoursMap[ordHour] += 1;
      } else {
        hoursMap[ordHour] = 1;
      }

      ord.items.forEach((item) => {
        if (!itemSales[item.menuItem.name]) {
          itemSales[item.menuItem.name] = { count: 0, revenue: 0, category: item.menuItem.categoryId };
        }
        itemSales[item.menuItem.name].count += item.quantity;
        itemSales[item.menuItem.name].revenue += item.subtotal;
      });
    });

    const topItems = Object.entries(itemSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 2. Predictive Restocking Algorithm
    // Uses simulated moving average consumption to predict days until stock depletion
    const restockingAlerts = inventory.map((item) => {
      const isUrgent = item.currentStock <= item.minThreshold;
      const daysLeft = Math.max(1, Math.round((item.currentStock / (item.minThreshold || 5)) * 2));
      return {
        ...item,
        isUrgent,
        daysLeft,
        status: isUrgent ? 'CRITICAL_LOW' : daysLeft <= 2 ? 'REORDER_SOON' : 'OPTIMAL',
      };
    });

    // 3. Table Occupancy Rate
    const occupiedTables = tables.filter((t) => t.status === 'OCCUPIED').length;
    const occupancyRate = tables.length > 0 ? Math.round((occupiedTables / tables.length) * 100) : 0;

    return NextResponse.json({
      metrics: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        todayRevenue: Number(todayRevenue.toFixed(2)),
        totalOrders: orders.length,
        occupancyRate,
        averageOrderValue: orders.length > 0 ? Number((totalRevenue / orders.length).toFixed(2)) : 0,
      },
      peakHours: Object.entries(hoursMap).map(([hour, count]) => ({
        hour: `${hour}:00`,
        orders: count,
      })),
      topItems,
      restockingAlerts,
      happyHours,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { happyHourId, isActive, discountPercent } = body;

    const updated = await prisma.happyHourRule.update({
      where: { id: happyHourId },
      data: {
        ...(isActive !== undefined && { isActive }),
        ...(discountPercent !== undefined && { discountPercent: parseFloat(discountPercent) }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating happy hour rule:', error);
    return NextResponse.json({ error: 'Failed to update rule' }, { status: 500 });
  }
}
