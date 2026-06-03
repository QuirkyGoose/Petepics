import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1920,height=1080">
<title>Peet Pics — Premiere Countdown</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;0,6..72,800;1,6..72,300;1,6..72,400;1,6..72,500;1,6..72,600&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>${STYLES}</style>
</head>
<body>

<div class="artwork-layer" id="artworkLayer"></div>
<div class="overlay-dark"></div>

<div class="ambient-glow-layer">
  <div class="ambient-orb orb-1"></div>
  <div class="ambient-orb orb-2"></div>
  <div class="ambient-orb orb-3"></div>
  <div class="ambient-orb orb-4"></div>
  <div class="ambient-orb orb-5"></div>
</div>
<div class="ambient-beam"></div>
<div class="ambient-beam beam-2"></div>
<div class="ambient-rays"></div>
<canvas class="ambient-particles" id="particleCanvas"></canvas>

<div class="film-strip-top"></div>
<div class="film-strip-bottom"></div>

<div class="main-layout" id="mainContent">
  <div class="left-panel">
    <div class="brand-logo">
      <div class="brand-title">Peet Pics</div>
      <div class="brand-subtitle">The Permanent Collection</div>
      <div class="brand-line"></div>
    </div>
    <div class="status-label">
      <span class="status-dot"></span>
      <span id="statusText">STARTING SOON</span>
    </div>
    <div class="countdown-block">
      <div class="countdown-bracket-top"></div>
      <div class="countdown-digits" id="countdown">
        <div class="digit-group"><span class="digit" id="d1">1</span><span class="digit" id="d2">0</span></div>
        <span class="colon">:</span>
        <div class="digit-group"><span class="digit" id="d3">0</span><span class="digit" id="d4">0</span></div>
      </div>
      <div class="countdown-bracket-bottom"></div>
      <div class="countdown-sub">minutes remaining</div>
      <div class="frame-counter">FRM <span class="frame-num" id="frameNum">0000</span> / <span id="totalFrames">0600</span></div>
    </div>
  </div>
  <div class="right-panel">
    <div class="vault-header"><span class="mini-dot"></span><span>FROM THE VAULT</span></div>
    <div class="poster-card" id="posterCard">
      <div class="poster-img-wrap">
        <div class="poster-shimmer" id="posterShimmer"></div>
        <div class="film-holes" id="filmHoles"></div>
        <img id="posterImg" alt="" src="" />
      </div>
      <div class="poster-info">
        <span class="poster-title" id="posterTitle">Loading gallery...</span>
        <span class="poster-gallery-tag" id="posterTag">PBT — Pobots</span>
      </div>
      <div class="poster-progress"><div class="poster-progress-fill" id="posterProgress"></div></div>
    </div>
    <div class="thumb-strip" id="thumbStrip"></div>
    <div class="gallery-badge"><span class="count-text" id="galleryCount">1358 WORKS</span><span class="badge-line"></span></div>
  </div>
</div>

<div class="info-bar">
  <div class="info-bar-left"><span class="info-tag">LIVE</span><a href="https://twitch.tv/AGoodPete" target="_blank" class="info-link">twitch.tv/AGoodPete</a></div>
  <div class="info-bar-right"><span class="info-tag" id="frameRate">24 FPS</span><a href="https://petepics-github-io.vercel.app/" target="_blank" class="info-link">PETEPICS</a></div>
</div>

<div class="pause-overlay" id="pauseOverlay">
  <div class="pause-icon"><div class="bar"></div><div class="bar"></div></div>
  <div class="pause-text">PAUSED</div>
</div>

<script>${SCRIPT}</script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}

/* ═══════════════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════════════ */
const STYLES = `
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #000; color: #e8dcc8; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; overflow: hidden; width: 1920px; height: 1080px; position: relative; }
  :root { --amber: #d4a853; --cream: #e8dcc8; --muted: #9a8d7a; --dim: #8e8374; --dark: #1a1814; --card: #2a2520; --border: #3d352a; --red: #c4473a; --accent: var(--amber); }

  .artwork-layer { position: fixed; inset: 0; z-index: 0; overflow: hidden; background: #000; }
  .artwork-layer .artwork-img { position: absolute; inset: -40px; width: calc(100% + 80px); height: calc(100% + 80px); object-fit: cover; opacity: 0; transition: opacity 2.5s ease; filter: brightness(.35) saturate(.6); }
  .artwork-layer .artwork-img.active { opacity: 1; }
  .artwork-layer .artwork-img.ken-burns-in { animation: kenBurnsIn 20s ease-out forwards; }
  .artwork-layer .artwork-img.ken-burns-out { animation: kenBurnsOut 20s ease-in forwards; }
  @keyframes kenBurnsIn { from { transform: scale(1) translate(0, 0); } to { transform: scale(1.08) translate(-10px, -5px); } }
  @keyframes kenBurnsOut { from { transform: scale(1.05) translate(5px, 3px); } to { transform: scale(1) translate(0, 0); } }

  .overlay-dark { position: fixed; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(0,0,0,.7) 0%, rgba(0,0,0,.3) 40%, rgba(0,0,0,.3) 60%, rgba(0,0,0,.8) 100%), radial-gradient(ellipse at 30% 50%, transparent 30%, rgba(0,0,0,.5) 100%); }

  .ambient-particles { position: fixed; inset: 0; z-index: 3; pointer-events: none; }
  .ambient-rays { position: fixed; inset: 0; z-index: 2; pointer-events: none; opacity: .35; background: conic-gradient(from -5deg at 0% 0%, transparent 0deg, rgba(212,168,83,.03) 3deg, transparent 6deg, transparent 18deg, rgba(212,168,83,.02) 20deg, transparent 23deg, transparent 40deg, rgba(212,168,83,.025) 42deg, transparent 45deg, transparent 360deg); animation: raysRotate 60s linear infinite; mix-blend-mode: screen; }
  @keyframes raysRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  .ambient-glow-layer { position: fixed; inset: 0; z-index: 2; pointer-events: none; overflow: hidden; }
  .ambient-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0; animation: orbDrift linear infinite; will-change: transform, opacity; }
  .ambient-orb.orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(212,168,83,.08) 0%, transparent 70%); top: 10%; left: -5%; animation-duration: 45s; }
  .ambient-orb.orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(212,168,83,.06) 0%, transparent 70%); top: 50%; right: -5%; animation-duration: 55s; animation-delay: -15s; }
  .ambient-orb.orb-3 { width: 350px; height: 350px; background: radial-gradient(circle, rgba(196,71,58,.04) 0%, transparent 70%); bottom: 10%; left: 30%; animation-duration: 50s; animation-delay: -25s; }
  .ambient-orb.orb-4 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(212,168,83,.05) 0%, transparent 70%); top: 30%; left: 50%; animation-duration: 40s; animation-delay: -10s; }
  .ambient-orb.orb-5 { width: 450px; height: 450px; background: radial-gradient(circle, rgba(181,112,126,.04) 0%, transparent 70%); top: 60%; left: 15%; animation-duration: 60s; animation-delay: -35s; }
  @keyframes orbDrift { 0% { transform: translate(0, 0) scale(1); opacity: 0; } 10% { opacity: 1; } 50% { transform: translate(120px, -80px) scale(1.15); opacity: .8; } 90% { opacity: 1; } 100% { transform: translate(250px, 60px) scale(.9); opacity: 0; } }

  .ambient-beam { position: fixed; top: -200px; left: 20%; width: 600px; height: 1400px; z-index: 2; pointer-events: none; background: linear-gradient(180deg, rgba(212,168,83,.04) 0%, rgba(212,168,83,.02) 30%, transparent 100%); transform: rotate(-8deg); animation: beamSway 20s ease-in-out infinite; mix-blend-mode: screen; }
  .ambient-beam.beam-2 { left: 65%; width: 400px; transform: rotate(5deg); animation-duration: 25s; animation-delay: -8s; opacity: .6; }
  @keyframes beamSway { 0%, 100% { transform: rotate(-8deg) translateX(0); opacity: .5; } 50% { transform: rotate(-4deg) translateX(30px); opacity: .8; } }

  .grain-overlay { position: fixed; inset: -50px; width: 200%; height: 200%; background-repeat: repeat; background-size: 128px 128px; opacity: .22; pointer-events: none; z-index: 99; animation: grainDrift .4s steps(6) infinite; }
  @keyframes grainDrift { 0% { transform: translate(0, 0); } 10% { transform: translate(-2%, -2%); } 20% { transform: translate(2%, 0%); } 30% { transform: translate(-2%, 2%); } 40% { transform: translate(2%, -2%); } 50% { transform: translate(-2%, 0%); } 60% { transform: translate(0%, 2%); } 70% { transform: translate(2%, 0%); } 80% { transform: translate(-2%, -2%); } 90% { transform: translate(0%, 2%); } 100% { transform: translate(0, 0); } }

  .film-strip-top, .film-strip-bottom { position: fixed; left: 0; right: 0; height: 3px; z-index: 30; pointer-events: none; }
  .film-strip-top { top: 0; background: linear-gradient(90deg, transparent, var(--amber), transparent); opacity: .15; }
  .film-strip-bottom { bottom: 0; background: linear-gradient(90deg, transparent, var(--amber), transparent); opacity: .15; }

  .main-layout { position: fixed; inset: 0; z-index: 20; display: flex; align-items: stretch; }
  .left-panel { flex: 0 0 55%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 40px 60px; position: relative; }

  .brand-logo { text-align: center; margin-bottom: 28px; animation: brandReveal 1.2s cubic-bezier(.16, 1, .3, 1) both; }
  @keyframes brandReveal { from { opacity: 0; transform: translateY(-30px) scale(.95); letter-spacing: .3em; } to { opacity: 1; transform: translateY(0) scale(1); letter-spacing: -.03em; } }
  .brand-title { font-family: 'Newsreader', serif; font-size: 80px; font-weight: 700; color: var(--cream); letter-spacing: -.03em; line-height: 1; text-shadow: 0 4px 40px rgba(0,0,0,.6), 0 0 80px rgba(212,168,83,.08); }
  .brand-subtitle { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: .5em; text-transform: uppercase; color: var(--amber); margin-top: 12px; opacity: .6; }
  .brand-line { width: 120px; height: 1px; background: linear-gradient(90deg, transparent, var(--amber), transparent); margin: 18px auto 0; opacity: .3; }

  .status-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: .4em; text-transform: uppercase; color: var(--amber); margin-bottom: 20px; display: flex; align-items: center; gap: 10px; animation: fadeIn .8s ease-out .3s both; }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); box-shadow: 0 0 8px rgba(196,71,58,.6); animation: dotPulse 2s ease-in-out infinite; }
  @keyframes dotPulse { 0%, 100% { opacity: .4; transform: scale(1); } 50% { opacity: 1; transform: scale(1.4); } }

  .countdown-block { text-align: center; position: relative; animation: fadeIn .8s ease-out .5s both; }
  .countdown-digits { font-family: 'JetBrains Mono', monospace; font-size: 160px; font-weight: 700; letter-spacing: .04em; color: var(--cream); line-height: 1; text-shadow: 0 0 100px rgba(212,168,83,.1), 0 6px 40px rgba(0,0,0,.5); transition: color .4s, text-shadow .4s; display: inline-flex; align-items: baseline; }
  .countdown-digits .digit-group { display: inline-flex; position: relative; }
  .countdown-digits .digit { display: inline-block; min-width: .6em; text-align: center; position: relative; }
  .countdown-digits .digit.flip { animation: digitSlam .35s cubic-bezier(.16, 1, .3, 1); }
  @keyframes digitSlam { 0% { transform: translateY(-20px) scale(1.1); opacity: .5; } 60% { transform: translateY(3px) scale(.98); } 100% { transform: translateY(0) scale(1); opacity: 1; } }
  .countdown-digits .colon { color: var(--amber); opacity: .4; font-weight: 400; font-size: .8em; margin: 0 .01em; position: relative; top: -.08em; animation: colonBlink 1s step-end infinite; }
  @keyframes colonBlink { 0%, 100% { opacity: .4; } 50% { opacity: .1; } }

  .countdown-bracket-top, .countdown-bracket-bottom { width: 200px; height: 1px; background: linear-gradient(90deg, transparent, var(--amber), transparent); margin: 0 auto; opacity: .2; }
  .countdown-bracket-top { margin-bottom: 8px; }
  .countdown-bracket-bottom { margin-top: 8px; }
  .countdown-sub { font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 500; letter-spacing: .5em; text-transform: uppercase; color: var(--muted); margin-top: 14px; opacity: .5; }
  .frame-counter { position: absolute; bottom: -40px; left: 50%; transform: translateX(-50%); font-family: 'JetBrains Mono', monospace; font-size: 8px; font-weight: 400; letter-spacing: .15em; color: var(--dim); opacity: .3; white-space: nowrap; }
  .frame-counter .frame-num { color: var(--amber); opacity: .5; }

  .countdown-digits.urgent { color: var(--red); text-shadow: 0 0 120px rgba(196,71,58,.3), 0 6px 40px rgba(0,0,0,.5); }
  .countdown-digits.urgent .colon { color: var(--red); }

  .right-panel { flex: 0 0 45%; position: relative; display: flex; flex-direction: column; justify-content: center; padding: 40px 40px 40px 20px; animation: panelSlideIn 1s cubic-bezier(.16, 1, .3, 1) .6s both; }
  @keyframes panelSlideIn { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); } }
  .right-panel::before { content: ''; position: absolute; left: 0; top: 10%; bottom: 10%; width: 2px; background: linear-gradient(180deg, transparent, var(--amber), transparent); opacity: .2; }

  .vault-header { font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 500; letter-spacing: .4em; text-transform: uppercase; color: var(--amber); margin-bottom: 16px; padding-left: 20px; display: flex; align-items: center; gap: 8px; opacity: .6; }
  .vault-header .mini-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--amber); animation: miniPulse 3s ease-in-out infinite; }
  @keyframes miniPulse { 0%, 100% { opacity: .3; } 50% { opacity: 1; } }

  .poster-card { position: relative; margin: 0 0 16px 20px; border-radius: 4px; overflow: hidden; background: rgba(26,24,20,.7); border: 1px solid rgba(212,168,83,.1); box-shadow: 0 12px 60px rgba(0,0,0,.5), 0 0 30px rgba(212,168,83,.04); transition: border-color .6s; }
  .poster-card .poster-img-wrap { position: relative; width: 100%; height: 320px; overflow: hidden; background: #111; }
  .poster-card .poster-img-wrap img { width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity .8s ease .2s; filter: brightness(.85) saturate(.85); }
  .poster-card .poster-img-wrap img.loaded { opacity: 1; }
  .poster-card .poster-shimmer { position: absolute; inset: 0; background: linear-gradient(90deg, #1a1814 25%, #2a2520 50%, #1a1814 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite linear; z-index: 2; transition: opacity .5s; }
  .poster-card .poster-shimmer.hidden { opacity: 0; pointer-events: none; }
  @keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
  .poster-card .film-holes { position: absolute; left: 0; top: 0; bottom: 0; width: 18px; background: rgba(0,0,0,.4); z-index: 3; display: flex; flex-direction: column; justify-content: space-evenly; align-items: center; padding: 10px 0; }
  .poster-card .film-hole { width: 8px; height: 5px; border-radius: 1px; background: rgba(0,0,0,.6); border: 1px solid rgba(212,168,83,.08); }
  .poster-info { padding: 12px 16px 12px 32px; background: rgba(26,24,20,.9); display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(212,168,83,.06); }
  .poster-title { font-family: 'Newsreader', serif; font-size: 16px; font-weight: 500; color: var(--cream); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 65%; line-height: 1.3; }
  .poster-title.condensed { font-size: 13px; }
  .poster-title.extra-condensed { font-size: 11px; letter-spacing: -.01em; }
  .poster-gallery-tag { font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 500; letter-spacing: .1em; padding: 2px 8px; border-left: 2px solid var(--amber); color: var(--amber); background: rgba(212,168,83,.06); white-space: nowrap; }
  .poster-progress { height: 2px; background: rgba(0,0,0,.4); overflow: hidden; }
  .poster-progress-fill { height: 100%; background: var(--amber); width: 0%; opacity: .4; transition: width .1s linear; }

  .thumb-strip { display: flex; gap: 6px; padding-left: 20px; margin-top: 4px; }
  .thumb-strip .thumb-item { flex: 0 0 64px; height: 48px; border-radius: 2px; overflow: hidden; position: relative; border: 1px solid rgba(212,168,83,.06); cursor: pointer; transition: border-color .3s, transform .3s; background: #111; }
  .thumb-strip .thumb-item:hover { border-color: rgba(212,168,83,.3); transform: scale(1.05); }
  .thumb-strip .thumb-item.active { border-color: var(--amber); box-shadow: 0 0 12px rgba(212,168,83,.2); }
  .thumb-strip .thumb-item img { width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity .4s; }
  .thumb-strip .thumb-item img.loaded { opacity: 1; }

  .gallery-badge { margin-top: 12px; padding-left: 20px; display: flex; align-items: center; gap: 12px; }
  .gallery-badge .count-text { font-family: 'JetBrains Mono', monospace; font-size: 8px; font-weight: 500; letter-spacing: .2em; text-transform: uppercase; color: var(--dim); }
  .gallery-badge .badge-line { flex: 1; height: 1px; background: linear-gradient(90deg, rgba(212,168,83,.1), transparent); }

  .info-bar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 30; padding: 10px 32px; display: flex; justify-content: space-between; align-items: center; background: linear-gradient(transparent, rgba(0,0,0,.8)); }
  .info-bar-left, .info-bar-right { display: flex; align-items: center; gap: 12px; }
  .info-tag { font-family: 'JetBrains Mono', monospace; font-size: 7px; font-weight: 500; letter-spacing: .15em; text-transform: uppercase; color: var(--muted); padding: 2px 6px; border: 1px solid rgba(212,168,83,.08); border-radius: 1px; }
  .info-link { font-family: 'JetBrains Mono', monospace; font-size: 7px; font-weight: 500; letter-spacing: .08em; color: var(--amber); text-decoration: none; opacity: .4; }

  .pause-overlay { position: fixed; inset: 0; z-index: 50; background: rgba(0,0,0,.7); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 12px; opacity: 0; pointer-events: none; transition: opacity .3s; }
  .pause-overlay.visible { opacity: 1; pointer-events: auto; }
  .pause-icon { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .pause-icon .bar { width: 8px; height: 32px; background: var(--amber); border-radius: 2px; opacity: .7; }
  .pause-text { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 600; letter-spacing: .4em; text-transform: uppercase; color: var(--amber); }

  .finished .countdown-digits { color: var(--amber); text-shadow: 0 0 140px rgba(212,168,83,.4), 0 6px 40px rgba(0,0,0,.5); animation: finishedGlow 2s ease-in-out infinite; }
  @keyframes finishedGlow { 0%, 100% { opacity: 1; } 50% { opacity: .8; } }
  .finished .brand-title { text-shadow: 0 4px 40px rgba(0,0,0,.6), 0 0 120px rgba(212,168,83,.15); }

  .gallery-pobots { --accent: #d4a853; }
  .gallery-prestlers { --accent: #a0522d; }
  .gallery-cultural { --accent: #b5707e; }
  .gallery-pisc { --accent: #6b7c5e; }
  .gallery-submissions { --accent: #6b7c5e; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;

/* ═══════════════════════════════════════════════════════════════════
   SCRIPT — same-origin, no CORS issues
   ═══════════════════════════════════════════════════════════════════ */
const SCRIPT = `
var P = new URLSearchParams(window.location.search);
var CFG = {
  minutes: parseInt(P.get('minutes')) || 10,
  label: P.get('label') || 'STARTING SOON',
  gallery: P.get('gallery') || 'all',
  speed: parseInt(P.get('speed')) || 10,
  showGrain: P.get('grain') !== 'false',
};

var ABBR = { pobots: "PBT", prestlers: "PST", cultural: "CUL", pisc: "PSC", submissions: "SUB" };
var GNAME = { pobots: "Pobots", prestlers: "Prestlers", cultural: "Cultural Pics", pisc: "Pisc", submissions: "Submissions" };
var API_URL = '/api/gallery';

var FALLBACK_WORKS = [
  {"t":"24 Hour Party Petebot","g":"pobots","u":"https://i.postimg.cc/DJhygw82/24-Hour-Party-Petebot.png"},
  {"t":"Cristal Baschet","g":"pobots","u":"https://i.postimg.cc/R3N0FD2S/Cristal-Baschet.png"},
  {"t":"Amillion Botts","g":"pobots","u":"https://i.postimg.cc/cg3478x1/Amillion-Botts.png"},
  {"t":"Gordon Peetcock","g":"pobots","u":"https://i.postimg.cc/F19HkzMj/Gordon-Petecock.png"},
  {"t":"Flensburger Peetr","g":"pobots","u":"https://i.postimg.cc/bZbhBjXx/Flensburger-Peter.png"},
  {"t":"Mecha Godpeter","g":"pobots","u":"https://i.postimg.cc/VdJ1XCD4/Mecha-Godpeter.png"},
  {"t":"2 Become 1 but its the Smoking Gunns","g":"prestlers","u":"https://i.postimg.cc/bsYXR2gL/2-Become-1-but-its-the-Smoking-Gunns.png"},
  {"t":"4 Lads Spelling out PETE in the WCW crowd","g":"prestlers","u":"https://i.postimg.cc/nC32fsxJ/4-Lads-Spelling-out-PETE-in-the-WCW-crowd.png"},
  {"t":"A Peet Pic That Threatens The Sanctity Of The Good Friday Agreement","g":"cultural","u":"https://i.postimg.cc/TKrPWb3n/A-Peet-Pic-That-Threatens-The-Sanctity-Of-The-Good-Friday-Agreement.png"},
  {"t":"10 Things I Pete About You","g":"pisc","u":"https://i.postimg.cc/LnhSp1PX/10-Things-I-Pete-About-You.png"},
  {"t":"AGood Honest Petter","g":"pisc","u":"https://i.postimg.cc/FdjtTyw8/AGood-Honest-Petter.png"},
  {"t":"Kindly donated to the collection by Harry Hardy","g":"submissions","u":"https://i.postimg.cc/t1xYkckv/Kindly-donated-to-the-collection-by-Harry-Hardy.png"},
];

var WORKS = [];

function fetchGallery() {
  return fetch(API_URL)
    .then(function(res) { if (!res.ok) throw new Error('API ' + res.status); return res.json(); })
    .then(function(data) {
      if (data.allWorks && Array.isArray(data.allWorks) && data.allWorks.length > 0) {
        WORKS = data.allWorks.map(function(w) { return { t: w.title, g: w.gallery, u: w.imageUrl }; });
        console.log('Loaded ' + WORKS.length + ' works via same-origin fetch');
        return;
      }
      throw new Error('No works in response');
    })
    .catch(function(err) {
      console.warn('Fetch failed:', err.message, '— using ' + FALLBACK_WORKS.length + ' fallback works');
      WORKS = FALLBACK_WORKS.map(function(w) { return Object.assign({}, w); });
    });
}

var activeWorks = [], posterWorks = [], bgWorks = [];
var paused = false, totalSeconds = CFG.minutes * 60, remainingSeconds = totalSeconds;
var countdownInterval = null, posterIdx = 0, posterInterval = null;
var posterProg = 0, posterProgInterval = null, bgIdx = 0, bgInterval = null;
var finished = false, prevDigits = ['', '', '', ''], frameCount = 0;
var consecutiveImgErrors = 0, MAX_CONSECUTIVE_ERRORS = 5;

function genGrain() {
  var c = document.createElement('canvas'); c.width = c.height = 128;
  var x = c.getContext('2d'); if (!x) return;
  var d = x.createImageData(128, 128);
  for (var i = 0; i < d.data.length; i += 4) { var v = Math.random() * 255; d.data[i] = v; d.data[i+1] = v; d.data[i+2] = v; d.data[i+3] = 12; }
  x.putImageData(d, 0, 0);
  var g = document.createElement('div'); g.className = 'grain-overlay'; g.style.backgroundImage = 'url(' + c.toDataURL('image/png') + ')';
  document.body.appendChild(g);
}

function buildFilmHoles() {
  var el = document.getElementById('filmHoles');
  for (var i = 0; i < 12; i++) { var hole = document.createElement('div'); hole.className = 'film-hole'; el.appendChild(hole); }
}

function condense(t, m) { if (!t || t.length <= m) return t; var s = t.slice(0, m - 1); var l = s.lastIndexOf(' '); if (l > m * .5) s = s.slice(0, l); return s + '...'; }

function updateDisplay() {
  var min = Math.floor(remainingSeconds / 60), sec = remainingSeconds % 60;
  var d1 = String(Math.floor(min / 10)), d2 = String(min % 10), d3 = String(Math.floor(sec / 10)), d4 = String(sec % 10);
  var newDigits = [d1, d2, d3, d4], ids = ['d1', 'd2', 'd3', 'd4'];
  newDigits.forEach(function(d, i) { var el = document.getElementById(ids[i]); if (d !== prevDigits[i]) { el.textContent = d; el.classList.remove('flip'); void el.offsetWidth; el.classList.add('flip'); } });
  prevDigits = newDigits;
  var elapsed = totalSeconds - remainingSeconds;
  document.getElementById('frameNum').textContent = String(elapsed * 24).padStart(5, '0');
  document.getElementById('totalFrames').textContent = String(totalSeconds * 24).padStart(5, '0');
  var cd = document.getElementById('countdown');
  if (remainingSeconds <= 30 && remainingSeconds > 0) { cd.classList.add('urgent'); } else { cd.classList.remove('urgent'); }
  if (remainingSeconds <= 0 && !finished) { finished = true; document.getElementById('mainContent').classList.add('finished'); document.getElementById('statusText').textContent = "WE'RE LIVE"; cd.classList.remove('urgent'); clearInterval(posterInterval); clearInterval(posterProgInterval); }
}

function tick() { if (paused || finished) return; remainingSeconds--; if (remainingSeconds < 0) remainingSeconds = 0; updateDisplay(); }

function updatePoster(idx) {
  var w = posterWorks[idx]; if (!w) return;
  var img = document.getElementById('posterImg'), shimmer = document.getElementById('posterShimmer');
  var title = document.getElementById('posterTitle'), tag = document.getElementById('posterTag'), card = document.getElementById('posterCard');
  shimmer.classList.remove('hidden'); img.classList.remove('loaded'); img.style.display = '';
  card.className = 'poster-card gallery-' + (w.g || 'pobots');
  img.src = w.u; img.alt = w.t;
  img.onerror = function() { consecutiveImgErrors++; if (consecutiveImgErrors <= MAX_CONSECUTIVE_ERRORS) { setTimeout(function() { advancePoster(); }, 500); } else { this.style.display = 'none'; shimmer.classList.add('hidden'); } };
  var t = w.t || 'Unknown'; title.textContent = t;
  title.classList.remove('condensed', 'extra-condensed');
  if (t.length > 60) title.classList.add('extra-condensed'); else if (t.length > 40) title.classList.add('condensed');
  tag.textContent = (ABBR[w.g] || 'UNK') + ' \\u2014 ' + (GNAME[w.g] || w.g);
  document.querySelectorAll('.thumb-strip .thumb-item').forEach(function(el, i) { el.classList.toggle('active', i === idx); });
  posterProg = 0; var bar = document.getElementById('posterProgress'); if (bar) bar.style.width = '0%';
}

document.getElementById('posterImg').addEventListener('load', function() { if (this.naturalWidth > 0) { this.classList.add('loaded'); document.getElementById('posterShimmer').classList.add('hidden'); consecutiveImgErrors = 0; } });

function advancePoster() { posterIdx = (posterIdx + 1) % posterWorks.length; updatePoster(posterIdx); }

function startPosterProgress() {
  posterProg = 0; clearInterval(posterProgInterval);
  var tickMs = 100, totalMs = CFG.speed * 1000;
  posterProgInterval = setInterval(function() { if (paused) return; posterProg += tickMs; var bar = document.getElementById('posterProgress'); if (bar) bar.style.width = Math.min(100, posterProg / totalMs * 100) + '%'; }, tickMs);
}

function buildThumbStrip() {
  var strip = document.getElementById('thumbStrip'); strip.innerHTML = '';
  posterWorks.forEach(function(w, i) {
    var item = document.createElement('div'); item.className = 'thumb-item' + (i === 0 ? ' active' : '');
    var img = document.createElement('img'); img.src = w.u; img.alt = w.t || ''; img.loading = 'lazy';
    img.onload = function() { this.classList.add('loaded'); };
    img.onerror = function() { this.style.display = 'none'; };
    item.appendChild(img); item.onclick = function() { posterIdx = i; updatePoster(i); };
    strip.appendChild(item);
  });
}

function buildBackground() {
  var container = document.getElementById('artworkLayer');
  bgWorks.forEach(function(w, i) {
    var img = document.createElement('img'); img.className = 'artwork-img' + (i === 0 ? ' active ken-burns-in' : '');
    img.src = w.u; img.alt = w.t || ''; img.onerror = function() { this.style.display = 'none'; };
    container.appendChild(img);
  });
}

function rotateBackground() {
  var imgs = document.querySelectorAll('.artwork-layer .artwork-img'); if (imgs.length === 0) return;
  var current = document.querySelector('.artwork-layer .artwork-img.active');
  if (!current) { if (imgs[0]) imgs[0].classList.add('active', 'ken-burns-in'); return; }
  bgIdx = (bgIdx + 1) % bgWorks.length;
  var next = imgs[bgIdx % imgs.length];
  current.classList.remove('active', 'ken-burns-in'); current.classList.add('ken-burns-out');
  next.classList.add('active', 'ken-burns-in'); next.classList.remove('ken-burns-out');
  setTimeout(function() { current.classList.remove('ken-burns-out'); }, 2500);
}

function initParticles() {
  var canvas = document.getElementById('particleCanvas'); if (!canvas) return;
  var ctx = canvas.getContext('2d'); if (!ctx) return;
  canvas.width = 1920; canvas.height = 1080;
  var particles = [];
  for (var i = 0; i < 80; i++) { particles.push({ x: Math.random() * 1920, y: Math.random() * 1080, vx: (Math.random() - 0.5) * 0.3, vy: -Math.random() * 0.4 - 0.1, size: Math.random() * 2 + 0.5, opacity: Math.random() * 0.5 + 0.1, life: Math.random() * 500 + 200, age: 0 }); }
  function animate() {
    ctx.clearRect(0, 0, 1920, 1080);
    particles.forEach(function(p) {
      p.x += p.vx; p.y += p.vy; p.age++;
      if (p.age > p.life || p.y < -10) { p.x = Math.random() * 1920; p.y = 1080 + Math.random() * 20; p.age = 0; }
      var fadeRatio = p.age < 60 ? p.age / 60 : p.age > p.life - 60 ? (p.life - p.age) / 60 : 1;
      var alpha = p.opacity * Math.max(0, fadeRatio);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(212,168,83,' + alpha.toFixed(3) + ')'; ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

function shuffle(arr) { for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp; } return arr; }

function init() {
  document.getElementById('statusText').textContent = CFG.label;
  if (CFG.showGrain) genGrain();
  buildFilmHoles();
  fetchGallery().then(function() {
    activeWorks = CFG.gallery === 'all' ? WORKS.slice() : WORKS.filter(function(w) { return w.g === CFG.gallery; });
    if (activeWorks.length === 0) activeWorks = WORKS.slice();
    shuffle(activeWorks);
    posterWorks = activeWorks.slice(0, Math.min(8, activeWorks.length));
    bgWorks = activeWorks.slice(8, 8 + 20);
    document.getElementById('galleryCount').textContent = activeWorks.length + ' WORKS';
    buildThumbStrip(); buildBackground(); updatePoster(0); startPosterProgress();
    updateDisplay(); countdownInterval = setInterval(tick, 1000);
    posterInterval = setInterval(function() { if (!paused && !finished) advancePoster(); }, CFG.speed * 1000);
    bgInterval = setInterval(function() { if (!paused && !finished) rotateBackground(); }, 15000);
    initParticles();
  });
}

document.addEventListener('keydown', function(e) {
  if (e.code === 'Space') { e.preventDefault(); paused = !paused; document.getElementById('pauseOverlay').classList.toggle('visible', paused); }
  if (e.code === 'KeyR') { remainingSeconds = totalSeconds; finished = false; paused = false; document.getElementById('mainContent').classList.remove('finished'); document.getElementById('statusText').textContent = CFG.label; document.getElementById('pauseOverlay').classList.remove('visible'); updateDisplay(); }
  if (e.code === 'KeyH') { document.getElementById('mainContent').style.opacity = document.getElementById('mainContent').style.opacity === '0' ? '1' : '0'; }
});

init();
`;
