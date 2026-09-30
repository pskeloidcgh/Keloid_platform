// 產生 LINE 圖文選單圖片（2500×843，一列三格）→ public/line/richmenu.png
// 配色沿用 src/app/globals.css 的品牌色。改字或改色後重跑：node scripts/generate-richmenu.mjs
// 圖片跟著網站部署，GAS 的 setupRichMenu() 會從 <PLATFORM_BASE_URL>/line/richmenu.png 抓。
// 格子的順序與寬度要和 gas/line-relay.gs 的 RICH_MENU_AREAS 一致。
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const W = 2500;
const H = 843;
const COL = W / 3;

const C = {
  paper: "#fbfaf5",
  ink: "#1b2318",
  brand700: "#325823",
  brand600: "#3f6f2b",
  brand100: "#dfedd2",
  brand50: "#f1f7ec",
  accent400: "#e3a930",
  divider: "#e4e7dc",
  muted: "#6b7466",
};

const FONT = "'Noto Sans TC', 'Microsoft JhengHei', sans-serif";

// 線條圖示，以 (0,0) 為中心、約 200×200 的座標系
const ICONS = {
  book: `
    <path d="M -95 -70 Q -50 -92 0 -68 L 0 82 Q -50 58 -95 80 Z" />
    <path d="M 95 -70 Q 50 -92 0 -68 L 0 82 Q 50 58 95 80 Z" />
    <line x1="-68" y1="-38" x2="-26" y2="-30" />
    <line x1="-68" y1="-6" x2="-26" y2="2" />
    <line x1="68" y1="-38" x2="26" y2="-30" />
    <line x1="68" y1="-6" x2="26" y2="2" />`,
  phone: `
    <path d="M -62 -92 C -84 -92 -96 -72 -92 -48 C -80 20 -20 80 48 92 C 72 96 92 84 92 62 L 92 36 C 92 26 84 18 74 16 L 38 10 C 28 8 20 12 14 20 L 2 36 C -30 20 -44 6 -58 -26 L -40 -38 C -32 -44 -28 -52 -30 -62 L -36 -98 Z" transform="translate(4 4)" />`,
  calendar: `
    <rect x="-90" y="-72" width="180" height="162" rx="22" />
    <line x1="-90" y1="-24" x2="90" y2="-24" />
    <line x1="-46" y1="-96" x2="-46" y2="-52" />
    <line x1="46" y1="-96" x2="46" y2="-52" />
    <path d="M -34 34 L -8 58 L 40 8" />`,
};

const CELLS = [
  { icon: "book", label: "衛教主題", sub: "常見問題與照護須知" },
  { icon: "phone", label: "聯絡診間", sub: "02-2648-2121" },
  { icon: "calendar", label: "網路掛號", sub: "國泰醫院掛號系統" },
];

function cell(c, i) {
  const cx = COL * i + COL / 2;
  return `
  <g>
    <circle cx="${cx}" cy="330" r="150" fill="${C.brand50}" />
    <g transform="translate(${cx} 330) scale(0.95)" fill="none" stroke="${C.brand600}"
       stroke-width="15" stroke-linecap="round" stroke-linejoin="round">${ICONS[c.icon]}</g>
    <text x="${cx}" y="622" text-anchor="middle" font-family="${FONT}" font-size="112"
          font-weight="700" fill="${C.ink}" letter-spacing="10">${c.label}</text>
    <text x="${cx}" y="720" text-anchor="middle" font-family="${FONT}" font-size="54"
          fill="${C.muted}" letter-spacing="3">${c.sub}</text>
  </g>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${C.paper}" />
  <rect width="${W}" height="10" fill="${C.brand700}" />
  <rect y="10" width="${W}" height="4" fill="${C.accent400}" />
  <line x1="${COL}" y1="160" x2="${COL}" y2="${H - 90}" stroke="${C.divider}" stroke-width="4" />
  <line x1="${COL * 2}" y1="160" x2="${COL * 2}" y2="${H - 90}" stroke="${C.divider}" stroke-width="4" />
  ${CELLS.map(cell).join("")}
</svg>`;

mkdirSync("public/line", { recursive: true });
const out = "public/line/richmenu.png";
const info = await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toFile(out);
console.log(`${out}  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
