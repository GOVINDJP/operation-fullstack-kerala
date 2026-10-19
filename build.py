# -*- coding: utf-8 -*-
import base64, html, io, os
from PIL import Image
import data as D

BASE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(BASE, "assets")
OUT = os.path.join(BASE, "Full-Stack-Roadmap-Kerala.html")

def img64(name, maxw, quality=82):
    im = Image.open(os.path.join(ASSETS, name)).convert("RGB")
    if im.width > maxw:
        im = im.resize((maxw, int(im.height * maxw / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=quality, optimize=True, progressive=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()

HERO = img64("hero.png", 1400, 84)
BOSS = img64("boss.png", 1000, 80)
VICT = img64("victory.png", 1200, 82)
GOKU = img64("meme-goku.jpg", 560, 82)
ROCKLEE = img64("meme-rocklee.jpg", 700, 82)
SOLO = img64("meme-solo.jpg", 1100, 80)
NARUTO = img64("meme-naruto.jpg", 700, 80)
ALLMIGHT = img64("meme-allmight.jpg", 420, 88)
LEVI = img64("meme-levi.jpg", 760, 80)

E = lambda s: html.escape(str(s), quote=True)

CSS = r"""
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  margin:0;color:#1E1B2E;background:#FFF9F2;
  font-family:"Segoe UI",system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;
  line-height:1.55;-webkit-font-smoothing:antialiased;
}
body::before{
  content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;
  background:
    radial-gradient(900px 600px at 8% -5%, rgba(255,107,61,.13), transparent 60%),
    radial-gradient(800px 600px at 100% 8%, rgba(124,92,255,.12), transparent 60%),
    radial-gradient(900px 700px at 50% 110%, rgba(14,159,138,.10), transparent 60%);
}
h1,h2,h3,h4{line-height:1.15;letter-spacing:-.02em;margin:0}
p{margin:0}
a{color:#6C4CE0}
a:hover{text-decoration-thickness:2px}
.wrap{max-width:1180px;margin:0 auto;padding:0 24px}
.skip{position:absolute;left:-9999px;top:0;background:#1E1B2E;color:#fff;padding:12px 18px;border-radius:0 0 12px 0;z-index:200}
.skip:focus{left:0}
:focus-visible{outline:3px solid #FF6B3D;outline-offset:2px;border-radius:6px}

/* phase colour themes */
.c1{--pc:#FF6B3D;--pcs:#FFF1EA}
.c2{--pc:#E39A00;--pcs:#FFF7E3}
.c3{--pc:#7C5CFF;--pcs:#F2EEFF}
.c4{--pc:#0E9F8A;--pcs:#E9F8F5}
.c5{--pc:#2D9CDB;--pcs:#EAF5FC}
.c6{--pc:#E0457B;--pcs:#FDECF2}
.c7{--pc:#9B51E0;--pcs:#F5EDFC}
.c8{--pc:#B98A00;--pcs:#FBF4DE}
.c9{--pc:#219653;--pcs:#EAF7EF}

/* ---------- ANIME MEME BLOCKS ---------- */
.ribbon{padding:22px 0 6px}
.ribbon-head{display:flex;flex-wrap:wrap;align-items:center;gap:10px;font-weight:800;font-size:.92rem;color:#3A3450;margin-bottom:16px}
.ribbon-head .tag{background:linear-gradient(120deg,#FF6B3D,#E0457B);color:#fff;border-radius:999px;padding:5px 12px;font-size:.68rem;font-weight:900;letter-spacing:.12em}
.anime-3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.anime-card{margin:0;position:relative;border-radius:20px;overflow:hidden;background:#16121F;box-shadow:0 16px 38px rgba(30,27,46,.20);display:flex;flex-direction:column}
.anime-card .pic{position:relative;height:280px;overflow:hidden;flex:0 0 auto}
.anime-card img{width:100%;height:100%;object-fit:cover;object-position:center 34%;display:block;transition:transform .6s ease}
.anime-card:hover img{transform:scale(1.06)}
.anime-card.dbz img{object-position:center 0%}   /* poster: keep the WORK HARD line visible */
.anime-card.dbz .pic::after{background:linear-gradient(180deg,rgba(12,10,20,0) 55%,rgba(12,10,20,.92) 100%)}
.anime-card .pic::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(12,10,20,0) 45%,rgba(12,10,20,.9) 100%)}
.anime-card figcaption{padding:0 16px 16px;color:#E9E2F6;font-size:.87rem;line-height:1.5;margin-top:-58px;position:relative;z-index:2}
.anime-card .series{display:inline-block;font-size:.64rem;font-weight:900;letter-spacing:.14em;color:#FFB08F;margin-bottom:5px}
.anime-card b{display:block;color:#fff;font-size:1rem;margin-bottom:3px}
.anime-card .ico{position:absolute;top:12px;left:12px;z-index:3;font-size:.62rem;font-weight:900;letter-spacing:.1em;background:rgba(20,18,32,.72);backdrop-filter:blur(6px);color:#fff;padding:5px 9px;border-radius:999px}
.arc-divider{display:grid;grid-template-columns:290px 1fr;gap:22px;align-items:center;border-radius:24px;padding:20px;margin:4px 0 26px;overflow:hidden;background:linear-gradient(120deg,#1E1B2E 0%,#2B2350 55%,#3B2B63 100%);box-shadow:0 20px 46px rgba(30,27,46,.24)}
.arc-divider img{width:100%;display:block;border-radius:16px;max-height:270px;object-fit:cover;box-shadow:0 10px 24px rgba(0,0,0,.35)}
.arc-divider .k{font-size:.66rem;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:#FF9E7A;margin-bottom:9px}
.arc-divider h3{color:#fff;font-size:clamp(1.05rem,2vw,1.35rem);margin-bottom:8px}
.arc-divider p{color:#CFC6E8;font-size:.93rem}
.arc-divider p b{color:#fff}
.arc-divider.midboss{background:linear-gradient(120deg,#2A1030 0%,#5B1A3C 60%,#8A2A3B 100%)}
.arc-divider.midboss .k{color:#FFC46B}
.meme-strip{position:relative;border-radius:24px;overflow:hidden;margin:22px 0;box-shadow:0 18px 44px rgba(30,27,46,.22);background:#16121F}
.meme-strip img{width:100%;display:block;aspect-ratio:21/9;object-fit:cover;object-position:center 45%}
.meme-strip.levi img{aspect-ratio:21/8;object-position:center 34%}
.meme-strip .overlay{position:absolute;inset:auto 0 0 0;padding:22px 24px;background:linear-gradient(transparent,rgba(10,8,18,.92));color:#fff}
.meme-strip .overlay .k{display:inline-block;font-size:.64rem;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:#FFB08F;margin-bottom:6px}
.meme-strip .overlay b{display:block;font-size:clamp(1rem,2.2vw,1.45rem);line-height:1.2}
.meme-strip .overlay p{font-size:.85rem;color:#D9D2EA;margin-top:5px}
.meme.anime{background:#16121F;color:#F0EAFB;border-color:#2B2350}
.meme.anime b{color:#fff}
.meme.anime span{color:#FFB08F}
.meme .who{font-size:.66rem;font-weight:900;letter-spacing:.12em;color:#FF9E7A;text-transform:uppercase}

/* ---------- NAV ---------- */
.nav{position:sticky;top:0;z-index:100;background:rgba(255,249,242,.9);backdrop-filter:blur(14px);border-bottom:1px solid #EDE6DC}
.nav .wrap{display:flex;align-items:center;gap:18px;height:64px}
.logo{display:flex;align-items:center;gap:10px;font-weight:800;letter-spacing:-.02em;text-decoration:none;color:#1E1B2E;white-space:nowrap}
.logo .dot{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;color:#fff;font-size:17px;background:linear-gradient(135deg,#FF6B3D,#E0457B 55%,#7C5CFF);box-shadow:0 6px 16px rgba(224,69,123,.32)}
.nav-links{display:flex;gap:4px;margin-left:auto;overflow-x:auto;scrollbar-width:none;min-width:0;flex:1 1 auto}
.nav-links::-webkit-scrollbar{display:none}
.nav-links a{padding:7px 10px;border-radius:999px;font-size:.83rem;font-weight:600;color:#4A4463;text-decoration:none;white-space:nowrap}
.nav-links a:hover{background:#F4ECE2;color:#1E1B2E}
.nav-progress{display:flex;align-items:center;gap:8px;font-size:.78rem;font-weight:800;color:#0E9F8A;white-space:nowrap;flex:0 0 auto}
.nav-progress .mini{width:56px;height:8px;border-radius:99px;background:#EDE6DC;overflow:hidden;flex:0 0 56px}
.nav-progress .mini i{display:block;height:100%;width:0;background:linear-gradient(90deg,#0E9F8A,#2D9CDB);border-radius:99px;transition:width .35s ease}

/* ---------- HERO ---------- */
.hero{padding:46px 0 18px}
.hero-grid{display:grid;grid-template-columns:1.06fr .94fr;gap:40px;align-items:center}
.eyebrow{display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid #EDE6DC;border-radius:999px;padding:7px 14px;font-size:.76rem;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:#5A5570;box-shadow:0 4px 14px rgba(30,27,46,.05)}
.eyebrow .pulse{width:9px;height:9px;border-radius:50%;background:#27AE60;box-shadow:0 0 0 0 rgba(39,174,96,.6);animation:pulse 2.2s infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(39,174,96,.55)}70%{box-shadow:0 0 0 12px rgba(39,174,96,0)}100%{box-shadow:0 0 0 0 rgba(39,174,96,0)}}
h1{font-size:clamp(2.15rem,4.4vw,3.45rem);font-weight:900;margin:18px 0 0}
.grad{background:linear-gradient(100deg,#FF6B3D 0%,#E0457B 42%,#7C5CFF 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.lede{font-size:1.08rem;color:#5A5570;margin-top:16px;max-width:56ch}
.meta-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.chip{display:inline-flex;align-items:center;gap:6px;background:#fff;border:1px solid #EDE6DC;border-radius:999px;padding:6px 12px;font-size:.8rem;font-weight:700;color:#4A4463}
.chip.solid{background:#1E1B2E;color:#FFF9F2;border-color:#1E1B2E}
.cta-row{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}
.btn{display:inline-flex;align-items:center;gap:9px;border:0;cursor:pointer;font-family:inherit;font-weight:800;font-size:.95rem;padding:13px 20px;border-radius:14px;text-decoration:none;transition:transform .15s ease,box-shadow .15s ease}
.btn:hover{transform:translateY(-2px)}
.btn-primary{color:#fff;background:linear-gradient(120deg,#FF6B3D,#E0457B);box-shadow:0 12px 26px rgba(224,69,123,.30)}
.btn-ghost{background:#fff;color:#1E1B2E;border:1.5px solid #E6DDD1;box-shadow:0 6px 16px rgba(30,27,46,.05)}
.hero-art{position:relative}
.hero-art img{width:100%;display:block;border-radius:26px;box-shadow:0 26px 60px rgba(30,27,46,.20);object-fit:cover}
.art-tag{position:absolute;left:18px;bottom:18px;right:18px;display:flex;align-items:center;gap:12px;background:rgba(20,18,32,.72);backdrop-filter:blur(8px);color:#FFF9F2;border-radius:16px;padding:12px 14px}
.art-tag .ico{width:38px;height:38px;flex:0 0 38px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,#FF6B3D,#7C5CFF);font-size:19px}
.art-tag b{display:block;font-size:.86rem;letter-spacing:.06em;text-transform:uppercase}
.art-tag small{color:#D9D2EA;font-size:.78rem}

/* progress panel */
.panel{background:#fff;border:1px solid #EDE6DC;border-radius:20px;padding:18px 20px;box-shadow:0 14px 34px rgba(30,27,46,.07)}
.panel-top{display:flex;align-items:baseline;justify-content:space-between;gap:12px}
.panel-top .big{font-size:2.5rem;font-weight:900;letter-spacing:-.04em;line-height:1;background:linear-gradient(120deg,#0E9F8A,#2D9CDB);-webkit-background-clip:text;background-clip:text;color:transparent}
.panel-top small{font-weight:700;color:#5A5570}
.panel p.small{font-size:.82rem;color:#78718C;margin-top:6px}
.bar{height:12px;border-radius:99px;background:#F1EAE0;overflow:hidden;margin-top:12px}
.bar > i{display:block;height:100%;width:0;border-radius:99px;background:linear-gradient(90deg,#0E9F8A,#2D9CDB,#7C5CFF);transition:width .4s ease}

/* ---------- SECTIONS ---------- */
section{padding:54px 0;scroll-margin-top:76px}
.sec-head{max-width:820px;margin-bottom:26px}
.kicker{font-size:.76rem;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:#B4512E;margin-bottom:10px}
h2{font-size:clamp(1.6rem,3.4vw,2.35rem);font-weight:900}
.sub{color:#5A5570;margin-top:12px;font-size:1.02rem}
.grid{display:grid;gap:16px}
.grid > *,.two > *,.sched > *{min-width:0}
.g3{grid-template-columns:repeat(3,1fr)}
.g2{grid-template-columns:repeat(2,1fr)}
.card{background:#fff;border:1px solid #EDE6DC;border-radius:18px;padding:20px;box-shadow:0 10px 26px rgba(30,27,46,.05);min-width:0}
.card h4{font-size:1rem;margin-bottom:6px}
.card p{font-size:.9rem;color:#5A5570}
.stat{position:relative;overflow:hidden}
.stat::after{content:"";position:absolute;inset:auto -30px -40px auto;width:110px;height:110px;border-radius:50%;background:linear-gradient(135deg,rgba(255,107,61,.16),rgba(124,92,255,.10))}
.stat .v{font-size:1.7rem;font-weight:900;letter-spacing:-.03em;background:linear-gradient(120deg,#FF6B3D,#E0457B);-webkit-background-clip:text;background-clip:text;color:transparent}
.stat .l{font-weight:800;margin-top:2px;font-size:.95rem}
.stat .s{font-size:.8rem;color:#6A6480;margin-top:6px}
.stat a{font-size:.74rem;font-weight:700;display:inline-block;margin-top:8px;text-decoration:none}

.note{border-radius:20px;padding:22px 24px;background:linear-gradient(120deg,#EDFBF7,#F3F0FF);border:1px solid #D9EFE9}
.note h4{font-size:1.05rem;margin-bottom:10px}
.note ul{margin:0;padding-left:20px;color:#4A4463;font-size:.94rem}
.note li{margin:6px 0}

/* tables */
.table-wrap{overflow-x:auto;max-width:100%;border:1px solid #EDE6DC;border-radius:18px;background:#fff;box-shadow:0 10px 26px rgba(30,27,46,.05)}
table{border-collapse:collapse;width:100%;font-size:.9rem;min-width:640px}
th{background:#FBF5EC;text-align:left;padding:12px 16px;font-size:.74rem;letter-spacing:.1em;text-transform:uppercase;color:#6A6480;border-bottom:1px solid #EDE6DC}
td{padding:12px 16px;border-bottom:1px solid #F4EEE5;vertical-align:top}
tr:last-child td{border-bottom:0}
tr:hover td{background:#FFFCF7}
.pill{display:inline-block;font-size:.68rem;font-weight:900;letter-spacing:.08em;padding:4px 9px;border-radius:999px;white-space:nowrap}
.p-must{background:#FFE9E1;color:#B3401D}
.p-should{background:#E8F6F2;color:#0B6B5C}
.p-bonus{background:#EFEAFF;color:#5B3BBF}
.p-later{background:#EFEFEF;color:#5A5570}

/* ---------- ROADMAP ---------- */
.toolbar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:0 0 22px}
.toolbar .spacer{margin-left:auto}
.tool-btn{font-family:inherit;font-size:.82rem;font-weight:800;cursor:pointer;background:#fff;border:1.5px solid #E6DDD1;color:#3A3450;padding:9px 14px;border-radius:999px}
.tool-btn:hover{background:#FBF3E9}
.timeline{display:grid;gap:26px}
.phase{position:relative;background:#fff;border:1px solid #EDE6DC;border-radius:24px;padding:24px;box-shadow:0 16px 40px rgba(30,27,46,.07);border-top:6px solid var(--pc)}
.phase + .phase::before{content:"▼";position:absolute;top:-23px;left:50%;transform:translateX(-50%);font-size:13px;color:#C9BFAF}
.phase-head{display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap}
.badge{width:56px;height:56px;flex:0 0 56px;border-radius:18px;display:grid;place-items:center;font-weight:900;font-size:1.15rem;color:#fff;background:var(--pc);box-shadow:0 10px 22px color-mix(in srgb,var(--pc) 35%,transparent)}
.ph-title{flex:1 1 320px;min-width:0}
.arc{font-size:.72rem;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:var(--pc)}
.ph-title h3{font-size:clamp(1.25rem,2.4vw,1.6rem);margin-top:4px}
.ph-meta{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.ph-meta .chip{border-color:#EFE7DB}
.chip.hours{background:var(--pcs);border-color:transparent;color:var(--pc)}
.chip.pct{background:#1E1B2E;color:#fff;border-color:#1E1B2E;min-width:58px;justify-content:center}
.mission{color:#4A4463;margin-top:16px;font-size:.98rem;max-width:88ch}
.boss{margin-top:16px;background:var(--pcs);border-left:4px solid var(--pc);border-radius:0 14px 14px 0;padding:12px 16px;font-size:.93rem;color:#3A3450}
.boss b{color:#1E1B2E}
.watch{margin-top:18px}
.watch h4{font-size:.74rem;letter-spacing:.13em;text-transform:uppercase;color:#78718C;margin-bottom:8px}
.watch ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.watch li{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;font-size:.9rem;background:#FCF7F0;border:1px solid #F2E9DC;border-radius:12px;padding:9px 12px}
.watch li a{font-weight:800;text-decoration:none;color:#3A2E8C}
.watch li a:hover{text-decoration:underline}
.watch li span{color:#78718C;font-size:.78rem}
.watch li span::before{content:"· ";color:#C0B7A8}

.checks{display:grid;grid-template-columns:1fr 1fr;gap:6px 18px;margin-top:20px}
.chk{display:flex;align-items:flex-start;gap:10px;padding:7px 8px;border-radius:10px;cursor:pointer;font-size:.925rem;color:#2E2942;transition:background .15s}
.chk:hover{background:#FCF7F0}
.chk input{appearance:none;-webkit-appearance:none;width:20px;height:20px;flex:0 0 20px;margin-top:2px;border:2px solid #D8CDBE;border-radius:6px;background:#fff;cursor:pointer;position:relative;transition:all .15s}
.chk input:checked{border-color:var(--pc);background-color:var(--pc);background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6L9 17l-5-5'/%3E%3C/svg%3E");background-size:14px 14px;background-position:center;background-repeat:no-repeat}
.chk input:checked + span{color:#9A93A8;text-decoration:line-through;text-decoration-color:#C9C1D4}
.phase .bar{margin-top:18px;height:10px}
.phase .bar > i{background:var(--pc)}
.tip{margin-top:12px;font-size:.86rem;color:#6A6480;font-style:italic}
body.hide-done .chk:has(input:checked){display:none}
.phase.done{border-top-color:#27AE60}

/* ---------- SCHEDULE ---------- */
.sched{display:grid;grid-template-columns:1.15fr .85fr;gap:18px;align-items:start}
.sched-row{display:grid;grid-template-columns:120px 1fr;gap:14px;padding:13px 0;border-bottom:1px dashed #EDE6DC}
.sched-row:last-child{border-bottom:0}
.sched-row .t{font-weight:900;font-size:.86rem;color:#B4512E;font-variant-numeric:tabular-nums}
.sched-row b{display:block;font-size:.94rem}
.sched-row span{font-size:.84rem;color:#6A6480}
.day{display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-bottom:1px dashed #EDE6DC}
.day:last-child{border-bottom:0}
.day .d{font-weight:900;min-width:86px;font-size:.9rem}
.day .h{font-weight:800;color:#0E9F8A;font-size:.82rem;min-width:78px}
.day p{font-size:.84rem;color:#5A5570}

/* ---------- PROJECTS ---------- */
.proj{position:relative;background:#fff;border:1px solid #EDE6DC;border-radius:20px;padding:20px;box-shadow:0 10px 26px rgba(30,27,46,.05);display:flex;flex-direction:column;gap:10px}
.proj .lv{align-self:flex-start;font-size:.7rem;font-weight:900;letter-spacing:.12em;color:#fff;background:linear-gradient(120deg,#FF6B3D,#E0457B);border-radius:8px;padding:5px 9px}
.proj h4{font-size:1.06rem}
.proj .stack{font-size:.78rem;font-weight:800;color:#0E9F8A}
.proj ul{margin:4px 0 0;padding-left:0;list-style:none;display:grid;gap:5px}
.proj li{font-size:.86rem;color:#4A4463;padding-left:20px;position:relative}
.proj li::before{content:"✓";position:absolute;left:0;color:#0E9F8A;font-weight:900}
.proj .foot{margin-top:auto;display:flex;gap:6px;flex-wrap:wrap}
.proj .foot .chip{font-size:.7rem;padding:5px 9px}
.proj .proof{font-size:.82rem;color:#6A6480;background:#FCF7F0;border-radius:10px;padding:9px 11px}

/* ---------- JOBS ---------- */
.park{display:flex;gap:12px;align-items:flex-start}
.park .ic{width:44px;height:44px;flex:0 0 44px;border-radius:14px;display:grid;place-items:center;font-size:22px;background:#F3EEFF}
.park b{display:block}
.park span{font-size:.82rem;color:#6A6480}
.two{display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:start}
details{background:#fff;border:1px solid #EDE6DC;border-radius:14px;padding:0;overflow:hidden}
details + details{margin-top:10px}
summary{cursor:pointer;padding:14px 16px;font-weight:800;font-size:.94rem;list-style:none;display:flex;justify-content:space-between;gap:10px;align-items:center}
summary::-webkit-details-marker{display:none}
summary::after{content:"+";font-size:1.2rem;color:#B4512E;font-weight:900}
details[open] summary::after{content:"–"}
details .body{padding:0 16px 16px;font-size:.9rem;color:#4A4463}
.tmpl{background:#FCF7F0;border:1px dashed #E0D2BE;border-radius:12px;padding:12px 14px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.8rem;color:#3A3450;white-space:pre-wrap;line-height:1.5}
ol.q{margin:0;padding-left:22px;color:#4A4463;font-size:.9rem}
ol.q li{margin:9px 0}

/* ---------- CHEATS ---------- */
.kbd{display:inline-block;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.76rem;background:#1E1B2E;color:#FFF9F2;border-radius:6px;padding:3px 7px;box-shadow:0 2px 0 #0E0C1A;white-space:nowrap}
.code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.8rem;color:#0B6B5C;background:#EAF7F3;border-radius:6px;padding:3px 7px;white-space:nowrap}
.mini-table{min-width:0;width:100%;table-layout:fixed;font-size:.82rem;margin-top:8px}
.mini-table td{overflow-wrap:anywhere;padding:9px 8px}
.mini-table td:first-child{width:44%}
.mini-table .code,.mini-table .kbd{white-space:normal;overflow-wrap:anywhere;font-size:.72rem;display:inline-block;line-height:1.35}

/* ---------- RED TEAM ---------- */
.rt{background:#fff;border:1px solid #EDE6DC;border-radius:18px;padding:18px 20px;box-shadow:0 10px 26px rgba(30,27,46,.05)}
.rt .risk{font-size:.92rem;color:#3A3450;padding-left:26px;position:relative}
.rt .risk::before{content:"⚠️";position:absolute;left:0;top:0}
.rt .fix{margin-top:12px;font-size:.9rem;background:#EAF7EF;border-radius:12px;padding:11px 12px;color:#1F5B39;padding-left:36px;position:relative}
.rt .fix::before{content:"✅";position:absolute;left:12px;top:11px}

/* ---------- MOTIVATION ---------- */
.banner{position:relative;border-radius:24px;overflow:hidden;box-shadow:0 22px 50px rgba(30,27,46,.18)}
.banner img{width:100%;display:block;aspect-ratio:16/8;object-fit:cover}
.banner .cap{position:absolute;inset:auto 0 0 0;padding:26px;background:linear-gradient(transparent,rgba(15,12,25,.86));color:#fff}
.banner .cap b{display:block;font-size:clamp(1.1rem,2.4vw,1.6rem)}
.banner .cap span{font-size:.86rem;color:#E3DBF1}
.memes{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:18px}
.meme{border-radius:18px;padding:18px;color:#1E1B2E;background:var(--pcs);border:1px solid #EDE6DC;display:flex;flex-direction:column;gap:10px;min-height:126px}
.meme b{font-size:.95rem;line-height:1.45}
.meme span{font-size:.7rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:var(--pc);margin-top:auto}

/* ---------- SOURCES / FOOTER ---------- */
.src{columns:2;column-gap:28px;font-size:.86rem}
.src a{display:block;margin-bottom:10px;break-inside:avoid;color:#4A4463}
.foot{background:#1E1B2E;color:#D9D2EA;padding:40px 0;margin-top:30px}
.foot .wrap{display:flex;flex-wrap:wrap;gap:16px;justify-content:space-between;align-items:center}
.foot b{color:#fff}
.foot small{display:block;color:#A79FC0;margin-top:4px}
.top{position:fixed;right:18px;bottom:18px;width:46px;height:46px;border-radius:50%;border:0;background:#1E1B2E;color:#fff;font-size:18px;cursor:pointer;box-shadow:0 10px 24px rgba(30,27,46,.3);opacity:0;pointer-events:none;transition:opacity .2s}
.top.show{opacity:1;pointer-events:auto}

@media (max-width:960px){
  .hero-grid{grid-template-columns:1fr}
  .anime-3{grid-template-columns:1fr 1fr}
  .arc-divider{grid-template-columns:1fr}
  .arc-divider img{max-height:220px;width:100%;object-position:center 30%}
  .g3{grid-template-columns:1fr 1fr}
  .sched{grid-template-columns:1fr}
  .two{grid-template-columns:1fr}
  .memes{grid-template-columns:1fr 1fr}
}
@media (max-width:720px){
  section{padding:40px 0;scroll-margin-top:116px}
  .nav .wrap{height:auto;flex-wrap:wrap;padding:9px 0 4px;row-gap:2px}
  .nav-links{order:3;width:100%;flex:0 0 100%;margin:2px 0 0;padding-bottom:2px;flex-wrap:wrap;overflow:visible;row-gap:3px}
  .nav-links a{padding:6px 9px;font-size:.78rem}
  .anime-3{grid-template-columns:1fr}
  .anime-card .pic{height:240px}
  .meme-strip img,.meme-strip.levi img{aspect-ratio:16/10}
  .checks{grid-template-columns:1fr}
  .g3,.g2{grid-template-columns:1fr}
  .src{columns:1}
  .nav .wrap{height:58px}
  .nav-progress{display:none}
  .badge{width:46px;height:46px;flex:0 0 46px;border-radius:14px;font-size:1rem}
  .phase{padding:18px}
  .banner img{aspect-ratio:16/10}
}
@media (max-width:700px){
  .card > table{display:block;overflow-x:auto;max-width:100%}
}
@media (max-width:520px){
  .memes{grid-template-columns:1fr}
  .kbd,.code{white-space:normal}
  .sched-row{grid-template-columns:96px 1fr}
  .cta-row .btn{width:100%;justify-content:center}
}
@media print{
  .nav,.top,.toolbar,.cta-row,.hero-art .art-tag{display:none}
  body{background:#fff}
  body::before{display:none}
  section{padding:18px 0;break-inside:avoid}
  .phase,.card,.proj,.rt,.banner{box-shadow:none;break-inside:avoid}
  .banner img{display:none}
  .banner{background:#F3EEFF;padding:18px}
  .banner .cap{position:static;background:none;color:#1E1B2E}
  .banner .cap span{color:#5A5570}
  details{display:block}
}
"""

JS = r"""
(function(){
  var KEY = 'fs-kerala-progress-v1';
  var state = {};
  try { state = JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e) { state = {}; }
  var boxes = Array.prototype.slice.call(document.querySelectorAll('.chk input'));
  var total = boxes.length;

  function save(){ try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e){} }

  // Ticking a box should never move the page. Native behaviour stays intact (including
  // keyboard toggling) — the scroll guard below just undoes any focus-scroll side effect.
  Array.prototype.forEach.call(document.querySelectorAll('.chk'), function(lab){
    lab.addEventListener('mousedown', function(e){
      if (e.target.tagName !== 'INPUT') e.preventDefault();   // no focus-scroll on label text
    });
  });

  // Belt and braces: if any scroll shift still happens on tick, restore it instantly.
  function keepScroll(y){
    var restore = function(){
      if (Math.abs(window.scrollY - y) > 2) {
        var de = document.documentElement;
        var prev = de.style.scrollBehavior;
        de.style.scrollBehavior = 'auto';
        window.scrollTo(0, y);
        de.style.scrollBehavior = prev;
      }
    };
    restore();
    requestAnimationFrame(restore);
    setTimeout(restore, 60);
  }

  boxes.forEach(function(b){
    if (state[b.id]) b.checked = true;
    b.addEventListener('change', function(){
      var y = window.scrollY;
      state[b.id] = b.checked;
      save(); update();
      keepScroll(y);
    });
  });

  function update(){
    var done = 0;
    boxes.forEach(function(b){ if (b.checked) done++; });
    var pct = total ? Math.round(done * 100 / total) : 0;

    var big = document.getElementById('pct-big');
    if (big) big.textContent = pct + '%';
    var cnt = document.getElementById('pct-count');
    if (cnt) cnt.textContent = done + ' / ' + total + ' checkpoints';
    var fill = document.getElementById('overall-fill');
    if (fill) fill.style.width = pct + '%';
    var mini = document.getElementById('nav-fill');
    if (mini) mini.style.width = pct + '%';
    var nl = document.getElementById('nav-pct-label');
    if (nl) nl.textContent = pct + '%';

    document.querySelectorAll('.phase').forEach(function(card){
      var inp = card.querySelectorAll('.chk input');
      var on = 0;
      inp.forEach(function(i){ if (i.checked) on++; });
      var p = inp.length ? Math.round(on * 100 / inp.length) : 0;
      var fillEl = card.querySelector('.bar > i');
      if (fillEl) fillEl.style.width = p;
      var label = card.querySelector('.chip.pct');
      if (label) label.textContent = p + '%';
      card.classList.toggle('done', p === 100);
    });
  }
  update();

  var reset = document.getElementById('reset');
  if (reset) reset.addEventListener('click', function(){
    if (!confirm('Reset all checkpoints? Your notes in the Excel tracker are safe.')) return;
    state = {}; save();
    boxes.forEach(function(b){ b.checked = false; });
    update();
  });

  var hide = document.getElementById('hide-done');
  if (hide) hide.addEventListener('click', function(){
    document.body.classList.toggle('hide-done');
    hide.textContent = document.body.classList.contains('hide-done') ? 'Show completed' : 'Hide completed';
  });

  var toggle = document.getElementById('collapse-all');
  if (toggle) toggle.addEventListener('click', function(){
    var collapsed = document.body.classList.toggle('compact');
    document.querySelectorAll('.phase').forEach(function(c){
      c.querySelector('.checks').style.display = collapsed ? 'none' : '';
      c.querySelector('.watch').style.display = collapsed ? 'none' : '';
    });
    toggle.textContent = collapsed ? 'Expand all checklists' : 'Collapse all checklists';
  });

  var printBtn = document.getElementById('print');
  if (printBtn) printBtn.addEventListener('click', function(){ try { window.print(); } catch(e){} });

  var top = document.getElementById('toTop');
  window.addEventListener('scroll', function(){
    if (!top) return;
    if (window.scrollY > 600) top.classList.add('show'); else top.classList.remove('show');
  }, {passive:true});
  if (top) top.addEventListener('click', function(){ window.scrollTo({top:0, behavior:'smooth'}); });
})();
"""

def watch_html(items):
    out = []
    for w in items:
        out.append(
            '<li><a href="%s" target="_blank" rel="noopener">%s ↗</a>'
            '<span>%s</span><span>%s</span></li>' % (E(w["u"]), E(w["t"]), E(w["c"]), E(w["n"]))
        )
    return "\n".join(out)

def phase_html(p, idx):
    boxes = []
    for j, item in enumerate(p["checklist"], start=1):
        cid = "p%d-%d" % (idx, j)
        boxes.append('<label class="chk"><input type="checkbox" id="%s"><span>%s</span></label>' % (cid, E(item)))
    return """
<article class="phase %s" id="phase-%d">
  <div class="phase-head">
    <div class="badge">%s</div>
    <div class="ph-title">
      <div class="arc">%s %s · %s</div>
      <h3>%s</h3>
    </div>
    <div class="ph-meta">
      <span class="chip hours">⏱ %sh</span>
      <span class="chip pct">0%%</span>
    </div>
  </div>
  <p class="mission">%s</p>
  <div class="boss"><b>🐲 Boss to defeat:</b> %s</div>
  <div class="watch">
    <h4>Watch / read (verified links)</h4>
    <ul>%s</ul>
  </div>
  <div class="checks">%s</div>
  <div class="bar" aria-hidden="true"><i></i></div>
  <p class="tip">💡 %s</p>
</article>""" % (p["color"], idx, p["num"], p["emoji"], E(p["arc"]), E(p["weeks"]), E(p["title"]),
                 p["hours"], E(p["mission"]), E(p["boss"]), watch_html(p["watch"]),
                 "\n".join(boxes), E(p["tip"]))

def stats_html():
    out = []
    for s in D.STATS:
        out.append("""
        <div class="card stat">
          <div class="v">%s</div>
          <div class="l">%s</div>
          <div class="s">%s</div>
          <a href="%s" target="_blank" rel="noopener">source ↗</a>
        </div>""" % (E(s["value"]), E(s["label"]), E(s["sub"]), E(s["src"])))
    return "\n".join(out)

def tools_html():
    rows = []
    for name, why, pri, when in D.TOOLS:
        cls = {"MUST": "p-must", "SHOULD": "p-should", "BONUS": "p-bonus", "LATER": "p-later"}[pri]
        rows.append("<tr><td><b>%s</b></td><td>%s</td><td><span class='pill %s'>%s</span></td><td>%s</td></tr>"
                    % (E(name), E(why), cls, pri, E(when)))
    return "\n".join(rows)

def projects_html():
    out = []
    for p in D.PROJECTS:
        feats = "".join("<li>%s</li>" % E(f) for f in p["features"])
        out.append("""
        <div class="proj">
          <span class="lv">%s · %s</span>
          <h4>%s</h4>
          <div class="stack">%s</div>
          <ul>%s</ul>
          <div class="proof">🎯 %s</div>
          <div class="foot"><span class="chip">📦 %s</span></div>
        </div>""" % (E(p["lv"]), E(p["weeks"]), E(p["title"]), E(p["stack"]), feats, E(p["proof"]), E(p["deploy"])))
    return "\n".join(out)

def schedule_html():
    rows = []
    for t, title, desc in D.SCHEDULE:
        rows.append("""
        <div class="sched-row"><div class="t">%s</div><div><b>%s</b><span>%s</span></div></div>""" % (E(t), E(title), E(desc)))
    return "\n".join(rows)

def days_html():
    out = []
    for d, h, note in D.SCHEDULE_NOTES:
        out.append("""
        <div class="day"><div class="d">%s</div><div class="h">%s</div><p>%s</p></div>""" % (E(d), E(h), E(note)))
    return "\n".join(out)

def sources_html():
    out = []
    for name, url, note in D.JOB_SOURCES:
        out.append('<a href="%s" target="_blank" rel="noopener">↗ %s<span style="display:block;font-size:.78rem;color:#78718C">%s</span></a>' % (E(url), E(name), E(note)))
    return "\n".join(out)

def companies_html():
    rows = []
    for name, typ, city, note in D.COMPANIES:
        rows.append("<tr><td><b>%s</b></td><td>%s</td><td>%s</td><td>%s</td></tr>" % (E(name), E(typ), E(city), E(note)))
    return "\n".join(rows)

def interview_html():
    out = []
    for topic, qs in D.INTERVIEW.items():
        lis = "".join("<li>%s</li>" % E(q) for q in qs)
        out.append("""
        <details>
          <summary>%s — %d questions</summary>
          <div class="body"><ol class="q">%s</ol></div>
        </details>""" % (E(topic), len(qs), lis))
    return "\n".join(out)

def milestones_html():
    out = []
    for when, what, cls in D.MILESTONES:
        out.append("""
        <div class="card %s" style="--pc:#7C5CFF">
          <div class="chip" style="background:var(--pcs,#F2EEFF);border-color:transparent;color:#5B3BBF">%s</div>
          <p style="margin-top:10px;font-weight:700;color:#2E2942">%s</p>
        </div>""" % (cls, E(when), E(what)))
    return "\n".join(out)

def cheats_html():
    rows = []
    for title, typ, url, note in D.CHEATS:
        rows.append("<tr><td><a href='%s' target='_blank' rel='noopener'><b>%s</b> ↗</a></td><td><span class='pill p-should'>%s</span></td><td>%s</td></tr>"
                    % (E(url), E(title), E(typ), E(note)))
    return "\n".join(rows)

def rows2(items, key_cls, val_cls):
    return "\n".join("<tr><td><span class='%s'>%s</span></td><td>%s</td></tr>" % (key_cls, E(a), E(b)) for a, b in items)

def redteam_html():
    out = []
    for risk, fix in D.REDTEAM:
        out.append("""
        <div class="rt">
          <p class="risk">%s</p>
          <p class="fix">%s</p>
        </div>""" % (E(risk), E(fix)))
    return "\n".join(out)

def memes_html():
    out = []
    for text, tag, cls in D.MEMES:
        out.append('<div class="meme %s"><b>%s</b><span>%s</span></div>' % (cls, E(text), E(tag)))
    return "\n".join(out)

def resume_html():
    return "\n".join("""
      <div class="card"><h4>%s</h4><p>%s</p></div>""" % (E(t), E(d)) for t, d in D.RESUME_TIPS)

MIDBOSS = """
<div class="arc-divider midboss">
  <img src="__ALLMIGHT__" alt="All Might from My Hero Academia charging forward with the words PLUS ULTRA">
  <div class="txt">
    <div class="k">Halfway checkpoint · around day 110</div>
    <h3>“Go beyond. PLUS ULTRA!”</h3>
    <p>If the authenticated API is deployed, you are no longer “an intern who knows HTML”. You are a full-stack developer with a smaller portfolio. <b>This is the exact point where most people quit</b> — the second half is where the offers live.</p>
  </div>
</div>
"""

_parts = []
for_i = 0
for i, ph in enumerate(D.PHASES):
    _parts.append(phase_html(ph, i + 1))
    if ph["num"] == "04":
        _parts.append(MIDBOSS)
PHASES_HTML = "\n".join(_parts)
TOTAL_CHECKS = sum(len(p["checklist"]) for p in D.PHASES)

HTML = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Operation Full Stack · Kerala Roadmap 2026</title>
<meta name="description" content="A 32-week, research-backed roadmap from intern to full-stack developer for the Kerala and South India job market. Topic-wise checklists, verified YouTube courses, projects, cheat sheets and a job-hunt playbook.">
<style>__CSS__</style>
</head>
<body>
<a class="skip" href="#roadmap">Skip to the roadmap</a>

<header class="nav">
  <div class="wrap">
    <a class="logo" href="#top"><span class="dot">⚡</span> Operation Full Stack</a>
    <nav class="nav-links" aria-label="Sections">
      <a href="#market">Market</a>
      <a href="#roadmap">Roadmap</a>
      <a href="#schedule">Schedule</a>
      <a href="#projects">Projects</a>
      <a href="#jobs">Job hunt</a>
      <a href="#interview">Interviews</a>
      <a href="#cheats">Cheat sheets</a>
      <a href="#review">Review</a>
    </nav>
    <div class="nav-progress" aria-hidden="true"><span id="nav-pct-label">Progress</span><span class="mini"><i id="nav-fill"></i></span></div>
  </div>
</header>

<main id="top">
  <section class="hero">
    <div class="wrap hero-grid">
      <div>
        <span class="eyebrow"><span class="pulse"></span> Kerala &amp; South India edition · Oct 2026</span>
        <h1>From intern to<br><span class="grad">Full Stack Developer</span></h1>
        <p class="lede">A 32-week shonen-style training plan built around your real constraints: 6 hours × 4 days + 1 project day, zero backend, strong HTML/CSS. Research-backed for the 2026 Indian job market — with every YouTube link verified.</p>
        <div class="meta-row">
          <span class="chip">🗓️ 32 weeks</span>
          <span class="chip">⏱️ ~30 h / week</span>
          <span class="chip">🎯 MERN + TypeScript</span>
          <span class="chip">🐍 Python + Power BI</span>
          <span class="chip solid">__TOTAL__ checkpoints</span>
        </div>
        <div class="cta-row">
          <a class="btn btn-primary" href="#roadmap">Start Week 1 →</a>
          <a class="btn btn-ghost" href="Full-Stack-Study-Tracker.xlsx" download>⬇ Download Excel tracker</a>
        </div>
        <div class="panel" style="margin-top:24px">
          <div class="panel-top">
            <div class="big" id="pct-big">0%</div>
            <small id="pct-count">0 / __TOTAL__ checkpoints</small>
          </div>
          <div class="bar"><i id="overall-fill"></i></div>
          <p class="small">Tick boxes as you finish topics — progress saves in your browser. Use the Excel tracker for hours, revisions and job applications.</p>
        </div>
      </div>
      <div class="hero-art">
        <img src="__HERO__" alt="Original anime-style illustration of a young developer looking at a glowing tech campus skyline at sunrise">
        <div class="art-tag">
          <div class="ico">🔥</div>
          <div><b>Training arc: active</b><small>Week 0 → Week 32 · 3 projects → 1 capstone → 1 offer</small></div>
        </div>
      </div>
    </div>
  </section>

  <section class="ribbon" aria-label="Training arc motivation">
    <div class="wrap">
      <div class="ribbon-head"><span class="tag">TRAINING ARC</span> Real anime energy — because a PDF checklist never made anyone grind at 5:30 AM.</div>
      <div class="anime-3">
        <figure class="anime-card dbz">
          <span class="ico">DBZ</span>
          <div class="pic"><img src="__GOKU__" alt="Dragon Ball Z poster of Goku reading Work Hard In Silence, Let Success Be Your Noise"></div>
          <figcaption><span class="series">DRAGON BALL Z ARC</span><b>Work hard in silence.</b>Goku didn't unlock Super Saiyan by watching 22 hours of tutorials. 6 hours today. 6 hours tomorrow. That's the entire secret.</figcaption>
        </figure>
        <figure class="anime-card">
          <span class="ico">NARUTO</span>
          <div class="pic"><img src="__ROCKLEE__" alt="Rock Lee from Naruto raising his bandaged fist"></div>
          <figcaption><span class="series">NARUTO ARC</span><b>Zero talent? Perfect.</b>Rock Lee had no ninjutsu and still outworked every genius in Konoha. You have zero backend. Same energy, 32 weeks.</figcaption>
        </figure>
        <figure class="anime-card">
          <span class="ico">SOLO LEVELING</span>
          <div class="pic"><img src="__SOLO__" alt="Solo Leveling ARISE key art of Sung Jin-Woo"></div>
          <figcaption><span class="series">SOLO LEVELING ARC</span><b>E-rank → S-rank.</b>Day 1: "What is an API?" Day 120: shipping one to production. Level up once a week and watch it compound.</figcaption>
        </figure>
      </div>
    </div>
  </section>

  <section id="market">
    <div class="wrap">
      <div class="sec-head">
        <div class="kicker">Market intel · 2026</div>
        <h2>What the Indian market is actually paying for</h2>
        <p class="sub">I pulled current hiring reports, live Infopark listings and salary aggregators so your 550 study hours go where the jobs are — not where the tutorials are.</p>
      </div>
      <div class="grid g3">__STATS__</div>

      <div class="note" style="margin-top:20px">
        <h4>🧠 So what does this mean for <em>you</em>?</h4>
        <ul>
          <li><b>Your fastest path is MERN + TypeScript</b>, not Java. You already have HTML/CSS/JS — extending that into React and Node is the shortest distance between you and an offer.</li>
          <li><b>Backend is where freshers win offers.</b> "Knows React" is common; "shipped an authenticated API with error handling" is rare in a fresher pile.</li>
          <li><b>Kerala is service-heavy</b> (Infopark/Technopark JDs often say Java + Angular), but Python + React full-stack fresher roles are live too. Keep Java for year 2.</li>
          <li><b>Power BI is a differentiator, not a core skill.</b> It makes you interesting for data-adjacent roles — it won't get you a full-stack job on its own.</li>
          <li><b>Apply beyond Kerala.</b> 70% Kerala + 30% Bengaluru/Chennai/Hyderabad/remote roughly 5× your market for the same effort.</li>
        </ul>
      </div>

      <div style="margin-top:26px">
        <h3 style="font-size:1.15rem;margin-bottom:12px">Tool relevance in the India market right now</h3>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Tool / skill</th><th>Why it matters here</th><th>Priority</th><th>When you learn it</th></tr></thead>
            <tbody>__TOOLS__</tbody>
          </table>
        </div>
      </div>
    </div>
  </section>

  <section id="roadmap">
    <div class="wrap">
      <div class="sec-head">
        <div class="kicker">The training arc</div>
        <h2>Your 32-week roadmap</h2>
        <p class="sub">Nine seasons. Each one ends with a boss you must actually defeat — a deployed project, not a finished playlist. Tick each topic as you go.</p>
      </div>

      <div class="toolbar">
        <button class="tool-btn" id="collapse-all" type="button">Collapse all checklists</button>
        <button class="tool-btn" id="hide-done" type="button">Hide completed</button>
        <button class="tool-btn" id="print" type="button">🖨️ Save as PDF</button>
        <span class="spacer"></span>
        <button class="tool-btn" id="reset" type="button">↺ Reset progress</button>
      </div>

      <div class="arc-divider">
        <img src="__NARUTO__" alt="Naruto manga panel quote: I never go back on my word, that's my ninja way">
        <div class="txt">
          <div class="k">The nindō rule</div>
          <h3>“I never go back on my word. That's my ninja way.”</h3>
          <p>You will not feel motivated every day — Naruto didn't either. What carried him was a <b>rule</b>, not a mood. Yours: <b>never skip two days in a row.</b> Miss Monday? Fine. Tuesday is non-negotiable.</p>
        </div>
      </div>

      <div class="timeline">__PHASES__</div>
    </div>
  </section>

  <section id="schedule">
    <div class="wrap">
      <div class="sec-head">
        <div class="kicker">Daily operating system</div>
        <h2>Your 6-hour study day</h2>
        <p class="sub">Built around an internship. Split it, protect it, and never negotiate with the clock. Total: 24 study hours + 6 project hours = 30 hours/week.</p>
      </div>
      <div class="sched">
        <div class="card">
          <h4 style="margin-bottom:8px">Weekday template (Mon–Thu)</h4>
          __SCHEDULE__
        </div>
        <div>
          <div class="card">
            <h4 style="margin-bottom:8px">The week</h4>
            __DAYS__
          </div>
          <div class="note" style="margin-top:16px">
            <h4>⚔️ The 5 laws of this training arc</h4>
            <ul>
              <li><b>70/30 rule:</b> 70% building, 30% watching. Every video ends with the tab closed.</li>
              <li><b>One boss per season:</b> no new phase until the deliverable is deployed.</li>
              <li><b>Daily commit:</b> a green square is proof of life.</li>
              <li><b>45 min DSA daily</b> from week 3 — not 5-hour Sunday marathons.</li>
              <li><b>One rest day.</b> Burnout is the real final boss.</li>
            </ul>
          </div>
        </div>
      </div>

      <div style="margin-top:26px">
        <h3 style="font-size:1.15rem;margin-bottom:12px">Milestone save-points</h3>
        <div class="grid g3">__MILESTONES__</div>
      </div>
    </div>
  </section>

  <section id="projects">
    <div class="wrap">
      <div class="sec-head">
        <div class="kicker">Boss rush</div>
        <h2>The project ladder</h2>
        <p class="sub">Five projects, increasing in difficulty. Each one exists to answer a specific interview question. By the end, your GitHub is the portfolio.</p>
      </div>
      <div class="meme-strip">
        <img src="__SOLO__" alt="Solo Leveling ARISE key art">
        <div class="overlay">
          <span class="k">Solo leveling arc</span>
          <b>ARISE. Five projects = five levels.</b>
          <p>Clear one, unlock the next. No skipping bosses — every project answers a different interview question.</p>
        </div>
      </div>
      <div class="grid g3">__PROJECTS__</div>
    </div>
  </section>

  <section id="jobs">
    <div class="wrap">
      <div class="sec-head">
        <div class="kicker">Endgame</div>
        <h2>The Kerala job-hunt playbook</h2>
        <p class="sub">Where the openings actually live, who is hiring, what to send, and how many times to send it.</p>
      </div>

      <div class="grid g3">
        <div class="card park"><div class="ic">🏙️</div><div><b>Infopark, Kochi</b><span>Phase 1 &amp; 2 · ~400+ companies. Check the official job board every Monday — fresher Python/React roles appear regularly.</span></div></div>
        <div class="card park"><div class="ic">🌴</div><div><b>Technopark, Trivandrum</b><span>India's first IT park. Product + service mix: IBS, Speridian, NeST, CareStack, TCS, Infosys.</span></div></div>
        <div class="card park"><div class="ic">🚀</div><div><b>Cyberpark, Kozhikode + startups</b><span>Smaller pool, faster decisions. Kerala Startup Mission ecosystem hires via networks and LinkedIn.</span></div></div>
      </div>

      <div class="two" style="margin-top:22px">
        <div class="card">
          <h4 style="margin-bottom:12px">Where to look (bookmark these)</h4>
          <div style="display:grid;gap:9px">__SOURCES__</div>
        </div>
        <div class="card">
          <h4 style="margin-bottom:12px">Starter target list — Kerala &amp; nearby</h4>
          <p style="font-size:.82rem;color:#6A6480;margin-bottom:10px">Verify live openings before applying; teams change fast. Use this to build your tracker.</p>
          <div class="table-wrap" style="box-shadow:none">
            <table style="min-width:420px">
              <thead><tr><th>Company</th><th>Type</th><th>Where</th></tr></thead>
              <tbody>__COMPANIES__</tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="meme-strip levi">
        <img src="__LEVI__" alt="Levi Ackerman from Attack on Titan with the quote: I don't know the outcome but I am still gonna try">
        <div class="overlay">
          <span class="k">Attack on Titan arc</span>
          <b>You don't know the outcome. Apply anyway.</b>
          <p>Levi had no guarantee either. 25 applications a week — rejection is data, not a verdict on you.</p>
        </div>
      </div>

      <div class="grid g2" style="margin-top:22px">
        <div class="card">
          <h4>📐 Application maths (be honest with yourself)</h4>
          <p style="margin-top:8px">25 quality applications/week → ~300 over 12 weeks. A realistic 8–12% interview rate for freshers → <b>25–35 interviews</b> → 3–5 final rounds → 1–2 offers.</p>
          <p style="margin-top:10px;font-size:.88rem;color:#6A6480">The people who "applied to 20 jobs and got nothing" usually applied to 20 jobs. Volume + tailoring + referrals is the formula.</p>
        </div>
        <div class="card">
          <h4>🤝 Referral message that works</h4>
          <div class="tmpl" style="margin-top:10px">Hi [Name], I'm a frontend intern moving into full-stack (MERN + TypeScript). I built [project + live link], a job board with JWT auth and 40+ REST endpoints.

I saw [Company] is hiring for [role]. Would you be open to referring me — or pointing me to the right person? Happy to send my resume.

Thanks either way!</div>
        </div>
      </div>

      <div style="margin-top:26px">
        <h3 style="font-size:1.15rem;margin-bottom:12px">Resume upgrades (before you apply anywhere)</h3>
        <div class="grid g3">__RESUME__</div>
      </div>
    </div>
  </section>

  <section id="interview">
    <div class="wrap">
      <div class="sec-head">
        <div class="kicker">Boss dialogue</div>
        <h2>Interview question bank</h2>
        <p class="sub">The questions Indian fresher panels actually ask. Answer each out loud — in English, then in Malayalam if that's your comfort language.</p>
      </div>
      __INTERVIEW__
    </div>
  </section>

  <section id="cheats">
    <div class="wrap">
      <div class="sec-head">
        <div class="kicker">Power-ups</div>
        <h2>Shortcuts, commands &amp; PDF cheat sheets</h2>
        <p class="sub">Print the PDFs. Stick them above your desk. Muscle memory is a real superpower in interviews and at work.</p>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Resource</th><th>Type</th><th>Why you'll use it</th></tr></thead>
          <tbody>__CHEATS__</tbody>
        </table>
      </div>

      <div class="grid g3" style="margin-top:20px">
        <div class="card">
          <h4>⌨️ VS Code — 15 shortcuts</h4>
          <table class="mini-table"><tbody>__VSCODE__</tbody></table>
        </div>
        <div class="card">
          <h4>🌿 Git — daily commands</h4>
          <table class="mini-table"><tbody>__GIT__</tbody></table>
        </div>
        <div class="card">
          <h4>🧩 JS array methods to memorise</h4>
          <table class="mini-table"><tbody>__JSMETHODS__</tbody></table>
        </div>
      </div>
    </div>
  </section>

  <section id="review">
    <div class="wrap">
      <div class="sec-head">
        <div class="kicker">Peer review · red-team pass</div>
        <h2>I had a second agent try to destroy this plan</h2>
        <p class="sub">Before shipping, I ran the plan through a hostile review whose only job was to find why it fails. These were the seven hits — and the fixes baked into the roadmap above.</p>
      </div>
      <div class="grid g2">__REDTEAM__</div>
    </div>
  </section>

  <section id="motivation">
    <div class="wrap">
      <div class="sec-head">
        <div class="kicker">Why you'll finish</div>
        <h2>Training-arc energy</h2>
        <p class="sub">You are not behind. You are at the start of the arc where the protagonist is still weak — and that's exactly where every good story begins.</p>
      </div>
      <div class="grid g2" style="margin-bottom:18px">
        <div class="banner">
          <img src="__BOSS__" alt="Original anime-style illustration of a developer facing a giant monster made of error messages">
          <div class="cap"><b>“This is not even my final form.”</b><span>Week 12: backend dungeon. Week 19: final boss. Week 32: you're someone else.</span></div>
        </div>
        <div class="banner">
          <img src="__VICT__" alt="Original anime-style illustration of a developer celebrating on a mountain at sunset">
          <div class="cap"><b>The offer is the arc reward.</b><span>Not luck. 550 logged hours, 4 deployed projects, 1 demo you can give half-asleep.</span></div>
        </div>
      </div>
      <div class="memes">__MEMES__</div>
    </div>
  </section>

  <section id="sources">
    <div class="wrap">
      <div class="sec-head">
        <div class="kicker">Due diligence</div>
        <h2>Sources &amp; further reading</h2>
        <p class="sub">Salary ranges are directional, not guarantees — always sanity-check against live listings and offers. Verified as of October 2026.</p>
      </div>
      <div class="src">__SOURCE_LIST__</div>
      <div class="note" style="margin-top:18px">
        <h4>A note on honesty</h4>
        <ul>
          <li>All YouTube videos, playlists and PDFs above were checked to exist when this page was built. Playlists get updated — the channel name is your fallback.</li>
          <li>Salary figures come from job boards, salary aggregators and 2026 hiring reports, which vary wildly. Use them to negotiate a range, not to fix an expectation.</li>
          <li>This is a plan, not a guarantee. What actually moves the needle: shipped projects, referrals, and interviews.</li>
        </ul>
      </div>
    </div>
  </section>
</main>

<footer class="foot">
  <div class="wrap">
    <div>
      <b>Operation Full Stack · Kerala Edition</b>
      <small>Built for a future full-stack developer in Kerala · October 2026</small>
    </div>
    <div style="text-align:right">
      <b>__TOTAL__ checkpoints · 9 seasons · 5 projects</b>
      <small>Save this page (Ctrl+S) — it works offline.</small>
    </div>
  </div>
</footer>

<button class="top" id="toTop" type="button" aria-label="Back to top">↑</button>

<script>__JS__</script>
</body>
</html>"""

HTML = (HTML
        .replace("__CSS__", CSS)
        .replace("__JS__", JS)
        .replace("__HERO__", HERO)
        .replace("__BOSS__", BOSS)
        .replace("__VICT__", VICT)
        .replace("__GOKU__", GOKU)
        .replace("__ROCKLEE__", ROCKLEE)
        .replace("__SOLO__", SOLO)
        .replace("__NARUTO__", NARUTO)
        .replace("__ALLMIGHT__", ALLMIGHT)
        .replace("__LEVI__", LEVI)
        .replace("__STATS__", stats_html())
        .replace("__TOOLS__", tools_html())
        .replace("__PHASES__", PHASES_HTML)
        .replace("__TOTAL__", str(TOTAL_CHECKS))
        .replace("__SCHEDULE__", schedule_html())
        .replace("__DAYS__", days_html())
        .replace("__MILESTONES__", milestones_html())
        .replace("__PROJECTS__", projects_html())
        .replace("__SOURCES__", sources_html())
        .replace("__COMPANIES__", companies_html())
        .replace("__RESUME__", resume_html())
        .replace("__INTERVIEW__", interview_html())
        .replace("__CHEATS__", cheats_html())
        .replace("__VSCODE__", rows2(D.VSCODE, "kbd", ""))
        .replace("__GIT__", rows2(D.GITCMDS, "code", ""))
        .replace("__JSMETHODS__", rows2(D.JSMETHODS, "code", ""))
        .replace("__REDTEAM__", redteam_html())
        .replace("__MEMES__", memes_html())
        .replace("__SOURCE_LIST__", "\n".join('<a href="%s" target="_blank" rel="noopener">↗ %s</a>' % (E(u), E(t)) for t, u in D.SOURCES))
        )

# final pass: resolve any placeholder that was injected by another placeholder (e.g. inside PHASES_HTML)
_IMGS = [("__GOKU__", GOKU), ("__ROCKLEE__", ROCKLEE), ("__SOLO__", SOLO),
         ("__NARUTO__", NARUTO), ("__ALLMIGHT__", ALLMIGHT), ("__LEVI__", LEVI),
         ("__HERO__", HERO), ("__BOSS__", BOSS), ("__VICT__", VICT)]
for _k, _v in _IMGS:
    HTML = HTML.replace(_k, _v)
import re as _re
_left = _re.findall(r"__[A-Z_]+__", HTML)
assert not _left, "unresolved placeholders: %s" % set(_left)

with open(OUT, "w", encoding="utf-8") as f:
    f.write(HTML)
print("wrote", OUT, len(HTML), "chars")
print("checkpoints:", TOTAL_CHECKS)
