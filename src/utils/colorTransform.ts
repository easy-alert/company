/* eslint-disable no-bitwise */
/* eslint-disable no-multi-assign */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */

function hexToRgb(hex: string) {
  // Remove the '#' if it exists
  hex = hex.replace(/^#/, '');

  // Parse the hex values into RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
}

function rgbToHsl(r: number, g: number, b: number) {
  (r /= 255), (g /= 255), (b /= 255);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let h;
  let s;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
        break;
    }

    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h: number, s: number, l: number) {
  (h /= 360), (s /= 100), (l /= 100);

  let r;
  let g;
  let b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

export function transformColor(hex: string, hueShift = 0, satAdjust = 0, lightAdjust = 0) {
  // Convert hex to RGB
  const { r, g, b } = hexToRgb(hex);

  // Convert RGB to HSL
  let { h, s, l } = rgbToHsl(r, g, b);

  // Adjust HSL values
  h = (h + hueShift) % 360;
  s = Math.min(100, Math.max(0, s + satAdjust));
  l = Math.min(100, Math.max(0, l + lightAdjust));

  // Convert HSL back to RGB
  const newRgb = hslToRgb(h, s, l);

  // Convert RGB back to hex
  const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  return newHex;
}
