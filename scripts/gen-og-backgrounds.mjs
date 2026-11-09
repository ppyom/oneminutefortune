// OG 결과 이미지(B) 배경 생성 — design/OgResult.dc.html 의 SVG 좌표 그대로.
//
// Satori(next/og)는 backdrop-filter를 지원하지 않는다. 그래서 글래스 카드가 놓일
// 자리만 미리 블러·채도 처리한 배경 PNG를 만들어 두고, 그 위에 반투명 카드를 그린다.
//
// 사용: node scripts/gen-og-backgrounds.mjs
// 카드 위치(OG_CARD)를 바꾸면 app/api/og/route.tsx 의 카드 위치도 함께 바꾼다.
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const W = 1200;
const H = 630;
// route.tsx의 OG_RESULT_CARD와 같은 값
const CARD = { x: 740, y: 159, w: 380, h: 312, r: 32 };
const BLUR = 28; // design: blur(28px) saturate(160%)

const background = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#290044"/>
  <circle cx="90" cy="60" r="2" fill="#EEE3B0" opacity="0.7"/>
  <circle cx="480" cy="40" r="1.5" fill="#EEE3B0" opacity="0.6"/>
  <circle cx="300" cy="590" r="2" fill="#EEE3B0" opacity="0.6"/>
  <circle cx="1150" cy="590" r="1.5" fill="#EEE3B0" opacity="0.7"/>
  <circle cx="900" cy="200" r="190" fill="#8A2A78"/>
  <circle cx="1080" cy="470" r="140" fill="#8A2A78" opacity="0.75"/>
  <circle cx="1030" cy="120" r="34" fill="#EEE3B0" opacity="0.9"/>
  <circle cx="40" cy="600" r="120" fill="#8A2A78" opacity="0.55"/>
</svg>`;

const mask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" rx="${CARD.r}" fill="#fff"/>
  </svg>`,
);

const base = await sharp(Buffer.from(background)).png().toBuffer();
// 전체를 블러한 뒤 카드 모양으로 잘라야 가장자리가 자연스럽다
const blurredCard = await sharp(base)
  .blur(BLUR)
  .modulate({ saturation: 1.6 })
  .composite([{ input: mask, blend: "dest-in" }])
  .png()
  .toBuffer();

mkdirSync("assets/og", { recursive: true });
await sharp(base)
  .composite([{ input: blurredCard }])
  .png({ compressionLevel: 9 })
  .toFile("assets/og/result-bg.png");
console.log("✓ assets/og/result-bg.png");
