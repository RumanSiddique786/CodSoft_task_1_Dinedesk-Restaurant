import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dataStore } from '@/lib/dataStore';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const restaurantSlug = searchParams.get('restaurant') || searchParams.get('slug');
  const restaurantId = searchParams.get('restaurantId');

  try {
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

    if (!currentRestaurant) {
      return NextResponse.json(dataStore.getMenu(restaurantSlug, restaurantId));
    }

    const whereClause = { restaurantId: currentRestaurant.id };

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
        restaurantId: currentRestaurant.id,
      },
    });

    if (!categories || categories.length === 0) {
      return NextResponse.json(dataStore.getMenu(restaurantSlug, restaurantId));
    }

    return NextResponse.json({ 
      restaurant: currentRestaurant,
      categories, 
      happyHours 
    });
  } catch (error) {
    console.warn('Prisma menu fetch failed, using fallback dataStore:', error);
    return NextResponse.json(dataStore.getMenu(restaurantSlug, restaurantId));
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

    try {
      const updated = await prisma.menuItem.update({
        where: { id },
        data: { isAvailable },
      });
      return NextResponse.json(updated);
    } catch {
      const fallbackUpdated = dataStore.updateMenuItemAvailability(id, isAvailable);
      return NextResponse.json(fallbackUpdated || { id, isAvailable });
    }
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}
