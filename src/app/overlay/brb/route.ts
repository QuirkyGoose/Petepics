import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1920,height=1080">
<title>Peet Pics — Be Right Back</title>
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
  <div class="ambient-orb orb-6"></div>
  <div class="ambient-orb orb-7"></div>
</div>

<div class="ambient-beam beam-left"></div>
<div class="ambient-beam beam-right"></div>
<div class="ambient-rays"></div>
<canvas class="ambient-particles" id="particleCanvas"></canvas>
<canvas class="ambient-bokeh" id="bokehCanvas"></canvas>

<div class="film-strip-top"></div>
<div class="film-strip-bottom"></div>

<div class="main-layout" id="mainContent">
  <div class="left-panel">
    <div class="brand-logo">
      <div class="brand-title">Peet Pics</div>
      <div class="brand-subtitle">The Permanent Collection</div>
      <div class="brand-line"></div>
    </div>
    <div class="brb-block">
      <div class="brb-icon">
        <div class="clock-face">
          <div class="clock-hand clock-hand-hour" id="clockHour"></div>
          <div class="clock-hand clock-hand-minute" id="clockMinute"></div>
          <div class="clock-center-dot"></div>
        </div>
      </div>
      <div class="brb-text" id="brbText">BE RIGHT BACK</div>
      <div class="brb-line"></div>
      <div class="brb-sub" id="brbSub">the vault will return shortly</div>
      <div class="elapsed-block">
        <span class="elapsed-label">AWAY</span>
        <span class="elapsed-time" id="elapsedTime">00:00</span>
      </div>
    </div>
    <div class="status-label">
      <span class="status-dot"></span>
      <span id="statusText">AWAY</span>
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
  <div class="info-bar-left"><span class="info-tag">AWAY</span><a href="https://twitch.tv/AGoodPete" target="_blank" class="info-link">twitch.tv/AGoodPete</a></div>
  <div class="info-bar-right"><span class="info-tag" id="frameRate">24 FPS</span><a href="https://petepics-github-io.vercel.app/" target="_blank" class="info-link">PETEPICS</a></div>
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
   STYLES — cinematic ambient background, BRB screen
   ═══════════════════════════════════════════════════════════════════ */
const STYLES = `
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #000; color: #e8dcc8; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; overflow: hidden; width: 1920px; height: 1080px; position: relative; }
  :root { --amber: #d4a853; --cream: #e8dcc8; --muted: #9a8d7a; --dim: #8e8374; --dark: #1a1814; --card: #2a2520; --border: #3d352a; --red: #c4473a; --accent: var(--amber); }

  /* ═══ BACKGROUND LAYERS ═══ */

  .bg-base {
    position: fixed; inset: 0; z-index: 0;
    background: radial-gradient(ellipse at 25% 45%, #12100d 0%, #080706 50%, #030303 100%);
  }

  .bg-gradient-shift {
    position: fixed; inset: 0; z-index: 1; pointer-events: none;
    background:
      radial-gradient(ellipse 80% 60% at 20% 70%, rgba(212,168,83,.03) 0%, transparent 70%),
      radial-gradient(ellipse 70% 50% at 80% 30%, rgba(181,112,126,.02) 0%, transparent 70%);
    animation: shiftWash 40s ease-in-out infinite alternate;
    mix-blend-mode: screen;
  }
  @keyframes shiftWash {
    0%   { opacity: .4; transform: scale(1) translateX(0); }
    50%  { opacity: .7; transform: scale(1.05) translateX(-20px); }
    100% { opacity: .4; transform: scale(1) translateX(20px); }
  }

  .bg-vignette {
    position: fixed; inset: 0; z-index: 2; pointer-events: none;
    background:
      radial-gradient(ellipse 85% 80% at 50% 50%, transparent 30%, rgba(0,0,0,.5) 70%, rgba(0,0,0,.85) 100%),
      linear-gradient(180deg, rgba(0,0,0,.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,.5) 100%);
  }

  .bg-horizon-glow {
    position: fixed; bottom: 0; left: 0; right: 0; height: 40%; z-index: 1; pointer-events: none;
    background:
      radial-gradient(ellipse 120% 80% at 50% 100%, rgba(212,168,83,.04) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 30% 100%, rgba(196,71,58,.02) 0%, transparent 50%);
    animation: horizonPulse 12s ease-in-out infinite alternate;
  }
  @keyframes horizonPulse {
    0%   { opacity: .6; }
    100% { opacity: 1; }
  }

  /* ═══ AMBIENT ELEMENTS ═══ */

  .ambient-particles { position: fixed; inset: 0; z-index: 5; pointer-events: none; }
  .ambient-bokeh { position: fixed; inset: 0; z-index: 4; pointer-events: none; }

  .ambient-rays {
    position: fixed; inset: 0; z-index: 3; pointer-events: none; opacity: .2;
    background: conic-gradient(from -5deg at 0% 0%,
      transparent 0deg, rgba(212,168,83,.025) 3deg, transparent 6deg,
      transparent 18deg, rgba(212,168,83,.015) 20deg, transparent 23deg,
      transparent 40deg, rgba(212,168,83,.02) 42deg, transparent 45deg,
      transparent 360deg);
    animation: raysRotate 80s linear infinite; mix-blend-mode: screen;
  }
  @keyframes raysRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  .ambient-glow-layer { position: fixed; inset: 0; z-index: 3; pointer-events: none; overflow: hidden; }
  .ambient-orb { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0; animation: orbDrift linear infinite; will-change: transform, opacity; }

  .ambient-orb.orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(212,168,83,.07) 0%, transparent 70%); top: 5%; left: -8%; animation-duration: 50s; }
  .ambient-orb.orb-2 { width: 450px; height: 450px; background: radial-gradient(circle, rgba(212,168,83,.05) 0%, transparent 70%); top: 45%; right: -5%; animation-duration: 60s; animation-delay: -15s; }
  .ambient-orb.orb-3 { width: 380px; height: 380px; background: radial-gradient(circle, rgba(196,71,58,.03) 0%, transparent 70%); bottom: 5%; left: 25%; animation-duration: 55s; animation-delay: -25s; }
  .ambient-orb.orb-4 { width: 320px; height: 320px; background: radial-gradient(circle, rgba(212,168,83,.04) 0%, transparent 70%); top: 25%; left: 45%; animation-duration: 45s; animation-delay: -10s; }
  .ambient-orb.orb-5 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(181,112,126,.03) 0%, transparent 70%); top: 55%; left: 10%; animation-duration: 65s; animation-delay: -35s; }
  .ambient-orb.orb-6 { width: 280px; height: 280px; background: radial-gradient(circle, rgba(212,168,83,.04) 0%, transparent 70%); top: 10%; right: 25%; animation-duration: 50s; animation-delay: -20s; }
  .ambient-orb.orb-7 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(160,82,45,.025) 0%, transparent 70%); bottom: 20%; right: 15%; animation-duration: 55s; animation-delay: -40s; }

  @keyframes orbDrift {
    0%   { transform: translate(0, 0) scale(1); opacity: 0; }
    8%   { opacity: 1; }
    50%  { transform: translate(100px, -60px) scale(1.1); opacity: .7; }
    92%  { opacity: 1; }
    100% { transform: translate(200px, 40px) scale(.95); opacity: 0; }
  }

  .ambient-beam {
    position: fixed; top: -300px; width: 500px; height: 1600px; z-index: 3; pointer-events: none;
    mix-blend-mode: screen;
  }
  .ambient-beam.beam-left {
    left: 15%;
    background: linear-gradient(180deg, rgba(212,168,83,.035) 0%, rgba(212,168,83,.015) 35%, transparent 100%);
    transform: rotate(-6deg); animation: beamSwayLeft 25s ease-in-out infinite;
  }
  .ambient-beam.beam-right {
    left: 60%; width: 350px;
    background: linear-gradient(180deg, rgba(212,168,83,.025) 0%, rgba(212,168,83,.01) 35%, transparent 100%);
    transform: rotate(4deg); animation: beamSwayRight 30s ease-in-out infinite;
  }
  @keyframes beamSwayLeft {
    0%, 100% { transform: rotate(-6deg) translateX(0); opacity: .5; }
    50%      { transform: rotate(-3deg) translateX(25px); opacity: .75; }
  }
  @keyframes beamSwayRight {
    0%, 100% { transform: rotate(4deg) translateX(0); opacity: .4; }
    50%      { transform: rotate(2deg) translateX(-20px); opacity: .65; }
  }

  .grain-overlay {
    position: fixed; inset: -50px; width: 200%; height: 200%;
    background-repeat: repeat; background-size: 128px 128px; opacity: .18;
    pointer-events: none; z-index: 99; animation: grainDrift .4s steps(6) infinite;
  }
  @keyframes grainDrift {
    0% { transform: translate(0, 0); } 10% { transform: translate(-2%, -2%); }
    20% { transform: translate(2%, 0%); } 30% { transform: translate(-2%, 2%); }
    40% { transform: translate(2%, -2%); } 50% { transform: translate(-2%, 0%); }
    60% { transform: translate(0%, 2%); } 70% { transform: translate(2%, 0%); }
    80% { transform: translate(-2%, -2%); } 90% { transform: translate(0%, 2%); }
    100% { transform: translate(0, 0); }
  }

  .film-strip-top, .film-strip-bottom { position: fixed; left: 0; right: 0; height: 3px; z-index: 30; pointer-events: none; }
  .film-strip-top { top: 0; background: linear-gradient(90deg, transparent, var(--amber), transparent); opacity: .12; }
  .film-strip-bottom { bottom: 0; background: linear-gradient(90deg, transparent, var(--amber), transparent); opacity: .12; }

  /* ═══ MAIN LAYOUT ═══ */
  .main-layout { position: fixed; inset: 0; z-index: 20; display: flex; align-items: stretch; }
  .left-panel { flex: 0 0 55%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 40px 60px; position: relative; }

  .brand-logo { text-align: center; margin-bottom: 40px; animation: brandReveal 1.2s cubic-bezier(.16, 1, .3, 1) both; }
  @keyframes brandReveal { from { opacity: 0; transform: translateY(-30px) scale(.95); letter-spacing: .3em; } to { opacity: 1; transform: translateY(0) scale(1); letter-spacing: -.03em; } }
  .brand-title { font-family: 'Newsreader', serif; font-size: 80px; font-weight: 700; color: var(--cream); letter-spacing: -.03em; line-height: 1; text-shadow: 0 4px 40px rgba(0,0,0,.6), 0 0 80px rgba(212,168,83,.1); }
  .brand-subtitle { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: .5em; text-transform: uppercase; color: var(--amber); margin-top: 12px; opacity: .6; }
  .brand-line { width: 120px; height: 1px; background: linear-gradient(90deg, transparent, var(--amber), transparent); margin: 18px auto 0; opacity: .3; }

  /* ═══ BRB BLOCK ═══ */
  .brb-block { text-align: center; position: relative; animation: fadeIn .8s ease-out .3s both; }

  .brb-icon { margin: 0 auto 28px; width: 100px; height: 100px; position: relative; display: flex; align-items: center; justify-content: center; }

  .clock-face {
    width: 100px; height: 100px; border-radius: 50%;
    border: 2px solid rgba(212,168,83,.25);
    background: radial-gradient(circle, rgba(26,24,20,.6) 0%, rgba(10,9,8,.8) 100%);
    position: relative;
    box-shadow: 0 0 30px rgba(212,168,83,.05), inset 0 0 20px rgba(0,0,0,.3);
    animation: clockGlow 4s ease-in-out infinite alternate;
  }
  @keyframes clockGlow {
    0%   { box-shadow: 0 0 30px rgba(212,168,83,.05), inset 0 0 20px rgba(0,0,0,.3); }
    100% { box-shadow: 0 0 50px rgba(212,168,83,.1), inset 0 0 20px rgba(0,0,0,.3); }
  }

  /* Clock tick marks */
  .clock-face::before {
    content: '';
    position: absolute; inset: 6px; border-radius: 50%;
    background: conic-gradient(
      transparent 0deg, rgba(212,168,83,.15) 0deg, rgba(212,168,83,.15) 2deg, transparent 2deg,
      transparent 28deg, rgba(212,168,83,.1) 28deg, rgba(212,168,83,.1) 30deg, transparent 30deg,
      transparent 58deg, rgba(212,168,83,.15) 58deg, rgba(212,168,83,.15) 60deg, transparent 60deg,
      transparent 88deg, rgba(212,168,83,.15) 88deg, rgba(212,168,83,.15) 90deg, transparent 90deg,
      transparent 118deg, rgba(212,168,83,.1) 118deg, rgba(212,168,83,.1) 120deg, transparent 120deg,
      transparent 148deg, rgba(212,168,83,.15) 148deg, rgba(212,168,83,.15) 150deg, transparent 150deg,
      transparent 178deg, rgba(212,168,83,.15) 178deg, rgba(212,168,83,.15) 180deg, transparent 180deg,
      transparent 208deg, rgba(212,168,83,.1) 208deg, rgba(212,168,83,.1) 210deg, transparent 210deg,
      transparent 238deg, rgba(212,168,83,.15) 238deg, rgba(212,168,83,.15) 240deg, transparent 240deg,
      transparent 268deg, rgba(212,168,83,.15) 268deg, rgba(212,168,83,.15) 270deg, transparent 270deg,
      transparent 298deg, rgba(212,168,83,.1) 298deg, rgba(212,168,83,.1) 300deg, transparent 300deg,
      transparent 328deg, rgba(212,168,83,.15) 328deg, rgba(212,168,83,.15) 330deg, transparent 330deg,
      transparent 360deg
    );
  }

  .clock-hand {
    position: absolute; bottom: 50%; left: 50%;
    transform-origin: bottom center;
    border-radius: 2px;
  }
  .clock-hand-hour {
    width: 3px; height: 28px;
    background: var(--amber);
    margin-left: -1.5px;
    opacity: .8;
    animation: clockHourSpin 30s linear infinite;
    box-shadow: 0 0 6px rgba(212,168,83,.3);
  }
  .clock-hand-minute {
    width: 2px; height: 36px;
    background: var(--cream);
    margin-left: -1px;
    opacity: .6;
    animation: clockMinuteSpin 8s linear infinite;
    box-shadow: 0 0 4px rgba(232,220,200,.2);
  }
  .clock-center-dot {
    position: absolute; top: 50%; left: 50%;
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--amber);
    transform: translate(-50%, -50%);
    box-shadow: 0 0 8px rgba(212,168,83,.4);
    z-index: 2;
  }

  @keyframes clockHourSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes clockMinuteSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  .brb-text {
    font-family: 'Newsreader', serif;
    font-size: 72px; font-weight: 700;
    color: var(--cream);
    letter-spacing: .04em;
    line-height: 1;
    text-shadow: 0 0 80px rgba(212,168,83,.15), 0 6px 40px rgba(0,0,0,.5);
    animation: brbPulse 6s ease-in-out infinite;
  }
  @keyframes brbPulse {
    0%, 100% { opacity: 1; text-shadow: 0 0 80px rgba(212,168,83,.15), 0 6px 40px rgba(0,0,0,.5); }
    50%      { opacity: .85; text-shadow: 0 0 120px rgba(212,168,83,.25), 0 6px 40px rgba(0,0,0,.5); }
  }

  .brb-line {
    width: 280px; height: 1px;
    background: linear-gradient(90deg, transparent, var(--amber), transparent);
    margin: 20px auto;
    opacity: .25;
  }

  .brb-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 400;
    letter-spacing: .35em; text-transform: uppercase;
    color: var(--muted);
    opacity: .5;
    margin-bottom: 24px;
  }

  .elapsed-block {
    display: inline-flex; align-items: center; gap: 12px;
    font-family: 'JetBrains Mono', monospace;
    padding: 6px 20px;
    border: 1px solid rgba(212,168,83,.1);
    border-radius: 2px;
    background: rgba(26,24,20,.4);
  }
  .elapsed-label {
    font-size: 8px; font-weight: 500;
    letter-spacing: .3em; text-transform: uppercase;
    color: var(--muted); opacity: .5;
  }
  .elapsed-time {
    font-size: 20px; font-weight: 600;
    letter-spacing: .08em;
    color: var(--amber);
    opacity: .7;
    font-variant-numeric: tabular-nums;
  }

  .status-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: .4em; text-transform: uppercase; color: var(--amber); margin-top: 28px; display: flex; align-items: center; gap: 10px; animation: fadeIn .8s ease-out .5s both; }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--amber); box-shadow: 0 0 8px rgba(212,168,83,.4); animation: dotPulse 3s ease-in-out infinite; }
  @keyframes dotPulse { 0%, 100% { opacity: .3; transform: scale(1); } 50% { opacity: .8; transform: scale(1.3); } }

  /* ═══ RIGHT PANEL ═══ */
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

  .gallery-pobots { --accent: #d4a853; }
  .gallery-prestlers { --accent: #a0522d; }
  .gallery-cultural { --accent: #b5707e; }
  .gallery-pisc { --accent: #6b7c5e; }
  .gallery-submissions { --accent: #6b7c5e; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;

/* ═══════════════════════════════════════════════════════════════════
   SCRIPT — same-origin fetch, ambient canvas, elapsed timer
   ═══════════════════════════════════════════════════════════════════ */
const SCRIPT = `
var P = new URLSearchParams(window.location.search);
var CFG = {
  message: P.get('message') || 'BE RIGHT BACK',
  sub: P.get('sub') || 'the vault will return shortly',
  gallery: P.get('gallery') || 'all',
  speed: parseInt(P.get('speed')) || 12,
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

var activeWorks = [], posterWorks = [];
var posterIdx = 0, posterInterval = null;
var posterProg = 0, posterProgInterval = null;
var consecutiveImgErrors = 0, MAX_CONSECUTIVE_ERRORS = 5;
var elapsedSeconds = 0, elapsedInterval = null;

function genGrain() {
  var c = document.createElement('canvas'); c.width = c.height = 128;
  var x = c.getContext('2d'); if (!x) return;
  var d = x.createImageData(128, 128);
  for (var i = 0; i < d.data.length; i += 4) { var v = Math.random() * 255; d.data[i] = v; d.data[i+1] = v; d.data[i+2] = v; d.data[i+3] = 10; }
  x.putImageData(d, 0, 0);
  var g = document.createElement('div'); g.className = 'grain-overlay'; g.style.backgroundImage = 'url(' + c.toDataURL('image/png') + ')';
  document.body.appendChild(g);
}

function buildFilmHoles() {
  var el = document.getElementById('filmHoles');
  for (var i = 0; i < 12; i++) { var hole = document.createElement('div'); hole.className = 'film-hole'; el.appendChild(hole); }
}

function updateElapsed() {
  elapsedSeconds++;
  var min = Math.floor(elapsedSeconds / 60), sec = elapsedSeconds % 60;
  var h = Math.floor(min / 60); min = min % 60;
  var display = '';
  if (h > 0) { display = h + ':' + String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0'); }
  else { display = String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0'); }
  document.getElementById('elapsedTime').textContent = display;
}

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
  posterProgInterval = setInterval(function() { posterProg += tickMs; var bar = document.getElementById('posterProgress'); if (bar) bar.style.width = Math.min(100, posterProg / totalMs * 100) + '%'; }, tickMs);
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

/* ═══ AMBIENT PARTICLES — golden dust motes rising slowly ═══ */
function initParticles() {
  var canvas = document.getElementById('particleCanvas'); if (!canvas) return;
  var ctx = canvas.getContext('2d'); if (!ctx) return;
  canvas.width = 1920; canvas.height = 1080;
  var particles = [];
  for (var i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * 1920, y: Math.random() * 1080,
      vx: (Math.random() - 0.5) * 0.25, vy: -Math.random() * 0.35 - 0.05,
      size: Math.random() * 1.8 + 0.3,
      opacity: Math.random() * 0.4 + 0.08,
      life: Math.random() * 600 + 250, age: Math.floor(Math.random() * 400),
      twinkle: Math.random() * Math.PI * 2
    });
  }
  function animate() {
    ctx.clearRect(0, 0, 1920, 1080);
    particles.forEach(function(p) {
      p.x += p.vx; p.y += p.vy; p.age++;
      p.twinkle += 0.02;
      if (p.age > p.life || p.y < -10) { p.x = Math.random() * 1920; p.y = 1080 + Math.random() * 30; p.age = 0; }
      var fadeRatio = p.age < 80 ? p.age / 80 : p.age > p.life - 80 ? (p.life - p.age) / 80 : 1;
      var twinkleFactor = 0.7 + 0.3 * Math.sin(p.twinkle);
      var alpha = p.opacity * Math.max(0, fadeRatio) * twinkleFactor;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(212,168,83,' + alpha.toFixed(4) + ')'; ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ═══ BOKEH — soft out-of-focus light circles floating ═══ */
function initBokeh() {
  var canvas = document.getElementById('bokehCanvas'); if (!canvas) return;
  var ctx = canvas.getContext('2d'); if (!ctx) return;
  canvas.width = 1920; canvas.height = 1080;
  var circles = [];
  var colours = [
    [212, 168, 83],
    [196, 140, 70],
    [181, 112, 126],
    [160, 82, 45],
    [200, 160, 90],
  ];
  for (var i = 0; i < 18; i++) {
    var c = colours[Math.floor(Math.random() * colours.length)];
    circles.push({
      x: Math.random() * 1920, y: Math.random() * 1080,
      vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.12,
      radius: Math.random() * 60 + 25,
      r: c[0], g: c[1], b: c[2],
      baseAlpha: Math.random() * 0.035 + 0.01,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.005 + 0.002
    });
  }
  function animate() {
    ctx.clearRect(0, 0, 1920, 1080);
    circles.forEach(function(c) {
      c.x += c.vx; c.y += c.vy; c.phase += c.speed;
      if (c.x < -c.radius) c.x = 1920 + c.radius;
      if (c.x > 1920 + c.radius) c.x = -c.radius;
      if (c.y < -c.radius) c.y = 1080 + c.radius;
      if (c.y > 1080 + c.radius) c.y = -c.radius;
      var alpha = c.baseAlpha * (0.6 + 0.4 * Math.sin(c.phase));
      var grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.radius);
      grad.addColorStop(0, 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + (alpha * 1.5).toFixed(4) + ')');
      grad.addColorStop(0.4, 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + alpha.toFixed(4) + ')');
      grad.addColorStop(1, 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',0)');
      ctx.beginPath(); ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad; ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

function shuffle(arr) { for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp; } return arr; }

function init() {
  document.getElementById('brbText').textContent = CFG.message;
  document.getElementById('brbSub').textContent = CFG.sub;
  if (CFG.showGrain) genGrain();
  buildFilmHoles();
  fetchGallery().then(function() {
    activeWorks = CFG.gallery === 'all' ? WORKS.slice() : WORKS.filter(function(w) { return w.g === CFG.gallery; });
    if (activeWorks.length === 0) activeWorks = WORKS.slice();
    shuffle(activeWorks);
    posterWorks = activeWorks.slice(0, Math.min(8, activeWorks.length));
    document.getElementById('galleryCount').textContent = activeWorks.length + ' WORKS';
    buildThumbStrip(); updatePoster(0); startPosterProgress();
    posterInterval = setInterval(function() { advancePoster(); }, CFG.speed * 1000);
    elapsedInterval = setInterval(updateElapsed, 1000);
    initParticles();
    initBokeh();
  });
}

document.addEventListener('keydown', function(e) {
  if (e.code === 'KeyR') { elapsedSeconds = 0; document.getElementById('elapsedTime').textContent = '00:00'; }
  if (e.code === 'KeyH') { document.getElementById('mainContent').style.opacity = document.getElementById('mainContent').style.opacity === '0' ? '1' : '0'; }
});

init();
`;
