"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
  ArrowUp,
  Grid3X3,
  Shuffle,
  Heart,
  Share2,
  Sun,
  Moon,
  Info,
  Sparkles,
  Play,
  Pause,
  Download,
  Film,
  LayoutGrid,
  List,
  Maximize,
  BarChart3,
  Columns2,
  Volume2,
  VolumeX,
  Upload,
  DownloadCloud,
  Expand,
  ChevronDown,
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
const GALLERY_ABBREVIATIONS: Record<string, string> = {
  pobots: "PBT",
  prestlers: "PST",
  cultural: "CUL",
  pisc: "PSC",
};
const FRAME_STYLES = ["frame-oak", "frame-gold", "frame-ebony", "frame-silver"];
const TWITCH_URL = "https://twitch.tv/AGoodPete";
const SPREADSHEET_URL =
  "https://docs.google.com/spreadsheets/d/1wScbL0TrHCmo17wN_vx8LxzWRA-K6BDfMekyY6JsI0A/edit?gid=0#gid=0";
const FAVS_STORAGE_KEY = "petepics_favourites";
const VIEWMODE_STORAGE_KEY = "petepics_viewmode";
const RECENT_STORAGE_KEY = "petepics_recently_viewed";

const ROOMS = [
  { id: "all", label: "All Works", icon: Grid3X3 },
  { id: "pobots", label: "Pobots", icon: null },
  { id: "prestlers", label: "Prestlers", icon: null },
  { id: "cultural", label: "Cultural Pics", icon: null },
  { id: "pisc", label: "Pisc", icon: null },
  { id: "favourites", label: "Favourites", icon: Heart },
  { id: "nacky", label: "Nacky Nook", icon: Sparkles },
] as const;

type ViewMode = "grid" | "list" | "solo";

const PAGE_SIZE = 60;

/* ── Twitch SVG Icon ──────────────────────────────────────── */
function TwitchIcon({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
    >
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
    </svg>
  );
}

/* ── Favourites Hook (hydration-safe) ─────────────────────── */
function useFavourites() {
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVS_STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage after mount to avoid SSR mismatch
      if (stored) setFavs(new Set(JSON.parse(stored)));
    } catch {}
    setMounted(true);
  }, []);

  const isFav = useCallback(
    (id: string) => mounted && favs.has(id),
    [favs, mounted]
  );

  const favCount = mounted ? favs.size : 0;

  const toggleFav = useCallback((id: string) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(FAVS_STORAGE_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }, []);

  return { favs, toggleFav, isFav, favCount };
}

/* ── Theme Hook (hydration-safe) ──────────────────────────── */
function useTheme() {
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate theme from localStorage after mount to avoid SSR mismatch
    setMounted(true);
    try {
      const stored = localStorage.getItem("petepics_theme");
      if (stored) setDark(stored === "dark");
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "dark" : "light"
    );
    try {
      localStorage.setItem("petepics_theme", dark ? "dark" : "light");
    } catch {}
  }, [dark, mounted]);

  const toggle = useCallback(() => setDark((d) => !d), []);

  return { dark, toggle, mounted };
}

/* ── View Mode Hook (hydration-safe) ──────────────────────── */
function useViewMode() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage
    setMounted(true);
    try {
      const stored = localStorage.getItem(VIEWMODE_STORAGE_KEY) as ViewMode | null;
      if (stored && ["grid", "list", "solo"].includes(stored)) setViewMode(stored);
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(VIEWMODE_STORAGE_KEY, viewMode);
    } catch {}
  }, [viewMode, mounted]);

  const cycleView = useCallback(() => {
    setViewMode((prev) => {
      if (prev === "grid") return "list";
      if (prev === "list") return "solo";
      return "grid";
    });
  }, []);

  return { viewMode, setViewMode, cycleView };
}

/* ── Recently Viewed Hook (hydration-safe) ────────────────── */
function useRecentlyViewed() {
  const [recent, setRecent] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage
    setMounted(true);
    try {
      const stored = localStorage.getItem(RECENT_STORAGE_KEY);
      if (stored) setRecent(JSON.parse(stored));
    } catch {}
  }, []);

  const addRecent = useCallback((id: string) => {
    setRecent((prev) => {
      const next = [id, ...prev.filter((r) => r !== id)].slice(0, 20);
      try {
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return { recent, addRecent, mounted };
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
    <div className="relative overflow-hidden bg-[var(--vault-dark)] min-h-[80px]">
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
  isFav,
  onToggleFav,
  onKeyDown,
}: {
  work: GalleryWork;
  index: number;
  onClick: () => void;
  isFav: boolean;
  onToggleFav: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}) {
  const frameStyle = FRAME_STYLES[index % FRAME_STYLES.length];
  const tagClass =
    work.gallery === "pobots"
      ? "tag-amber"
      : work.gallery === "prestlers"
      ? "tag-rust"
      : work.gallery === "cultural"
      ? "tag-rose"
      : "tag-sage";

  const sprocketNum = String(index + 1).padStart(3, "0");

  return (
    <motion.div
      className="artwork-card break-inside-avoid mb-6 cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: Math.min(index * 0.015, 0.3),
        duration: 0.5,
        ease: "easeOut",
      }}
      role="article"
      aria-label={`Artwork: ${work.title} from ${work.galleryName}`}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <span className="sprocket-number" aria-hidden="true">{sprocketNum}</span>
      <div className={`frame ${frameStyle}`} onClick={onClick}>
        <div className="frame-inner">
          <LazyImage src={work.imageUrl} alt={work.title} />
          <span className="frame-number">#{index + 1}</span>
          <span className={`card-gallery-tag ${tagClass}`}>
            {GALLERY_ABBREVIATIONS[work.gallery] || work.gallery.slice(0, 3).toUpperCase()}
          </span>
          <button
            className={`fav-badge ${isFav ? "fav-badge-active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav();
            }}
            aria-label={
              isFav ? "Remove from favourites" : "Add to favourites"
            }
            title={isFav ? "Remove from favourites" : "Add to favourites"}
          >
            <Heart
              className="w-3 h-3"
              fill={isFav ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
      <div className="nameplate" onClick={onClick}>
        <div className="nameplate-title">{work.title}</div>
      </div>
    </motion.div>
  );
}

/* ── List Card (for List view) ────────────────────────────── */
function ListCard({
  work,
  index,
  onClick,
  isFav,
  onToggleFav,
  onKeyDown,
}: {
  work: GalleryWork;
  index: number;
  onClick: () => void;
  isFav: boolean;
  onToggleFav: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}) {
  const tagClass =
    work.gallery === "pobots"
      ? "tag-amber"
      : work.gallery === "prestlers"
      ? "tag-rust"
      : work.gallery === "cultural"
      ? "tag-rose"
      : "tag-sage";

  return (
    <motion.div
      className="list-card"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: Math.min(index * 0.02, 0.3), duration: 0.4 }}
      onClick={onClick}
      role="article"
      aria-label={`Artwork: ${work.title} from ${work.galleryName}`}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div className="list-card-thumb">
        <img src={work.imageUrl} alt={work.title} loading="lazy" />
      </div>
      <div className="list-card-info">
        <div className="list-card-title">{work.title}</div>
        <div className="list-card-meta">
          <span className={`list-card-tag ${tagClass}`}>
            {GALLERY_ABBREVIATIONS[work.gallery] || work.gallery.slice(0, 3).toUpperCase()}
          </span>
          <span className="list-card-gallery">{work.galleryName}</span>
        </div>
      </div>
      <button
        className={`list-card-fav ${isFav ? "list-card-fav-active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFav();
        }}
        aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
      >
        <Heart className="w-4 h-4" fill={isFav ? "currentColor" : "none"} />
      </button>
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
  isFav,
  onToggleFav,
  onShare,
  onToggleZoom,
  isZoomed,
  slideshowActive,
  onToggleSlideshow,
  onDownload,
  compareActive,
  onToggleCompare,
  nextWork,
  allItems,
  onGoToIndex,
}: {
  isOpen: boolean;
  onClose: () => void;
  work: GalleryWork | null;
  position: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  isFav: boolean;
  onToggleFav: () => void;
  onShare: () => void;
  onToggleZoom: () => void;
  isZoomed: boolean;
  slideshowActive: boolean;
  onToggleSlideshow: () => void;
  onDownload: () => void;
  compareActive: boolean;
  onToggleCompare: () => void;
  nextWork: GalleryWork | null;
  allItems: GalleryWork[];
  onGoToIndex: (idx: number) => void;
}) {
  const currentWorkId = work?.id ?? "";
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  if (!isOpen || !work) return null;

  const filmRef = `Film: ${GALLERY_ABBREVIATIONS[work.gallery] || "UNK"}-${String(position + 1).padStart(3, "0")}`;

  return (
    <AnimatePresence>
      <motion.div
        className="lb-overlay"
        key={currentWorkId}
        role="dialog"
        aria-modal="true"
        aria-label={`Artwork lightbox: ${work.title}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          touchEndX.current = e.changedTouches[0].clientX;
          const diff = touchStartX.current - touchEndX.current;
          if (Math.abs(diff) > 60) {
            if (diff > 0) onNext();
            else onPrev();
          }
        }}
      >
        <button
          className="lb-close"
          onClick={onClose}
          aria-label="Close lightbox"
        >
          <X className="w-5 h-5" />
        </button>

        <motion.div
          className="lb-content"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className={`lb-frame ${compareActive ? "lb-frame-compare" : ""}`}>
            <div className="lb-spotlight" aria-hidden="true" />
            <div className="lb-frame-inner" onClick={onToggleZoom}>
              <img
                src={work.imageUrl}
                alt={work.title}
                className={`lb-image ${isZoomed ? "lb-image-zoomed" : ""} ${slideshowActive ? "lb-image-kenburns" : ""}`}
              />
              <div className="lb-zoom-hint">
                {isZoomed ? "Click to zoom out" : "Click to zoom in"}
              </div>
            </div>
            {compareActive && nextWork && (
              <div className="lb-frame-inner lb-compare-image" onClick={onToggleZoom}>
                <img
                  src={nextWork.imageUrl}
                  alt={nextWork.title}
                  className="lb-image"
                />
              </div>
            )}
          </div>

          <div className="lb-info">
            <div className="lb-gallery-tag">{work.galleryName}</div>
            <h2 className="lb-title">{work.title}</h2>
            <div className="lb-exif-ref">{filmRef}</div>
            <div className="lb-position">
              {position + 1} / {total}
              {slideshowActive && (
                <span className="slideshow-indicator">REEL</span>
              )}
            </div>

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

            <div className="lb-actions-row">
              <button
                className={`lb-action-btn ${isFav ? "lb-action-btn-active" : ""}`}
                onClick={onToggleFav}
                title={
                  isFav ? "Remove from favourites" : "Add to favourites"
                }
              >
                <Heart
                  className="w-4 h-4"
                  fill={isFav ? "currentColor" : "none"}
                />
                <span>{isFav ? "Favourited" : "Favourite"}</span>
              </button>
              <button
                className="lb-action-btn"
                onClick={onShare}
                title="Copy image link"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <a
                className="lb-social-btn"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out "${work.title}" from Pete Pics!`)}&url=${encodeURIComponent(work.imageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on X/Twitter"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                className="lb-social-btn"
                href={`https://reddit.com/submit?title=${encodeURIComponent(`${work.title} - Pete Pics`)}&url=${encodeURIComponent(work.imageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on Reddit"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.841.09 3.502.624 4.739 1.433.449-.455 1.072-.737 1.764-.737a2.49 2.49 0 0 1 2.49 2.49c0 1.103-.723 2.038-1.723 2.37.046.2.07.41.07.622 0 3.12-3.264 5.644-7.277 5.644-4.014 0-7.278-2.523-7.278-5.644 0-.222.024-.437.07-.647C4.772 13.6 4.049 12.665 4.049 11.562a2.49 2.49 0 0 1 2.49-2.49c.683 0 1.3.27 1.748.722 1.247-.812 2.92-1.35 4.773-1.434l.885-4.148a.348.348 0 0 1 .14-.208.35.35 0 0 1 .247-.042l2.896.613a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.941.913.457 0 2.099-.071 2.94-.913a.328.328 0 0 0 0-.463.327.327 0 0 0-.462 0c-.548.549-1.897.787-2.478.787-.58 0-1.93-.24-2.478-.787a.326.326 0 0 0-.232-.094z"/></svg>
              </a>
              <button
                className="lb-action-btn"
                onClick={onDownload}
                title="Download image"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                className={`lb-action-btn ${compareActive ? "lb-action-btn-active" : ""}`}
                onClick={onToggleCompare}
                title="Compare with next (C)"
              >
                <Columns2 className="w-4 h-4" />
                <span>Compare</span>
              </button>
              <button
                className={`lb-action-btn-slideshow ${slideshowActive ? "active" : ""}`}
                onClick={onToggleSlideshow}
                title={slideshowActive ? "Pause slideshow" : "Start slideshow"}
              >
                {slideshowActive ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span>{slideshowActive ? "Pause" : "Slideshow"}</span>
              </button>
            </div>

            <div className="lb-shortcut-hint">
              <kbd>←</kbd> <kbd>→</kbd> Navigate &nbsp; <kbd>Z</kbd> Zoom
              &nbsp; <kbd>F</kbd> Favourite &nbsp; <kbd>S</kbd> Slideshow
              &nbsp; <kbd>C</kbd> Compare &nbsp; <kbd>D</kbd> Download
              &nbsp; <kbd>I</kbd> Immersive &nbsp; <kbd>Esc</kbd> Close
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

        {/* Film strip timeline at bottom */}
        <div className="lb-filmstrip">
          <div className="lb-filmstrip-inner">
            {allItems.slice(Math.max(0, position - 5), position + 15).map((w, i) => {
              const actualIdx = Math.max(0, position - 5) + i;
              return (
                <button
                  key={w.id}
                  className={`lb-filmstrip-thumb ${actualIdx === position ? "lb-filmstrip-active" : ""}`}
                  onClick={() => onGoToIndex(actualIdx)}
                  title={w.title}
                  role="img"
                  aria-label={`${w.title} — thumbnail ${actualIdx + 1}`}
                >
                  <img src={w.imageUrl} alt="" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile lightbox bar */}
        <div className="mobile-lb-bar">
          <div className="mobile-lb-bar-inner">
            <div className="mobile-lb-bar-info">
              <span className="mobile-lb-bar-gallery">
                {work.galleryName}
              </span>
              <span className="mobile-lb-bar-title">{work.title}</span>
              <span className="mobile-lb-bar-pos">
                {position + 1} / {total}
              </span>
            </div>
            <div className="mobile-lb-bar-actions">
              <button
                className={`lb-action-btn-sm ${isFav ? "lb-action-btn-active" : ""}`}
                onClick={onToggleFav}
                title="Favourite"
              >
                <Heart
                  className="w-4 h-4"
                  fill={isFav ? "currentColor" : "none"}
                />
              </button>
              <button
                className="lb-action-btn-sm"
                onClick={onShare}
                title="Copy link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="mobile-lb-nav">
            <button
              className="mobile-lb-nav-btn"
              onClick={onPrev}
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="mobile-lb-nav-pos">
              {position + 1} / {total}
            </span>
            <button
              className="mobile-lb-nav-btn"
              onClick={onNext}
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
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



/* ── Collection Stats Modal ───────────────────────────────── */
function StatsModal({
  isOpen,
  onClose,
  data,
  favCount,
  recentCount,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: GalleryResponse | null;
  favCount: number;
  recentCount: number;
}) {
  if (!isOpen || !data) return null;

  const galleries = Object.values(data.galleries);
  const maxCount = Math.max(...galleries.map((g) => g.works.length));
  const mostViewedGallery = galleries.reduce((a, b) =>
    a.works.length > b.works.length ? a : b
  );

  return (
    <AnimatePresence>
      <motion.div
        className="about-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          className="stats-modal"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="about-close"
            onClick={onClose}
            aria-label="Close stats"
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="about-title">Vault Manifest</h3>

          <div className="stats-modal-row">
            <span className="stats-modal-label">Total Works</span>
            <span className="stats-modal-value stats-modal-total">{data.totalWorks}</span>
          </div>

          <div className="stats-modal-divider" />

          {galleries.map((g) => (
            <div key={g.id} className="stats-modal-gallery">
              <div className="stats-modal-gallery-header">
                <span className="stats-modal-gallery-name">{g.name}</span>
                <span className="stats-modal-gallery-count">{g.works.length}</span>
              </div>
              <div className="stats-modal-bar-track">
                <div
                  className="stats-modal-bar-fill"
                  style={{ width: `${(g.works.length / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}

          <div className="stats-modal-divider" />

          <div className="stats-modal-row">
            <span className="stats-modal-label">Favourites</span>
            <span className="stats-modal-value stats-modal-fav">{favCount}</span>
          </div>

          <div className="stats-modal-row">
            <span className="stats-modal-label">Recently Viewed</span>
            <span className="stats-modal-value">{recentCount}</span>
          </div>

          <div className="stats-modal-divider" />

          <div className="stats-modal-row">
            <span className="stats-modal-label">Most Collected Gallery</span>
            <span className="stats-modal-value stats-modal-accent">{mostViewedGallery.name}</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── About Modal (with Export/Import Favourites) ───────────── */
function AboutModal({
  isOpen,
  onClose,
  showToast,
}: {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    try {
      const stored = localStorage.getItem(FAVS_STORAGE_KEY) || "[]";
      const blob = new Blob([stored], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "petepics-favourites.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Favourites exported successfully!");
    } catch {
      showToast("Export failed — could not read favourites");
    }
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
          showToast("Invalid format — expected a JSON array of IDs");
          return;
        }
        // Validate all items are strings
        const validIds = parsed.filter((id: unknown) => typeof id === "string");
        if (validIds.length === 0) {
          showToast("No valid IDs found in the file");
          return;
        }
        // Merge with existing
        const existing = JSON.parse(localStorage.getItem(FAVS_STORAGE_KEY) || "[]");
        const merged = Array.from(new Set([...existing, ...validIds]));
        localStorage.setItem(FAVS_STORAGE_KEY, JSON.stringify(merged));
        showToast(`Imported ${validIds.length} favourites! Reload to see changes.`);
      } catch {
        showToast("Import failed — invalid JSON file");
      }
    };
    reader.readAsText(file);
    // Reset the input so the same file can be re-imported
    e.target.value = "";
  };

  return (
    <AnimatePresence>
      <motion.div
        className="about-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          className="about-modal"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="about-close"
            onClick={onClose}
            aria-label="Close about"
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="about-title">About Pete Pics</h3>
          <p className="about-desc">
            Pete Pics is a permanent collection dedicated to the finest
            Pete-adjacent artwork, Pobots, Prestlers, and Cultural Artefacts.
            Curated by AGoodPete on Twitch.
          </p>
          <div className="about-divider" />
          <h4 className="about-subtitle">The Nacky Nook</h4>
          <p className="about-desc">
            A secret corner of the gallery reserved for the most delightfully
            unhinged Pete content. Only the finest absurdist masterpieces earn
            their place in the Nacky Nook.
          </p>
          <div className="about-divider" />
          <h4 className="about-subtitle">Keyboard Shortcuts</h4>
          <div className="about-shortcuts">
            <div className="about-shortcut-row">
              <kbd>←</kbd> <kbd>→</kbd>{" "}
              <span>Navigate images in lightbox</span>
            </div>
            <div className="about-shortcut-row">
              <kbd>Z</kbd> <span>Zoom in/out</span>
            </div>
            <div className="about-shortcut-row">
              <kbd>F</kbd> <span>Toggle favourite</span>
            </div>
            <div className="about-shortcut-row">
              <kbd>R</kbd> <span>Random artwork</span>
            </div>
            <div className="about-shortcut-row">
              <kbd>T</kbd> <span>Toggle theme</span>
            </div>
            <div className="about-shortcut-row">
              <kbd>V</kbd> <span>Cycle view mode (Grid/List/Solo)</span>
            </div>
            <div className="about-shortcut-row">
              <kbd>C</kbd> <span>Toggle compare mode in lightbox</span>
            </div>
            <div className="about-shortcut-row">
              <kbd>?</kbd> <span>Show this shortcuts panel</span>
            </div>
            <div className="about-shortcut-row">
              <kbd>S</kbd> <span>Toggle slideshow</span>
            </div>
            <div className="about-shortcut-row">
              <kbd>D</kbd> <span>Download image</span>
            </div>
            <div className="about-shortcut-row">
              <kbd>I</kbd> <span>Toggle immersive mode</span>
            </div>
            <div className="about-shortcut-row">
              <kbd>Esc</kbd> <span>Close lightbox / modal</span>
            </div>
          </div>
          <div className="about-divider" />

          {/* Favourites Management */}
          <h4 className="about-subtitle">Favourites Management</h4>
          <div className="favs-management-section">
            <button className="favs-export-btn" onClick={handleExport}>
              <DownloadCloud className="w-4 h-4" />
              <span>Export Favourites</span>
            </button>
            <button className="favs-import-btn" onClick={handleImport}>
              <Upload className="w-4 h-4" />
              <span>Import Favourites</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>

          <div className="about-divider" />
          <a
            className="about-twitch-link"
            href={TWITCH_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitchIcon size={16} />
            twitch.tv/AGoodPete
          </a>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Toast ────────────────────────────────────────────────── */
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="toast-notification"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          role="alert"
          aria-live="assertive"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Main Page ────────────────────────────────────────────── */
export default function Home() {
  const [data, setData] = useState<GalleryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchStatus, setFetchStatus] = useState("Connecting to archive…");
  const [currentRoom, setCurrentRoom] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxItems, setLightboxItems] = useState<GalleryWork[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [viewedCount, setViewedCount] = useState(0);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [slideshowActive, setSlideshowActive] = useState(false);
  const [compareActive, setCompareActive] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [ambientSound, setAmbientSound] = useState(false);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const [roomTransitionKey, setRoomTransitionKey] = useState(0);
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [immersiveToolbarVisible, setImmersiveToolbarVisible] = useState(true);

  const { favs, toggleFav, isFav, favCount } = useFavourites();
  const { dark, toggle: toggleTheme, mounted: themeMounted } = useTheme();
  const { viewMode, setViewMode, cycleView } = useViewMode();
  const { recent, addRecent, mounted: recentMounted } = useRecentlyViewed();

  /* Show toast */
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  }, []);

  /* Scroll progress tracking */
  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Gallery scroll hint — show once when gallery loads */
  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => setShowScrollHint(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [data]);

  useEffect(() => {
    if (showScrollHint) {
      const timer = setTimeout(() => setShowScrollHint(false), 4500);
      return () => clearTimeout(timer);
    }
  }, [showScrollHint]);

  /* Immersive mode toolbar auto-hide */
  useEffect(() => {
    if (!immersiveMode) return;
    let timeout: ReturnType<typeof setTimeout>;
    function onMouseMove() {
      setImmersiveToolbarVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setImmersiveToolbarVisible(false), 3000);
    }
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      clearTimeout(timeout);
    };
  }, [immersiveMode]);

  /* FEATURE 1: Hash-Based Deep Linking — read hash on mount */
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && ROOMS.some((r) => r.id === hash)) {
      setCurrentRoom(hash);
    }
  }, []);

  /* Fetch gallery data on mount */
  useEffect(() => {
    async function fetchData() {
      try {
        setFetchStatus("Connecting to vault archive…");
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

  /* Room change handler — FEATURE 1: update hash, FEATURE 2: reset pagination */
  const handleRoomChange = useCallback((room: string) => {
    setCurrentRoom(room);
    setSearchQuery("");
    setMobileMenuOpen(false);
    setDisplayCount(PAGE_SIZE); // FEATURE 2: reset pagination on room switch
    window.scrollTo({ top: 56, behavior: "smooth" });
    // FEATURE 1: Update URL hash
    window.location.hash = room;
    // FEATURE 7: Room transition animation key
    setRoomTransitionKey((k) => k + 1);
  }, []);

  /* Lightbox navigation */
  const openLightbox = useCallback(
    (items: GalleryWork[], index: number) => {
      setLightboxItems(items);
      setLightboxIndex(index);
      setLightboxOpen(true);
      setIsZoomed(false);
      setCompareActive(false);
      setViewedCount((c) => c + 1);
      document.body.style.overflow = "hidden";
      const work = items[index];
      if (work) addRecent(work.id);
    },
    [addRecent]
  );

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setIsZoomed(false);
    setSlideshowActive(false);
    setCompareActive(false);
    document.body.style.overflow = "";
  }, []);

  const lbNav = useCallback(
    (dir: number) => {
      setLightboxIndex(
        (prev) => (prev + dir + lightboxItems.length) % lightboxItems.length
      );
      setIsZoomed(false);
    },
    [lightboxItems.length]
  );

  const goToIndex = useCallback(
    (idx: number) => {
      setLightboxIndex(idx);
      setIsZoomed(false);
    },
    []
  );

  /* Slideshow auto-advance */
  useEffect(() => {
    if (!slideshowActive || !lightboxOpen) return;
    const timer = setInterval(() => {
      lbNav(1);
    }, 4000);
    return () => clearInterval(timer);
  }, [slideshowActive, lightboxOpen, lbNav]);

  /* Toggle slideshow */
  const toggleSlideshow = useCallback(() => {
    setSlideshowActive((prev) => !prev);
  }, []);

  /* Toggle compare */
  const toggleCompare = useCallback(() => {
    setCompareActive((prev) => !prev);
  }, []);

  /* Download handler */
  const handleDownload = useCallback(() => {
    const work = lightboxItems[lightboxIndex];
    if (!work) return;
    showToast(`Downloading ${work.title}...`);
    fetch(work.imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const sanitized = work.title.replace(/[^a-zA-Z0-9_\- ]/g, "").replace(/\s+/g, "_");
        a.download = `${sanitized}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(() => {
        showToast("Download failed");
      });
  }, [lightboxItems, lightboxIndex, showToast]);

  /* Random artwork */
  const handleRandom = useCallback(() => {
    if (!data || data.allWorks.length === 0) return;
    const randomWork =
      data.allWorks[Math.floor(Math.random() * data.allWorks.length)];
    const room = randomWork.gallery;
    const works = data.galleries[room]?.works || data.allWorks;
    const idx = works.findIndex((w) => w.id === randomWork.id);
    openLightbox(works, idx >= 0 ? idx : 0);
  }, [data, openLightbox]);

  /* Keyboard navigation */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "?" && !lightboxOpen) {
        e.preventDefault();
        setAboutOpen((prev) => !prev);
        return;
      }
      if (e.key === "Escape" && aboutOpen) {
        setAboutOpen(false);
        return;
      }
      if (e.key === "Escape" && statsOpen) {
        setStatsOpen(false);
        return;
      }

      if (lightboxOpen) {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") lbNav(1);
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") lbNav(-1);
        if (e.key === "Escape") closeLightbox();
        if (e.key === "z" || e.key === "Z") setIsZoomed((prev) => !prev);
        if (e.key === "f" || e.key === "F") {
          const work = lightboxItems[lightboxIndex];
          if (work) toggleFav(work.id);
        }
        if (e.key === "s" || e.key === "S") toggleSlideshow();
        if (e.key === "d" || e.key === "D") handleDownload();
        if (e.key === "c" || e.key === "C") toggleCompare();
        return;
      }

      if (e.key === "r" || e.key === "R") handleRandom();
      if (e.key === "t" || e.key === "T") toggleTheme();
      if (e.key === "v" || e.key === "V") cycleView();
      if (e.key === "i" || e.key === "I") setImmersiveMode((prev) => !prev);
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [
    lightboxOpen,
    lbNav,
    closeLightbox,
    aboutOpen,
    statsOpen,
    lightboxItems,
    lightboxIndex,
    toggleFav,
    toggleTheme,
    handleRandom,
    toggleSlideshow,
    handleDownload,
    toggleCompare,
    cycleView,
  ]);

  /* Share handler */
  const handleShare = useCallback(() => {
    const work = lightboxItems[lightboxIndex];
    if (!work) return;
    navigator.clipboard
      .writeText(work.imageUrl)
      .then(() => {
        showToast("Image link copied to clipboard!");
      })
      .catch(() => {
        showToast("Could not copy link");
      });
  }, [lightboxItems, lightboxIndex, showToast]);

  /* Get visible works */
  const getVisibleWorks = useCallback((): GalleryWork[] => {
    if (!data) return [];
    const q = searchQuery.toLowerCase().trim();

    if (currentRoom === "favourites") {
      const favWorks = data.allWorks.filter((w) => favs.has(w.id));
      if (q)
        return favWorks.filter(
          (w) =>
            w.title.toLowerCase().includes(q) ||
            w.galleryName.toLowerCase().includes(q)
        );
      return favWorks;
    }

    if (currentRoom === "nacky") {
      const nackyWorks = data.allWorks.filter((_, i) => i % 7 === 0);
      if (q)
        return nackyWorks.filter(
          (w) =>
            w.title.toLowerCase().includes(q) ||
            w.galleryName.toLowerCase().includes(q)
        );
      return nackyWorks;
    }

    if (q) {
      return data.allWorks.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.galleryName.toLowerCase().includes(q)
      );
    }
    if (currentRoom === "all") return data.allWorks;
    return data.galleries[currentRoom]?.works || [];
  }, [data, currentRoom, searchQuery, favs]);

  const visibleWorks = getVisibleWorks();

  // FEATURE 2: Pagination — show limited number unless searching
  const isSearching = searchQuery.trim().length > 0;
  const displayedWorks = isSearching ? visibleWorks : visibleWorks.slice(0, displayCount);
  const remaining = isSearching ? 0 : Math.max(0, visibleWorks.length - displayCount);

  const currentLightboxWork = lightboxItems[lightboxIndex];
  const nextLightboxWork = lightboxItems[(lightboxIndex + 1) % lightboxItems.length];

  /* Recently viewed works for the strip */
  const recentWorks = useMemo(() => {
    if (!data || !recentMounted) return [];
    return recent
      .map((id) => data.allWorks.find((w) => w.id === id))
      .filter((w): w is GalleryWork => !!w);
  }, [data, recent, recentMounted]);

  /* Nacky Nook info */
  const nackyCount = data
    ? data.allWorks.filter((_, i) => i % 7 === 0).length
    : 0;

  /* Solo view current work */
  const [soloIndex, setSoloIndex] = useState(0);
  const soloWork = viewMode === "solo" && visibleWorks.length > 0 ? visibleWorks[soloIndex % visibleWorks.length] : null;

  /* FEATURE 4: Get current room display name */
  const currentRoomName = currentRoom === "all"
    ? "All Works"
    : currentRoom === "favourites"
    ? "Your Favourites"
    : currentRoom === "nacky"
    ? "The Nacky Nook"
    : data?.galleries[currentRoom]?.name || currentRoom;

  /* ────── GALLERY ────── */
  return (
    <div className="min-h-screen flex flex-col bg-[var(--vault-bg)]" suppressHydrationWarning>
      {/* Scroll Progress Bar */}
      {!immersiveMode && (
        <div
          className="scroll-progress-bar"
          style={{ width: `${scrollProgress}%` }}
        />
      )}

      {/* Immersive Mode Toolbar */}
      {immersiveMode && (
        <div className={`immersive-toolbar ${immersiveToolbarVisible ? "" : "immersive-hidden"}`}>
          <span className="immersive-room-name">{currentRoomName}</span>
          <button
            className="immersive-exit-btn"
            onClick={() => setImmersiveMode(false)}
          >
            <X className="w-3.5 h-3.5" />
            Exit Immersive
          </button>
        </div>
      )}

      {/* Gallery Scroll Hint */}
      {showScrollHint && !immersiveMode && (
        <motion.div
          className="scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ChevronDown className="w-5 h-5" />
          <span className="scroll-hint-text">Scroll to explore</span>
        </motion.div>
      )}

      {/* Skip to content link for accessibility */}
      <a href="#gallery-main" className="skip-to-content">
        Skip to gallery content
      </a>

      {/* Navigation */}
      {!immersiveMode && (
      <nav className="gallery-nav" role="navigation" aria-label="Main navigation" suppressHydrationWarning>
        <div className="nav-logo" role="banner">
          <span>Pete</span> Pics
          <a
            className="nav-twitch-badge"
            href={TWITCH_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitchIcon size={12} />
            AGoodPete
          </a>
          <span className="nav-logo-subtitle">THE VAULT</span>
        </div>

        {/* Desktop tabs */}
        <div className="nav-tabs">
          {ROOMS.map((room) => {
            const count =
              room.id === "all"
                ? data?.totalWorks || 0
                : room.id === "favourites"
                ? favCount
                : room.id === "nacky"
                ? nackyCount
                : data?.galleries[room.id]?.works.length || 0;
            return (
              <button
                key={room.id}
                className={`nav-tab ${currentRoom === room.id ? "active" : ""} ${room.id === "nacky" ? "nav-tab-nacky" : ""} ${room.id === "favourites" ? "nav-tab-fav" : ""}`}
                onClick={() => handleRoomChange(room.id)}
              >
                {room.id === "nacky" && <Sparkles className="w-3 h-3" />}
                {room.id === "favourites" && <Heart className="w-3 h-3" />}
                {room.label}
                {count > 0 && <span className="nav-tab-count">{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="nav-actions">
          {/* View mode toggle */}
          <div className="nav-view-toggle">
            <button
              className={`nav-view-btn ${viewMode === "grid" ? "nav-view-btn-active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid view"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              className={`nav-view-btn ${viewMode === "list" ? "nav-view-btn-active" : ""}`}
              onClick={() => setViewMode("list")}
              title="List view"
              aria-label="List view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              className={`nav-view-btn ${viewMode === "solo" ? "nav-view-btn-active" : ""}`}
              onClick={() => setViewMode("solo")}
              title="Solo view"
              aria-label="Solo view"
            >
              <Maximize className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            className="nav-action-btn"
            onClick={handleRandom}
            title="Random Artwork (R)"
            aria-label="View random artwork"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            className="nav-action-btn"
            onClick={() => setStatsOpen(true)}
            title="Vault Manifest"
            aria-label="Collection stats"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          <button
            className="nav-action-btn"
            onClick={toggleTheme}
            title="Toggle Theme (T)"
            aria-label="Toggle theme"
          >
            {themeMounted && dark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          <button
            className="nav-action-btn"
            onClick={() => setAmbientSound((p) => !p)}
            title={ambientSound ? "Mute ambient" : "Ambient sound (UI only)"}
            aria-label="Toggle ambient sound"
          >
            {ambientSound ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          <button
            className="nav-action-btn"
            onClick={() => setImmersiveMode(true)}
            title="Immersive Mode (I)"
            aria-label="Enter immersive mode"
          >
            <Expand className="w-4 h-4" />
          </button>

          <button
            className="nav-action-btn"
            onClick={() => setAboutOpen(true)}
            title="About & Shortcuts (?)"
            aria-label="About and keyboard shortcuts"
          >
            <Info className="w-4 h-4" />
          </button>

          <button
            className="nav-action-btn nav-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Search */}
        <div className="search-wrap" role="search">
          <Search className="w-4 h-4 text-[var(--vault-amber)] opacity-50" aria-hidden="true" />
          <Input
            type="search"
            placeholder="Search works…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="gallery-search"
            aria-label="Search gallery works by title"
            role="searchbox"
          />
        </div>
      </nav>

      )}
      {/* End nav wrapper for immersive mode */}

      {/* Mobile menu — slide-in from right */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="mobile-menu"
              id="mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="mobile-menu-header">
                <span className="mobile-menu-title">THE VAULT</span>
                <button
                  className="mobile-menu-close"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {ROOMS.map((room) => {
                const count =
                  room.id === "all"
                    ? data?.totalWorks || 0
                    : room.id === "favourites"
                    ? favCount
                    : room.id === "nacky"
                    ? nackyCount
                    : data?.galleries[room.id]?.works.length || 0;
                return (
                  <button
                    key={room.id}
                    className={`mobile-menu-item ${currentRoom === room.id ? "mobile-menu-item-active" : ""}`}
                    onClick={() => handleRoomChange(room.id)}
                  >
                    {room.id === "nacky" && <Sparkles className="w-4 h-4" />}
                    {room.id === "favourites" && <Heart className="w-4 h-4" />}
                    {room.label}
                    <span className="mobile-menu-count">{count}</span>
                  </button>
                );
              })}
              <div className="mobile-menu-divider" />
              <a
                className="mobile-menu-item mobile-menu-twitch"
                href={TWITCH_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitchIcon size={16} />
                AGoodPete on Twitch
              </a>
              <a
                className="mobile-menu-item"
                href={SPREADSHEET_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                📊 Pete Pics Spreadsheet
              </a>
              <div className="mobile-menu-divider" />
              <div className="mobile-menu-view-toggle">
                <button
                  className={`nav-view-btn ${viewMode === "grid" ? "nav-view-btn-active" : ""}`}
                  onClick={() => { setViewMode("grid"); setMobileMenuOpen(false); }}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  className={`nav-view-btn ${viewMode === "list" ? "nav-view-btn-active" : ""}`}
                  onClick={() => { setViewMode("list"); setMobileMenuOpen(false); }}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  className={`nav-view-btn ${viewMode === "solo" ? "nav-view-btn-active" : ""}`}
                  onClick={() => { setViewMode("solo"); setMobileMenuOpen(false); }}
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Stats available in Vault Manifest modal */}

      {/* Recently Viewed strip */}
      {!immersiveMode && recentWorks.length > 0 && (
        <div className="recently-viewed-strip">
          <span className="recently-viewed-label">Recently Viewed</span>
          <div className="recently-viewed-scroll">
            {recentWorks.map((w) => (
              <button
                key={w.id}
                className="recently-viewed-thumb"
                onClick={() => {
                  const idx = visibleWorks.findIndex((vw) => vw.id === w.id);
                  if (idx >= 0) openLightbox(visibleWorks, idx);
                  else openLightbox([w], 0);
                }}
                title={w.title}
              >
                <img src={w.imageUrl} alt={w.title} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main id="gallery-main" role="main" aria-label={`${currentRoomName} gallery`} suppressHydrationWarning>

      {/* Room Header */}
      <header className="room-header" role="banner">
        <div className="room-header-left">
          <div className="room-eyebrow">
            {currentRoom === "all"
              ? "ARCHIVE ROOM"
              : currentRoom === "favourites"
              ? "PERSONAL COLLECTION"
              : currentRoom === "nacky"
              ? "THE NACKY NOOK"
              : "VAULT CHAMBER"}
          </div>
          <h2 className="room-title">
            {currentRoomName}
          </h2>
          {(currentRoom === "favourites" || currentRoom === "nacky") && (
            <p className="room-desc">
              {currentRoom === "favourites"
                ? "Your personal collection of the finest works, hand-picked and preserved."
                : "A secret corner reserved for the most delightfully unhinged Pete content."}
            </p>
          )}
        </div>
        <div className="room-count">
          <strong>{visibleWorks.length}</strong>
          Works
        </div>
      </header>

      {/* Gallery Content */}
      <div className="flex-1">
        <div className="wainscot" />

        {/* FEATURE 7: Room transition animation line */}
        <AnimatePresence>
          <motion.div
            key={roomTransitionKey}
            className="room-transition-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1, opacity: [1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </AnimatePresence>

        {/* Search results header */}
        {searchQuery && (
          <div className="search-results-header" role="status" aria-live="polite">
            Found <strong>{visibleWorks.length}</strong> works matching &quot;{searchQuery}&quot;
          </div>
        )}

        {/* FEATURE 2: Showing indicator */}
        {!isSearching && visibleWorks.length > PAGE_SIZE && (
          <div className="showing-indicator">
            Showing {displayedWorks.length} <span className="showing-indicator-sep">·</span> of <span className="showing-indicator-total">{visibleWorks.length}</span>
          </div>
        )}

        {/* Room wall */}
        <div
          className={`gallery-wall ${
            currentRoom === "pobots"
              ? "room-wall-1"
              : currentRoom === "prestlers"
              ? "room-wall-2"
              : currentRoom === "cultural"
              ? "room-wall-3"
              : currentRoom === "pisc"
              ? "room-wall-4"
              : currentRoom === "nacky"
              ? "room-wall-nacky"
              : currentRoom === "favourites"
              ? "room-wall-fav"
              : ""
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentRoom}-${viewMode}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {visibleWorks.length === 0 ? (
                <div className="no-results">
                  {currentRoom === "favourites"
                    ? "No favourites yet — click the heart on any artwork to save it here."
                    : "No works found matching your search."}
                </div>
              ) : viewMode === "list" ? (
                /* ── LIST VIEW ── */
                <div className="gallery-list" aria-roledescription="gallery">
                  {displayedWorks.map((work, i) => (
                    <ListCard
                      key={work.id}
                      work={work}
                      index={i}
                      onClick={() => openLightbox(visibleWorks, i)}
                      isFav={isFav(work.id)}
                      onToggleFav={() => toggleFav(work.id)}
                      onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === "Enter") openLightbox(visibleWorks, i);
                      }}
                    />
                  ))}
                </div>
              ) : viewMode === "solo" ? (
                /* ── SOLO VIEW ── */
                <div className="solo-view">
                  {soloWork && (
                    <div className="solo-card">
                      <motion.div
                        key={soloWork.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <div className="solo-image-wrap">
                          <img
                            src={soloWork.imageUrl}
                            alt={soloWork.title}
                            onClick={() => openLightbox(visibleWorks, 0)}
                          />
                        </div>
                        <div className="solo-info">
                          <h3 className="solo-title">{soloWork.title}</h3>
                          <span className="solo-gallery">{soloWork.galleryName}</span>
                          <button
                            className={`solo-fav ${isFav(soloWork.id) ? "solo-fav-active" : ""}`}
                            onClick={() => toggleFav(soloWork.id)}
                          >
                            <Heart
                              className="w-5 h-5"
                              fill={isFav(soloWork.id) ? "currentColor" : "none"}
                            />
                          </button>
                        </div>
                        <div className="solo-nav">
                          <button
                            className="solo-nav-btn"
                            onClick={() => setSoloIndex((i) => (i - 1 + visibleWorks.length) % visibleWorks.length)}
                            disabled={visibleWorks.length <= 1}
                            aria-label="Previous artwork"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <span className="solo-nav-pos">{(soloIndex % visibleWorks.length) + 1} / {visibleWorks.length}</span>
                          <button
                            className="solo-nav-btn"
                            onClick={() => setSoloIndex((i) => (i + 1) % visibleWorks.length)}
                            disabled={visibleWorks.length <= 1}
                            aria-label="Next artwork"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </div>
              ) : (
                /* ── GRID VIEW (default) ── */
                <div className="gallery-grid" aria-roledescription="gallery">
                  {displayedWorks.map((work, i) => (
                    <ArtworkCard
                      key={work.id}
                      work={work}
                      index={i}
                      onClick={() => openLightbox(visibleWorks, i)}
                      isFav={isFav(work.id)}
                      onToggleFav={() => toggleFav(work.id)}
                      onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === "Enter") openLightbox(visibleWorks, i);
                      }}
                    />
                  ))}
                </div>
              )}

              {/* FEATURE 2: Load More button */}
              {remaining > 0 && !isSearching && (
                <div className="load-more-wrap">
                  <button
                    className="load-more-btn"
                    onClick={() => setDisplayCount((c) => c + PAGE_SIZE)}
                    aria-label="Load more artworks"
                  >
                    <span>LOAD MORE</span>
                    <span className="load-more-remaining">· {remaining} WORKS REMAINING</span>
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      </main>

      {/* Footer */}
      {!immersiveMode && (
      <footer className="vault-footer" suppressHydrationWarning>
        <div className="vault-footer-filmstrip" aria-hidden="true" />
        <div className="vault-footer-inner">
          <div className="vault-footer-brand">
            Built with ❤️ by the Pete Pics community
          </div>
          <div className="vault-footer-emblem" aria-hidden="true">
            <Film className="w-5 h-5" />
          </div>
          <div className="vault-footer-links">
            <a
              className="footer-link footer-link-animated"
              href={TWITCH_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitchIcon size={14} />
              AGoodPete on Twitch
            </a>
            <a
              className="footer-link footer-link-animated"
              href={SPREADSHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              📊 Pete Pics Spreadsheet
            </a>
          </div>
          <div className="vault-footer-version">v7.0 · EST. 2024</div>
        </div>
      </footer>
      )}

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        work={currentLightboxWork}
        position={lightboxIndex}
        total={lightboxItems.length}
        onPrev={() => lbNav(-1)}
        onNext={() => lbNav(1)}
        isFav={currentLightboxWork ? isFav(currentLightboxWork.id) : false}
        onToggleFav={() => {
          if (currentLightboxWork) toggleFav(currentLightboxWork.id);
        }}
        onShare={handleShare}
        onToggleZoom={() => setIsZoomed((p) => !p)}
        isZoomed={isZoomed}
        slideshowActive={slideshowActive}
        onToggleSlideshow={toggleSlideshow}
        onDownload={handleDownload}
        compareActive={compareActive}
        onToggleCompare={toggleCompare}
        nextWork={nextLightboxWork}
        allItems={lightboxItems}
        onGoToIndex={goToIndex}
      />

      {/* About Modal — with Export/Import Favourites */}
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} showToast={showToast} />

      {/* Stats Modal */}
      <StatsModal
        isOpen={statsOpen}
        onClose={() => setStatsOpen(false)}
        data={data}
        favCount={favCount}
        recentCount={recentWorks.length}
      />

      {/* Toast */}
      <Toast message={toastMessage} visible={toastVisible} />

      {/* Scroll to top */}
      <ScrollToTop />
    </div>
  );
}
