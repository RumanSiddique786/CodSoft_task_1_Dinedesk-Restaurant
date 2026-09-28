import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dataStore } from '@/lib/dataStore';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    if (!reviews || reviews.length === 0) {
      return NextResponse.json(dataStore.getReviews());
    }
    return NextResponse.json(reviews);
  } catch (error) {
    console.warn('Prisma reviews fetch failed, using fallback dataStore:', error);
    return NextResponse.json(dataStore.getReviews());
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, menuItemId, customerName = 'Foodie Explorer', rating = 5, foodRating = 5, serviceRating = 5, comment } = body;

    try {
      const review = await prisma.review.create({
        data: {
          orderId: orderId || null,
          menuItemId: menuItemId || null,
          customerName,
          rating: parseInt(rating, 10),
          foodRating: parseInt(foodRating, 10),
          serviceRating: parseInt(serviceRating, 10),
          comment,
        },
      });
      return NextResponse.json(review, { status: 201 });
    } catch (prismaErr) {
      console.warn('Prisma review create failed, using dataStore:', prismaErr);
      const fallback = dataStore.createReview({
        orderId,
        menuItemId,
        customerName,
        rating,
        foodRating,
        serviceRating,
        comment,
      });
      return NextResponse.json(fallback, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
