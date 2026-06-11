import 'dotenv/config'
import mongoose from 'mongoose'

await mongoose.connect(process.env.MONGODB_URI)

const car = await mongoose.connection.db.collection('cars').findOne(
  { slug: 'maruti-suzuki-swift-zxi-plus-2024' },
  { projection: { slug: 1, images: 1, colors: 1 } }
)

console.log(JSON.stringify(car, null, 2))

await mongoose.disconnect()
