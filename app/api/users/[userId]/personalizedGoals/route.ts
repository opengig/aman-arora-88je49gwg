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

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const semenAnalyses = await prisma.semenAnalysis.findMany({
      where: { userId },
      orderBy: { analysisDate: 'desc' },
      take: 1,
    });

    if (semenAnalyses.length === 0) {
      return NextResponse.json({ success: true, message: 'No historical data available', data: {} }, { status: 200 });
    }

    const latestAnalysis = semenAnalyses[0];
    const goal1 = `Increase motility by 5% in the next month`;
    const goal2 = `Maintain morphology above 4%`;

    const personalizedGoals = {
      goal1,
      goal2,
    };

    return NextResponse.json({
      success: true,
      message: 'Personalized goals fetched successfully!',
      data: personalizedGoals,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching personalized goals:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}