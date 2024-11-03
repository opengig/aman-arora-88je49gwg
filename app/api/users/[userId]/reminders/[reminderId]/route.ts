import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type ReminderRequestBody = {
  type: string;
  message: string;
  frequency: string;
  reminderDate: string;
};

export async function PUT(
  request: Request,
  { params }: { params: { userId: string; reminderId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    const reminderId = parseInt(params.reminderId, 10);

    if (isNaN(userId) || isNaN(reminderId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID or reminder ID' }, { status: 400 });
    }

    const body: ReminderRequestBody = await request.json();

    const { type, message, frequency, reminderDate } = body;

    const updatedReminder = await prisma.reminder.update({
      where: {
        id: reminderId,
        userId: userId,
      },
      data: {
        type,
        message,
        frequency,
        reminderDate: new Date(reminderDate),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Reminder updated successfully!',
      data: {
        id: updatedReminder.id,
        type: updatedReminder.type,
        message: updatedReminder.message,
        createdAt: updatedReminder.createdAt.toISOString(),
        frequency: updatedReminder.frequency,
        updatedAt: updatedReminder.updatedAt.toISOString(),
        reminderDate: updatedReminder.reminderDate.toISOString(),
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error updating reminder:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string; reminderId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    const reminderId = parseInt(params.reminderId, 10);

    if (isNaN(userId) || isNaN(reminderId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID or reminder ID' }, { status: 400 });
    }

    await prisma.reminder.deleteMany({
      where: {
        id: reminderId,
        userId: userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Reminder deleted successfully!',
      data: {},
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}