import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type ReminderRequestBody = {
  type: string;
  message: string;
  frequency: string;
  reminderDate: string;
};

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    const reminders = await prisma.reminder.findMany({
      where: { userId },
      select: {
        id: true,
        type: true,
        message: true,
        createdAt: true,
        frequency: true,
        updatedAt: true,
        reminderDate: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Reminders fetched successfully!',
      data: reminders,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    const body: ReminderRequestBody = await request.json();
    const { type, message, frequency, reminderDate } = body;

    if (!type || !message || !frequency || !reminderDate) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const newReminder = await prisma.reminder.create({
      data: {
        userId,
        type,
        message,
        frequency,
        reminderDate: new Date(reminderDate),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Reminder created successfully!',
      data: {
        id: newReminder.id,
        type: newReminder.type,
        message: newReminder.message,
        createdAt: newReminder.createdAt.toISOString(),
        frequency: newReminder.frequency,
        updatedAt: newReminder.updatedAt.toISOString(),
        reminderDate: newReminder.reminderDate.toISOString(),
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating reminder:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}