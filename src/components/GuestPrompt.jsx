// src/components/GuestPrompt.jsx
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function GuestPrompt({ open, onClose, title = "Welcome to MannMitra AI", description }) {
  const navigate = useNavigate();
  const overlayRef = useRef(null);
  const primaryRef = useRef(null);
  const previousActiveRef = useRef(null);

  // hover states for button effects
  const [primaryHover, setPrimaryHover] = useState(false);
  const [loginHover, setLoginHover] = useState(false);
  const [signupHover, setSignupHover] = useState(false);

  const desc = description || "Explore the AI interface as a guest. Some features (save chat, booking, profile) require signing up.";

  useEffect(() => {
    if (!open) return;
    previousActiveRef.current = document.activeElement;
    const t = setTimeout(() => primaryRef.current?.focus(), 40);

    function onKey(e) {
      if (e.key === "Escape") onClose?.();
      if (e.key === "Tab") {
        const focusable = overlayRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) || [];
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      try { previousActiveRef.current?.focus(); } catch (e) {}
    };
  }, [open, onClose]);

  const onOverlayMouseDown = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  const continueAsGuest = () => {
    localStorage.setItem("mann_guest", "1");
    onClose?.();
  };

  if (!open) return null;

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(6,8,15,0.6)",
    backdropFilter: "blur(6px) saturate(120%)",
    zIndex: 99999,
    padding: 20,
  };

  const cardStyle = {
    width: "min(440px, 92%)",
    borderRadius: 14,
    overflow: "hidden",
    background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,250,253,0.98))",
    boxShadow: "0 30px 80px rgba(2,6,23,0.72)",
    color: "#081220",
    display: "flex",
    flexDirection: "column",
  };

  const bodyStyle = { padding: "18px 20px 10px 20px" };
  const headerRow = { display: "flex", gap: 12, alignItems: "flex-start", justifyContent: "space-between" };
  const brand = { display: "flex", gap: 12, alignItems: "center" };
  const badge = {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(90deg,#ec4899,#fb923c,#14b8a6)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
  };
  const titleStyle = { margin: 0, fontSize: 16.5, fontWeight: 700, lineHeight: 1.18, marginBottom: 8 };
  const descStyle = { marginTop: 0, marginBottom: 0, color: "#475569", fontSize: 13, maxWidth: 420 };

  const actions = { marginTop: 38, display: "flex", flexDirection: "column", gap: 16 };

 
  const primaryBtnBase = {
    appearance: "none",
    border: "none",
    cursor: "pointer",
    padding: "9px 12px",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 14.5,
    color: "white",
    width: "min(200px, 72%)",
    alignSelf: "center",
    display: "inline-flex",
    justifyContent: "center",
    transition: "transform 180ms ease, box-shadow 180ms ease, filter 180ms ease",
  };

  const primaryBtnStyle = {
    ...primaryBtnBase,
    background: primaryHover ? "linear-gradient(90deg,#05a7bd,#2563eb)" : "linear-gradient(90deg,#06b6d4,#3b82f6)",
    boxShadow: primaryHover ? "0 16px 34px rgba(37,99,235,0.18)" : "0 8px 20px rgba(59,130,246,0.14)",
    transform: primaryHover ? "translateY(-3px) scale(1.01)" : "translateY(0) scale(1)",
    outline: "none",
  };

  const secondaryRow = { display: "flex", gap: 8, justifyContent: "center" };
  const outlineBtnBase = {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid rgba(15,23,42,0.06)",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    color: "#0f172a",
    transition: "transform 140ms ease, box-shadow 140ms ease, background 140ms ease, color 140ms ease",
    width: "auto",
    minWidth: 140,
    maxWidth: 130,
    textAlign: "center",
  };

  const loginStyle = {
    ...outlineBtnBase,
    background: loginHover ? "#2563eb" : "#fff",
    color: loginHover ? "#fff" : "#0f172a",
    transform: loginHover ? "translateY(-2px)" : "translateY(0)",
    boxShadow: loginHover ? "0 10px 22px rgba(37,99,235,0.12)" : "none",
    marginRight: "16px",
  };

  const signupStyle = {
    ...outlineBtnBase,
    background: signupHover ? "#06b6d4" : "#fff",
    color: signupHover ? "#fff" : "#0f172a",
    transform: signupHover ? "translateY(-2px)" : "translateY(0)",
    boxShadow: signupHover ? "0 10px 22px rgba(6,182,212,0.12)" : "none",
    marginLeft: "16px",
  };

  const cancelStyle = { marginTop: 6, alignSelf: "center", color: "#64748b", fontSize: 13, background: "transparent", border: "none", cursor: "pointer" };
  const footer = { padding: "14px 16px", borderTop: "1px solid rgba(15,23,42,0.04)", textAlign: "center", fontSize: 12, color: "#6b7280" };

  const CloseIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M6 18L18 6" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const modal = (
    <div
      ref={overlayRef}
      style={overlayStyle}
      onMouseDown={onOverlayMouseDown}
      aria-modal="true"
      role="dialog"
      aria-labelledby="guest-title"
      aria-describedby="guest-desc"
    >
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        style={cardStyle}
      >
        <div style={bodyStyle}>
          <div style={headerRow}>
            <div style={brand}>
              <div style={badge} aria-hidden> M </div>
              <div>
                <h3 id="guest-title" style={titleStyle}>{title}</h3>
                <p id="guest-desc" style={descStyle}>{desc}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close"
              style={{ background: "transparent", border: "none", cursor: "pointer", padding: 8, borderRadius: 8 }}
            >
              <CloseIcon />
            </button>
          </div>

          <div style={actions}>
            <div style={secondaryRow}>
              <button
                onClick={() => {
                  onClose?.();
                  navigate("/login");
                }}
                onMouseEnter={() => setLoginHover(true)}
                onMouseLeave={() => setLoginHover(false)}
                style={loginStyle}
              >
                Login
              </button>

              <button
                onClick={() => {
                  onClose?.();
                  navigate("/signup");
                }}
                onMouseEnter={() => setSignupHover(true)}
                onMouseLeave={() => setSignupHover(false)}
                style={signupStyle}
              >
                Sign up
              </button>
            </div>

            <button
              ref={primaryRef}
              onClick={continueAsGuest}
              onMouseEnter={() => setPrimaryHover(true)}
              onMouseLeave={() => setPrimaryHover(false)}
              style={primaryBtnStyle}
            >
              Continue as Guest
            </button>

            {/* <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                onClick={() => { localStorage.removeItem("mann_guest"); onClose?.(); }}
                style={cancelStyle}
              >
                Cancel
              </button>
            </div> */}
          </div>
        </div>

        <div style={footer}>
          Your data stays local unless you sign up.
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modal, document.body);
}
