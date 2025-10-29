import axios from "axios";

export async function fetchEvidenceFromNews(summaryData: any) {
  const API_KEY = process.env.NEWS_API_KEY; // stored in .env.local
  if (!API_KEY) throw new Error("Missing NEWS_API_KEY in environment.");

  // Use keywords from topics or fallback to summary text
  const query =
    summaryData?.topics?.join(" OR ") ||
    summaryData?.summary?.slice(0, 80) ||
    "startup innovation";

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    query
  )}&language=en&pageSize=5&sortBy=relevancy&apiKey=${API_KEY}`;

  try {
    const res = await axios.get(url);
    const articles = res.data.articles.map((a: any) => ({
      title: a.title,
      source: a.source.name,
      publishedAt: a.publishedAt,
      url: a.url,
      description: a.description,
    }));
    return articles;
  } catch (err: any) {
    console.error("NewsAPI fetch failed:", err.message);
    return [];
  }
}
