import { supabase } from "../config/supabaseClient";

export async function signUp({ email, password, firstName, lastName, age, mobile }) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    const user = authData.user;

    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          user_id: user.id,
          first_name: firstName,
          last_name: lastName,
          age,
          phone_number: mobile,
          email,
        },
      ]);
    if (profileError) {
      console.error("❌ Profile insert error:", profileError.message);
    } else {
      console.log("✅ Profile row inserted for user:", user.id);
    }


    if (profileError) throw profileError;

    return { user };
  } catch (error) {
    console.error("Signup error:", error.message);
    return { error };
  }
}

export async function signIn({ email, password }) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { user: data.user };
  } catch (error) {
    console.error("Login error:", error.message);
    return { error };
  }
}

export async function getProfile(userId) {
  try {
    console.log("➡️ Fetching profile for userId:", userId);
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    console.log("📄 Supabase response data:", data);
    console.log("⚠️ Supabase response error:", error);  

    if (error) return { error };

    return { profile: data };
  } catch (error) {
    console.error("❌ Get profile error:", error.message);
    return { error };
  }
}

export async function updateProfile(userId, updates) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    return { profile: data };
  } catch (error) {
    console.error("Update profile error:", error.message);
    return { error };
  }
}