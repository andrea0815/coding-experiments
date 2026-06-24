export async function loadShader(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Could not load shader: ${path}`);
  }

  const text = await response.text();

  if (text.trim().startsWith("<!doctype html>") || text.trim().startsWith("<html")) {
    throw new Error(`Expected shader file, but got HTML instead: ${path}`);
  }

  return text;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function mix(a, b, t) {
  return a * (1 - t) + b * t;
}