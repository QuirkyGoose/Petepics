"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
  ArrowUp,
  DoorOpen,
  Grid3X3,
  Eye,
  Shuffle,
} from "lucide-react";
import { Input } from "@/components/ui/input";

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
  { id: "all", label: "All Works", icon: Grid3X3 },
  { id: "pobots", label: "Pobots", icon: null },
  { id: "prestlers", label: "Prestlers", icon: null },
  { id: "cultural", label: "Cultural Pics", icon: null },
  { id: "pisc", label: "Pisc", icon: null },
] as const;

/* ── Floating Particles ───────────────────────────────────── */
function FloatingParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: ((i * 37 + 13) % 100),        // deterministic pseudo-random
        y: ((i * 53 + 7) % 100),
        size: (i % 3) + 1,
        duration: (i % 20) + 15,
        delay: (i % 10),
      })),
    []
  );

  return (
    <div className="particles-container" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="particle"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, -10, 5, 0],
            opacity: [0.1, 0.4, 0.2, 0.5, 0.1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: Math.min(index * 0.015, 0.3), duration: 0.5, ease: "easeOut" }}
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

/* ── Custom Lightbox ──────────────────────────────────────── */
function Lightbox({
  isOpen,
  onClose,
  work,
  position,
  total,
  onPrev,
  onNext,
}: {
  isOpen: boolean;
  onClose: () => void;
  work: GalleryWork | null;
  position: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const currentWorkId = work?.id ?? "";
  const zoomed = useState(false);
  // Reset zoom when artwork changes — use key on the container instead
  const isZoomed = zoomed[0];
  const setIsZoomed = zoomed[1];

  if (!isOpen || !work) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="lb-overlay"
        key={currentWorkId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Close button */}
        <button className="lb-close" onClick={onClose} aria-label="Close lightbox">
          <X className="w-5 h-5" />
        </button>

        <motion.div
          className="lb-content"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Frame with spotlight */}
          <div className="lb-frame">
            <div className="lb-spotlight" aria-hidden="true" />
            <div className="lb-frame-inner" onClick={() => setIsZoomed(!isZoomed)}>
              <img
                src={work.imageUrl}
                alt={work.title}
                className={`lb-image ${isZoomed ? "lb-image-zoomed" : ""}`}
              />
              <div className="lb-zoom-hint">
                {isZoomed ? "Click to zoom out" : "Click to zoom in"}
              </div>
            </div>
          </div>

          {/* Info panel */}
          <div className="lb-info">
            <div className="lb-gallery-tag">{work.galleryName}</div>
            <h2 className="lb-title">{work.title}</h2>
            <div className="lb-position">
              {position + 1} / {total}
            </div>

            {/* Progress bar */}
            <div className="lb-progress-track">
              <div
                className="lb-progress-fill"
                style={{ width: `${((position + 1) / total) * 100}%` }}
              />
            </div>

            <div className="lb-nav">
              <button className="lb-btn" onClick={onPrev}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </button>
              <button className="lb-btn" onClick={onNext}>
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <a
              href={work.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="lb-open-link"
            >
              View full image <ExternalLink className="w-3 h-3 inline ml-1" />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Scroll-to-Top Button ─────────────────────────────────── */
function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="scroll-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ── Stats Bar ────────────────────────────────────────────── */
function StatsBar({ data }: { data: GalleryResponse | null }) {
  if (!data) return null;
  const galleries = Object.values(data.galleries);

  return (
    <div className="stats-bar">
      {galleries.map((g) => (
        <div key={g.id} className="stat-item">
          <span className="stat-count">{g.works.length}</span>
          <span className="stat-label">{g.name}</span>
        </div>
      ))}
      <div className="stat-divider" />
      <div className="stat-item stat-item-total">
        <span className="stat-count stat-count-total">{data.totalWorks}</span>
        <span className="stat-label">Total Works</span>
      </div>
    </div>
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
  const [viewedCount, setViewedCount] = useState(0);

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
      setViewedCount((c) => c + 1);
      document.body.style.overflow = "hidden";
    },
    []
  );

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  }, []);

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
      if (e.key === "Escape") closeLightbox();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, lbNav, closeLightbox]);

  /* Random artwork */
  const handleRandom = useCallback(() => {
    if (!data || data.allWorks.length === 0) return;
    const randomWork = data.allWorks[Math.floor(Math.random() * data.allWorks.length)];
    const room = randomWork.gallery;
    const works = data.galleries[room]?.works || data.allWorks;
    const idx = works.findIndex((w) => w.id === randomWork.id);
    openLightbox(works, idx >= 0 ? idx : 0);
  }, [data, openLightbox]);

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
      <section className="entrance-section" suppressHydrationWarning>
        {/* Floating particles */}
        <FloatingParticles />

        {/* Decorative columns */}
        <div className="entrance-columns" aria-hidden="true">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`col-pillar ${i === 1 || i === 2 || i === 4 || i === 5 ? "col-pillar-thin" : ""}`}
            />
          ))}
        </div>

        {/* Ornamental top border */}
        <div className="entrance-top-border" aria-hidden="true" />

        <motion.div
          className="entrance-inner text-center z-10 px-8 py-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          suppressHydrationWarning
        >
          {/* Logo badge with ring animation */}
          <div className="logo-badge-container">
            <motion.div
              className="logo-ring"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="logo-badge"
              animate={{
                boxShadow: [
                  "0 0 30px rgba(184,148,42,0.15), inset 0 0 15px rgba(184,148,42,0.05)",
                  "0 0 60px rgba(184,148,42,0.4), inset 0 0 40px rgba(184,148,42,0.1)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            >
              <Palette className="w-9 h-9 text-[var(--gold)]" suppressHydrationWarning />
            </motion.div>
          </div>

          {/* Title with staggered animation */}
          <motion.h1
            className="museum-name"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span>Pete</span> Pics
          </motion.h1>
          <motion.p
            className="museum-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            The Gallery · Est. 2024
          </motion.p>
          <motion.p
            className="museum-tagline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            A permanent collection dedicated to the finest Pete-adjacent artwork, Pobots,
            Prestlers, and Cultural Artefacts of Our Time.
          </motion.p>

          {/* Enter button */}
          <motion.button
            className="enter-btn"
            onClick={enterGallery}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
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
              transition={{ delay: 1.5 }}
            >
              <div className="loader-spinner" />
              <span className="entrance-loading-text">{fetchStatus}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Ornamental bottom border */}
        <div className="entrance-bottom-border" aria-hidden="true" />

        {/* Collection count */}
        <motion.div
          className="gallery-count"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          suppressHydrationWarning
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
    <div className="min-h-screen flex flex-col bg-[var(--warm-white)]" suppressHydrationWarning>
      {/* Navigation */}
      <nav className="gallery-nav">
        <button
          className="nav-back-btn"
          onClick={() => setPhase("entrance")}
          aria-label="Back to entrance"
          title="Back to Entrance"
        >
          <DoorOpen className="w-4 h-4" />
        </button>
        <div className="nav-logo">
          <span>Pete</span> Pics
        </div>

        {/* Desktop tabs with count badges */}
        <div className="nav-tabs">
          {ROOMS.map((room) => {
            const count =
              room.id === "all"
                ? data?.totalWorks || 0
                : data?.galleries[room.id]?.works.length || 0;
            return (
              <button
                key={room.id}
                className={`nav-tab ${currentRoom === room.id ? "active" : ""}`}
                onClick={() => handleRoomChange(room.id)}
              >
                {room.label}
                <span className="nav-tab-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="nav-actions">
          <button
            className="nav-action-btn"
            onClick={handleRandom}
            title="Random Artwork"
            aria-label="View random artwork"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            className="nav-action-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

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
            {ROOMS.map((room) => {
              const count =
                room.id === "all"
                  ? data?.totalWorks || 0
                  : data?.galleries[room.id]?.works.length || 0;
              return (
                <button
                  key={room.id}
                  className={`mobile-menu-item ${currentRoom === room.id ? "active" : ""}`}
                  onClick={() => handleRoomChange(room.id)}
                >
                  {room.label}
                  <span className="mobile-menu-count">{count}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats bar */}
      <StatsBar data={data} />

      {/* Viewed counter */}
      {viewedCount > 0 && (
        <div className="viewed-counter">
          <Eye className="w-3 h-3" /> {viewedCount} artwork{viewedCount !== 1 ? "s" : ""} viewed
        </div>
      )}

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

      {/* Scroll to top */}
      <ScrollToTop />

      {/* Custom Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        work={currentLightboxWork}
        position={lightboxIndex}
        total={lightboxItems.length}
        onPrev={() => lbNav(-1)}
        onNext={() => lbNav(1)}
      />
    </div>
  );
}
