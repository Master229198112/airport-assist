import crypto from 'crypto'

const algorithm = 'aes-256-cbc'
const key = Buffer.from(process.env.CRYPTO_SECRET_KEY, 'hex')  // 32 bytes = 256 bits
const iv = Buffer.from(process.env.CRYPTO_IV, 'hex')            // 16 bytes = 128 bits

export function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

export function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
