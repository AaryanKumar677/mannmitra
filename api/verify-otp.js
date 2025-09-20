// api/verify-otp.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { email, code } = req.body || {};
    if (!email || !code) {
      return res.status(400).json({ success: false, error: "Email and code required" });
    }

    // Fetch recent OTP rows for this email (get a few to be safe)
    const { data, error: fetchErr } = await supabase
      .from("email_otps")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(5);

    if (fetchErr) {
      console.error("verify-otp DB fetch error:", fetchErr);
      return res.status(500).json({ success: false, error: "DB error" });
    }

    if (!data || data.length === 0) {
      return res.status(400).json({ success: false, error: "Invalid code" });
    }

    // find a row that matches code AND is not used (used === true should be ignored)
    const matching = data.find((r) => String(r.code) === String(code) && (r.used !== true));

    if (!matching) {
      return res.status(400).json({ success: false, error: "Invalid or already used code" });
    }

    // expiry check
    if (matching.expires_at && new Date(matching.expires_at) < new Date()) {
      // optionally delete expired row
      try {
        await supabase.from("email_otps").delete().eq("id", matching.id);
      } catch (delErr) {
        console.warn("Failed to delete expired OTP:", delErr);
      }
      return res.status(400).json({ success: false, error: "Code expired" });
    }

    // mark as used (preferred) so it can't be reused
    const { error: updErr } = await supabase
      .from("email_otps")
      .update({ used: true })
      .eq("id", matching.id);

    if (updErr) {
      console.warn("Could not mark OTP used:", updErr);
      // Not fatal — continue and return success (or you may return 500 if you prefer)
    }

    return res.status(200).json({ success: true, message: "OTP verified" });
  } catch (err) {
    console.error("verify-otp error:", err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
}
