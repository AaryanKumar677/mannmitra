// src/utils/guest.js
import { supabase } from "../config/supabaseClient";

/**
 * Guest conversations ko localStorage se uthata hai
 * aur nayi user_id ke saath supabase me daal deta hai.
 */
export async function migrateGuestConversations(userId) {
  try {
    const guestData = localStorage.getItem("mann_guest_conversations");
    if (!guestData) {
      console.log("⚠️ No guest conversations found.");
      return;
    }

    const conversations = JSON.parse(guestData);
    if (!Array.isArray(conversations) || conversations.length === 0) {
      console.log("⚠️ Guest conversations empty.");
      return;
    }

    // Supabase table: conversations (example)
    const { error } = await supabase.from("conversations").insert(
      conversations.map((c) => ({
        user_id: userId,
        message: c.message,
        response: c.response,
        created_at: c.created_at || new Date().toISOString(),
      }))
    );

    if (error) {
      console.error("❌ Failed to migrate guest conversations:", error.message);
    } else {
      console.log("✅ Guest conversations migrated to DB.");
      localStorage.removeItem("mann_guest_conversations"); // cleanup
    }
  } catch (err) {
    console.error("Guest migration error:", err.message);
  }
}
