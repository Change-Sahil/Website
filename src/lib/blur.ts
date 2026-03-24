/**
 * Universeller Blur-Placeholder für next/image.
 * Ersetzt den weißen Ladeblitz durch einen weichen hellgrauen Übergang.
 */
function toBase64(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str).toString("base64");
  }
  return btoa(str);
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 5">
  <rect width="8" height="5" fill="#f1f5f9"/>
</svg>`;

export const blurDataURL = `data:image/svg+xml;base64,${toBase64(svg)}`;
