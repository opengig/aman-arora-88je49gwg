import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type QuestionRequestBody = {
  userId: number;
  content: string;
};

export async function POST(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = parseInt(params.sessionId, 10);
    if (isNaN(sessionId)) {
      return NextResponse.json({ success: false, message: 'Invalid session ID' }, { status: 400 });
    }

    const body: QuestionRequestBody = await request.json();
    const { userId, content } = body;

    if (!userId || !content) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const question = await prisma.forumPost.create({
      data: {
        userId,
        content,
        threadId: sessionId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Question posted successfully!',
      data: {
        id: question.id,
        content: question.content,
        createdAt: question.createdAt.toISOString(),
        updatedAt: question.updatedAt.toISOString(),
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error posting question:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}