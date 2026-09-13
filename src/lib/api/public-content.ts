import { FORMS, NEWS } from "@/lib/owc-data";
import type { FormItem, NewsItem } from "./contracts";

type Fetcher = typeof fetch;

export function publicContentFallbackEnabled() {
  return process.env.NEXT_PUBLIC_OWC_PUBLIC_CONTENT_FALLBACK === "true";
}

export function localNewsContent(): NewsItem[] {
  return NEWS.map((item) => ({
    id: item.slug,
    slug: item.slug,
    category: item.category,
    date: item.date,
    title: item.title,
    excerpt: item.excerpt,
    body: item.body,
    image: item.image,
    featured: Boolean(item.featured),
  }));
}

export function localFormsContent(): FormItem[] {
  return FORMS.map((item) => ({
    id: item.code,
    code: item.code,
    title: item.title,
    category: item.category,
    format: item.format,
    size: item.size,
    updated: item.updated,
  }));
}

async function loadItems<T>(
  path: string,
  fallback: () => T[],
  fetcher: Fetcher,
  allowFallback: boolean,
): Promise<T[]> {
  try {
    const response = await fetcher(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`OWC content request failed with ${response.status}`);
    const payload = (await response.json()) as { items?: T[] };
    if (!Array.isArray(payload.items)) throw new Error("OWC content response is invalid");
    return payload.items;
  } catch (error) {
    if (allowFallback) return fallback();
    throw error;
  }
}

export function loadPublicNews(
  fetcher: Fetcher = fetch,
  allowFallback = publicContentFallbackEnabled(),
) {
  return loadItems<NewsItem>("/api/owc/content/news", localNewsContent, fetcher, allowFallback);
}

export function loadPublicForms(
  fetcher: Fetcher = fetch,
  allowFallback = publicContentFallbackEnabled(),
) {
  return loadItems<FormItem>("/api/owc/content/forms", localFormsContent, fetcher, allowFallback);
}
