import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    const recommendations = await prisma.recommendation.findMany({
      where: { userId },
      select: {
        id: true,
        insight: true,
        createdAt: true,
        updatedAt: true,
        recommendationDate: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Recommendations fetched successfully!',
      data: recommendations,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}