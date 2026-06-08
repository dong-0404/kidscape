import mongoose from 'mongoose'
import { config } from './env.js'

let listenersBound = false

function bindListeners() {
  if (listenersBound) return
  listenersBound = true
  mongoose.connection.on('connected', () => console.log('✓ MongoDB connected'))
  mongoose.connection.on('error', (err) => console.error('✗ MongoDB error:', err.message))
  mongoose.connection.on('disconnected', () => console.warn('… MongoDB disconnected'))
}

export async function connectDB() {
  bindListeners()
  mongoose.set('strictQuery', true)
  await mongoose.connect(config.mongoUri)
  return mongoose.connection
}

export async function disconnectDB() {
  await mongoose.connection.close()
}

export default connectDB
