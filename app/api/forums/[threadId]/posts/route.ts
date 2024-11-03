import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type PostRequestBody = {
  userId: number;
  content: string;
};

export async function GET(
  request: Request,
  { params }: { params: { threadId: string } }
) {
  try {
    const threadId = parseInt(params.threadId, 10);
    if (isNaN(threadId)) {
      return NextResponse.json({ success: false, message: 'Invalid thread ID' }, { status: 400 });
    }

    const posts = await prisma.forumPost.findMany({
      where: { threadId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Posts fetched successfully!',
      data: posts,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { threadId: string } }
) {
  try {
    const threadId = parseInt(params.threadId, 10);
    if (isNaN(threadId)) {
      return NextResponse.json({ success: false, message: 'Invalid thread ID' }, { status: 400 });
    }

    const body: PostRequestBody = await request.json();
    const { userId, content } = body;

    if (!userId || !content) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const thread = await prisma.forumThread.findFirst({
      where: { id: threadId },
    });

    if (!thread) {
      return NextResponse.json({ success: false, message: 'Thread not found' }, { status: 404 });
    }

    const post = await prisma.forumPost.create({
      data: {
        userId,
        content,
        threadId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Post created successfully!',
      data: {
        id: post.id,
        content: post.content,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}