"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Film,
  Sparkles,
  Heart,
  Upload,
  Grid3X3,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface GalleryResponse {
  galleries: Record<string, { id: string; name: string; tagline: string; works: unknown[] }>;
  totalWorks: number;
}

const ROOM_CARDS = [
  { id: "pobots", name: "Pobots", tagline: "Robots. Peets. The intersection thereof.", color: "amber" },
  { id: "prestlers", name: "Prestlers", tagline: "Peet meets the squared circle and beyond.", color: "rust" },
  { id: "cultural", name: "Cultural Pics", tagline: "Art, culture, and things that are Peet.", color: "rose" },
  { id: "pisc", name: "Pisc", tagline: "A miscellany. A cornucopia. A Pisc.", color: "sage" },
  { id: "submissions", name: "Submissions", tagline: "Community contributions from the spreadsheet.", color: "sage" },
  { id: "nacky", name: "Nacky Nook", tagline: "The most delightfully unhinged Peet content.", color: "violet" },
] as const;

/**
 * Landing page (/) — minimal hero + featured rooms + CTA into the archive.
 * Keeps the existing Vault aesthetic. Intentionally lightweight so the
 * gallery (which is heavy) loads only when the user clicks through.
 */
export default function LandingPage() {
  const [data, setData] = useState<GalleryResponse | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Hash-based redirect: support legacy #pobots, #prestlers etc. URLs
    const hash = window.location.hash.replace("#", "");
    const validRooms = ["all", "pobots", "prestlers", "cultural", "pisc", "submissions", "favourites", "nacky"];
    if (hash && validRooms.includes(hash)) {
      router.replace(`/gallery/${hash}`);
      return;
    }

    // Fetch gallery data so we can show counts on the landing page
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((json: GalleryResponse) => setData(json))
      .catch(() => {});
  }, [router]);

  const totalWorks = data?.totalWorks ?? null;
  const roomCount = data ? Object.keys(data.galleries).length : 0;

  return (
    <main className="landing-page">
      {/* Ambient background gradients — matches the Vault theme */}
      <div className="landing-bg" aria-hidden="true" />

      {/* Top brand strip */}
      <header className="landing-header">
        <div className="landing-brand">
          <span className="landing-brand-mark">P</span>
          <span className="landing-brand-text">Peet Pics</span>
          <span className="landing-brand-sub">THE VAULT</span>
        </div>
        <Link
          href="https://twitch.tv/AGoodPete"
          target="_blank"
          rel="noopener noreferrer"
          className="landing-twitch-link"
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
          </svg>
          AGoodPeet on Twitch
        </Link>
      </header>

      {/* Hero */}
      <section className="landing-hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="landing-eyebrow">EST. 2024 · CATALOGUE v7.0</div>
          <h1 className="landing-title">
            <span>Peet</span> Pics
          </h1>
          <p className="landing-tagline">
            A permanent archive dedicated to the finest Peet-adjacent artwork,
            Pobots, Prestlers, and Cultural Artefacts of Our Time.
          </p>

          {/* Stats row */}
          <div className="landing-stats">
            <div className="landing-stat">
              <div className="landing-stat-num">
                {totalWorks !== null ? totalWorks.toLocaleString() : "…"}
              </div>
              <div className="landing-stat-label">Works Archived</div>
            </div>
            <div className="landing-stat-divider" />
            <div className="landing-stat">
              <div className="landing-stat-num">{roomCount || "…"}</div>
              <div className="landing-stat-label">Collections</div>
            </div>
            <div className="landing-stat-divider" />
            <div className="landing-stat">
              <div className="landing-stat-num">∞</div>
              <div className="landing-stat-label">Pobots</div>
            </div>
          </div>

          {/* Primary CTA */}
          <Link href="/gallery/all" className="landing-cta">
            <Grid3X3 className="w-4 h-4" />
            <span>Enter the Archive</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Secondary CTAs */}
          <div className="landing-secondary-ctas">
            <Link href="/gallery/nacky" className="landing-secondary-cta">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nacky Nook</span>
            </Link>
            <Link href="/gallery/favourites" className="landing-secondary-cta">
              <Heart className="w-3.5 h-3.5" />
              <span>Favourites</span>
            </Link>
            <Link href="/gallery/submissions" className="landing-secondary-cta">
              <Upload className="w-3.5 h-3.5" />
              <span>Submit Yours</span>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Room cards */}
      <section className="landing-rooms">
        <div className="landing-rooms-header">
          <h2 className="landing-rooms-title">Browse by Collection</h2>
          <p className="landing-rooms-sub">Six chambers of the vault, each with its own character.</p>
        </div>
        <div className="landing-rooms-grid">
          {ROOM_CARDS.map((room, idx) => {
            const count = data?.galleries[room.id]?.works.length ?? null;
            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + idx * 0.06, ease: "easeOut" }}
              >
                <Link
                  href={`/gallery/${room.id}`}
                  className={`landing-room-card landing-room-${room.color}`}
                >
                  <div className="landing-room-card-header">
                    <span className="landing-room-card-name">{room.name}</span>
                    {count !== null && (
                      <span className="landing-room-card-count">{count}</span>
                    )}
                  </div>
                  <p className="landing-room-card-tagline">{room.tagline}</p>
                  <div className="landing-room-card-arrow">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-filmstrip" aria-hidden="true">
          <Film className="w-4 h-4" />
          <span>Built with ❤️ by the Peet Pics community</span>
          <Film className="w-4 h-4" />
        </div>
      </footer>
    </main>
  );
}
