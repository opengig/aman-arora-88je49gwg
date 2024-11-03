import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { bookmarkId: string } }
) {
  try {
    const bookmarkId = parseInt(params.bookmarkId, 10);
    if (isNaN(bookmarkId)) {
      return NextResponse.json({ success: false, message: 'Invalid bookmark ID' }, { status: 400 });
    }

    await prisma.bookmark.delete({
      where: { id: bookmarkId },
    });

    return NextResponse.json({
      success: true,
      message: 'Bookmark removed successfully!',
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error removing bookmark:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}