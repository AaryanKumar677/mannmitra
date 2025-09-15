import { supabase } from "../config/supabaseClient";

export async function signUp({ email, password, firstName, lastName, age, mobile }) {
  try {
    // Step 1: Auth user create karo
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    const user = authData.user;

    // Step 2: Profile insert karo
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          user_id: user.id,         // ✅ sahi column
          first_name: firstName,
          last_name: lastName,
          age,
          phone_numb: mobile,       // ✅ sahi column
        },
      ]);

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
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw error;

    return { profile: data };
  } catch (error) {
    console.error("Get profile error:", error.message);
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
