  
  
  import Image from "next/image";
  import { Metadata } from 'next';
  import NewsCardComp from '@/components/NewCard';
import HotNewsTicker from "@/components/HotNewsBanner";
import CommentForm from "@/components/CommentForm";
import LikeBtn from "@/components/LikeBtn";

interface UserType {
  id: string;
  name: string | null;
  image: string | null;
}

interface CommentType {
  id: string;
  content: string;
  subscriberId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Article {
  id: string;
  title: string;
  content: string;
  image: string;
  day: string;
  month: string;
  status?: string;
  isPublic: boolean;
  createdByBot: boolean;
  ArticleSource?: string;
  userid?: string;
  user?: UserType;
  category: string;
  comment: CommentType[];
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

async function getArticle(id: string): Promise<Article> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/article?id=${id}`);
  if (!res.ok) throw new Error('Failed to fetch article');
  return res.json();
}

async function getRelatedArticles(category: string): Promise<Article[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/article?category=${category}`);
  if (!res.ok) throw new Error('Failed to fetch related articles');
  const data = await res.json();
  return data.articles;
}

async function updateArticleViews(article: Article) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/article`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...article,
        views: article.views + 1
      }),
    });
    if (!response.ok) throw new Error('Failed to update views');
  } catch (error) {
    console.error('Error updating views:', error);
  }
}

// async function updateArticleLikes(article: Article) {
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/article`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         ...article,
//         likes: article.likes + 1
//       }),
//     });
//     if (!response.ok) throw new Error('Failed to update likes');
//     return await response.json();
//   } catch (error) {
//     console.error('Error updating likes:', error);
//   }
// }

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { idx } = await params;
  const article = await getArticle(idx);

  const cleanDescription = stripHtml(article.content).substring(0, 160);

  return {
    title: article.title,
    description: cleanDescription,
    openGraph: {
      title: article.title,
      description: cleanDescription,
      images: [article.image],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: cleanDescription,
      images: [article.image],
    },
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

type Props = {
  params: Promise<{ idx: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ params }: { params: Promise<{ idx: string }> }) {
  const { idx } = await params;
  const article = await getArticle(idx);
  const relatedNews = (await getRelatedArticles(article.category)).slice(0,3);

  // Update views when page loads
  await updateArticleViews(article);

  const months = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec'
  }

  const monthWord = months[Number(article.month) as keyof typeof months] || article.month || ''
  const day = Number(article.day) < 10 ? `${article.day}` : article.day

  // const handleLikeClick = async () => {
  //   const updatedArticle = await updateArticleLikes(article);
  //   if (updatedArticle) {
  //     article.likes = updatedArticle.likes;
  //   }
  // };

  return (
    <div className="font-['Roboto'] bg-[#fafbfc] min-h-screen pt-11">
      <div className="px-4 md:px-12 py-8 max-w-7xl m-auto">
        
        {/* Main Content */}
        <div className="flex-1 max-w-3xl mx-auto">
            <HotNewsTicker />
            {/* Article Title */}
          <h1 className="mt-5 mb-2 text-xl sm:text-3xl font-black text-gray-800 tracking-wide text-center">
            {article.title}
          </h1>

          {/* Author and Date */}
          <div className="flex items-center justify-center mb-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Image
                src={article.user?.image || "/avatar.webp"}
                alt="Author"
                width={24}
                height={24}
                className="rounded-full mr-2"
              />
              <span className="mr-2">{article.user?.name || "Newsfy Team"}</span>
            </div>
            <span className="mx-2">•</span>
            <time>{`${day} ${monthWord} ${new Date(article.createdAt).getFullYear()}`}</time>
          </div>

          {/* Article Image */}
          <div className="rounded-md overflow-hidden relative">
            <img
              src={article.image || "/samia3.webp"}
              alt={article.title}
              width={1000}
              height={1000}
              className="w-full h-[500px] object-cover"
              // priority
            />
            {/* Date Badge */}
            <div className="absolute top-0 right-0 bg-[#E6002D] text-white rounded-bl-lg py-2 px-3 flex flex-col items-center justify-center font-bold text-[1.6rem]">
              <div>{day}</div>
              <div className="text-xs sm:text-sm font-normal">{monthWord}</div>
            </div>
          </div>

          {/* Article Content */}
          <div className="mt-4 text-[#555] text-xs sm:text-sm leading-relaxed description_from_user">
            <div dangerouslySetInnerHTML={{__html:article.content}}></div>
             {/* Engagement Stats */}
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="flex items-center space-x-6">
             <LikeBtn articleId={idx}/>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{article.comment.length}</span>
              </button>
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{article.views} views</span>
            </div>
          </div>
          </div>
          {/* Categories */}
          <div className="border-t-2 border-gray-200 mt-2 pt-2 flex flex-col sm:flex-row justify-between sm:items-center">
              <div>
                  <div className="inline-flex ml-3 space-x-2">
                      <span className="text-xs px-3 py-1 rounded-sm font-semibold bg-black text-gray-100">
                          {article.category.toUpperCase()}
                      </span>
                  </div>
            </div>
            {/* Social Icons */}
            <div className="flex gap-3 mt-3">
                <a
                  title="Share on LinkedIn"
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL || '')}/habari/${idx}&title=${encodeURIComponent(article.title || '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                >
                  <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                  </svg>
                </a>
                <a
                  title="Share on Twitter"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title || '')}&url=${encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL || '')}/habari/${idx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                >
                  <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                  </svg>
                </a>
                <a
                  title="Share on WhatsApp"
                  href={`https://wa.me/?text=${encodeURIComponent(`${article.title || ''} ${process.env.NEXT_PUBLIC_APP_URL || ''}/habari/${idx}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                >
                  <svg className="w-3 h-3 text-gray-600" fill="currentColor" stroke="none" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </div>
          </div>

        <CommentForm articleId={idx}/>
          {/* Related News */}
          <div className="border border-gray-200 rounded-xs  mt-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase px-4 pt-4">Related News</h2>
            <hr className="border-gray-200"/>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedNews.map((news) => (
                <NewsCardComp
                  key={news.id}
                  id={news.id}
                  day={news.day}
                  month={news.month}
                  title={news.title}
                  image={news.image}
                  pageName={""}
                  isFirst={false}
                />
              ))}
            </div>
          </div>

          
        </div>

     </div>
      </div>
    );
  }
