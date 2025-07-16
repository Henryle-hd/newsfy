  import { NextResponse } from "next/server";
  import {prisma} from "@/lib/prisma";
  import { getServerSession } from "next-auth";
  import { authOptions } from "@/lib/auth";
  import sendEmail from "@/lib/email";

  // GET all articles
  export async function GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');
      const category = searchParams.get('category');
      const allArticle = searchParams.get('all');
      const isPublic = searchParams.get('isPublic') === 'true';
      const page = parseInt(searchParams.get('page') || '1');
      const limit = 8;
      const skip = (page - 1) * limit;

      if (id) {
        const article = await prisma.article.findUnique({
          where: { id },
          include: {
            user: true,
            comment: true,
          }
        });
        if (!article) {
          return NextResponse.json({ error: "Article not found" }, { status: 404 });
        }
        return NextResponse.json(article);
      }

      if (allArticle){
        const articles= await prisma.article.findMany({
          where: isPublic ? { isPublic: true } : {},
          orderBy:{createdAt:'desc'}
        })

        return NextResponse.json({articles})
      }

      const whereClause = {
        ...(category ? { category } : {}),
        ...(isPublic ? { isPublic: true } : {})
      };

      const [articles, total] = await Promise.all([
        prisma.article.findMany({
          where: whereClause,
          include: {
            user: true,
            comment: true,
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: limit,
          skip: skip,
        }),
        prisma.article.count({
          where: whereClause
        })
      ]);

      return NextResponse.json({
        articles,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      });
    } catch (error) {
      console.log(error)
      return NextResponse.json({ error: "Error fetching articles" }, { status: 500 });
    }
  }

  // POST new article
  export async function POST(req: Request) {
    try {
      const session = await getServerSession(authOptions);
      const body = await req.json();
      const { title, content, image, day, month, category, status, isPublic, createdByBot, ArticleSource } = body;

      const article = await prisma.article.create({
        data: {
          title,
          content,
          image,
          day,
          month,
          category,
          status,
          isPublic,
          createdByBot,
          ArticleSource,
          userid: session?.user?.id,
          views: 0,
          likes: 0,
        },
      });

      if (isPublic) {
        const subscribers = await prisma.subscriber.findMany();
        const emailContent = `
          <div style="">
            <div class="">
              <img src="${image}" alt="${title}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px;"/>
              <h3 style="color: #1a202c; margin: 15px 0; font-size: large;">${title}</h3>
              <p style="color: #4a5568;">${content.substring(0, 600)}...</p>
              <div style="margin: 20px 0;">
                <a href="https://newsfy-nine.vercel.app/habari/${article.id}" style="background: #E6002D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Read More</a>
              </div>
            </div>
          </div>
        `;
      
        await sendEmail(
          `Updates: ${title}`,
          emailContent,
          subscribers.map(sub => sub.email),
          "Newsfy"
        );
      }

      return NextResponse.json(article);
    } catch (error) {
      console.log(error)
      return NextResponse.json({ error: "Error creating article" }, { status: 500 });
    }
  }

  // PUT update article
  export async function PUT(req: Request) {
    try {
      const session = await getServerSession(authOptions);
      const body = await req.json();
      const { id, title, content, image, day, month, category, status, isPublic, createdByBot, ArticleSource, views, likes } = body;

      // const existingArticle = await prisma.article.findUnique({
      //   where: { id }
      // });

      if (views !== undefined || likes !== undefined) {
        const article = await prisma.article.update({
          where: { id: id },
          data: { views, likes },
        });
        return NextResponse.json(article);
      }

      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const article = await prisma.article.update({
        where: {
          id: id,
        },
        data: {
          title,
          content,
          image,
          day,
          month,
          category,
          status,
          isPublic,
          createdByBot,
          ArticleSource,
        },
      });

      // if (isPublic && existingArticle?.isPublic === false) {
      //   const subscribers = await prisma.subscriber.findMany();
      //   const emailContent = `
      //     <div style="p">
      //       <div class="">
      //         <img src="${image}" alt="${title}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px;"/>
      //         <h3 style="color: #1a202c; margin: 15px 0;">${title}</h3>
      //         <p style="color: #4a5568;">${existingArticle.content.substring(0, 500)}...</p>
      //         <div style="margin: 20px 0;">
      //           <a href="https://newsfy-nine.vercel.app/habari/${article.id}" style="background: #E6002D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Read More</a>
      //         </div>
      //       </div>
      //     </div>
      //   `;
      //   await sendEmail(
      //     `Updates: ${title}`,
      //     emailContent,
      //     subscribers.map(sub => sub.email),
      //     "Newsfy"
      //   );
      // }

      return NextResponse.json(article);
    } catch (error) {
      console.log(error)
      return NextResponse.json({ error: "Error updating article" }, { status: 500 });
    }
  }

  // DELETE article
  export async function DELETE(req: Request) {
    try {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if (!id) {
        return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
      }

      const article = await prisma.article.delete({
        where: {
          id: id,
        },
      });

      return NextResponse.json(article);
    } catch (error) {
      console.log(error)
      return NextResponse.json({ error: "Error deleting article" }, { status: 500 });
    }
  }
