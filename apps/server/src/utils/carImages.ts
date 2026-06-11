import { env } from '../config/env'

const DEFAULT_CDN_BASE = 'https://cdn.cardeko.in/cars'

export function getCarImageCdnBase(): string {
  const fromEnv = env.CAR_IMAGE_CDN_BASE?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  return DEFAULT_CDN_BASE
}

export function buildCarImageUrls(carSlug: string, cdnBase = getCarImageCdnBase()): string[] {
  const base = `${cdnBase}/${carSlug}`
  return [`${base}/front.webp`, `${base}/side.webp`, `${base}/rear.webp`, `${base}/interior.webp`]
}
