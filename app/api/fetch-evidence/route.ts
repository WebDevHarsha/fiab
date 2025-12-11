import { NextResponse } from "next/server";

const NEWS_API_KEY = process.env.NEWS_API_KEY;

async function fetchNewsForKeyword(keyword: string) {
  const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // last 30 days
    .toISOString()
    .split("T")[0];

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    keyword
  )}&language=en&from=${from}&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();
  return data.articles || [];
}

export async function POST(req: Request) {
  try {
    const { keywords } = await req.json();

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json({ error: "No keywords provided" }, { status: 400 });
    }

    const allArticles: any[] = [];

    for (const keyword of keywords) {
      const articles = await fetchNewsForKeyword(keyword);
      allArticles.push(...articles);
    }

    // Deduplicate by title
    const seen = new Set();
    const uniqueArticles = allArticles.filter((a) => {
      if (seen.has(a.title)) return false;
      seen.add(a.title);
      return true;
    });

    return NextResponse.json({ articles: uniqueArticles.slice(0, 20) });
  } catch (err) {
    console.error("Error fetching news:", err);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
