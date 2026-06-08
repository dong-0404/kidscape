import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { config } from '../config/env.js'

const { Schema, model } = mongoose

const adminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // bcrypt hash; never selected by default (must opt in with .select('+passwordHash')).
    passwordHash: { type: String, required: true, select: false },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
)

// Compare a plaintext password against this admin's stored hash.
adminSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash)
}

// Hash a plaintext password using the configured cost factor.
adminSchema.statics.hashPassword = function (plain) {
  return bcrypt.hash(plain, config.bcryptSaltRounds)
}

export default model('Admin', adminSchema)
