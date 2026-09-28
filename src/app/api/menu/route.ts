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

    if (!currentRestaurant) {
      currentRestaurant = await prisma.restaurant.findFirst({
        orderBy: { createdAt: 'asc' },
      });
    }

    const whereClause = currentRestaurant ? { restaurantId: currentRestaurant.id } : {};

    const categories = await prisma.category.findMany({
      where: whereClause,
      orderBy: { sortOrder: 'asc' },
      include: {
        menuItems: {
          orderBy: { price: 'asc' },
        },
      },
    });

    const happyHours = await prisma.happyHourRule.findMany({
      where: { 
        isActive: true,
        ...(currentRestaurant ? { restaurantId: currentRestaurant.id } : {}),
      },
    });

    return NextResponse.json({ 
      restaurant: currentRestaurant,
      categories, 
      happyHours 
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const restaurant = await prisma.restaurant.findFirst();

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 400 });
    }

    const item = await prisma.menuItem.create({
      data: {
        name: body.name,
        description: body.description || '',
        price: parseFloat(body.price),
        imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        categoryId: body.categoryId,
        isVeg: Boolean(body.isVeg),
        isGlutenFree: Boolean(body.isGlutenFree),
        spiceLevel: parseInt(body.spiceLevel || '0', 10),
        prepTimeMinutes: parseInt(body.prepTimeMinutes || '15', 10),
        allergens: body.allergens || '',
        restaurantId: restaurant.id,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, isAvailable } = body;

    const updated = await prisma.menuItem.update({
      where: { id },
      data: { isAvailable },
    });

    // Notify connected clients via global.io if available
    const g = global as unknown as { io?: { emit: (event: string, data: unknown) => void } };
    if (g.io) {
      g.io.emit('menu:availability_updated', { itemId: id, isAvailable });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}
