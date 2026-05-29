import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

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

const GALLERY_DEFS = [
  { id: "pobots", albumHex: "VML2tRn" },
  { id: "prestlers", albumHex: "RFbFrht" },
  { id: "cultural", albumHex: "HVYDkG8" },
  { id: "pisc", albumHex: "Yt9J3Xt" },
  { id: "submissions", albumHex: "nMN0w6j" },
];

const DATA_FILE = join(process.cwd(), "db", "gallery-data.json");
const CACHE_FILE = join(process.cwd(), "db", "gallery-cache.json");

/* ── Build full response with metadata from local data file ── */
function buildResponse(rawData: { galleries: Record<string, { id: string; works: GalleryWork[] }>; totalWorks: number }): GalleryResponse {
  const galleries: Record<string, GalleryData> = {};
  const allWorks: GalleryWork[] = [];

  for (const [gid, g] of Object.entries(rawData.galleries)) {
    const meta = GALLERY_META[gid] || { name: gid, tagline: "", wallClass: "" };

    // Enrich works with gallery metadata
    const works = g.works.map((w) => ({
      ...w,
      galleryName: meta.name,
    }));

    galleries[gid] = {
      id: gid,
      name: meta.name,
      tagline: meta.tagline,
      wallClass: meta.wallClass,
      works,
    };

    allWorks.push(...works);
  }

  return { galleries, allWorks, totalWorks: allWorks.length };
}

/* ── Fetch from postimg.cc API (for refresh) ──────────────── */
function deriveTitle(name: string): string {
  try {
    name = decodeURIComponent(name);
  } catch {}
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
    throw new Error(`API error: ${data.error.message || JSON.stringify(data.error)}`);
  }

  return {
    images: data.images || [],
    hasMore: data.has_page_next === true || data.has_page_next === "true",
  };
}

async function refreshFromApi(): Promise<GalleryResponse | null> {
  const galleries: Record<string, GalleryData> = {};
  const allWorks: GalleryWork[] = [];

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
          console.warn(`Retry ${retries} for ${meta.name} page ${page}:`, err);
          await new Promise((r) => setTimeout(r, 2000 * retries));
        } else {
          console.warn(`Failed to fetch ${meta.name} page ${page}:`, err);
          hasMore = false;
        }
      }
    }

    if (gi < GALLERY_DEFS.length - 1) {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  const totalWorks = allWorks.length;
  if (totalWorks === 0) return null;

  // Save to data file for next cold start
  const rawSave = { galleries: {} as Record<string, { id: string; works: GalleryWork[] }>, totalWorks };
  for (const [gid, g] of Object.entries(galleries)) {
    rawSave.galleries[gid] = { id: g.id, works: g.works };
  }
  try {
    writeFileSync(DATA_FILE, JSON.stringify(rawSave, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to save gallery data file:", err);
  }

  return { galleries, allWorks, totalWorks };
}

/* ── In-memory cache ──────────────────────────────────────── */
let memoryCache: { data: GalleryResponse; timestamp: number } | null = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const forceRefresh = url.searchParams.get("refresh") === "true";

    // 1. Check memory cache (10-min TTL)
    if (!forceRefresh && memoryCache && Date.now() - memoryCache.timestamp < CACHE_TTL) {
      return NextResponse.json(memoryCache.data);
    }

    // 2. Check file cache (2-hour TTL)
    if (!forceRefresh) {
      const fileCache = readCacheFile();
      if (fileCache && Date.now() - fileCache.timestamp < 2 * 60 * 60 * 1000) {
        memoryCache = fileCache;
        return NextResponse.json(fileCache.data);
      }
    }

    // 3. Try to read from local data file (instant, no API call)
    const localData = readDataFile();
    if (localData) {
      const response = buildResponse(localData);
      memoryCache = { data: response, timestamp: Date.now() };
      writeCacheFile(response);

      // If refresh requested, also trigger a background API fetch
      if (forceRefresh) {
        refreshFromApi().then((freshData) => {
          if (freshData) {
            memoryCache = { data: freshData, timestamp: Date.now() };
            writeCacheFile(freshData);
          }
        }).catch(() => {});
      }

      return NextResponse.json(response);
    }

    // 4. Fall back to API fetch
    const apiData = await refreshFromApi();
    if (apiData) {
      memoryCache = { data: apiData, timestamp: Date.now() };
      writeCacheFile(apiData);
      return NextResponse.json(apiData);
    }

    // 5. Last resort — stale file cache
    const staleCache = readCacheFile();
    if (staleCache) return NextResponse.json(staleCache.data);

    return NextResponse.json(
      { error: "Failed to fetch gallery data", galleries: {}, allWorks: [], totalWorks: 0 },
      { status: 500 }
    );
  } catch (error) {
    console.error("Gallery fetch error:", error);
    if (memoryCache) return NextResponse.json(memoryCache.data);
    const staleCache = readCacheFile();
    if (staleCache) return NextResponse.json(staleCache.data);
    return NextResponse.json(
      { error: "Failed to fetch gallery data", galleries: {}, allWorks: [], totalWorks: 0 },
      { status: 500 }
    );
  }
}

function readDataFile() {
  try {
    if (!existsSync(DATA_FILE)) return null;
    const raw = readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

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
  } catch {}
}
