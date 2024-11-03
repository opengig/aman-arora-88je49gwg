import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type SemenAnalysisRequestBody = {
  volume: number;
  motility: number;
  morphology: number;
};

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    const body: SemenAnalysisRequestBody = await request.json();
    const { volume, motility, morphology } = body;

    if (typeof volume !== 'number' || typeof motility !== 'number' || typeof morphology !== 'number') {
      return NextResponse.json({ success: false, message: 'Invalid input data' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const semenAnalysis = await prisma.semenAnalysis.create({
      data: {
        userId,
        volume,
        motility,
        morphology,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Semen analysis report logged successfully!',
      data: {
        id: semenAnalysis.id,
        userId: semenAnalysis.userId,
        volume: semenAnalysis.volume,
        motility: semenAnalysis.motility,
        morphology: semenAnalysis.morphology,
        createdAt: semenAnalysis.createdAt.toISOString(),
        updatedAt: semenAnalysis.updatedAt.toISOString(),
        analysisDate: semenAnalysis.analysisDate.toISOString(),
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error logging semen analysis:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}