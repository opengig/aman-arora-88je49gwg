import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type HabitRequestBody = {
  diet: string;
  sleepPattern: string;
  lifestyleChanges: string;
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

    const body: HabitRequestBody = await request.json();

    const { diet, sleepPattern, lifestyleChanges } = body;
    if (!diet || !sleepPattern || !lifestyleChanges) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const habit = await prisma.habit.create({
      data: {
        userId,
        diet,
        sleepPattern,
        lifestyleChanges,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Habit logged successfully!',
      data: {
        id: habit.id,
        diet: habit.diet,
        userId: habit.userId,
        logDate: habit.logDate.toISOString(),
        createdAt: habit.createdAt.toISOString(),
        updatedAt: habit.updatedAt.toISOString(),
        sleepPattern: habit.sleepPattern,
        lifestyleChanges: habit.lifestyleChanges,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error logging habit:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}