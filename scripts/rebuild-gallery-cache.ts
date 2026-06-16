/**
 * Rebuild gallery-data.json with full-resolution image URLs from postimg.cc
 *
 * The postimg JSON API returns: [thumbId, fullResId, name, ext, width, height, thumbUrl, ...]
 * Previously we only used the thumbId, which served a tiny 180x180 or 320x320 thumbnail.
 * Now we use the fullResId to get the original resolution.
 */

import { writeFileSync } from "fs";
import { join } from "path";

interface GalleryWork {
  id: string;
  file: string;
  title: string;
  gallery: string;
  galleryName: string;
  imageUrl: string;
  fullImageUrl?: string;
  width?: number;
  height?: number;
  thumbUrl?: string;
}

const GALLERY_DEFS = [
  { id: "pobots", albumHex: "VML2tRn" },
  { id: "prestlers", albumHex: "RFbFrht" },
  { id: "cultural", albumHex: "HVYDkG8" },
  { id: "pisc", albumHex: "Yt9J3Xt" },
  { id: "submissions", albumHex: "nMN0w6j" },
];

function deriveTitle(name: string): string {
  try {
    name = decodeURIComponent(name);
  } catch {}
  name = name.replace(/-/g, " ");
  return name.trim() || name;
}

async function fetchGalleryPage(albumHex: string, page: number) {
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
  if (!res.ok) throw new Error(`HTTP ${res.status} for album ${albumHex} page ${page}`);
  const data = await res.json();
  if (data.error) throw new Error(`API error: ${data.error.message || JSON.stringify(data.error)}`);
  return {
    images: data.images || [],
    hasMore: data.has_page_next === true || data.has_page_next === "true",
  };
}

async function rebuild() {
  const galleries: Record<string, { id: string; works: GalleryWork[] }> = {};
  let totalWorks = 0;

  for (let gi = 0; gi < GALLERY_DEFS.length; gi++) {
    const def = GALLERY_DEFS[gi];
    console.log(`\n[${gi + 1}/${GALLERY_DEFS.length}] Fetching ${def.id}...`);
    let page = 1;
    let hasMore = true;
    let retries = 0;
    const works: GalleryWork[] = [];

    while (hasMore) {
      try {
        const result = await fetchGalleryPage(def.albumHex, page);
        console.log(`  Page ${page}: ${result.images.length} images`);

        for (const img of result.images) {
          const [thumbId, fullResId, name, ext, width, height] = img as [
            string, string, string, string, number, number, ...unknown[]
          ];
          const file = `${name.replace(/ /g, "-")}.${ext}`;
          const imageUrl = fullResId
            ? `https://i.postimg.cc/${fullResId}/${file}`
            : `https://i.postimg.cc/${thumbId}/${file}`;
          const thumbUrl = `https://i.postimg.cc/${thumbId}/${file}`;
          works.push({
            id: thumbId,
            file,
            title: deriveTitle(name),
            gallery: def.id,
            galleryName: def.id,
            imageUrl,
            fullImageUrl: imageUrl,
            width: typeof width === "number" ? width : undefined,
            height: typeof height === "number" ? height : undefined,
            thumbUrl,
          });
          totalWorks++;
        }

        hasMore = result.hasMore;
        page++;
        retries = 0;
        if (hasMore) await new Promise((r) => setTimeout(r, 600));
      } catch (err) {
        retries++;
        if (retries <= 2) {
          console.warn(`  Retry ${retries} for ${def.id} page ${page}:`, (err as Error).message);
          await new Promise((r) => setTimeout(r, 2000 * retries));
        } else {
          console.warn(`  Failed ${def.id} page ${page}:`, (err as Error).message);
          hasMore = false;
        }
      }
    }

    galleries[def.id] = { id: def.id, works };
    console.log(`  ✓ ${def.id}: ${works.length} works`);

    if (gi < GALLERY_DEFS.length - 1) {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  const outputPath = join(process.cwd(), "db", "gallery-data.json");
  const output = { galleries, totalWorks };
  writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf-8");

  console.log(`\n✅ Done! ${totalWorks} works written to ${outputPath}`);

  const sample = galleries.pobots?.works[0];
  if (sample) {
    console.log("\nSample work:");
    console.log(`  title:    ${sample.title}`);
    console.log(`  thumbUrl: ${sample.thumbUrl}`);
    console.log(`  imageUrl: ${sample.imageUrl}`);
    console.log(`  size:     ${sample.width}x${sample.height}`);
  }
}

rebuild().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
