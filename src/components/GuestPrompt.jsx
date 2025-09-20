// src/components/GuestPrompt.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function GuestPrompt({ open, onClose }) {
  const navigate = useNavigate();
  if (!open) return null;

  const continueAsGuest = () => {
    localStorage.setItem("mann_guest", "1");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-xl font-semibold mb-2">Welcome to MannMitra AI</h3>
        <p className="text-sm text-gray-600 mb-4">
          You can explore the AI interface as a guest. Some features (save chat, booking, profile) require signing up.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={continueAsGuest}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-white font-medium"
          >
            Continue as Guest
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => navigate("/login")}
              className="flex-1 py-2 rounded-lg border border-gray-200"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              Sign up
            </button>
          </div>

          <button
            onClick={() => { localStorage.removeItem("mann_guest"); onClose(); }}
            className="mt-1 text-xs text-gray-500 underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
