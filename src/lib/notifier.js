const nodemailer = require('nodemailer')
const twilio = require('twilio')

const EMAIL_USER = process.env.EMAIL_USER
const TWILIO_FROM = process.env.TWILIO_FROM

async function sendEmail(to, subject, message) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const info = await transporter.sendMail({
      from: `"Airport Assist" <${EMAIL_USER}>`,
      to,
      subject,
      text: message,
    })

    console.log("✅ Email sent:", info.messageId)
  } catch (err) {
    console.error("❌ Email failed:", err.message)
  }
}

async function sendSMS(to, message) {
  try {
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
    const msg = await client.messages.create({
      body: message,
      from: TWILIO_FROM,
      to,
    })

    console.log("✅ SMS sent:", msg.sid)
  } catch (err) {
    console.error("❌ SMS failed:", err.message)
  }
}

module.exports = { sendEmail, sendSMS }
