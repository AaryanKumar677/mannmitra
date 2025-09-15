import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import Navbar from "../components/Navbar";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      const current = data?.user ?? null;
      if (!current) {
        // agar logged out hai to login page bhej do
        navigate("/login");
        return;
      }
      if (mounted) {
        setUser(current);
        setLoading(false);
      }
    }

    fetchUser();
    return () => (mounted = false);
  }, [navigate]);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    }
    navigate("/login");
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <Navbar />

      <main className="max-w-4xl mx-auto mt-8 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h1 className="text-2xl font-bold">Welcome{user?.email ? `, ${user.email}` : ''} 🎉</h1>
          <p className="text-sm text-gray-600 mt-2">This is your dashboard. Use the links below to manage your account.</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/profile" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Go to Profile</Link>
            <button onClick={handleSignOut} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">Logout</button>
          </div>

          <section className="mt-6">
            <h2 className="font-semibold">Quick Info</h2>
            <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
              <li>Your user id: <code className="bg-gray-100 px-2 py-1 rounded">{user?.id}</code></li>
              <li>Registered with: <strong>{user?.email}</strong></li>
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
