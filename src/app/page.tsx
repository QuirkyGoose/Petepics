"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Palette,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

/* ── Types ────────────────────────────────────────────────── */
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

/* ── Constants ────────────────────────────────────────────── */
const GALLERY_ORDER = ["pobots", "prestlers", "cultural", "pisc"];
const FRAME_STYLES = ["frame-oak", "frame-gold", "frame-ebony", "frame-silver"];
const ROOMS = [
  { id: "all", label: "All Works" },
  { id: "pobots", label: "Pobots" },
  { id: "prestlers", label: "Prestlers" },
  { id: "cultural", label: "Cultural Pics" },
  { id: "pisc", label: "Pisc" },
] as const;

/* ── Lazy Image Component ─────────────────────────────────── */
function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && imgRef.current && !imgRef.current.src) {
            imgRef.current.src = src;
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "400px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  if (error) {
    return (
      <div className="img-error">
        <span>Unavailable</span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-[#1e1810] min-h-[80px]">
      {!loaded && <div className="img-shimmer" />}
      <img
        ref={imgRef}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-auto object-cover transition-all duration-500 group-hover:scale-105 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="spotlight-overlay" />
    </div>
  );
}

/* ── Artwork Card ─────────────────────────────────────────── */
function ArtworkCard({
  work,
  index,
  onClick,
}: {
  work: GalleryWork;
  index: number;
  onClick: () => void;
}) {
  const frameStyle = FRAME_STYLES[index % FRAME_STYLES.length];

  return (
    <motion.div
      className="artwork-card break-inside-avoid mb-6 cursor-pointer group"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.5), duration: 0.4 }}
      onClick={onClick}
    >
      <div className={`frame ${frameStyle}`}>
        <div className="frame-inner">
          <LazyImage src={work.imageUrl} alt={work.title} />
        </div>
      </div>
      <div className="nameplate">
        <div className="nameplate-title">{work.title}</div>
      </div>
    </motion.div>
  );
}

/* ── Main Page ────────────────────────────────────────────── */
export default function Home() {
  const [phase, setPhase] = useState<"entrance" | "gallery">("entrance");
  const [data, setData] = useState<GalleryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchStatus, setFetchStatus] = useState("Fetching collection…");
  const [currentRoom, setCurrentRoom] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxItems, setLightboxItems] = useState<GalleryWork[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* Fetch gallery data on mount */
  useEffect(() => {
    async function fetchData() {
      try {
        setFetchStatus("Connecting to gallery archive…");
        const res = await fetch("/api/gallery");
        if (!res.ok) throw new Error("Failed to fetch");

        setFetchStatus("Parsing collection data…");
        const json: GalleryResponse = await res.json();
        setData(json);
        setFetchStatus(`${json.totalWorks} works loaded`);
      } catch (err) {
        console.error("Gallery fetch error:", err);
        setFetchStatus("Failed to load — please refresh");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  /* Open gallery */
  const enterGallery = useCallback(() => {
    setPhase("gallery");
  }, []);

  /* Room change handler */
  const handleRoomChange = useCallback((room: string) => {
    setCurrentRoom(room);
    setSearchQuery("");
    setMobileMenuOpen(false);
    window.scrollTo({ top: 56, behavior: "smooth" });
  }, []);

  /* Lightbox navigation */
  const openLightbox = useCallback(
    (items: GalleryWork[], index: number) => {
      setLightboxItems(items);
      setLightboxIndex(index);
      setLightboxOpen(true);
    },
    []
  );

  const lbNav = useCallback(
    (dir: number) => {
      setLightboxIndex(
        (prev) => (prev + dir + lightboxItems.length) % lightboxItems.length
      );
    },
    [lightboxItems.length]
  );

  /* Keyboard navigation */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!lightboxOpen) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") lbNav(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") lbNav(-1);
      if (e.key === "Escape") setLightboxOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, lbNav]);

  /* Get visible works */
  const getVisibleWorks = useCallback((): GalleryWork[] => {
    if (!data) return [];
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      return data.allWorks.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.galleryName.toLowerCase().includes(q)
      );
    }
    if (currentRoom === "all") return data.allWorks;
    return data.galleries[currentRoom]?.works || [];
  }, [data, currentRoom, searchQuery]);

  const visibleWorks = getVisibleWorks();
  const currentLightboxWork = lightboxItems[lightboxIndex];

  /* ────── ENTRANCE ────── */
  if (phase === "entrance") {
    return (
      <section className="entrance-section">
        {/* Decorative columns */}
        <div className="entrance-columns" aria-hidden="true">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`col-pillar ${i === 1 || i === 2 ? "col-pillar-thin" : ""}`} />
          ))}
        </div>

        <motion.div
          className="entrance-inner text-center z-10 px-8 py-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          {/* Logo badge */}
          <motion.div
            className="logo-badge"
            animate={{
              boxShadow: [
                "0 0 20px rgba(184,148,42,0.15), inset 0 0 10px rgba(184,148,42,0.03)",
                "0 0 50px rgba(184,148,42,0.35), inset 0 0 30px rgba(184,148,42,0.08)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          >
            <Palette className="w-9 h-9 text-[var(--gold)]" />
          </motion.div>

          {/* Title */}
          <h1 className="museum-name">
            <span>Pete</span> Pics
          </h1>
          <p className="museum-subtitle">The Gallery · Est. 2024</p>
          <p className="museum-tagline">
            A permanent collection dedicated to the finest Pete-adjacent artwork, Pobots,
            Prestlers, and Cultural Artefacts of Our Time.
          </p>

          {/* Enter button */}
          <motion.button
            className="enter-btn"
            onClick={enterGallery}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Enter the Gallery
            <ArrowRight className="enter-btn-arrow" />
          </motion.button>

          {/* Loading indicator */}
          {loading && (
            <motion.div
              className="mt-8 flex items-center justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="loader-spinner" />
              <span className="font-['Josefin_Sans'] text-[0.7rem] tracking-[0.3em] uppercase text-[rgba(184,148,42,0.5)]">
                {fetchStatus}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Collection count */}
        <motion.div
          className="gallery-count"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.8 }}
        >
          {!loading && data
            ? `${data.totalWorks} works in the permanent collection`
            : !loading
            ? "Collection unavailable"
            : null}
        </motion.div>
      </section>
    );
  }

  /* ────── GALLERY ────── */
  return (
    <div className="min-h-screen flex flex-col bg-[var(--warm-white)]">
      {/* Navigation */}
      <nav className="gallery-nav">
        <div className="nav-logo">
          <span>Pete</span> Pics
        </div>

        {/* Desktop tabs */}
        <div className="nav-tabs">
          {ROOMS.map((room) => (
            <button
              key={room.id}
              className={`nav-tab ${currentRoom === room.id ? "active" : ""}`}
              onClick={() => handleRoomChange(room.id)}
            >
              {room.label}
            </button>
          ))}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Search */}
        <div className="search-wrap">
          <Search className="w-4 h-4 text-[var(--gold)] opacity-50" />
          <Input
            type="search"
            placeholder="Search works…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="gallery-search"
          />
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {ROOMS.map((room) => (
              <button
                key={room.id}
                className={`mobile-menu-item ${currentRoom === room.id ? "active" : ""}`}
                onClick={() => handleRoomChange(room.id)}
              >
                {room.label}
                {currentRoom === room.id && (
                  <span className="mobile-menu-count">
                    {room.id === "all"
                      ? data?.totalWorks || 0
                      : data?.galleries[room.id]?.works.length || 0}
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1">
        {/* Room header */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentRoom}-${searchQuery}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {!searchQuery && currentRoom !== "all" && data?.galleries[currentRoom] && (
              <div className={`room-header ${data.galleries[currentRoom].wallClass}`}>
                <div className="room-header-left">
                  <div className="room-eyebrow">Pete Pics — Permanent Collection</div>
                  <h2 className="room-title">
                    <em>{data.galleries[currentRoom].name}</em>
                  </h2>
                  <p className="room-desc">{data.galleries[currentRoom].tagline}</p>
                </div>
                <div className="room-count">
                  <strong>{data.galleries[currentRoom].works.length}</strong>
                  Works on Display
                </div>
              </div>
            )}

            {!searchQuery && currentRoom === "all" && (
              <div className="room-header">
                <div className="room-header-left">
                  <div className="room-eyebrow">Pete Pics — Full Collection</div>
                  <h2 className="room-title">
                    All <em>Works</em>
                  </h2>
                  <p className="room-desc">
                    The complete permanent collection across all four galleries.
                  </p>
                </div>
                <div className="room-count">
                  <strong>{data?.totalWorks || 0}</strong>
                  Works Total
                </div>
              </div>
            )}

            {searchQuery && (
              <div className="search-results-header">
                {visibleWorks.length > 0 ? (
                  <>
                    Showing <strong>{visibleWorks.length}</strong> result
                    {visibleWorks.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
                  </>
                ) : null}
              </div>
            )}

            {/* Wainscot */}
            {!searchQuery && <div className="wainscot" />}
          </motion.div>
        </AnimatePresence>

        {/* Gallery grid */}
        <div className="gallery-wall">
          {searchQuery && visibleWorks.length === 0 ? (
            <div className="no-results">
              No works found for &ldquo;{searchQuery}&rdquo;
            </div>
          ) : searchQuery || currentRoom !== "all" ? (
            <div className="gallery-grid">
              {visibleWorks.map((work, idx) => (
                <ArtworkCard
                  key={work.id}
                  work={work}
                  index={idx}
                  onClick={() => openLightbox(visibleWorks, idx)}
                />
              ))}
            </div>
          ) : (
            /* All rooms view */
            GALLERY_ORDER.map((galleryId) => {
              const gallery = data?.galleries[galleryId];
              if (!gallery || gallery.works.length === 0) return null;
              return (
                <div key={galleryId} className="all-room">
                  <div className="all-room-label">
                    {gallery.name} — {gallery.works.length} works
                  </div>
                  <div className="gallery-grid">
                    {gallery.works.map((work, idx) => (
                      <ArtworkCard
                        key={work.id}
                        work={work}
                        index={idx}
                        onClick={() => openLightbox(gallery.works, idx)}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="gallery-footer mt-auto">
        <strong>Pete Pics — The Gallery</strong>
        A collection of the world&apos;s finest Pete-related artwork · Images sourced from
        postimg.cc
      </footer>

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="lightbox-dialog">
          <DialogTitle className="sr-only">
            {currentLightboxWork?.title || "Artwork Viewer"}
          </DialogTitle>
          {currentLightboxWork && (
            <div className="lb-inner">
              <div className="lb-frame">
                <div className="lb-spotlight" aria-hidden="true" />
                <div className="lb-frame-inner">
                  <img
                    src={currentLightboxWork.imageUrl}
                    alt={currentLightboxWork.title}
                    className="lb-image"
                  />
                </div>
              </div>
              <div className="lb-info">
                <div className="lb-gallery-tag">{currentLightboxWork.galleryName}</div>
                <h2 className="lb-title">{currentLightboxWork.title}</h2>
                <div className="lb-position">
                  {lightboxIndex + 1} / {lightboxItems.length}
                </div>
                <div className="lb-nav">
                  <Button
                    variant="outline"
                    size="sm"
                    className="lb-btn"
                    onClick={() => lbNav(-1)}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="lb-btn"
                    onClick={() => lbNav(1)}
                  >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <a
                  href={currentLightboxWork.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lb-open-link"
                >
                  View full image <ExternalLink className="w-3 h-3 inline ml-1" />
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
