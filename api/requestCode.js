import Twilio from "twilio";

const otpStore = {}; // { number: { otp, expires } }

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { number } = req.body;
  if (!number) return res.status(400).json({ error: "Number required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

  otpStore[number] = { otp, expires };

  try {
    const client = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${number}`,
      body: `Your OTP code is: ${otp}`
    });

    res.status(200).json({ success: true, message: "OTP sent via WhatsApp" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export { otpStore }; // share with verifyCode.js 
