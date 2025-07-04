export default function createAccentColorGenerator() {
  const usedColors = new Set<string>();
  const excludedColors = new Set<string>(['#00ff00', '#0000ff']);

  function getRandomColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `#${[r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')}`;
  }

  function getComplementaryColor(hex: string): string {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    const compR = 255 - r;
    const compG = 255 - g;
    const compB = 255 - b;
    return `#${[compR, compG, compB].map(c => c.toString(16).padStart(2, '0')).join('')}`;
  }

  function isColorUsedOrExcluded(hex: string): boolean {
    const lowerHex = hex.toLowerCase();
    return usedColors.has(lowerHex) || excludedColors.has(lowerHex);
  }

  return function generateColor(): string {
    let attempts = 0;

    while (attempts < 100) {
      const base = getRandomColor();
      const candidate = getComplementaryColor(base);

      if (!isColorUsedOrExcluded(candidate)) {
        usedColors.add(candidate.toLowerCase());
        return candidate;
      }

      attempts++;
    }

    // Fallback si toutes les couleurs sont prises
    while (true) {
      const fallback = getRandomColor();
      if (!isColorUsedOrExcluded(fallback)) {
        usedColors.add(fallback.toLowerCase());
        return fallback;
      }
    }
  };
}
