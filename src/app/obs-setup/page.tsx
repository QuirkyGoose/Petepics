"use client";

import { useState, useMemo, useCallback } from "react";
import { Copy, Check, ExternalLink, Eye, Monitor } from "lucide-react";

const SITE_URL = "https://petepics-github-io.vercel.app";

const GALLERY_OPTIONS = [
  { value: "all", label: "All Galleries" },
  { value: "pobots", label: "Pobots" },
  { value: "prestlers", label: "Prestlers" },
  { value: "cultural", label: "Cultural Pics" },
  { value: "pisc", label: "Pisc" },
  { value: "submissions", label: "Submissions" },
];

const LABEL_PRESETS = [
  "NOW DESIGNING",
  "NOW SKETCHING",
  "NOW PAINTING",
  "NOW DRAWING",
  "CREATING",
  "WORKING ON",
  "NOW STREAMING",
  "LIVE ART",
];

export default function ObsSetupPage() {
  const [label, setLabel] = useState("NOW DESIGNING");
  const [sub, setSub] = useState("");
  const [title, setTitle] = useState("");
  const [gallery, setGallery] = useState("all");
  const [cycle, setCycle] = useState(12);
  const [grain, setGrain] = useState(true);
  const [showTop, setShowTop] = useState(true);
  const [showBottom, setShowBottom] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const overlayUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (label && label !== "NOW DESIGNING") params.set("label", label);
    if (sub) params.set("sub", sub);
    if (title) params.set("title", title);
    if (gallery !== "all") params.set("gallery", gallery);
    if (cycle !== 12) params.set("cycle", String(cycle));
    if (!grain) params.set("grain", "false");
    if (!showTop) params.set("top", "hide");
    if (!showBottom) params.set("bottom", "hide");

    const qs = params.toString();
    return `${SITE_URL}/overlay.html${qs ? "?" + qs : ""}`;
  }, [label, sub, title, gallery, cycle, grain, showTop, showBottom]);

  const copyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(overlayUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = overlayUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [overlayUrl]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0C0A09",
        color: "#e8dcc8",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "0",
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid rgba(212,168,83,0.15)",
          padding: "24px 32px",
          background: "rgba(26,24,20,0.9)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <Monitor
              size={24}
              style={{ color: "#d4a853" }}
            />
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 600,
                color: "#e8dcc8",
                margin: 0,
              }}
            >
              OBS Overlay Setup
            </h1>
          </div>
          <p
            style={{
              fontSize: "14px",
              color: "#9a8d7a",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Customise your Peet Pics OBS overlay and copy the URL to paste into
            OBS Browser Source. No local files needed!
          </p>
        </div>
      </header>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px" }}>
        {/* URL Output */}
        <div
          style={{
            background: "rgba(26,24,20,0.9)",
            border: "1px solid rgba(212,168,83,0.2)",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#d4a853",
              marginBottom: "10px",
            }}
          >
            Your Overlay URL
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              readOnly
              value={overlayUrl}
              style={{
                flex: 1,
                background: "rgba(12,10,9,0.8)",
                border: "1px solid rgba(212,168,83,0.15)",
                borderRadius: "4px",
                padding: "10px 14px",
                color: "#e8dcc8",
                fontSize: "13px",
                fontFamily: "'JetBrains Mono', monospace",
                outline: "none",
              }}
            />
            <button
              onClick={copyUrl}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 18px",
                background: copied
                  ? "rgba(107,124,94,0.3)"
                  : "rgba(212,168,83,0.2)",
                border: `1px solid ${copied ? "rgba(107,124,94,0.4)" : "rgba(212,168,83,0.3)"}`,
                borderRadius: "4px",
                color: copied ? "#6b7c5e" : "#d4a853",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
            >
              {copied ? (
                <>
                  <Check size={14} /> Copied!
                </>
              ) : (
                <>
                  <Copy size={14} /> Copy URL
                </>
              )}
            </button>
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "12px",
            }}
          >
            <a
              href={overlayUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                background: "rgba(212,168,83,0.1)",
                border: "1px solid rgba(212,168,83,0.2)",
                borderRadius: "4px",
                color: "#d4a853",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
            >
              <ExternalLink size={12} /> Open in Browser
            </a>
            <button
              onClick={() => setShowPreview(!showPreview)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                background: "rgba(212,168,83,0.1)",
                border: "1px solid rgba(212,168,83,0.2)",
                borderRadius: "4px",
                color: "#d4a853",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.2s",
              }}
            >
              <Eye size={12} /> {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
          </div>
        </div>

        {/* Preview iframe */}
        {showPreview && (
          <div
            style={{
              marginBottom: "32px",
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid rgba(212,168,83,0.15)",
              position: "relative",
            }}
          >
            <div
              style={{
                background: "rgba(26,24,20,0.9)",
                padding: "8px 14px",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#9a8d7a",
                borderBottom: "1px solid rgba(212,168,83,0.1)",
              }}
            >
              Live Preview
            </div>
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "56.25%",
                background: "#0C0A09",
              }}
            >
              <iframe
                src={overlayUrl}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
                title="OBS Overlay Preview"
              />
            </div>
          </div>
        )}

        {/* Settings Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
          }}
        >
          {/* Label */}
          <div
            style={{
              gridColumn: "span 2",
              background: "rgba(26,24,20,0.6)",
              border: "1px solid rgba(212,168,83,0.1)",
              borderRadius: "6px",
              padding: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#d4a853",
                marginBottom: "8px",
              }}
            >
              Main Label
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="NOW DESIGNING"
              style={{
                width: "100%",
                background: "rgba(12,10,9,0.8)",
                border: "1px solid rgba(212,168,83,0.15)",
                borderRadius: "4px",
                padding: "10px 14px",
                color: "#e8dcc8",
                fontSize: "14px",
                outline: "none",
                fontFamily: "'Inter', sans-serif",
              }}
            />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                marginTop: "10px",
              }}
            >
              {LABEL_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setLabel(preset)}
                  style={{
                    padding: "4px 10px",
                    background:
                      label === preset
                        ? "rgba(212,168,83,0.25)"
                        : "rgba(212,168,83,0.08)",
                    border: `1px solid ${label === preset ? "rgba(212,168,83,0.4)" : "rgba(212,168,83,0.12)"}`,
                    borderRadius: "3px",
                    color: "#d4a853",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                    fontFamily: "'JetBrains Mono', monospace",
                    transition: "all 0.15s",
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Sub Label */}
          <div
            style={{
              background: "rgba(26,24,20,0.6)",
              border: "1px solid rgba(212,168,83,0.1)",
              borderRadius: "6px",
              padding: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#d4a853",
                marginBottom: "8px",
              }}
            >
              Sub-Label (optional)
            </label>
            <input
              type="text"
              value={sub}
              onChange={(e) => setSub(e.target.value)}
              placeholder="e.g. Commission for @username"
              style={{
                width: "100%",
                background: "rgba(12,10,9,0.8)",
                border: "1px solid rgba(212,168,83,0.15)",
                borderRadius: "4px",
                padding: "10px 14px",
                color: "#e8dcc8",
                fontSize: "14px",
                outline: "none",
                fontFamily: "'Inter', sans-serif",
              }}
            />
            <p
              style={{
                fontSize: "11px",
                color: "#8e8374",
                marginTop: "6px",
                lineHeight: 1.4,
              }}
            >
              Appears below the title. Leave empty to hide.
            </p>
          </div>

          {/* Artwork Title Override */}
          <div
            style={{
              background: "rgba(26,24,20,0.6)",
              border: "1px solid rgba(212,168,83,0.1)",
              borderRadius: "6px",
              padding: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#d4a853",
                marginBottom: "8px",
              }}
            >
              Artwork Title Override
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Leave empty to auto-cycle"
              style={{
                width: "100%",
                background: "rgba(12,10,9,0.8)",
                border: "1px solid rgba(212,168,83,0.15)",
                borderRadius: "4px",
                padding: "10px 14px",
                color: "#e8dcc8",
                fontSize: "14px",
                outline: "none",
                fontFamily: "'Inter', sans-serif",
              }}
            />
            <p
              style={{
                fontSize: "11px",
                color: "#8e8374",
                marginTop: "6px",
                lineHeight: 1.4,
              }}
            >
              Override the cycling title with fixed text. Long text auto-condenses.
            </p>
          </div>

          {/* Gallery Filter */}
          <div
            style={{
              background: "rgba(26,24,20,0.6)",
              border: "1px solid rgba(212,168,83,0.1)",
              borderRadius: "6px",
              padding: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#d4a853",
                marginBottom: "8px",
              }}
            >
              Gallery Filter
            </label>
            <select
              value={gallery}
              onChange={(e) => setGallery(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(12,10,9,0.8)",
                border: "1px solid rgba(212,168,83,0.15)",
                borderRadius: "4px",
                padding: "10px 14px",
                color: "#e8dcc8",
                fontSize: "14px",
                outline: "none",
                fontFamily: "'Inter', sans-serif",
                appearance: "auto",
              }}
            >
              {GALLERY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Cycle Time */}
          <div
            style={{
              background: "rgba(26,24,20,0.6)",
              border: "1px solid rgba(212,168,83,0.1)",
              borderRadius: "6px",
              padding: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#d4a853",
                marginBottom: "8px",
              }}
            >
              Cycle Interval
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="range"
                min={4}
                max={30}
                step={1}
                value={cycle}
                onChange={(e) => setCycle(Number(e.target.value))}
                style={{
                  flex: 1,
                  accentColor: "#d4a853",
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "14px",
                  color: "#e8dcc8",
                  minWidth: "50px",
                  textAlign: "right",
                }}
              >
                {cycle}s
              </span>
            </div>
          </div>

          {/* Toggles */}
          <div
            style={{
              background: "rgba(26,24,20,0.6)",
              border: "1px solid rgba(212,168,83,0.1)",
              borderRadius: "6px",
              padding: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#d4a853",
                marginBottom: "12px",
              }}
            >
              Visibility
            </label>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {[
                {
                  label: "Top-left cycling artwork",
                  checked: showTop,
                  onChange: () => setShowTop(!showTop),
                },
                {
                  label: "Bottom-left text card",
                  checked: showBottom,
                  onChange: () => setShowBottom(!showBottom),
                },
                {
                  label: "Film grain effect",
                  checked: grain,
                  onChange: () => setGrain(!grain),
                },
              ].map((item) => (
                <label
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    fontSize: "13px",
                    color: "#e8dcc8",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={item.onChange}
                    style={{ accentColor: "#d4a853", width: "16px", height: "16px" }}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          {/* OBS Instructions */}
          <div
            style={{
              gridColumn: "span 2",
              background: "rgba(26,24,20,0.6)",
              border: "1px solid rgba(212,168,83,0.1)",
              borderRadius: "6px",
              padding: "20px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#d4a853",
                marginBottom: "12px",
              }}
            >
              How to Add in OBS
            </div>
            <ol
              style={{
                fontSize: "13px",
                lineHeight: 1.8,
                color: "#9a8d7a",
                paddingLeft: "20px",
              }}
            >
              <li>
                Open OBS and add a new <strong style={{ color: "#e8dcc8" }}>Browser Source</strong>
              </li>
              <li>
                Uncheck &quot;Local file&quot;
              </li>
              <li>
                Paste the URL above into the <strong style={{ color: "#e8dcc8" }}>URL</strong> field
              </li>
              <li>
                Set Width to <strong style={{ color: "#e8dcc8" }}>1920</strong> and Height to{" "}
                <strong style={{ color: "#e8dcc8" }}>1080</strong>
              </li>
              <li>
                Click OK — the overlay will appear live!
              </li>
              <li>
                To change text later, edit the URL in the Browser Source properties (no need to re-create)
              </li>
            </ol>
            <div
              style={{
                marginTop: "14px",
                padding: "12px",
                background: "rgba(212,168,83,0.06)",
                borderLeft: "2px solid #d4a853",
                borderRadius: "0 4px 4px 0",
                fontSize: "12px",
                color: "#9a8d7a",
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: "#d4a853" }}>Tip:</strong> The overlay
              auto-cycles artwork from the gallery. To show a specific title,
              use the &quot;Artwork Title Override&quot; field above. Long titles are
              automatically condensed to fit. Keyboard shortcuts work in the
              browser source too: Space (advance), R (random), H (hide/show).
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "40px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(212,168,83,0.1)",
            textAlign: "center",
            fontSize: "12px",
            color: "#8e8374",
          }}
        >
          <a
            href={SITE_URL}
            style={{ color: "#d4a853", textDecoration: "none" }}
          >
            Peet Pics
          </a>{" "}
          — OBS Overlay Setup
        </div>
      </div>
    </div>
  );
}
