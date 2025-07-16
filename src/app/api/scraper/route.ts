  import { NextRequest, NextResponse } from "next/server";
  import axios from "axios";
  // Fix Cheerio import for ESM/TypeScript compatibility
  import * as cheerio from "cheerio";
  import { DateTime } from "luxon";
  import { PrismaClient } from "@prisma/client";

  const prisma = new PrismaClient();

  async function fetchHTML(url: string) {
    try {
      console.log(`Fetching HTML from URL: ${url}`);
      const { data } = await axios.get(url);
      return cheerio.load(data);
    } catch (error) {
      console.error("Error fetching URL:", error);
      return null;
    }
  }

  function isArticleNewer(articleDate: string | null, lastScrape: string | null) {
    console.log(`Checking if article date ${articleDate} is newer than last scrape ${lastScrape}`);
    if (!articleDate || !lastScrape) return true;
    try {
      const articleTime = DateTime.fromISO(articleDate);
      const lastScrapeTime = DateTime.fromISO(lastScrape);
      return articleTime > lastScrapeTime;
    } catch {
      return true;
    }
  }

  async function scrapeCategory(url: string, lastScrape: string | null = null) {
    console.log(`Starting to scrape category from URL: ${url}`);
    interface NewsArticle {
      category: string;
      title: string;
      ArticleSource: string;
      image: string;
      day: string;
      month: string;
      content: string;
      createdAt: string;
      createdByBot: boolean;
      isPublic: boolean;
      status: string;
      views: number;
      likes: number;
    }

    const news: NewsArticle[] = [];
    const $ = await fetchHTML(url);
    if (!$) return news;

    const articles = $("article");
    console.log(`Found ${articles.length} articles to process`);

    for (let i = 0; i < articles.length; i++) {
      try {
        console.log(`Processing article ${i + 1} of ${articles.length}`);
        const article = articles.eq(i);
        const category:string = article.find("span.term-badge").text().trim().toUpperCase();
        const validCategories = ["HABARI", "AFYA", "TEHAMA", "AJIRA", "BURUDANI", "MICHEZO"];
        if (!validCategories.includes(category)) {
          continue;
        }
        const links = article.find("a");

        if (links.length < 2) continue;

        const title = links.eq(1).attr("title");
        const href = links.eq(1).attr("href");

        console.log(`Found article: ${title}`);

        if (!title || !href) continue;

        const articlePage = await fetchHTML(href);
        let twitterImage = "";
        let fullDate = "";
        let day = "";
        let month = "";
        let content = "";

        if (articlePage) {
          console.log(`Extracting details from article page`);
          const twitterImageAttr = articlePage('meta[name="twitter:image"]').attr("content");
          twitterImage = twitterImageAttr || "";

          const dateElem = articlePage("time.post-published");
          if (dateElem.length) {
            const datetime = dateElem.attr("datetime");
            if (datetime) {
              fullDate = datetime;
              if (lastScrape && !isArticleNewer(fullDate, lastScrape)) {
                console.log(`Article is not newer than last scrape, skipping`);
                continue;
              }

              const dateParts = fullDate.split("-");
              if (dateParts.length >= 3) {
                month = dateParts[1];
                day = dateParts[2].split("T")[0];
              }
            }
          }

          const contentDiv = articlePage("article .single-post-content");
          if (contentDiv.length) {
            content = contentDiv.text() || "";
          }
        }

        if (lastScrape && !fullDate) {
          console.log(`No date found for article, skipping`);
          continue;
        }

        console.log(`Adding article to news array: ${title}`);
        news.push({
          category,
          title,
          ArticleSource: href,
          image: twitterImage,
          day,
          month,
          content,
          createdAt: fullDate,
          createdByBot: true,
          isPublic: false,
          status: "SCRAPED",
          views: 0,
          likes: 0,
        });
      } catch (err) {
        console.error("Error processing article:", err);
      }
    }

    console.log(`Finished scraping category, found ${news.length} articles`);
    return news;
  }

  async function getLastScrape(category: string) {
    console.log(`Getting last scrape for category: ${category}`);
    const last = await prisma.scraper.findFirst({
      where: { category },
      orderBy: { last_scrape: "asc" },
    });
    return last?.last_scrape ? DateTime.fromJSDate(last.last_scrape).toISO() : null;
  }

  async function getNewsByCategory(category: string | null = null) {
    console.log(`Starting news fetch for category: ${category}`);
    const baseUrl = "https://globalpublishers.co.tz";
    const categories: Record<string, string> = {
      ajira: `${baseUrl}/category/ajira/`,
      burudani: `${baseUrl}/category/burudani/`,
      michezo: `${baseUrl}/category/michezo/`,
      habari: `${baseUrl}/category/habari/`,
      afya: `${baseUrl}/category/afya/`,
    };

    interface NewsItem {
      category: string;
      title: string;
      ArticleSource: string;
      image: string;
      day: string;
      month: string;
      content: string;
      createdAt: string;
      createdByBot: boolean;
      isPublic: boolean;
      status: string;
      views: number;
      likes: number;
    }

    const allNews: NewsItem[] = [];
    const keys = category && category !== "all"
      ? [category]
      : Object.keys(categories);

    console.log(`Processing categories: ${keys.join(", ")}`);

    for (const cat of keys) {
      const url = categories[cat.toLowerCase()];
      if (!url) continue;
      console.log(`Processing category: ${cat}`);
      const lastScrapeForCat = await getLastScrape(cat);
      const news = await scrapeCategory(url, lastScrapeForCat);
      allNews.push(...news);
    }

    console.log(`Total articles found: ${allNews.length}`);
    return allNews;
  }

  export async function POST(req: NextRequest) {
    try {
      console.log("Starting POST request processing");
      const body = await req.json();
      const { category = "all" } = body;

      console.log(`Fetching news for category: ${category}`);
      const news = await getNewsByCategory(category);

      // Deduplicate
      console.log("Deduplicating articles");
      const seen = new Set();
      const uniqueNews = news.filter(article => {
        const key = `${article.title}-${article.ArticleSource}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      console.log(`Found ${uniqueNews.length} unique articles`);

      // Save articles to DB
      console.log("Saving articles to database");
      const createdArticles = [];
      for (const article of uniqueNews) {
        if (!article.title || !article.content) continue;
        try {
          console.log(`Creating article: ${article.title}`);
          const created = await prisma.article.create({
            data: {
              title: article.title,
              content: article.content,
              image: article.image || "",
              day: article.day || "",
              month: article.month || "",
              status: article.status,
              isPublic: article.isPublic,
              createdByBot: true,
              ArticleSource: article.ArticleSource,
              category: article.category || "",
              views: 0,
              likes: 0,
              createdAt: article.createdAt ? new Date(article.createdAt) : new Date(),
            },
          });
          createdArticles.push(created);
        } catch (err) {
          console.log("Error creating article:", err);
          continue;
        }
      }

      // Save scrape history
      console.log("Saving scrape history");
      const now = new Date();
      const categoriesScraped = category === "all"
        ? ["ajira", "burudani", "michezo", "habari","afya"]
        : [category];

      const scrapeHistories = [];
      for (const cat of categoriesScraped) {
        console.log(`Creating scrape history for category: ${cat}`);
        const scrapeHistory = await prisma.scraper.create({
          data: {
            status: "COMPLETED",
            category: cat,
            last_scrape: now,
          },
        });
        scrapeHistories.push(scrapeHistory);
      }

      console.log("Request processing completed successfully");
      return NextResponse.json({
        status: "success",
        category,
        last_scrape: now,
        total_articles: createdArticles.length,
        articles: createdArticles,
        scrape_history: scrapeHistories,
      });
    } catch (err) {
      console.error("Error processing request:", err);
      return NextResponse.json({ status: "error", message: err}, { status: 500});
    }
  }