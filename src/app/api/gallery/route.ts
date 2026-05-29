import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const GALLERY_DEFS = [
  { id: "pobots", name: "Pobots", albumHex: "VML2tRn" },
  { id: "prestlers", name: "Prestlers", albumHex: "RFbFrht" },
  { id: "cultural", name: "Cultural Pics", albumHex: "HVYDkG8" },
  { id: "pisc", name: "Pisc", albumHex: "Yt9J3Xt" },
  { id: "submissions", name: "Submissions", albumHex: "nMN0w6j" },
];

interface GalleryWork {
  id: string;
  file: string;
  title: string;
  gallery: string;
  galleryName: string;
  imageUrl: string;
}

interface GalleryData {
  id: string;
  name: string;
  tagline: string;
  wallClass: string;
  works: GalleryWork[];
}

interface GalleryResponse {
  galleries: Record<string, GalleryData>;
  allWorks: GalleryWork[];
  totalWorks: number;
}

const GALLERY_META: Record<string, { name: string; tagline: string; wallClass: string }> = {
  pobots: { name: "Pobots", tagline: "Robots. Petes. The intersection thereof.", wallClass: "room-wall-1" },
  prestlers: { name: "Prestlers", tagline: "Pete meets the squared circle and beyond.", wallClass: "room-wall-2" },
  cultural: { name: "Cultural Pics", tagline: "Art, culture, and things that are Pete.", wallClass: "room-wall-3" },
  pisc: { name: "Pisc", tagline: "A miscellany. A cornucopia. A Pisc.", wallClass: "room-wall-4" },
  submissions: { name: "Submissions", tagline: "Community contributions — submit your own Pete Pics via the spreadsheet.", wallClass: "room-wall-submissions" },
};

const CACHE_FILE = join(process.cwd(), "db", "gallery-cache.json");
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes in-memory, 2 hours file

function deriveTitle(name: string): string {
  try {
    name = decodeURIComponent(name);
  } catch {
    // keep as-is
  }
  name = name.replace(/-/g, " ");
  return name.trim() || name;
}

async function fetchGalleryPage(
  albumHex: string,
  page: number
): Promise<{ images: Array<(string | number | boolean)[]>; hasMore: boolean }> {
  const apiUrl = `https://postimg.cc/json?action=list&page=${page}&album=${albumHex}`;

  const res = await fetch(apiUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "application/json",
      Referer: "https://postimg.cc/",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for album ${albumHex} page ${page}`);
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(`API error for ${albumHex}: ${data.error.message || JSON.stringify(data.error)}`);
  }

  const images = data.images || [];
  const hasMore = data.has_page_next === true || data.has_page_next === "true";

  return { images, hasMore };
}

/* ── File-based cache ─────────────────────────────────────── */
function readCacheFile(): { data: GalleryResponse; timestamp: number } | null {
  try {
    if (!existsSync(CACHE_FILE)) return null;
    const raw = readFileSync(CACHE_FILE, "utf-8");
    const cached = JSON.parse(raw);
    if (cached && cached.data && cached.timestamp) return cached;
  } catch {}
  return null;
}

function writeCacheFile(data: GalleryResponse): void {
  try {
    writeFileSync(CACHE_FILE, JSON.stringify({ data, timestamp: Date.now() }), "utf-8");
  } catch (err) {
    console.warn("Failed to write gallery cache file:", err);
  }
}

/* ── In-memory cache ──────────────────────────────────────── */
let memoryCache: { data: GalleryResponse; timestamp: number } | null = null;

async function fetchAllGalleries(): Promise<GalleryResponse> {
  const galleries: Record<string, GalleryData> = {};
  const allWorks: GalleryWork[] = [];

  // Fetch galleries sequentially with delays to avoid rate-limiting
  for (let gi = 0; gi < GALLERY_DEFS.length; gi++) {
    const def = GALLERY_DEFS[gi];
    const meta = GALLERY_META[def.id];
    let page = 1;
    let hasMore = true;
    let retries = 0;

    galleries[def.id] = {
      id: def.id,
      name: meta.name,
      tagline: meta.tagline,
      wallClass: meta.wallClass,
      works: [],
    };

    while (hasMore) {
      try {
        const result = await fetchGalleryPage(def.albumHex, page);

        for (const img of result.images) {
          const [id, , name, ext] = img as [string, string, string, string, ...unknown[]];
          const file = `${name.replace(/ /g, "-")}.${ext}`;
          const imageUrl = `https://i.postimg.cc/${id}/${file}`;
          const work: GalleryWork = {
            id,
            file,
            title: deriveTitle(name),
            gallery: def.id,
            galleryName: meta.name,
            imageUrl,
          };

          allWorks.push(work);
          galleries[def.id].works.push(work);
        }

        hasMore = result.hasMore;
        page++;
        retries = 0;
        if (hasMore) await new Promise((r) => setTimeout(r, 600));
      } catch (err) {
        retries++;
        if (retries <= 2) {
          console.warn(`Retry ${retries} for ${def.name} page ${page}:`, err);
          await new Promise((r) => setTimeout(r, 2000 * retries));
        } else {
          console.warn(`Failed to fetch ${def.name} page ${page} after ${retries} retries:`, err);
          hasMore = false;
        }
      }
    }

    // Delay between galleries to avoid rate-limiting
    if (gi < GALLERY_DEFS.length - 1) {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  return { galleries, allWorks, totalWorks: allWorks.length };
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const forceRefresh = url.searchParams.get("refresh") === "true";

    // 1. Check memory cache (10-min TTL)
    if (!forceRefresh && memoryCache && Date.now() - memoryCache.timestamp < CACHE_TTL) {
      return NextResponse.json(memoryCache.data);
    }

    // 2. Check file cache (2-hour TTL — survives restarts)
    if (!forceRefresh) {
      const fileCache = readCacheFile();
      if (fileCache && Date.now() - fileCache.timestamp < 2 * 60 * 60 * 1000) {
        memoryCache = fileCache;
        return NextResponse.json(fileCache.data);
      }
    }

    // 3. Fetch fresh data
    const data = await fetchAllGalleries();

    // Update both caches
    memoryCache = { data, timestamp: Date.now() };
    writeCacheFile(data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Gallery fetch error:", error);
    // Return stale cache if available
    if (memoryCache) return NextResponse.json(memoryCache.data);
    const fileCache = readCacheFile();
    if (fileCache) return NextResponse.json(fileCache.data);
    return NextResponse.json(
      { error: "Failed to fetch gallery data", galleries: {}, allWorks: [], totalWorks: 0 },
      { status: 500 }
    );
  }
}
