import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type BookmarkRequestBody = {
  userId: number;
  articleId: number;
};

export async function POST(request: Request) {
  try {
    const body: BookmarkRequestBody = await request.json();

    const userId = body.userId;
    const articleId = body.articleId;

    if (isNaN(userId) || isNaN(articleId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID or article ID' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const article = await prisma.article.findFirst({
      where: { id: articleId },
    });

    if (!article) {
      return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        articleId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Article bookmarked successfully!',
      data: {
        id: bookmark.id,
        userId: bookmark.userId,
        articleId: bookmark.articleId,
        createdAt: bookmark.createdAt.toISOString(),
        updatedAt: bookmark.updatedAt.toISOString(),
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error bookmarking article:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const userId = 1; // Replace with actual user ID extraction logic

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        article: {
          select: {
            id: true,
            title: true,
            content: true,
            category: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    const bookmarkedArticles = bookmarks.map((bookmark: any) => ({
      id: bookmark.article.id,
      title: bookmark.article.title,
      content: bookmark.article.content,
      category: bookmark.article.category,
      createdAt: bookmark.article.createdAt.toISOString(),
      updatedAt: bookmark.article.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      message: 'Bookmarked articles fetched successfully!',
      data: bookmarkedArticles,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching bookmarked articles:', error);
    return NextResponse.json({
      success: false,
      message: 'Error while fetching bookmarked articles',
    }, { status: 500 });
  }
}