  import { NextResponse } from "next/server";
  import { prisma } from "@/lib/prisma";
  import { getServerSession } from "next-auth";
  import { authOptions } from "@/lib/auth";

  export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { content, email, name, ArticleId } = body;

      if (!content || !email || !ArticleId || !name) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      // Check if subscriber exists
      let subscriber = await prisma.subscriber.findUnique({
        where: { email }
      });

      // If subscriber doesn't exist, create new subscriber
      if (!subscriber) {
        subscriber = await prisma.subscriber.create({
          data: {
            name,
            email
          }
        });
      }

      // Create comment
      const comment = await prisma.commentForNew.create({
        data: {
          content,
          subscriberId: subscriber.id,
          ArticleId
        }
      });

      return NextResponse.json(comment, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: "Internal Server Error" + error }, { status: 500 });
    }
  }

  export async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const articleId = searchParams.get("articleId");

      if (!articleId) {
        return NextResponse.json({ error: "Missing article ID" }, { status: 400 });
      }

      const comments = await prisma.commentForNew.findMany({
        where: {
          ArticleId: articleId
        },
        include: {
          subscriber: true,
          Article: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return NextResponse.json(comments, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Internal Server Error" + error }, { status: 500 });
    }
  }

  export async function DELETE(request: Request) {
    try {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { searchParams } = new URL(request.url);
      const commentId = searchParams.get("commentId");

      if (!commentId) {
        return NextResponse.json({ error: "Missing comment ID" }, { status: 400 });
      }

      const comment = await prisma.commentForNew.findUnique({
        where: { id: commentId },
        include: { subscriber: true }
      });

      if (!comment) {
        return NextResponse.json({ error: "Comment not found" }, { status: 404 });
      }

      if (comment.subscriber.email !== session.user?.email) {
        return NextResponse.json({ error: "Unauthorized to delete this comment" }, { status: 403 });
      }

      await prisma.commentForNew.delete({
        where: { id: commentId }
      });

      return NextResponse.json({ message: "Comment deleted successfully" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Internal Server Error" + error }, { status: 500 });
    }
  }

  export async function PUT(request: Request) {
    try {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const body = await request.json();
      const { commentId, content } = body;

      if (!commentId || !content) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      const comment = await prisma.commentForNew.findUnique({
        where: { id: commentId },
        include: { subscriber: true }
      });

      if (!comment) {
        return NextResponse.json({ error: "Comment not found" }, { status: 404 });
      }

      if (comment.subscriber.email !== session.user?.email) {
        return NextResponse.json({ error: "Unauthorized to update this comment" }, { status: 403 });
      }

      const updatedComment = await prisma.commentForNew.update({
        where: { id: commentId },
        data: { content },
        include: { subscriber: true }
      });

      return NextResponse.json(updatedComment, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Internal Server Error" + error }, { status: 500 });
    }
  }
