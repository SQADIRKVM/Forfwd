import * as cheerio from 'cheerio';

export interface SearchResult {
    title: string;
    url: string;
    content: string;
    engine?: string;
    score?: number;
}

interface CacheEntry {
    results: SearchResult[];
    timestamp: number;
}

const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours
const searchCache = new Map<string, CacheEntry>();

const SEARXNG_URL = process.env.SEARXNG_URL || 'http://127.0.0.1:8080';

// Fetch one page of results (SearXNG supports ?pageno= param)
async function fetchPage(query: string, page: number, timeoutMs = 12000): Promise<SearchResult[]> {
    const url = `${SEARXNG_URL}/search`;
    const formData = new URLSearchParams();
    formData.append('q', query);
    formData.append('category_general', '1');
    formData.append('language', 'en');
    formData.append('pageno', String(page));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'text/html',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
            body: formData.toString(),
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
            console.warn(`SearxNG page ${page} returned status ${res.status}`);
            return [];
        }

        const html = await res.text();
        const $ = cheerio.load(html);
        const results: SearchResult[] = [];

        $('article.result').each((_i: number, el: unknown) => {
            const titleElem = $(el as Parameters<typeof $>[0]).find('h3 a');
            const title = titleElem.text().trim();
            const href = titleElem.attr('href');
            const content = $(el as Parameters<typeof $>[0]).find('.content').text().trim();
            if (title && href) {
                results.push({ title, url: href, content, engine: 'searxng' });
            }
        });

        return results;
    } catch (err) {
        clearTimeout(timeoutId);
        if (err instanceof Error && err.name === 'AbortError') {
            console.warn(`SearxNG page ${page} timed out for query: "${query}"`);
        } else {
            console.error(`SearxNG page ${page} error:`, err);
        }
        return [];
    }
}

/**
 * Search SearXNG with multi-page pagination.
 * @param query    The search string
 * @param maxPages How many pages to fetch (default: 5 → ~50 results per query)
 */
export async function searchSearxNG(query: string, maxPages = 5): Promise<SearchResult[]> {
    const cacheKey = `${query.trim().toLowerCase()}:pages${maxPages}`;
    const cached = searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
        console.log(`[SearXNG Cache Hit] "${query}"`);
        return cached.results;
    }

    console.log(`Searching SearXNG: "${query}" (up to ${maxPages} pages)`);

    const allResults: SearchResult[] = [];
    const seenUrls = new Set<string>();

    for (let page = 1; page <= maxPages; page++) {
        const pageResults = await fetchPage(query, page);

        if (pageResults.length === 0) {
            // No more results — stop early
            console.log(`  Page ${page}: 0 results, stopping early.`);
            break;
        }

        for (const r of pageResults) {
            if (!seenUrls.has(r.url)) {
                seenUrls.add(r.url);
                allResults.push(r);
            }
        }

        console.log(`  Page ${page}: ${pageResults.length} results | Total: ${allResults.length}`);

        // Small delay between pages to avoid burst rate-limiting
        if (page < maxPages) {
            await new Promise(r => setTimeout(r, 1200));
        }
    }

    console.log(`SearXNG total unique results for "${query}": ${allResults.length}`);
    if (allResults.length > 0) {
        searchCache.set(cacheKey, { results: allResults, timestamp: Date.now() });
    }
    return allResults;
}
