/**
 * Backfill `images` on all cars in the `cars` collection from slug + CDN base.
 * Does not delete reviews or other data.
 *
 * Usage: node scripts/backfill-images.mjs
 * Optional: CAR_IMAGE_CDN_BASE=https://your-cdn.example/cars
 */
import 'dotenv/config'
import mongoose from 'mongoose'

const DEFAULT_CDN_BASE = 'https://cdn.cardeko.in/cars'

function getCdnBase() {
  const fromEnv = process.env.CAR_IMAGE_CDN_BASE?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  return DEFAULT_CDN_BASE
}

function buildCarImageUrls(carSlug, cdnBase) {
  const base = `${cdnBase}/${carSlug}`
  return [
    `${base}/front.webp`,
    `${base}/side.webp`,
    `${base}/rear.webp`,
    `${base}/interior.webp`,
  ]
}

const cdnBase = getCdnBase()
await mongoose.connect(process.env.MONGODB_URI)

const collection = mongoose.connection.db.collection('cars')
const force = process.argv.includes('--force')
const cars = await collection.find({ slug: { $exists: true } }).project({ slug: 1, images: 1 }).toArray()

let updated = 0
let skipped = 0
for (const car of cars) {
  if (!force && Array.isArray(car.images) && car.images.length > 0) {
    skipped += 1
    continue
  }
  const images = buildCarImageUrls(car.slug, cdnBase)
  await collection.updateOne({ _id: car._id }, { $set: { images } })
  updated += 1
}

const sample = await collection.findOne({ 'images.0': { $exists: true } })
console.log(`Backfilled images for ${updated} cars, skipped ${skipped} with existing images (CDN: ${cdnBase})`)
console.log('Sample:', sample ? { slug: sample.slug, images: sample.images } : 'none')

await mongoose.disconnect()
