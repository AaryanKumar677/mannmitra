import { useState } from "react";
import { supabase } from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";

const Signup = ({ onClose }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    phone: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // ✅ Phone number validation (10 digits only)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(form.phone)) {
      setError("Please enter a valid 10-digit phone number.");
      setLoading(false);
      return;
    }

    // ✅ Strong password validation
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setError(
        "Password must be at least 8 characters long, include 1 uppercase, 1 number, and 1 special character."
      );
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (error) throw error;

      if (data.user) {
        await supabase.from("profiles").insert([
          {
            user_id: data.user.id, // ✅ correct column
            first_name: form.firstName,
            last_name: form.lastName,
            age: form.age,
            phone_numb: form.phone, // ✅ correct column
          },
        ]);
      }

      alert("✅ Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-lg shadow-lg w-96 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Create Account</h2>
        <form onSubmit={handleSignup} className="space-y-3">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone (10 digits)"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Signup;
