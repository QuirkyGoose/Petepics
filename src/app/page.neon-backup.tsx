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
  Heart,
  Share2,
  Sun,
  Moon,
  Info,
  Sparkles,
  Play,
  Pause,
  Download,
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

const ROOMS = [
  { id: "all", label: "All Works", icon: Grid3X3 },
  { id: "pobots", label: "Pobots", icon: null },
  { id: "prestlers", label: "Prestlers", icon: null },
  { id: "cultural", label: "Cultural Pics", icon: null },
  { id: "pisc", label: "Pisc", icon: null },
  { id: "favourites", label: "Favourites", icon: Heart },
  { id: "nacky", label: "Nacky Nook", icon: Sparkles },
] as const;

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

/* ── Floating Particles (deterministic) ───────────────────── */
function FloatingParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: (i * 37 + 13) % 100,
        y: (i * 53 + 7) % 100,
        size: (i % 3) + 1,
        duration: (i % 20) + 15,
        delay: i % 10,
      })),
    []
  );

  return (
    <div className="particles-container" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
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
    <div className="relative overflow-hidden bg-[var(--neon-dark)] min-h-[80px]">
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
}: {
  work: GalleryWork;
  index: number;
  onClick: () => void;
  isFav: boolean;
  onToggleFav: () => void;
}) {
  const frameStyle = FRAME_STYLES[index % FRAME_STYLES.length];
  const tagClass =
    work.gallery === "pobots"
      ? "tag-cyan"
      : work.gallery === "prestlers"
      ? "tag-amber"
      : work.gallery === "cultural"
      ? "tag-magenta"
      : "tag-green";

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
    >
      <div className={`frame ${frameStyle}`} onClick={onClick}>
        <div className="frame-inner">
          <LazyImage src={work.imageUrl} alt={work.title} />
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
}) {
  const currentWorkId = work?.id ?? "";

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
          <div className="lb-frame">
            <div className="lb-spotlight" aria-hidden="true" />
            <div className="lb-frame-inner" onClick={onToggleZoom}>
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

          <div className="lb-info">
            <div className="lb-gallery-tag">{work.galleryName}</div>
            <h2 className="lb-title">{work.title}</h2>
            <div className="lb-position">
              {position + 1} / {total}
              {slideshowActive && (
                <span className="slideshow-indicator">AUTO</span>
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
              <button
                className="lb-action-btn"
                onClick={onDownload}
                title="Download image"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
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
              &nbsp; <kbd>D</kbd> Download &nbsp; <kbd>Esc</kbd> Close
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

/* ── Stats Bar ────────────────────────────────────────────── */
function StatsBar({
  data,
  favCount,
}: {
  data: GalleryResponse | null;
  favCount: number;
}) {
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
      {favCount > 0 && (
        <div className="stat-item">
          <span className="stat-count stat-count-fav">{favCount}</span>
          <span className="stat-label">Favs</span>
        </div>
      )}
      <div className="stat-divider" />
      <div className="stat-item stat-item-total">
        <span className="stat-count stat-count-total">{data.totalWorks}</span>
        <span className="stat-label">Total Works</span>
      </div>
    </div>
  );
}

/* ── About Modal ──────────────────────────────────────────── */
function AboutModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

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
              <kbd>?</kbd> <span>Show this shortcuts panel</span>
            </div>
            <div className="about-shortcut-row">
              <kbd>S</kbd> <span>Toggle slideshow</span>
            </div>
            <div className="about-shortcut-row">
              <kbd>D</kbd> <span>Download image</span>
            </div>
            <div className="about-shortcut-row">
              <kbd>Esc</kbd> <span>Close lightbox / modal</span>
            </div>
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
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Main Page ────────────────────────────────────────────── */
export default function Home() {
  const [phase, setPhase] = useState<"entrance" | "gallery">("entrance");
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
  const [typewriterText, setTypewriterText] = useState("");

  const { favs, toggleFav, isFav, favCount } = useFavourites();
  const { dark, toggle: toggleTheme, mounted: themeMounted } = useTheme();

  /* Show toast */
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  }, []);

  /* Typewriter effect for subtitle */
  useEffect(() => {
    const target = "NEON GALLERY · EST. 2024";
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < target.length) {
          setTypewriterText(target.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 60);
      return () => clearInterval(interval);
    }, 800);
    return () => clearTimeout(timeout);
  }, []);

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
      setIsZoomed(false);
      setViewedCount((c) => c + 1);
      document.body.style.overflow = "hidden";
    },
    []
  );

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setIsZoomed(false);
    setSlideshowActive(false);
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
        return;
      }

      if (e.key === "r" || e.key === "R") handleRandom();
      if (e.key === "t" || e.key === "T") toggleTheme();
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [
    lightboxOpen,
    lbNav,
    closeLightbox,
    aboutOpen,
    lightboxItems,
    lightboxIndex,
    toggleFav,
    toggleTheme,
    handleRandom,
    toggleSlideshow,
    handleDownload,
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
  const currentLightboxWork = lightboxItems[lightboxIndex];

  /* Nacky Nook info */
  const nackyCount = data
    ? data.allWorks.filter((_, i) => i % 7 === 0).length
    : 0;

  /* ────── ENTRANCE — Neon Arcade "INSERT COIN" Screen ────── */
  if (phase === "entrance") {
    return (
      <section className="entrance-section">
        {/* Animated perspective grid background */}
        <div className="entrance-grid-bg" aria-hidden="true" />
        {/* CRT scanline overlay */}
        <div className="entrance-scanlines" aria-hidden="true" />
        {/* Floating particles */}
        <FloatingParticles />

        <motion.div
          className="entrance-inner"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        >
          {/* Circular neon badge */}
          <motion.div
            className="arcade-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Palette className="w-10 h-10" />
          </motion.div>

          {/* Title with glitch effect on hover */}
          <motion.h1
            className="arcade-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span>Pete</span> Pics
          </motion.h1>

          {/* Monospace subtitle with typing cursor */}
          <motion.p
            className="arcade-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {typewriterText}
            <span className="typing-cursor" />
          </motion.p>

          {/* Italic tagline */}
          <motion.p
            className="arcade-tagline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            A permanent collection dedicated to the finest Pete-adjacent artwork,
            Pobots, Prestlers, and Cultural Artefacts of Our Time.
          </motion.p>

          {/* Boot sequence line */}
          <motion.div
            className="boot-sequence"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
          >
            SYS://GALLERY.ONLINE · 1212_WORKS.DAT · STATUS: ACTIVE
          </motion.div>

          {/* Twitch link card */}
          <motion.a
            className="twitch-arcade-card"
            href={TWITCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.6 }}
          >
            <TwitchIcon size={18} />
            <span>Watch AGoodPete on Twitch</span>
          </motion.a>

          {/* Enter button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <button className="enter-arcade-btn" onClick={enterGallery}>
              ENTER THE GALLERY
              <ArrowRight className="enter-arcade-btn-arrow" />
            </button>
          </motion.div>

          {/* Retro pixel loading indicator */}
          {loading && (
            <motion.div
              className="arcade-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <span />
              <span />
              <span />
              <span className="arcade-loading-text">{fetchStatus}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Bottom count display */}
        <motion.div
          className="arcade-count"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
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
    <div className="min-h-screen flex flex-col bg-[var(--neon-bg)]">
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
          <a
            className="nav-twitch-badge"
            href={TWITCH_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitchIcon size={12} />
            AGoodPete
          </a>
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
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Search */}
        <div className="search-wrap">
          <Search className="w-4 h-4 text-[var(--neon-cyan)] opacity-50" />
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
                  : room.id === "favourites"
                  ? favCount
                  : room.id === "nacky"
                  ? nackyCount
                  : data?.galleries[room.id]?.works.length || 0;
              return (
                <button
                  key={room.id}
                  className={`mobile-menu-item ${currentRoom === room.id ? "active" : ""} ${room.id === "nacky" ? "mobile-menu-nacky" : ""}`}
                  onClick={() => handleRoomChange(room.id)}
                >
                  <span className="mobile-menu-label">
                    {room.id === "nacky" && (
                      <Sparkles className="w-3 h-3 inline mr-1" />
                    )}
                    {room.id === "favourites" && (
                      <Heart className="w-3 h-3 inline mr-1" />
                    )}
                    {room.label}
                  </span>
                  {count > 0 && (
                    <span className="mobile-menu-count">{count}</span>
                  )}
                </button>
              );
            })}
            {/* Mobile Twitch Card */}
            <div className="mobile-twitch-card">
              <div className="mobile-twitch-card-top">
                <TwitchIcon size={20} />
                <span className="mobile-twitch-card-name">AGoodPete</span>
              </div>
              <div className="mobile-twitch-card-status">
                Check back for the next stream
              </div>
              <a
                href={TWITCH_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-twitch-link"
              >
                <TwitchIcon size={14} />
                Open Channel
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats bar */}
      <StatsBar data={data} favCount={favCount} />

      {/* Viewed counter */}
      {viewedCount > 0 && (
        <div className="viewed-counter">
          <Eye className="w-3 h-3" /> {viewedCount} artwork
          {viewedCount !== 1 ? "s" : ""} viewed
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
            {!searchQuery && currentRoom === "nacky" && (
              <div className="room-header room-wall-nacky">
                <div className="room-header-left">
                  <div className="room-eyebrow">
                    ✨ Pete Pics — The Nacky Nook
                  </div>
                  <h2 className="room-title">
                    The <em>Nacky Nook</em>
                  </h2>
                  <p className="room-desc">
                    A secret corner reserved for the most delightfully unhinged
                    Pete content. Only the finest absurdist masterpieces earn
                    their place here.
                  </p>
                </div>
                <div className="room-count">
                  <strong>{nackyCount}</strong>
                  Nacky Works
                </div>
              </div>
            )}

            {!searchQuery && currentRoom === "favourites" && (
              <div className="room-header room-wall-fav">
                <div className="room-header-left">
                  <div className="room-eyebrow">
                    ♥ Pete Pics — Your Collection
                  </div>
                  <h2 className="room-title">
                    Your <em>Favourites</em>
                  </h2>
                  <p className="room-desc">
                    Your personal collection of favourited works. Heart any
                    artwork to add it here.
                  </p>
                </div>
                <div className="room-count">
                  <strong>{favCount}</strong>
                  Favourited
                </div>
              </div>
            )}

            {!searchQuery &&
              currentRoom !== "all" &&
              currentRoom !== "nacky" &&
              currentRoom !== "favourites" &&
              data?.galleries[currentRoom] && (
                <div
                  className={`room-header ${data.galleries[currentRoom].wallClass}`}
                >
                  <div className="room-header-left">
                    <div className="room-eyebrow">
                      Pete Pics — Permanent Collection
                    </div>
                    <h2 className="room-title">
                      <em>{data.galleries[currentRoom].name}</em>
                    </h2>
                    <p className="room-desc">
                      {data.galleries[currentRoom].tagline}
                    </p>
                  </div>
                  <div className="room-count">
                    <strong>{data.galleries[currentRoom].works.length}</strong>
                    Works on Display
                  </div>
                </div>
              )}

            {!searchQuery && currentRoom === "all" && (
              <div className="room-header room-wall-1">
                <div className="room-header-left">
                  <div className="room-eyebrow">
                    Pete Pics — The Permanent Collection
                  </div>
                  <h2 className="room-title">
                    The <em>Collection</em>
                  </h2>
                  <p className="room-desc">
                    Browse the complete archive of Pete-adjacent artwork across
                    all galleries.
                  </p>
                </div>
                <div className="room-count">
                  <strong>{data?.totalWorks || 0}</strong>
                  Total Works
                </div>
              </div>
            )}

            {/* Search results header */}
            {searchQuery && (
              <div className="search-results-header">
                Found <strong>{visibleWorks.length}</strong> works matching &quot;
                {searchQuery}&quot;
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Gallery grid */}
        <div className="gallery-wall">
          {visibleWorks.length > 0 ? (
            <div className="gallery-grid">
              {visibleWorks.map((work, i) => (
                <ArtworkCard
                  key={work.id}
                  work={work}
                  index={i}
                  onClick={() => openLightbox(visibleWorks, i)}
                  isFav={isFav(work.id)}
                  onToggleFav={() => toggleFav(work.id)}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              {searchQuery
                ? "No works found matching your search."
                : currentRoom === "favourites"
                ? "No favourites yet. Heart an artwork to add it here."
                : "This gallery is empty."}
            </div>
          )}
        </div>

        {/* All-room section in "all" view */}
        {currentRoom === "all" &&
          !searchQuery &&
          data &&
          GALLERY_ORDER.map((galleryId) => {
            const gallery = data.galleries[galleryId];
            if (!gallery) return null;
            return (
              <div key={galleryId} className="all-room">
                <div className="all-room-label">{gallery.name}</div>
                <div className="gallery-grid" style={{ padding: "0 3rem" }}>
                  {gallery.works.slice(0, 6).map((work, i) => (
                    <ArtworkCard
                      key={work.id}
                      work={work}
                      index={i}
                      onClick={() =>
                        openLightbox(
                          gallery.works,
                          gallery.works.findIndex((w) => w.id === work.id)
                        )
                      }
                      isFav={isFav(work.id)}
                      onToggleFav={() => toggleFav(work.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
      </main>

      {/* Footer */}
      <footer className="gallery-footer">
        <strong>Pete Pics</strong>
        <span>A permanent collection of Pete-adjacent artwork</span>
        <div className="footer-links">
          <a
            href={TWITCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-twitch-link"
          >
            <TwitchIcon size={14} />
            AGoodPete on Twitch
          </a>
          <a
            href={SPREADSHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-sheet-link"
          >
            Collection Spreadsheet
          </a>
        </div>
      </footer>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        work={currentLightboxWork}
        position={lightboxIndex}
        total={lightboxItems.length}
        onPrev={() => lbNav(-1)}
        onNext={() => lbNav(1)}
        isFav={
          currentLightboxWork ? isFav(currentLightboxWork.id) : false
        }
        onToggleFav={() => {
          if (currentLightboxWork) toggleFav(currentLightboxWork.id);
        }}
        onShare={handleShare}
        onToggleZoom={() => {
          if (slideshowActive) setSlideshowActive(false);
          setIsZoomed((prev) => !prev);
        }}
        isZoomed={isZoomed}
        slideshowActive={slideshowActive}
        onToggleSlideshow={toggleSlideshow}
        onDownload={handleDownload}
      />

      {/* About Modal */}
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />

      {/* Scroll to top */}
      <ScrollToTop />

      {/* Toast */}
      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  );
}
