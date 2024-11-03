import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type ForumRequestBody = {
  title: string;
  userId: number;
};

export async function GET() {
  try {
    const forumThreads = await prisma.forumThread.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Forum threads fetched successfully!",
      data: forumThreads,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching forum threads:', error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: ForumRequestBody = await request.json();
    
    const { title, userId } = body;

    if (!title || isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid input fields' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const forumThread = await prisma.forumThread.create({
      data: {
        title,
        userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Forum thread created successfully!',
      data: {
        id: forumThread.id,
        title: forumThread.title,
        createdAt: forumThread.createdAt.toISOString(),
        updatedAt: forumThread.updatedAt.toISOString(),
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating forum thread:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}