// quantize into 6-bit per channel
function quantizeColorHex(hex: number) {
  const r = (hex >> 16) & 0xff;
  const g = (hex >> 8) & 0xff;
  const b = hex & 0xff;

  const qr = Math.round((r / 255) * 63) * (255 / 63);
  const qg = Math.round((g / 255) * 63) * (255 / 63);
  const qb = Math.round((b / 255) * 63) * (255 / 63);

  return (
    (Math.round(qr) << 16) | (Math.round(qg) << 8) | Math.round(qb)
  );
}

// original palette
const rawPalette = [
  0x1a1f2b,
  0x0f141b,
  0x2d3a4a,
  0xd4a94e,
  0xb38a3b,
  0xa8b3c3,
  0x627086,
  0xe9ecf2,
];

// quantized palette
export const paletteHex = rawPalette.map(quantizeColorHex);

// find nearest palette color
export function nearestPaletteColor(hex: number) {
  let best = paletteHex[0];
  let bestDist = Infinity;

  const r0 = (hex >> 16) & 0xff;
  const g0 = (hex >> 8) & 0xff;
  const b0 = hex & 0xff;

  for (const p of paletteHex) {
    const r1 = (p >> 16) & 0xff;
    const g1 = (p >> 8) & 0xff;
    const b1 = p & 0xff;

    const d =
      (r0 - r1) ** 2 + (g0 - g1) ** 2 + (b0 - b1) ** 2;

    if (d < bestDist) {
      bestDist = d;
      best = p;
    }
  }

  return best;
}
