import client from "./client.js";

export async function getNews(page = 1) {
  const { data } = await client.get("/news/", { params: { page } });
  if (Array.isArray(data)) {
    return { results: data, count: data.length, next: null, previous: null };
  }
  return data;
}

export async function getNewsItem(slug) {
  const { data } = await client.get(`/news/${slug}/`);
  return data;
}
