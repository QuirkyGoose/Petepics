import { notFound } from "next/navigation";
import Link from "next/link";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ArrowLeft,
  Heart,
  Share2,
  Download,
} from "lucide-react";

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

interface GalleryData {
  galleries: Record<string, { id: string; works: GalleryWork[] }>;
  totalWorks: number;
}

const DATA_FILE = join(process.cwd(), "db", "gallery-data.json");

const GALLERY_NAMES: Record<string, string> = {
  pobots: "Pobots",
  prestlers: "Prestlers",
  cultural: "Cultural Pics",
  pisc: "Pisc",
  submissions: "Submissions",
};

/** Read gallery data from the local JSON file (server-side only). */
function readGalleryData(): GalleryData | null {
  try {
    if (!existsSync(DATA_FILE)) return null;
    const raw = readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Build the flat list of all works with enriched galleryName. */
function getAllWorks(data: GalleryData): GalleryWork[] {
  const all: GalleryWork[] = [];
  for (const [gid, g] of Object.entries(data.galleries)) {
    const name = GALLERY_NAMES[gid] || gid;
    for (const w of g.works) {
      all.push({ ...w, galleryName: name });
    }
  }
  return all;
}

/** Pre-generate all 1,377 artwork pages at build time. */
export function generateStaticParams() {
  const data = readGalleryData();
  if (!data) return [];
  return getAllWorks(data).map((w) => ({ id: w.id }));
}

/** Per-artwork metadata for SEO + social sharing. */
export function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  return params.then(({ id }) => {
    const data = readGalleryData();
    if (!data) return { title: "Artwork — Peet Pics" };
    const all = getAllWorks(data);
    const work = all.find((w) => w.id === id);
    if (!work) return { title: "Artwork — Peet Pics" };

    const imageUrl = work.imageUrl;
    return {
      title: `${work.title} — Peet Pics`,
      description: `${work.title} from the ${work.galleryName} collection. Part of the Peet Pics archive.`,
      openGraph: {
        title: `${work.title} — Peet Pics`,
        description: `From the ${work.galleryName} collection.`,
        type: "website",
        images: [{ url: imageUrl, width: work.width || 1200, height: work.height || 630, alt: work.title }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${work.title} — Peet Pics`,
        description: `From the ${work.galleryName} collection.`,
        images: [imageUrl],
      },
    };
  });
}

/** /artwork/[id] — Standalone artwork view (deep-linkable, SEO-friendly).
 *
 *  This is intentionally a server component: it renders fast, gets indexed
 *  by search engines, and produces proper OG cards when shared on social.
 *
 *  The interactive lightbox in /gallery/[room] remains the primary way to
 *  view artworks in context — this page is for direct links / social shares.
 */
export default async function ArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = readGalleryData();
  if (!data) notFound();

  const all = getAllWorks(data);
  const index = all.findIndex((w) => w.id === id);
  if (index === -1) notFound();

  const work = all[index];
  const prev = index > 0 ? all[index - 1] : null;
  const next = index < all.length - 1 ? all[index + 1] : null;

  return (
    <main className="artwork-page">
      <header className="artwork-header">
        <Link href={`/gallery/${work.gallery}`} className="artwork-back-link">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {work.galleryName}</span>
        </Link>
        <div className="artwork-header-brand">
          <span className="artwork-header-brand-mark">P</span>
          <span>Peet Pics — The Vault</span>
        </div>
      </header>

      <div className="artwork-content">
        {/* Image */}
        <div className="artwork-image-wrap">
          <img
            src={work.imageUrl}
            alt={work.title}
            className="artwork-image"
            width={work.width}
            height={work.height}
          />

          {/* Prev/Next floating arrows */}
          {prev && (
            <Link
              href={`/artwork/${prev.id}`}
              className="artwork-nav-arrow artwork-nav-prev"
              aria-label={`Previous: ${prev.title}`}
              title={`Previous: ${prev.title}`}
            >
              <ChevronLeft className="w-6 h-6" />
            </Link>
          )}
          {next && (
            <Link
              href={`/artwork/${next.id}`}
              className="artwork-nav-arrow artwork-nav-next"
              aria-label={`Next: ${next.title}`}
              title={`Next: ${next.title}`}
            >
              <ChevronRight className="w-6 h-6" />
            </Link>
          )}
        </div>

        {/* Info panel */}
        <aside className="artwork-info">
          <div className="artwork-info-gallery">{work.galleryName}</div>
          <h1 className="artwork-info-title">{work.title}</h1>
          <div className="artwork-info-meta">
            <span>#{index + 1} of {all.length}</span>
            {work.width && work.height && (
              <span> · {work.width}×{work.height}px</span>
            )}
          </div>

          <div className="artwork-info-actions">
            <a
              href={work.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="artwork-info-btn artwork-info-btn-primary"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Original</span>
            </a>
            <a
              href={work.imageUrl}
              download={`${work.file}`}
              className="artwork-info-btn"
              title="Download image"
            >
              <Download className="w-4 h-4" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out "${work.title}" from Peet Pics!`)}&url=${encodeURIComponent(work.imageUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="artwork-info-btn"
              title="Share on X/Twitter"
            >
              <Share2 className="w-4 h-4" />
            </a>
            <Link
              href={`/gallery/${work.gallery}`}
              className="artwork-info-btn"
              title={`View in ${work.galleryName}`}
            >
              <Heart className="w-4 h-4" />
            </Link>
          </div>

          {/* Prev/Next as text buttons below image info */}
          <div className="artwork-info-nav">
            {prev ? (
              <Link href={`/artwork/${prev.id}`} className="artwork-info-nav-btn">
                <ChevronLeft className="w-4 h-4" />
                <div className="artwork-info-nav-text">
                  <span className="artwork-info-nav-label">Previous</span>
                  <span className="artwork-info-nav-title">{prev.title}</span>
                </div>
              </Link>
            ) : (
              <div className="artwork-info-nav-btn artwork-info-nav-btn-disabled">
                <ChevronLeft className="w-4 h-4" />
                <div className="artwork-info-nav-text">
                  <span className="artwork-info-nav-label">Previous</span>
                  <span className="artwork-info-nav-title">Start of archive</span>
                </div>
              </div>
            )}
            {next ? (
              <Link href={`/artwork/${next.id}`} className="artwork-info-nav-btn artwork-info-nav-btn-next">
                <div className="artwork-info-nav-text artwork-info-nav-text-right">
                  <span className="artwork-info-nav-label">Next</span>
                  <span className="artwork-info-nav-title">{next.title}</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="artwork-info-nav-btn artwork-info-nav-btn-next artwork-info-nav-btn-disabled">
                <div className="artwork-info-nav-text artwork-info-nav-text-right">
                  <span className="artwork-info-nav-label">Next</span>
                  <span className="artwork-info-nav-title">End of archive</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
