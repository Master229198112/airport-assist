const crypto = require('crypto')

const algorithm = 'aes-256-cbc'

// Load and validate environment variables
const keyHex = process.env.CRYPTO_SECRET_KEY
const ivHex = process.env.CRYPTO_IV

if (!keyHex || !ivHex) {
  throw new Error('Missing CRYPTO_SECRET_KEY or CRYPTO_IV in environment variables.')
}

const key = Buffer.from(keyHex, 'hex')  // 32 bytes
const iv = Buffer.from(ivHex, 'hex')    // 16 bytes

function encrypt(text) {
  if (!text || typeof text !== 'string') return ''
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

function decrypt(encryptedText) {
  if (!encryptedText || typeof encryptedText !== 'string') return ''
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

module.exports = { encrypt, decrypt }
