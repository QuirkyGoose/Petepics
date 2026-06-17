import { MetadataRoute } from "next";
import { readFileSync, existsSync } from "fs";
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
  galleries: Record<string, { id: string; works: GalleryWork[] }>;
  totalWorks: number;
}

const DATA_FILE = join(process.cwd(), "db", "gallery-data.json");
const GALLERY_IDS = ["all", "pobots", "prestlers", "cultural", "pisc", "submissions", "favourites", "nacky"];

function readGalleryData(): GalleryData | null {
  try {
    if (!existsSync(DATA_FILE)) return null;
    const raw = readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Generate sitemap.xml dynamically from the gallery data.
 * Includes: landing page, all gallery rooms, and all 1,377 artwork pages.
 *
 * Refreshes whenever the data file changes (Next.js calls this at build time
 * and revalidates every hour).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://petepics-github-io.vercel.app";
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // Gallery rooms
  for (const gid of GALLERY_IDS) {
    entries.push({
      url: `${baseUrl}/gallery/${gid}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  // Artwork pages
  const data = readGalleryData();
  if (data) {
    for (const g of Object.values(data.galleries)) {
      for (const work of g.works) {
        entries.push({
          url: `${baseUrl}/artwork/${work.id}`,
          lastModified: now,
          changeFrequency: "yearly",
          priority: 0.6,
        });
      }
    }
  }

  return entries;
}
