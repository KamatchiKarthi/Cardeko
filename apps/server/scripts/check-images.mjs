import 'dotenv/config'
import mongoose from 'mongoose'

await mongoose.connect(process.env.MONGODB_URI)

const db = mongoose.connection.db
console.log('database:', db.databaseName)

for (const name of ['cars', 'carvariants', 'test']) {
  const exists = (await db.listCollections({ name }).toArray()).length > 0
  if (!exists) {
    console.log(`${name}: collection not found`)
    continue
  }

  const withImages = await db.collection(name).countDocuments({ 'images.0': { $exists: true } })
  const total = await db.collection(name).countDocuments()
  const sample = await db.collection(name).findOne({ 'images.0': { $exists: true } })

  console.log(`${name}: ${withImages}/${total} docs with images`)
  if (sample) {
    console.log(`  sample slug/name: ${sample.slug ?? sample.name}`)
    console.log(`  images:`, sample.images)
  }
}

await mongoose.disconnect()
