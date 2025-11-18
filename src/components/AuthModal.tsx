"use client";

import { useEffect, useState, useRef } from "react";
import { FiEye, FiEyeOff, FiMapPin } from "react-icons/fi";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (place: SelectedLocation) => void;
};

interface SelectedLocation {
  address: string;
  lat?: number;
  lng?: number;
}

export default function AuthModal({ open, onClose, onSelect }: Props) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [location, setLocation] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  /* ---------------------------------------------
        GOOGLE AUTOCOMPLETE
  ---------------------------------------------- */
  useEffect(() => {
    if (!open || mode !== "signup") return;

    function initAutocomplete() {
      if (!window.google || !inputRef.current) {
        setTimeout(initAutocomplete, 100);
        return;
      }

      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current!,
        {
          types: ["geocode"],
          componentRestrictions: { country: "in" },
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place || !place.geometry) return;

        const selected = {
          address: place.formatted_address || "",
          lat: place.geometry.location?.lat(),
          lng: place.geometry.location?.lng(),
        };

        setLocation(selected.address);
        setSelectedLocation(selected);
        onSelect(selected);
      });
    }

    if (!window.google) {
      const script = document.createElement("script");
      script.id = "googleMaps";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = initAutocomplete;
      document.body.appendChild(script);
    } else initAutocomplete();
  }, [open, mode, onSelect]);

  /* ---------------------------------------------
        DISABLE SCROLL
  ---------------------------------------------- */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* ---------------------------------------------
        AUTH SUBMIT
  ---------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setBusy(true);

    try {
      if (mode === "signup") {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await updateProfile(user, { displayName: name });

        await setDoc(doc(db, "users", user.uid), {
          name,
          email,
          location: selectedLocation?.address || location || "",
          lat: selectedLocation?.lat ?? null,
          lng: selectedLocation?.lng ?? null,
          createdAt: new Date().toISOString(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      onClose();
    } catch (error: any) {
      setErr(error.message || "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  /* ---------------------------------------------
        SHARED INPUT STYLE
  ---------------------------------------------- */
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontSize: 15,
    outline: "none",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(10px)",
        display: "flex",
        justifyContent: "flex-end",
        zIndex: 2000,
      }}
    >
      {/* PANEL */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "420px",
          height: "100vh",
          background: "rgba(10,10,10,0.92)",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
          backdropFilter: "blur(12px)",
          animation: "slideIn 0.35s ease-out",
          overflow: "hidden",
          padding: "34px 28px",
        }}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 26,
            right: 26,
            color: "#fff",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            width: 32,
            height: 32,
            border: "none",
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          ×
        </button>

        {/* TITLE */}
        <h2
          style={{
            margin: 0,
            fontSize: 34,
            fontFamily: "Playfair Display",
            color: "#d8c48d",
            fontWeight: 700,
          }}
        >
          {mode === "signup" ? "Join Us" : "Welcome Back"}
        </h2>

        <p
          style={{
            marginTop: 6,
            color: "rgba(255,255,255,0.55)",
            fontSize: 15,
          }}
        >
          {mode === "signup"
            ? "Create your account"
            : "Sign in to continue"}
        </p>

        {/* FORM */}
       <form onSubmit={handleSubmit} style={{ marginTop: 26 }}>
  {/* Wrapper to control max width of all fields */}
  <div style={{ width: "100%", maxWidth: 360, margin: "0 auto" }}>

    {/* FULL NAME (SIGNUP ONLY) */}
    {mode === "signup" && (
      <div style={{ marginBottom: 16 }}>
        <input
          style={inputStyle}
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
    )}

    {/* EMAIL */}
    <div style={{ marginBottom: 16 }}>
      <input
        style={inputStyle}
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>

    {/* PASSWORD */}
    <div style={{ marginBottom: 16, position: "relative" }}>
      <input
        style={{
          ...inputStyle,
          paddingRight: 46, // Space for eye icon
        }}
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="button"
        onClick={() => setShowPassword((p) => !p)}
        style={{
          position: "absolute",
          right: 14,
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "#d8c48d",
        }}
      >
        {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
      </button>
    </div>

    {/* LOCATION (SIGNUP ONLY) */}
    {mode === "signup" && (
      <div style={{ marginBottom: 18, position: "relative" }}>
        <FiMapPin
          size={16}
          color="#d8c48d"
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />

        <input
          ref={inputRef}
          type="text"
          placeholder="Search Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{
            ...inputStyle,
            paddingLeft: 40, // space for map icon
          }}
        />
      </div>
    )}

    {/* ERROR */}
    {err && (
      <div
        style={{
          padding: "12px 14px",
          background: "rgba(255,0,0,0.1)",
          border: "1px solid rgba(255,0,0,0.25)",
          borderRadius: 10,
          color: "#f87171",
          fontSize: 13,
          marginBottom: 14,
        }}
      >
        {err}
      </div>
    )}

    {/* SUBMIT BUTTON */}
    <button
      type="submit"
      disabled={busy}
      style={{
        width: "100%",
        padding: "14px 0",
        background: "linear-gradient(135deg,#b89c58,#d8c48d)",
        borderRadius: 12,
        color: "#000",
        fontWeight: 700,
        border: "none",
        cursor: busy ? "not-allowed" : "pointer",
        fontSize: 15,
      }}
    >
      {busy
        ? "Please wait…"
        : mode === "signup"
        ? "Create Account"
        : "Sign In"}
    </button>

    {/* SWITCH MODE */}
    <div
      style={{
        textAlign: "center",
        marginTop: 14,
        color: "rgba(255,255,255,0.55)",
        fontSize: 14,
      }}
    >
      {mode === "signup"
        ? "Already have an account?"
        : "Don't have an account?"}{" "}
      <span
        onClick={() => {
          setMode(mode === "signup" ? "signin" : "signup");
          setErr("");
        }}
        style={{
          color: "#d8c48d",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        {mode === "signup" ? "Sign In" : "Sign Up"}
      </span>
    </div>

  </div>
</form>

      </div>

      {/* ANIMATION */}
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}
