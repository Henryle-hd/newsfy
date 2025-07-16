
import axios from 'axios'
import * as cheerio from'cheerio';

async function response(url) {
    try {
        const response = await axios.get(url);
        return response;
    } catch (e) {
        console.error(`Error: ${e}`);
    }
}

async function getSoup(url) {
    const res = await response(url);
    return res ? cheerio.load(res.data) : null;
}

function isArticleNewer(articleDate, lastScrape) {
    if (!lastScrape) {
        return true;
    }
    return articleDate > lastScrape;
}

async function tehamaNews(url = "https://www.mawasiliano.go.tz/news", lastScrape) {
    const news = [];
    const mainSoup = await getSoup(url);
    
    if (!mainSoup) {
        return news;
    }

    const articlesSoup = mainSoup(".post-slide7");
    console.error(`Found ${articlesSoup.length} articles on page`);

    for (let i = 0; i < articlesSoup.length; i++) {
        try {
            const article = articlesSoup.eq(i);
            const image = article.find("img").attr("src");
            const title = article.find("p").text().trim();
            const date = article.find("ul").text().trim();
            const month = date.split(" ")[0];
            const day = date.split(" ")[1].replace(",", " ").trim();
            const dateObj = new Date(date);
            const isoDate = dateObj.toISOString();

            if (!isArticleNewer(dateObj, lastScrape)) {
                continue;
            }

            const link = article.find("a").attr("href");

            // content
            let content = null;
            const contentSoup = await getSoup(link);
            if (contentSoup) {
                content = contentSoup(".news-content").text();
                console.log(title);
            }

            news.push({
                category: "TEHAMA",
                title: title,
                ArticleSource: link,
                image: image,
                day: day,
                month: month,
                content: content,
                createdAt: isoDate,
                createdByBot: true
            });
        } catch (e) {
            console.error(`Error processing article: ${e}`);
            continue;
        }
    }
    return news;
}

// tehamaNews().then(console.log);
export default tehamaNews;
