import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../config/auth";
import { supabase } from "../config/supabaseClient";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    age: "",
    phone_numb: "",
  });

  // 🔹 Profile fetch karo jab component load ho
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser(); // logged in user lao

      if (user) {
        const { profile, error } = await getProfile(user.id);
        if (!error && profile) {
          setProfile(profile);
          setForm({
            first_name: profile.first_name || "",
            last_name: profile.last_name || "",
            age: profile.age || "",
            phone_numb: profile.phone_numb || "",
          });
        }
      }

      setLoading(false);
    }

    fetchProfile();
  }, []);

  // 🔹 Input change handler
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // 🔹 Profile update
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { profile, error } = await updateProfile(user.id, form);
      if (!error && profile) {
        setProfile(profile);
        alert("Profile updated successfully ✅");
      } else {
        alert("Failed to update profile ❌");
      }
    }

    setSaving(false);
  }

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4 text-center">My Profile</h2>

      <form onSubmit={handleSave} className="space-y-4">
        <input
          type="text"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full border px-3 py-2 rounded-lg"
        />
        <input
          type="text"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full border px-3 py-2 rounded-lg"
        />
        <input
          type="number"
          name="age"
          value={form.age}
          onChange={handleChange}
          placeholder="Age"
          className="w-full border px-3 py-2 rounded-lg"
        />
        <input
          type="text"
          name="phone_numb"
          value={form.phone_numb}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full border px-3 py-2 rounded-lg"
        />

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
