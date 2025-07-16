  import { NextResponse } from "next/server";
  import { getServerSession } from "next-auth";
  import { authOptions } from "@/lib/auth";
  import {prisma} from "@/lib/prisma";

  export async function GET() {
    try {
      const session = await getServerSession(authOptions);

      if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      // Get current and previous month dates
      const now = new Date();
      const currentMonth = now.getMonth();
      const previousMonth = currentMonth - 1;
    
      // Get stats
      const currentArticles = await prisma.article.count({
        where: {
          createdAt: {
            gte: new Date(now.getFullYear(), currentMonth, 1)
          }
        }
      });
      
      const totalArticle= await prisma.article.count()

      const previousArticles = await prisma.article.count({
        where: {
          createdAt: {
            gte: new Date(now.getFullYear(), previousMonth, 1),
            lt: new Date(now.getFullYear(), currentMonth, 1)
          }
        }
      });

      const currentSubscribers = await prisma.subscriber.count({
        where: {
          createdAt: {
            gte: new Date(now.getFullYear(), currentMonth, 1)
          }
        }
      });

      const previousSubscribers = await prisma.subscriber.count({
        where: {
          createdAt: {
            gte: new Date(now.getFullYear(), previousMonth, 1),
            lt: new Date(now.getFullYear(), currentMonth, 1)
          }
        }
      });

      // Get total views for current and previous month
      const articles = await prisma.article.findMany({
        select: {
          views: true,
          createdAt: true
        }
      });

      const currentViews = articles
        .filter(a => a.createdAt >= new Date(now.getFullYear(), currentMonth, 1))
        .reduce((sum, article) => sum + article.views, 0);

      const previousViews = articles
        .filter(a => a.createdAt >= new Date(now.getFullYear(), previousMonth, 1) && 
                    a.createdAt < new Date(now.getFullYear(), currentMonth, 1))
        .reduce((sum, article) => sum + article.views, 0);

      const currentComments = await prisma.commentForNew.count({
        where: {
          createdAt: {
            gte: new Date(now.getFullYear(), currentMonth, 1)
          }
        }
      });

      const previousComments = await prisma.commentForNew.count({
        where: {
          createdAt: {
            gte: new Date(now.getFullYear(), previousMonth, 1),
            lt: new Date(now.getFullYear(), currentMonth, 1)
          }
        }
      });

      // Get article trend (last 7 days)
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d;
      }).reverse();

      const articleTrend = await Promise.all(
        last7Days.map(async (date) => {
          const views = await prisma.article.aggregate({
            where: {
              createdAt: {
                gte: new Date(date.setHours(0,0,0,0)),
                lt: new Date(date.setHours(23,59,59,999))
              }
            },
            _sum: {
              views: true
            }
          });
        
          return {
            name: date.toLocaleDateString('en-US', { weekday: 'short' }),
            views: views._sum.views || 0
          };
        })
      );

      // Get category distribution
      const categories = ['HABARI', 'AFYA', 'TEHAMA', 'AJIRA', 'BURUDANI', 'MICHEZO'];
      const categoryDistribution = await Promise.all(
        categories.map(async (category) => {
          const count = await prisma.article.count({
            where: { category: category }
          });
          return {
            name: category,
            value: count
          };
        })
      );

      // Get recent subscribers with comment counts
      const recentSubscribers = await prisma.subscriber.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          name: true,
          email: true,
          commentForNew: true,
          _count: {
            select: { commentForNew: true }
          }
        }
      });

      const formattedSubscribers = recentSubscribers.map(sub => ({
        name: sub.name,
        email: sub.email,
        comment: sub._count.commentForNew
      }));

      const calculatePercentChange = (current: number, previous: number) => {
        if (previous === 0) return "0.0";
        return ((current - previous) / previous * 100).toFixed(1);
      };

      return NextResponse.json({
        stats: {
          articles: {
            totalArticle,
            current: currentArticles,
            previous: previousArticles,
            percentChange: calculatePercentChange(currentArticles, previousArticles)
          },
          subscribers: {
            current: currentSubscribers,
            previous: previousSubscribers,
            percentChange: calculatePercentChange(currentSubscribers, previousSubscribers)
          },
          views: {
            current: currentViews,
            previous: previousViews,
            percentChange: calculatePercentChange(currentViews, previousViews)
          },
          comments: {
            current: currentComments,
            previous: previousComments,
            percentChange: calculatePercentChange(currentComments, previousComments)
          }
        },
        articleTrend,
        categoryDistribution,
        RecentSubscribers: formattedSubscribers
      });

    } catch (error) {
      console.error("Error fetching overview data:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }
