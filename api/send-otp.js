// api/send-otp.js
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ success: false, error: "Email required" });

    // --- server-side cooldown: check recent OTP sent in last 60s ---
    const { data: recent, error: recentErr } = await supabase
      .from("email_otps")
      .select("created_at")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1);

    if (recentErr) {
      console.warn("recent query warning:", recentErr);
    } else if (recent && recent.length > 0) {
      const last = new Date(recent[0].created_at);
      if (Date.now() - last.getTime() < 60 * 1000) {
        return res.status(429).json({ success: false, error: "Please wait before requesting a new OTP" });
      }
    }

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // insert OTP
    const { data: insertData, error: insertErr } = await supabase
      .from("email_otps")
      .insert([{ email, code, expires_at: expiresAt }])
      .select(); // return inserted row(s)

    if (insertErr) {
      console.error("DB insert error:", insertErr);
      return res.status(500).json({ success: false, error: "DB insert failed" });
    }

    // Configure transporter (change secure according to your SMTP port)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // send email
    try {
      await transporter.sendMail({
        from: `"MannMitra" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Your MannMitra verification code",
        text: `Your verification code is ${code}. It expires in 10 minutes.`,
        html: `<p>Your verification code is <strong>${code}</strong>. It expires in 10 minutes.</p>`,
      });
    } catch (mailErr) {
      console.error("Mail send error:", mailErr);
      // rollback DB insert if mail fails
      try {
        await supabase.from("email_otps").delete().eq("email", email).eq("code", code);
      } catch (delErr) {
        console.warn("rollback delete failed:", delErr);
      }
      return res.status(500).json({ success: false, error: "Failed to send email" });
    }

    // success
    return res.status(200).json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error("send-otp error:", err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
}
