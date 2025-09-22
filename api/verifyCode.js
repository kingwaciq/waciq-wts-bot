import { v4 as uuidv4 } from "uuid";
import { otpStore } from "./requestCode.js";

const sessions = {}; // { number: { sessionId, active } }

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { number, otp } = req.body;
  if (!number || !otp) return res.status(400).json({ error: "Number and OTP required" });

  const record = otpStore[number];
  if (!record) return res.status(400).json({ error: "No OTP generated for this number" });
  if (Date.now() > record.expires) return res.status(400).json({ error: "OTP expired" });
  if (record.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

  const sessionId = uuidv4();
  sessions[number] = { sessionId, active: true };

  res.status(200).json({ success: true, sessionId });
}

export { sessions }; 
