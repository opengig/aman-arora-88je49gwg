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

    const semenAnalysis = await prisma.semenAnalysis.findFirst({
      where: { userId },
      orderBy: { analysisDate: 'desc' },
      select: {
        volume: true,
        motility: true,
        morphology: true,
      },
    });

    if (!semenAnalysis) {
      return NextResponse.json({ success: false, message: 'No semen analysis metrics found for the user' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Semen metrics fetched successfully!',
      data: semenAnalysis,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching semen metrics:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}