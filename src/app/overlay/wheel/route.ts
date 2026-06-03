import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1920,height=1080">
<title>Peet Pics — Spinning Wheel</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;0,6..72,800;1,6..72,300;1,6..72,400;1,6..72,500;1,6..72,600&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>${STYLES}</style>
</head>
<body>

<!-- Ambient background layers -->
<div class="bg-base"></div>
<div class="bg-gradient-shift"></div>
<div class="bg-vignette"></div>
<div class="bg-horizon-glow"></div>
<div class="ambient-glow-layer">
  <div class="ambient-orb orb-1"></div>
  <div class="ambient-orb orb-2"></div>
  <div class="ambient-orb orb-3"></div>
  <div class="ambient-orb orb-4"></div>
  <div class="ambient-orb orb-5"></div>
</div>
<div class="ambient-beam beam-left"></div>
<div class="ambient-beam beam-right"></div>
<canvas class="ambient-particles" id="particleCanvas"></canvas>

<div class="film-strip-top"></div>
<div class="film-strip-bottom"></div>

<div class="main-layout" id="mainContent">
  <div class="left-panel">
    <div class="brand-logo">
      <div class="brand-title">Peet Pics</div>
      <div class="brand-subtitle">The Wheel of Pete</div>
      <div class="brand-line"></div>
    </div>

    <div class="wheel-stage">
      <div class="wheel-pointer"></div>
      <div class="wheel-ring-outer"></div>
      <div class="wheel-container" id="wheelContainer">
        <canvas id="wheelCanvas" width="700" height="700"></canvas>
      </div>
      <div class="wheel-center">
        <div class="wheel-center-inner">
          <div class="wheel-center-text" id="spinText">SPIN</div>
        </div>
      </div>
      <div class="wheel-glow" id="wheelGlow"></div>
    </div>

    <div class="spin-info" id="spinInfo">
      <span class="spin-count-label">SPINS</span>
      <span class="spin-count" id="spinCount">0</span>
    </div>

    <div class="spin-hint" id="spinHint">PRESS SPACE OR CLICK TO SPIN</div>
  </div>

  <div class="right-panel">
    <div class="vault-header"><span class="mini-dot"></span><span>WINNER</span></div>
    <div class="winner-card" id="winnerCard">
      <div class="winner-placeholder" id="winnerPlaceholder">
        <div class="placeholder-icon">?</div>
        <div class="placeholder-text">Spin the wheel to reveal a Peet Pic</div>
      </div>
      <div class="winner-content" id="winnerContent" style="display:none">
        <div class="winner-img-wrap">
          <div class="winner-shimmer" id="winnerShimmer"></div>
          <div class="winner-film-holes" id="winnerFilmHoles"></div>
          <img id="winnerImg" alt="" src="" />
        </div>
        <div class="winner-info">
          <span class="winner-title" id="winnerTitle">—</span>
          <span class="winner-gallery-tag" id="winnerTag">—</span>
        </div>
      </div>
    </div>
    <div class="history-section">
      <div class="history-header">PREVIOUS SPINS</div>
      <div class="history-list" id="historyList"></div>
    </div>
  </div>
</div>

<div class="info-bar">
  <div class="info-bar-left"><span class="info-tag">LIVE</span><a href="https://twitch.tv/AGoodPete" target="_blank" class="info-link">twitch.tv/AGoodPete</a></div>
  <div class="info-bar-right"><span class="info-tag" id="totalCount">1358</span><a href="https://petepics-github-io.vercel.app/" target="_blank" class="info-link">PETEPICS</a></div>
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
  body { background: #000; color: #e8dcc8; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; overflow: hidden; width: 1920px; height: 1080px; position: relative; cursor: default; }
  :root { --amber: #d4a853; --cream: #e8dcc8; --muted: #9a8d7a; --dim: #8e8374; --dark: #1a1814; --card: #2a2520; --border: #3d352a; --red: #c4473a; }

  /* ═══ BACKGROUND LAYERS ═══ */
  .bg-base { position: fixed; inset: 0; z-index: 0; background: radial-gradient(ellipse at 30% 40%, #12100d 0%, #080706 50%, #030303 100%); }
  .bg-gradient-shift { position: fixed; inset: 0; z-index: 1; pointer-events: none; background: radial-gradient(ellipse 80% 60% at 20% 70%, rgba(212,168,83,.03) 0%, transparent 70%), radial-gradient(ellipse 70% 50% at 80% 30%, rgba(181,112,126,.02) 0%, transparent 70%); animation: shiftWash 40s ease-in-out infinite alternate; mix-blend-mode: screen; }
  @keyframes shiftWash { 0% { opacity: .4; transform: scale(1) translateX(0); } 50% { opacity: .7; transform: scale(1.05) translateX(-20px); } 100% { opacity: .4; transform: scale(1) translateX(20px); } }
  .bg-vignette { position: fixed; inset: 0; z-index: 2; pointer-events: none; background: radial-gradient(ellipse 85% 80% at 50% 50%, transparent 30%, rgba(0,0,0,.5) 70%, rgba(0,0,0,.85) 100%); }
  .bg-horizon-glow { position: fixed; bottom: 0; left: 0; right: 0; height: 40%; z-index: 1; pointer-events: none; background: radial-gradient(ellipse 120% 80% at 50% 100%, rgba(212,168,83,.04) 0%, transparent 60%); animation: horizonPulse 12s ease-in-out infinite alternate; }
  @keyframes horizonPulse { 0% { opacity: .6; } 100% { opacity: 1; } }

  .ambient-particles { position: fixed; inset: 0; z-index: 5; pointer-events: none; }
  .ambient-glow-layer { position: fixed; inset: 0; z-index: 3; pointer-events: none; overflow: hidden; }
  .ambient-orb { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0; animation: orbDrift linear infinite; will-change: transform, opacity; }
  .ambient-orb.orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(212,168,83,.06) 0%, transparent 70%); top: 5%; left: -8%; animation-duration: 50s; }
  .ambient-orb.orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(212,168,83,.04) 0%, transparent 70%); top: 45%; right: -5%; animation-duration: 60s; animation-delay: -15s; }
  .ambient-orb.orb-3 { width: 350px; height: 350px; background: radial-gradient(circle, rgba(196,71,58,.03) 0%, transparent 70%); bottom: 5%; left: 25%; animation-duration: 55s; animation-delay: -25s; }
  .ambient-orb.orb-4 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(212,168,83,.04) 0%, transparent 70%); top: 25%; left: 45%; animation-duration: 45s; animation-delay: -10s; }
  .ambient-orb.orb-5 { width: 450px; height: 450px; background: radial-gradient(circle, rgba(181,112,126,.03) 0%, transparent 70%); top: 55%; left: 10%; animation-duration: 65s; animation-delay: -35s; }
  @keyframes orbDrift { 0% { transform: translate(0, 0) scale(1); opacity: 0; } 8% { opacity: 1; } 50% { transform: translate(100px, -60px) scale(1.1); opacity: .7; } 92% { opacity: 1; } 100% { transform: translate(200px, 40px) scale(.95); opacity: 0; } }

  .ambient-beam { position: fixed; top: -300px; width: 500px; height: 1600px; z-index: 3; pointer-events: none; mix-blend-mode: screen; }
  .ambient-beam.beam-left { left: 15%; background: linear-gradient(180deg, rgba(212,168,83,.035) 0%, rgba(212,168,83,.015) 35%, transparent 100%); transform: rotate(-6deg); animation: beamSwayLeft 25s ease-in-out infinite; }
  .ambient-beam.beam-right { left: 60%; width: 350px; background: linear-gradient(180deg, rgba(212,168,83,.025) 0%, rgba(212,168,83,.01) 35%, transparent 100%); transform: rotate(4deg); animation: beamSwayRight 30s ease-in-infinite; }
  @keyframes beamSwayLeft { 0%, 100% { transform: rotate(-6deg) translateX(0); opacity: .5; } 50% { transform: rotate(-3deg) translateX(25px); opacity: .75; } }
  @keyframes beamSwayRight { 0%, 100% { transform: rotate(4deg) translateX(0); opacity: .4; } 50% { transform: rotate(2deg) translateX(-20px); opacity: .65; } }

  .grain-overlay { position: fixed; inset: -50px; width: 200%; height: 200%; background-repeat: repeat; background-size: 128px 128px; opacity: .14; pointer-events: none; z-index: 99; animation: grainDrift .4s steps(6) infinite; }
  @keyframes grainDrift { 0% { transform: translate(0, 0); } 25% { transform: translate(-2%, -1%); } 50% { transform: translate(1%, 2%); } 75% { transform: translate(-1%, -2%); } 100% { transform: translate(0, 0); } }

  .film-strip-top, .film-strip-bottom { position: fixed; left: 0; right: 0; height: 3px; z-index: 30; pointer-events: none; }
  .film-strip-top { top: 0; background: linear-gradient(90deg, transparent, var(--amber), transparent); opacity: .12; }
  .film-strip-bottom { bottom: 0; background: linear-gradient(90deg, transparent, var(--amber), transparent); opacity: .12; }

  /* ═══ MAIN LAYOUT ═══ */
  .main-layout { position: fixed; inset: 0; z-index: 20; display: flex; align-items: stretch; }
  .left-panel { flex: 0 0 58%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 30px 40px; position: relative; }

  .brand-logo { text-align: center; margin-bottom: 20px; animation: brandReveal 1s cubic-bezier(.16, 1, .3, 1) both; }
  @keyframes brandReveal { from { opacity: 0; transform: translateY(-20px) scale(.95); letter-spacing: .3em; } to { opacity: 1; transform: translateY(0) scale(1); letter-spacing: -.03em; } }
  .brand-title { font-family: 'Newsreader', serif; font-size: 56px; font-weight: 700; color: var(--cream); letter-spacing: -.03em; line-height: 1; text-shadow: 0 4px 40px rgba(0,0,0,.6), 0 0 80px rgba(212,168,83,.1); }
  .brand-subtitle { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: .5em; text-transform: uppercase; color: var(--amber); margin-top: 8px; opacity: .6; }
  .brand-line { width: 100px; height: 1px; background: linear-gradient(90deg, transparent, var(--amber), transparent); margin: 12px auto 0; opacity: .3; }

  /* ═══ WHEEL STAGE ═══ */
  .wheel-stage { position: relative; width: 540px; height: 540px; margin: 10px 0; animation: fadeIn .8s ease-out .3s both; }

  .wheel-pointer {
    position: absolute; top: -18px; left: 50%; transform: translateX(-50%); z-index: 25;
    width: 0; height: 0;
    border-left: 16px solid transparent;
    border-right: 16px solid transparent;
    border-top: 28px solid var(--amber);
    filter: drop-shadow(0 4px 12px rgba(212,168,83,.5));
    transition: filter .3s;
  }
  .wheel-pointer.active { filter: drop-shadow(0 4px 20px rgba(212,168,83,.8)); }

  .wheel-ring-outer {
    position: absolute; inset: -6px; border-radius: 50%;
    border: 3px solid rgba(212,168,83,.2);
    box-shadow: 0 0 40px rgba(212,168,83,.05), inset 0 0 40px rgba(0,0,0,.3);
    pointer-events: none; z-index: 5;
  }

  .wheel-container {
    position: absolute; inset: 0; border-radius: 50%; overflow: hidden;
    box-shadow: 0 0 60px rgba(0,0,0,.6), 0 0 30px rgba(212,168,83,.05);
    cursor: pointer;
    transition: box-shadow .4s;
  }
  .wheel-container:hover { box-shadow: 0 0 80px rgba(0,0,0,.6), 0 0 50px rgba(212,168,83,.1); }
  .wheel-container canvas { width: 100%; height: 100%; display: block; }

  .wheel-center {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 100px; height: 100px; border-radius: 50%; z-index: 15;
    background: radial-gradient(circle, #1a1814 0%, #0a0908 100%);
    border: 2px solid rgba(212,168,83,.3);
    box-shadow: 0 0 30px rgba(0,0,0,.8), inset 0 0 20px rgba(0,0,0,.5);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: border-color .3s, box-shadow .3s, transform .15s;
  }
  .wheel-center:hover { border-color: rgba(212,168,83,.5); box-shadow: 0 0 40px rgba(0,0,0,.8), 0 0 20px rgba(212,168,83,.1), inset 0 0 20px rgba(0,0,0,.5); transform: translate(-50%, -50%) scale(1.05); }
  .wheel-center:active { transform: translate(-50%, -50%) scale(.95); }
  .wheel-center-inner { text-align: center; }
  .wheel-center-text { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; letter-spacing: .15em; color: var(--amber); text-transform: uppercase; }
  .wheel-center.spinning .wheel-center-text { animation: spinPulse 1s ease-in-out infinite; }
  @keyframes spinPulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }

  .wheel-glow {
    position: absolute; inset: -40px; border-radius: 50%; z-index: -1;
    background: radial-gradient(circle, rgba(212,168,83,0) 40%, transparent 70%);
    transition: all .6s; pointer-events: none;
  }
  .wheel-glow.spinning { background: radial-gradient(circle, rgba(212,168,83,.08) 30%, transparent 70%); animation: glowPulse 1.5s ease-in-out infinite; }
  .wheel-glow.winner { background: radial-gradient(circle, rgba(212,168,83,.15) 20%, rgba(196,71,58,.05) 40%, transparent 70%); animation: winnerGlow 1s ease-in-out 3; }
  @keyframes glowPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: .7; } }
  @keyframes winnerGlow { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }

  .spin-info { display: flex; align-items: center; gap: 10px; margin-top: 12px; animation: fadeIn .8s ease-out .6s both; }
  .spin-count-label { font-family: 'JetBrains Mono', monospace; font-size: 8px; font-weight: 500; letter-spacing: .3em; text-transform: uppercase; color: var(--dim); }
  .spin-count { font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 700; color: var(--amber); opacity: .7; font-variant-numeric: tabular-nums; }

  .spin-hint { font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 500; letter-spacing: .3em; text-transform: uppercase; color: var(--dim); margin-top: 10px; opacity: .35; animation: hintBlink 3s ease-in-out infinite; }
  @keyframes hintBlink { 0%, 100% { opacity: .35; } 50% { opacity: .15; } }
  .spin-hint.hidden { display: none; }

  /* ═══ RIGHT PANEL ═══ */
  .right-panel { flex: 0 0 42%; position: relative; display: flex; flex-direction: column; justify-content: center; padding: 40px 40px 40px 20px; animation: panelSlideIn 1s cubic-bezier(.16, 1, .3, 1) .6s both; }
  @keyframes panelSlideIn { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); } }
  .right-panel::before { content: ''; position: absolute; left: 0; top: 10%; bottom: 10%; width: 2px; background: linear-gradient(180deg, transparent, var(--amber), transparent); opacity: .2; }

  .vault-header { font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 500; letter-spacing: .4em; text-transform: uppercase; color: var(--amber); margin-bottom: 16px; padding-left: 20px; display: flex; align-items: center; gap: 8px; opacity: .6; }
  .vault-header .mini-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--amber); animation: miniPulse 3s ease-in-out infinite; }
  @keyframes miniPulse { 0%, 100% { opacity: .3; } 50% { opacity: 1; } }

  /* Winner card */
  .winner-card { position: relative; margin: 0 0 20px 20px; border-radius: 4px; overflow: hidden; background: rgba(26,24,20,.7); border: 1px solid rgba(212,168,83,.1); box-shadow: 0 12px 60px rgba(0,0,0,.5), 0 0 30px rgba(212,168,83,.04); min-height: 340px; transition: border-color .6s, box-shadow .6s; }
  .winner-card.revealed { border-color: rgba(212,168,83,.25); box-shadow: 0 12px 60px rgba(0,0,0,.5), 0 0 50px rgba(212,168,83,.08); animation: cardReveal .6s cubic-bezier(.16, 1, .3, 1); }
  @keyframes cardReveal { from { transform: scale(.95); opacity: .7; } to { transform: scale(1); opacity: 1; } }

  .winner-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 30px; text-align: center; }
  .placeholder-icon { font-family: 'Newsreader', serif; font-size: 64px; font-weight: 300; color: var(--amber); opacity: .15; margin-bottom: 16px; }
  .placeholder-text { font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 400; letter-spacing: .2em; text-transform: uppercase; color: var(--dim); opacity: .4; line-height: 1.6; }

  .winner-content { display: flex; flex-direction: column; }
  .winner-img-wrap { position: relative; width: 100%; height: 260px; overflow: hidden; background: #111; }
  .winner-img-wrap img { width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity .8s ease .2s; filter: brightness(.85) saturate(.85); }
  .winner-img-wrap img.loaded { opacity: 1; }
  .winner-shimmer { position: absolute; inset: 0; background: linear-gradient(90deg, #1a1814 25%, #2a2520 50%, #1a1814 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite linear; z-index: 2; transition: opacity .5s; }
  .winner-shimmer.hidden { opacity: 0; pointer-events: none; }
  @keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
  .winner-film-holes { position: absolute; left: 0; top: 0; bottom: 0; width: 18px; background: rgba(0,0,0,.4); z-index: 3; display: flex; flex-direction: column; justify-content: space-evenly; align-items: center; padding: 10px 0; }
  .winner-film-holes .film-hole { width: 8px; height: 5px; border-radius: 1px; background: rgba(0,0,0,.6); border: 1px solid rgba(212,168,83,.08); }
  .winner-info { padding: 14px 16px 14px 32px; background: rgba(26,24,20,.9); display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(212,168,83,.06); }
  .winner-title { font-family: 'Newsreader', serif; font-size: 16px; font-weight: 500; color: var(--cream); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 65%; line-height: 1.3; }
  .winner-title.condensed { font-size: 13px; }
  .winner-title.extra-condensed { font-size: 11px; letter-spacing: -.01em; }
  .winner-gallery-tag { font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 500; letter-spacing: .1em; padding: 2px 8px; border-left: 2px solid var(--amber); color: var(--amber); background: rgba(212,168,83,.06); white-space: nowrap; }

  /* History */
  .history-section { margin-left: 20px; }
  .history-header { font-family: 'JetBrains Mono', monospace; font-size: 8px; font-weight: 500; letter-spacing: .3em; text-transform: uppercase; color: var(--dim); margin-bottom: 10px; opacity: .5; }
  .history-list { display: flex; gap: 8px; flex-wrap: wrap; }
  .history-item { width: 56px; height: 42px; border-radius: 2px; overflow: hidden; border: 1px solid rgba(212,168,83,.08); background: #111; position: relative; transition: border-color .3s, transform .3s; }
  .history-item:hover { border-color: rgba(212,168,83,.3); transform: scale(1.08); }
  .history-item img { width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity .3s; }
  .history-item img.loaded { opacity: 1; }
  .history-item .history-num { position: absolute; bottom: 1px; right: 2px; font-family: 'JetBrains Mono', monospace; font-size: 6px; font-weight: 600; color: var(--amber); opacity: .6; }

  .info-bar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 30; padding: 10px 32px; display: flex; justify-content: space-between; align-items: center; background: linear-gradient(transparent, rgba(0,0,0,.8)); }
  .info-bar-left, .info-bar-right { display: flex; align-items: center; gap: 12px; }
  .info-tag { font-family: 'JetBrains Mono', monospace; font-size: 7px; font-weight: 500; letter-spacing: .15em; text-transform: uppercase; color: var(--muted); padding: 2px 6px; border: 1px solid rgba(212,168,83,.08); border-radius: 1px; }
  .info-link { font-family: 'JetBrains Mono', monospace; font-size: 7px; font-weight: 500; letter-spacing: .08em; color: var(--amber); text-decoration: none; opacity: .4; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;

/* ═══════════════════════════════════════════════════════════════════
   SCRIPT
   ═══════════════════════════════════════════════════════════════════ */
const SCRIPT = `
var P = new URLSearchParams(window.location.search);
var CFG = {
  segments: Math.min(parseInt(P.get('segments')) || 12, 24),
  gallery: P.get('gallery') || 'all',
  showGrain: P.get('grain') !== 'false',
  spinDuration: parseFloat(P.get('duration')) || 5,
};

var ABBR = { pobots: "PBT", prestlers: "PST", cultural: "CUL", pisc: "PSC", submissions: "SUB" };
var GNAME = { pobots: "Pobots", prestlers: "Prestlers", cultural: "Cultural Pics", pisc: "Pisc", submissions: "Submissions" };
var SEGMENT_COLORS = [
  '#3d2e1a', '#2a2018', '#3a2a18', '#252015',
  '#352a1a', '#2e2218', '#3c2d1a', '#282014',
  '#38281a', '#302418', '#342618', '#2c1e14',
  '#3e2f1a', '#262015', '#36281a', '#2e2216',
  '#3a2b18', '#282016', '#3c2c1a', '#2a1e14',
  '#38291a', '#322418', '#342718', '#2c2014',
];
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
var wheelWorks = [];
var isSpinning = false;
var currentRotation = 0;
var spinCount = 0;
var history = [];
var segmentImages = [];

function fetchGallery() {
  return fetch(API_URL)
    .then(function(res) { if (!res.ok) throw new Error('API ' + res.status); return res.json(); })
    .then(function(data) {
      if (data.allWorks && Array.isArray(data.allWorks) && data.allWorks.length > 0) {
        WORKS = data.allWorks.map(function(w) { return { t: w.title, g: w.gallery, u: w.imageUrl }; });
        console.log('Loaded ' + WORKS.length + ' works');
        return;
      }
      throw new Error('No works');
    })
    .catch(function(err) {
      console.warn('Fetch failed:', err.message, '— using fallback');
      WORKS = FALLBACK_WORKS.map(function(w) { return Object.assign({}, w); });
    });
}

function shuffle(arr) { for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp; } return arr; }

function genGrain() {
  var c = document.createElement('canvas'); c.width = c.height = 128;
  var x = c.getContext('2d'); if (!x) return;
  var d = x.createImageData(128, 128);
  for (var i = 0; i < d.data.length; i += 4) { var v = Math.random() * 255; d.data[i] = v; d.data[i+1] = v; d.data[i+2] = v; d.data[i+3] = 8; }
  x.putImageData(d, 0, 0);
  var g = document.createElement('div'); g.className = 'grain-overlay'; g.style.backgroundImage = 'url(' + c.toDataURL('image/png') + ')';
  document.body.appendChild(g);
}

function buildWinnerFilmHoles() {
  var el = document.getElementById('winnerFilmHoles');
  for (var i = 0; i < 10; i++) { var hole = document.createElement('div'); hole.className = 'film-hole'; el.appendChild(hole); }
}

/* ═══ WHEEL DRAWING ═══ */
function drawWheel() {
  var canvas = document.getElementById('wheelCanvas');
  var ctx = canvas.getContext('2d');
  var size = 700;
  var cx = size / 2, cy = size / 2, radius = size / 2 - 4;
  var n = wheelWorks.length;
  var arc = (Math.PI * 2) / n;

  ctx.clearRect(0, 0, size, size);

  // Draw segments
  for (var i = 0; i < n; i++) {
    var startAngle = -Math.PI / 2 + i * arc;
    var endAngle = startAngle + arc;

    // Segment fill
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.closePath();

    var color = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
    ctx.fillStyle = color;
    ctx.fill();

    // Segment border
    ctx.strokeStyle = 'rgba(212,168,83,0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw image in segment
    if (segmentImages[i] && segmentImages[i].complete && segmentImages[i].naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.clip();

      var midAngle = startAngle + arc / 2;
      var imgSize = radius * 0.55;
      var imgDist = radius * 0.55;
      var imgCx = cx + Math.cos(midAngle) * imgDist;
      var imgCy = cy + Math.sin(midAngle) * imgDist;

      // Draw image as circle thumbnail
      var thumbRadius = Math.min(arc * radius * 0.3, 38);
      ctx.beginPath();
      ctx.arc(imgCx, imgCy, thumbRadius, 0, Math.PI * 2);
      ctx.clip();

      var aspect = segmentImages[i].naturalWidth / segmentImages[i].naturalHeight;
      var drawW, drawH;
      if (aspect > 1) { drawH = thumbRadius * 2; drawW = drawH * aspect; }
      else { drawW = thumbRadius * 2; drawH = drawW / aspect; }
      ctx.drawImage(segmentImages[i], imgCx - drawW / 2, imgCy - drawH / 2, drawW, drawH);

      ctx.restore();
    }

    // Segment number
    if (!segmentImages[i] || !segmentImages[i].complete) {
      var midAngle2 = startAngle + arc / 2;
      var numDist = radius * 0.6;
      var numX = cx + Math.cos(midAngle2) * numDist;
      var numY = cy + Math.sin(midAngle2) * numDist;
      ctx.save();
      ctx.font = '600 ' + Math.max(10, Math.min(16, arc * radius * 0.08)) + 'px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(212,168,83,0.2)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(i + 1), numX, numY);
      ctx.restore();
    }
  }

  // Outer ring
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(212,168,83,0.2)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Inner ring
  ctx.beginPath();
  ctx.arc(cx, cy, 55, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(212,168,83,0.15)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Tick marks at segment boundaries
  for (var j = 0; j < n; j++) {
    var angle = -Math.PI / 2 + j * arc;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * (radius - 15), cy + Math.sin(angle) * (radius - 15));
    ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    ctx.strokeStyle = 'rgba(212,168,83,0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Dot decorations around rim
  for (var k = 0; k < n * 3; k++) {
    var dotAngle = (Math.PI * 2 / (n * 3)) * k;
    var dotX = cx + Math.cos(dotAngle) * (radius - 6);
    var dotY = cy + Math.sin(dotAngle) * (radius - 6);
    ctx.beginPath();
    ctx.arc(dotX, dotY, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(212,168,83,0.12)';
    ctx.fill();
  }
}

function loadSegmentImages() {
  segmentImages = [];
  var loaded = 0;
  wheelWorks.forEach(function(w, i) {
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      loaded++;
      drawWheel();
    };
    img.onerror = function() {
      loaded++;
      segmentImages[i] = null;
      drawWheel();
    };
    img.src = w.u;
    segmentImages[i] = img;
  });
}

/* ═══ SPINNING ═══ */
function spin() {
  if (isSpinning) return;
  isSpinning = true;

  var center = document.querySelector('.wheel-center');
  var glow = document.getElementById('wheelGlow');
  var pointer = document.querySelector('.wheel-pointer');
  var hint = document.getElementById('spinHint');

  center.classList.add('spinning');
  glow.classList.add('spinning');
  pointer.classList.add('active');
  if (hint) hint.classList.add('hidden');

  document.getElementById('spinText').textContent = '...';

  // Pick a random winner
  var winnerIdx = Math.floor(Math.random() * wheelWorks.length);
  var n = wheelWorks.length;
  var arc = 360 / n;

  // Calculate target angle: multiple full rotations + landing on winner segment
  // The pointer is at top (12 o'clock). Segment i center is at i * arc degrees from top.
  // We want the wheel to rotate so that segment winnerIdx is at top.
  var targetSegmentCenter = winnerIdx * arc + arc / 2;
  // Add small random offset within the segment (not dead center)
  var offset = (Math.random() - 0.5) * arc * 0.6;
  var targetAngle = targetSegmentCenter + offset;

  // Multiple full spins + target
  var fullSpins = 5 + Math.floor(Math.random() * 4); // 5-8 full rotations
  var totalRotation = fullSpins * 360 + targetAngle;

  var startRotation = currentRotation;
  var endRotation = startRotation + totalRotation;
  var duration = CFG.spinDuration * 1000;
  var startTime = performance.now();

  // Easing function — cubic ease out with slight bounce
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateSpin(now) {
    var elapsed = now - startTime;
    var progress = Math.min(elapsed / duration, 1);
    var eased = easeOutCubic(progress);

    var angle = startRotation + totalRotation * eased;
    document.getElementById('wheelContainer').style.transform = 'rotate(' + angle + 'deg)';

    // Tick sound simulation — flash the pointer on segment boundaries
    var currentAngleDeg = angle % 360;
    var currentSegment = Math.floor(((360 - currentAngleDeg % 360 + 360) % 360) / arc);

    if (progress < 1) {
      requestAnimationFrame(animateSpin);
    } else {
      // Spin complete
      currentRotation = endRotation;
      isSpinning = false;
      center.classList.remove('spinning');
      glow.classList.remove('spinning');
      glow.classList.add('winner');
      pointer.classList.remove('active');

      spinCount++;
      document.getElementById('spinCount').textContent = spinCount;
      document.getElementById('spinText').textContent = 'SPIN';

      setTimeout(function() { glow.classList.remove('winner'); }, 3000);

      // Determine winner based on final angle
      // The wheel rotated by totalRotation, so the segment at the top is:
      var finalAngleDeg = endRotation % 360;
      var winnerFromWheel = Math.floor(((finalAngleDeg) % 360) / arc) % n;
      // Make sure we use the actual calculated winner (the random one we picked)
      revealWinner(winnerIdx);
    }
  }

  requestAnimationFrame(animateSpin);
}

function revealWinner(idx) {
  var w = wheelWorks[idx];
  if (!w) return;

  var card = document.getElementById('winnerCard');
  var placeholder = document.getElementById('winnerPlaceholder');
  var content = document.getElementById('winnerContent');
  var img = document.getElementById('winnerImg');
  var shimmer = document.getElementById('winnerShimmer');
  var title = document.getElementById('winnerTitle');
  var tag = document.getElementById('winnerTag');

  placeholder.style.display = 'none';
  content.style.display = 'flex';
  shimmer.classList.remove('hidden');
  img.classList.remove('loaded');
  img.src = w.u;
  img.alt = w.t;

  var t = w.t || 'Unknown';
  title.textContent = t;
  title.classList.remove('condensed', 'extra-condensed');
  if (t.length > 60) title.classList.add('extra-condensed');
  else if (t.length > 40) title.classList.add('condensed');
  tag.textContent = (ABBR[w.g] || 'UNK') + ' \\u2014 ' + (GNAME[w.g] || w.g);

  card.classList.remove('revealed');
  void card.offsetWidth;
  card.classList.add('revealed');

  // Add to history
  addToHistory(w);
}

document.getElementById('winnerImg').addEventListener('load', function() {
  if (this.naturalWidth > 0) {
    this.classList.add('loaded');
    document.getElementById('winnerShimmer').classList.add('hidden');
  }
});

function addToHistory(w) {
  history.unshift(w);
  if (history.length > 8) history.pop();

  var list = document.getElementById('historyList');
  list.innerHTML = '';
  history.forEach(function(w, i) {
    var item = document.createElement('div');
    item.className = 'history-item';
    var img = document.createElement('img');
    img.src = w.u; img.alt = w.t || ''; img.loading = 'lazy';
    img.onload = function() { this.classList.add('loaded'); };
    img.onerror = function() { this.style.display = 'none'; };
    var num = document.createElement('span');
    num.className = 'history-num';
    num.textContent = String(history.length - i);
    item.appendChild(img);
    item.appendChild(num);
    list.appendChild(item);
  });
}

/* ═══ PARTICLES ═══ */
function initParticles() {
  var canvas = document.getElementById('particleCanvas'); if (!canvas) return;
  var ctx = canvas.getContext('2d'); if (!ctx) return;
  canvas.width = 1920; canvas.height = 1080;
  var particles = [];
  for (var i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * 1920, y: Math.random() * 1080,
      vx: (Math.random() - 0.5) * 0.2, vy: -Math.random() * 0.3 - 0.05,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.35 + 0.08,
      life: Math.random() * 600 + 250, age: Math.floor(Math.random() * 400),
      twinkle: Math.random() * Math.PI * 2
    });
  }
  function animate() {
    ctx.clearRect(0, 0, 1920, 1080);
    particles.forEach(function(p) {
      p.x += p.vx; p.y += p.vy; p.age++; p.twinkle += 0.02;
      if (p.age > p.life || p.y < -10) { p.x = Math.random() * 1920; p.y = 1080 + Math.random() * 30; p.age = 0; }
      var fadeRatio = p.age < 80 ? p.age / 80 : p.age > p.life - 80 ? (p.life - p.age) / 80 : 1;
      var alpha = p.opacity * Math.max(0, fadeRatio) * (0.7 + 0.3 * Math.sin(p.twinkle));
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(212,168,83,' + alpha.toFixed(4) + ')'; ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ═══ INIT ═══ */
function init() {
  if (CFG.showGrain) genGrain();
  buildWinnerFilmHoles();

  fetchGallery().then(function() {
    var filtered = CFG.gallery === 'all' ? WORKS.slice() : WORKS.filter(function(w) { return w.g === CFG.gallery; });
    if (filtered.length === 0) filtered = WORKS.slice();
    shuffle(filtered);

    wheelWorks = filtered.slice(0, CFG.segments);
    document.getElementById('totalCount').textContent = filtered.length;

    drawWheel();
    loadSegmentImages();
    initParticles();
  });
}

document.addEventListener('keydown', function(e) {
  if (e.code === 'Space') { e.preventDefault(); spin(); }
  if (e.code === 'KeyR') {
    // Re-shuffle wheel with new images
    var filtered = CFG.gallery === 'all' ? WORKS.slice() : WORKS.filter(function(w) { return w.g === CFG.gallery; });
    if (filtered.length === 0) filtered = WORKS.slice();
    shuffle(filtered);
    wheelWorks = filtered.slice(0, CFG.segments);
    currentRotation = 0;
    document.getElementById('wheelContainer').style.transform = 'rotate(0deg)';
    drawWheel();
    loadSegmentImages();
  }
  if (e.code === 'KeyH') {
    document.getElementById('mainContent').style.opacity = document.getElementById('mainContent').style.opacity === '0' ? '1' : '0';
  }
});

document.getElementById('wheelContainer').addEventListener('click', function() { spin(); });
document.querySelector('.wheel-center').addEventListener('click', function(e) { e.stopPropagation(); spin(); });

init();
`;
