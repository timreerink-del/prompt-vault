/**
 * Generates the toolbar/store icons for the Swear Jar extension as plain
 * PNG files, using nothing but Node's built-in zlib (no image libraries
 * are available in this environment). Draws a simple mason-jar-with-coins
 * glyph procedurally, pixel by pixel.
 *
 * Run with: node scripts/generate-icons.js
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const SIZES = [16, 32, 48, 128];
const OUT_DIR = path.join(__dirname, "..", "icons");

// ---- minimal PNG encoder -------------------------------------------------

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePNG(width, height, rgbaPixels) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = chunk("IHDR", ihdrData);

  // raw scanlines, each prefixed with filter-type 0 (none)
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgbaPixels.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idatData = zlib.deflateSync(raw, { level: 9 });
  const idat = chunk("IDAT", idatData);

  const iend = chunk("IEND", Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

// ---- drawing helpers ------------------------------------------------------

function setPx(buf, w, x, y, r, g, b, a) {
  if (x < 0 || y < 0 || x >= w) return;
  const i = (y * w + x) * 4;
  if (i < 0 || i >= buf.length) return;
  // alpha-blend onto whatever is already there
  const srcA = a / 255;
  const dstR = buf[i], dstG = buf[i + 1], dstB = buf[i + 2], dstA = buf[i + 3] / 255;
  const outA = srcA + dstA * (1 - srcA);
  if (outA <= 0) {
    buf[i] = 0; buf[i + 1] = 0; buf[i + 2] = 0; buf[i + 3] = 0;
    return;
  }
  buf[i] = Math.round((r * srcA + dstR * dstA * (1 - srcA)) / outA);
  buf[i + 1] = Math.round((g * srcA + dstG * dstA * (1 - srcA)) / outA);
  buf[i + 2] = Math.round((b * srcA + dstB * dstA * (1 - srcA)) / outA);
  buf[i + 3] = Math.round(outA * 255);
}

function roundedRectSDF(px, py, x0, y0, x1, y1, r) {
  // signed-distance-ish test: returns true if point is inside a rounded rect
  const cx = Math.min(Math.max(px, x0 + r), x1 - r);
  const cy = Math.min(Math.max(py, y0 + r), y1 - r);
  if (px >= x0 + r && px <= x1 - r) return py >= y0 && py <= y1;
  if (py >= y0 + r && py <= y1 - r) return px >= x0 && px <= x1;
  const dx = px - cx, dy = py - cy;
  return dx * dx + dy * dy <= r * r;
}

function drawJarIcon(size) {
  const buf = Buffer.alloc(size * size * 4, 0); // transparent

  const margin = size * 0.1;
  const lidH = size * 0.16;
  const jarX0 = margin;
  const jarX1 = size - margin;
  const lidY0 = margin * 0.6;
  const lidY1 = lidY0 + lidH;
  const jarY0 = lidY1 - size * 0.02;
  const jarY1 = size - margin * 0.6;
  const radius = (jarX1 - jarX0) * 0.18;
  const fillLine = jarY0 + (jarY1 - jarY0) * 0.42;

  const GLASS_STROKE = [122, 156, 176, 235];
  const GLASS_FILL = [196, 224, 235, 60];
  const LID_COLOR = [143, 92, 43, 255];
  const LID_STROKE = [90, 55, 24, 255];
  const COIN = [247, 181, 33, 255];
  const COIN_DARK = [199, 138, 15, 255];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const px = x + 0.5, py = y + 0.5;

      // lid (slightly rounded rect, narrower than the jar mouth rim)
      const lidPad = (jarX1 - jarX0) * 0.04;
      if (
        roundedRectSDF(px, py, jarX0 - lidPad, lidY0, jarX1 + lidPad, lidY1, size * 0.03)
      ) {
        const edge = py < lidY0 + 1.2 || py > lidY1 - 1.2;
        setPx(buf, size, x, y, ...(edge ? LID_STROKE : LID_COLOR));
        continue;
      }

      // jar body
      if (roundedRectSDF(px, py, jarX0, jarY0, jarX1, jarY1, radius)) {
        const nearEdge =
          !roundedRectSDF(px, py, jarX0 + 1, jarY0 + 1, jarX1 - 1, jarY1 - 1, Math.max(radius - 1, 0));
        if (nearEdge) {
          setPx(buf, size, x, y, ...GLASS_STROKE);
        } else if (py >= fillLine) {
          setPx(buf, size, x, y, ...COIN);
        } else {
          setPx(buf, size, x, y, ...GLASS_FILL);
        }
      }
    }
  }

  // a couple of coin highlights sitting on top of the fill line (bigger icons only)
  if (size >= 48) {
    const coinR = size * 0.07;
    const coins = [
      [size * 0.38, fillLine - coinR * 0.6],
      [size * 0.6, fillLine - coinR * 1.4],
      [size * 0.5, fillLine - coinR * 2.6],
    ];
    for (const [cx, cy] of coins) {
      for (let y = Math.floor(cy - coinR); y <= Math.ceil(cy + coinR); y++) {
        for (let x = Math.floor(cx - coinR); x <= Math.ceil(cx + coinR); x++) {
          const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d <= coinR) {
            setPx(buf, size, x, y, ...(d > coinR - 1 ? COIN_DARK : COIN));
          }
        }
      }
    }
  }

  return buf;
}

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

for (const size of SIZES) {
  const pixels = drawJarIcon(size);
  const png = encodePNG(size, size, pixels);
  const outPath = path.join(OUT_DIR, `icon${size}.png`);
  fs.writeFileSync(outPath, png);
  console.log(`wrote ${outPath}`);
}
