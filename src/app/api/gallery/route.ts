import { NextResponse } from "next/server";

const GALLERY_DEFS = [
  { id: "pobots", name: "Pobots", albumHex: "VML2tRn" },
  { id: "prestlers", name: "Prestlers", albumHex: "RFbFrht" },
  { id: "cultural", name: "Cultural Pics", albumHex: "HVYDkG8" },
  { id: "pisc", name: "Pisc", albumHex: "Yt9J3Xt" },
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

interface CachedData {
  timestamp: number;
  data: {
    galleries: Record<string, GalleryData>;
    allWorks: GalleryWork[];
    totalWorks: number;
  };
}

const GALLERY_META: Record<string, { name: string; tagline: string; wallClass: string }> = {
  pobots: { name: "Pobots", tagline: "Robots. Petes. The intersection thereof.", wallClass: "room-wall-1" },
  prestlers: { name: "Prestlers", tagline: "Pete meets the squared circle and beyond.", wallClass: "room-wall-2" },
  cultural: { name: "Cultural Pics", tagline: "Art, culture, and things that are Pete.", wallClass: "room-wall-3" },
  pisc: { name: "Pisc", tagline: "A miscellany. A cornucopia. A Pisc.", wallClass: "room-wall-4" },
};

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
): Promise<{ images: Array<[string, string, string, string]>; hasMore: boolean }> {
  const apiUrl = `https://postimg.cc/json?action=list&page=${page}&album=${albumHex}`;

  const res = await fetch(apiUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for album ${albumHex} page ${page}`);
  }

  const data = await res.json();
  const images = data.images || [];
  const hasMore = data.has_page_next === true || data.has_page_next === "true";

  return { images, hasMore };
}

/* ── In-memory cache with 10-minute TTL ────────────────────── */
let cachedData: CachedData | null = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

async function fetchAllGalleries() {
  const galleries: Record<string, GalleryData> = {};
  const allWorks: GalleryWork[] = [];

  // Fetch all galleries in parallel for speed
  await Promise.all(
    GALLERY_DEFS.map(async (def) => {
      const meta = GALLERY_META[def.id];
      let page = 1;
      let hasMore = true;

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
            const [id, , name, ext] = img;
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
        } catch (err) {
          console.warn(`Failed to fetch ${def.name} page ${page}:`, err);
          hasMore = false;
        }
      }
    })
  );

  return { galleries, allWorks, totalWorks: allWorks.length };
}

export async function GET(request: Request) {
  try {
    // Check for force-refresh parameter
    const url = new URL(request.url);
    const forceRefresh = url.searchParams.get("refresh") === "true";

    // Return cached data if still fresh (unless force-refresh requested)
    if (!forceRefresh && cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      return NextResponse.json(cachedData.data);
    }

    const data = await fetchAllGalleries();

    // Update cache
    cachedData = { timestamp: Date.now(), data };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Gallery fetch error:", error);
    // Return stale cache if available, otherwise error
    if (cachedData) {
      return NextResponse.json(cachedData.data);
    }
    return NextResponse.json(
      { error: "Failed to fetch gallery data", galleries: {}, allWorks: [], totalWorks: 0 },
      { status: 500 }
    );
  }
}
