import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      orderId,
      customerName = 'Happy Diner',
      rating = 5,
      foodRating = 5,
      serviceRating = 5,
      comment = 'Delicious food and rapid service!',
    } = body;

    const review = await prisma.review.create({
      data: {
        orderId: orderId || null,
        customerName,
        rating: parseInt(rating, 10),
        foodRating: parseInt(foodRating, 10),
        serviceRating: parseInt(serviceRating, 10),
        comment,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
