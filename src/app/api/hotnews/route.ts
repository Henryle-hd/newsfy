
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const hotArticles = await prisma.article.findMany({
      take: 10,
      include: {
        user: true,
        comment: true,
      },
      orderBy: [
        {
          views: 'desc'
        },
        {
          likes: 'desc'
        },
        {
          comment: {
            _count: 'desc'
          }
        }
      ]
    });

    return NextResponse.json(hotArticles);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error fetching hot news" }, { status: 500 });
  }
}
