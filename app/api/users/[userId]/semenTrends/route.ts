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

    const semenAnalyses = await prisma.semenAnalysis.findMany({
      where: { userId },
      select: {
        analysisDate: true,
        volume: true,
        motility: true,
        morphology: true,
      },
      orderBy: {
        analysisDate: 'asc',
      },
    });

    const trendsData = semenAnalyses.map(analysis => ({
      date: analysis.analysisDate.toISOString().split('T')[0],
      volume: analysis.volume,
      motility: analysis.motility,
      morphology: analysis.morphology,
    }));

    return NextResponse.json({
      success: true,
      message: 'Semen trends fetched successfully!',
      data: trendsData,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching semen trends:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}