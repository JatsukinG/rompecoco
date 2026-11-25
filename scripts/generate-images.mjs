/**
 * Genera las imágenes estáticas del sitio a partir de SVG:
 *   - public/og-image.png        (1200×630, vista previa al compartir el link)
 *   - public/apple-touch-icon.png (180×180)
 *   - public/icon-192.png, public/icon-512.png (PWA / Android)
 *
 * Colores tomados de la paleta (docs/design-system.md).
 * Uso: pnpm images
 */
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const PURPLE = "#7c3aed"
const PURPLE_LIGHT = "#c4a6ff"
const BG = "#120c1d"
const GREEN = "#2f9e5b"
const ORANGE = "#f0a03a"
const GRAY = "#4b4558"
const FONT = "Helvetica Neue, Helvetica, Arial, sans-serif"

const out = (name) => fileURLToPath(new URL(`../public/${name}`, import.meta.url))

/** Marca: 4 piezas en una caja redondeada (igual que el logo del header). */
function logoMark(x, y, size) {
  const pad = size * 0.19
  const gap = size * 0.06
  const piece = (size - pad * 2 - gap) / 2
  const r = piece * 0.22
  const at = (col, row) => ({
    x: x + pad + col * (piece + gap),
    y: y + pad + row * (piece + gap),
  })
  return `
    <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${size * 0.24}" fill="${PURPLE}"/>
    ${[
      [0, 0, 1],
      [1, 0, 0.5],
      [0, 1, 0.5],
      [1, 1, 1],
    ]
      .map(([c, rw, o]) => {
        const p = at(c, rw)
        return `<rect x="${p.x}" y="${p.y}" width="${piece}" height="${piece}" rx="${r}" fill="#fff" fill-opacity="${o}"/>`
      })
      .join("")}`
}

function tile(x, y, size, letter, fill, color = "#fff") {
  return `
    <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${size * 0.18}" fill="${fill}"/>
    <text x="${x + size / 2}" y="${y + size * 0.68}" font-family="${FONT}" font-size="${size * 0.5}" font-weight="700" fill="${color}" text-anchor="middle">${letter}</text>`
}

function circle(cx, cy, r, letter, fill, color = "#fff") {
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>
    <text x="${cx}" y="${cy + r * 0.36}" font-family="${FONT}" font-size="${r * 1.0}" font-weight="700" fill="${color}" text-anchor="middle">${letter}</text>`
}

function ogImage() {
  const W = 1200
  const H = 630
  // Palabra: fila de fichas
  const t = 78
  const g = 10
  const row1 = [
    ["M", GRAY], ["E", ORANGE], ["N", GRAY], ["T", GRAY], ["E", GREEN],
  ]
  const row2 = [["J"], ["U"], ["E"], ["G"], ["O"]].map(([l]) => [l, GREEN])
  const tilesX = 700
  const tilesY = 150
  const tiles = [row1, row2]
    .map((row, r) =>
      row
        .map(([l, c], i) =>
          tile(tilesX + i * (t + g), tilesY + r * (t + g), t, l, c, c === ORANGE ? "#2a1a05" : "#fff")
        )
        .join("")
    )
    .join("")

  // Hilos: letras unidas por un hilo
  const cr = 30
  const step = 76
  const hx = 742
  const hy = 380
  const pts = [
    [0, 0, "H"], [1, 0, "I"], [2, 1, "L"], [3, 1, "O"], [4, 0, "S"],
  ]
  const others = [
    [2, 0, "R"], [3, 0, "A"], [0, 1, "S"], [1, 1, "N"], [4, 1, "T"],
  ]
  const xy = ([c, r]) => [hx + c * step, hy + r * step]
  const line = pts.map((p) => xy(p).join(",")).join(" ")
  const threads = `
    <polyline points="${line}" fill="none" stroke="${PURPLE_LIGHT}" stroke-opacity="0.45" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
    ${others.map((p) => circle(...xy(p), cr, p[2], "#231a33", "#a9a0b8")).join("")}
    ${pts.map((p) => circle(...xy(p), cr, p[2], PURPLE)).join("")}`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <radialGradient id="glow" cx="0.3" cy="0.15" r="0.8">
        <stop offset="0" stop-color="${PURPLE}" stop-opacity="0.45"/>
        <stop offset="1" stop-color="${PURPLE}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="${BG}"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>

    ${logoMark(80, 80, 64)}
    <text x="162" y="125" font-family="${FONT}" font-size="38" font-weight="700" fill="#fff">rompe<tspan fill="${PURPLE_LIGHT}">coco</tspan></text>

    <text font-family="${FONT}" font-size="66" font-weight="700" fill="#fff" letter-spacing="-1.5">
      <tspan x="80" y="300">Juegos para</tspan>
      <tspan x="80" y="378" fill="${PURPLE_LIGHT}">romperte el coco.</tspan>
    </text>
    <text x="80" y="450" font-family="${FONT}" font-size="28" fill="#b9b0c9">Acertijos, palabras y patrones.</text>
    <text x="80" y="490" font-family="${FONT}" font-size="28" fill="#b9b0c9">Un reto nuevo cada día.</text>

    ${tiles}
    ${threads}
  </svg>`
}

function iconSvg(size, { padded = false } = {}) {
  // padded: deja margen para íconos "maskable" de Android
  const inner = padded ? size * 0.8 : size
  const offset = (size - inner) / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    ${padded ? `<rect width="${size}" height="${size}" fill="${PURPLE}"/>` : ""}
    ${logoMark(offset, offset, inner)}
  </svg>`
}

const jobs = [
  ["og-image.png", ogImage()],
  ["apple-touch-icon.png", iconSvg(180, { padded: true })],
  ["icon-192.png", iconSvg(192, { padded: true })],
  ["icon-512.png", iconSvg(512, { padded: true })],
]

for (const [name, svg] of jobs) {
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out(name))
  console.log(`✔ public/${name}`)
}
