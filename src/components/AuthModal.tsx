"use client";

import { useEffect, useState, useRef } from "react";
import { FiEye, FiEyeOff, FiMapPin } from "react-icons/fi";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../lib/firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';

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
  }, [open, onSelect]);

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

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    if (mode === "signup") {
      if (!name.trim() || !email.trim() || !password.trim() || !location.trim()) {
        setErr("Please fill all required fields.");
        return;
      }

      const strongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
      if (!strongPassword.test(password)) {
        setErr("Enter a stronger password (min 6 chars, include letters & numbers).");
        return;
      }
    } else {
      if (!email.trim() || !password.trim()) {
        setErr("Invalid email or password.");
        return;
      }
    }

    setBusy(true);

    try {
      if (mode === "signup") {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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

        onClose();
      } else {
        // Sign In
        await signInWithEmailAndPassword(auth, email, password);
        onClose();
      }
    } catch (error: any) {
      const code = error?.code || "";
      if (mode === "signup" && code === "auth/email-already-in-use") {
        setErr("User already exists.");
      } else if (mode === "signin" && (code === "auth/user-not-found" || code === "auth/wrong-password")) {
        setErr("Invalid email or password.");
      } else {
        setErr("Something went wrong, please try again.");
      }
    } finally {
      setBusy(false);
    }
  };

async function google() {
  setErr(""); // clear previous errors

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    await setDoc(
      doc(db, 'users', user.uid),
      {
        uid: user.uid,
        name: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || '',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      },
      { merge: true }
    );

    onClose();

  } catch (error: any) {
    console.error("Google sign-in failed:", error);

    const code = error.code || "";

    // Smoothed, user-friendly error messages
    if (code === "auth/popup-closed-by-user") {
      setErr("Google sign-in was cancelled.");
    } else if (code === "auth/network-request-failed") {
      setErr("Network issue — please check your connection and try again.");
    } else if (code === "auth/internal-error") {
      setErr("Server issue — please try again in a moment.");
    } else {
      setErr("Unable to sign in with Google. Please try again.");
    }
  }
}


  // async function google() {
  //   try {
  //     const result = await signInWithPopup(auth, googleProvider);
  //     const user = result.user;

  //     await setDoc(
  //       doc(db, 'users', user.uid),
  //       {
  //         uid: user.uid,
  //         name: user.displayName || '',
  //         email: user.email || '',
  //         photoURL: user.photoURL || '',
  //         createdAt: serverTimestamp(),
  //         lastLogin: serverTimestamp(),
  //       },
  //       { merge: true }
  //     );

  //     console.log('✅ User saved to Firestore:', user.email);
  //   } catch (e: any) {
  //     console.error('❌ Google sign-in failed:', e);
  //     alert(e?.message || 'Google sign-in failed');
  //   }
  // }

  if (!open) return null;
  /* ---------------------------------------------
      RESET FORM WHEN MODAL OPENS
---------------------------------------------- */
  useEffect(() => {
    if (open) {
      setName("");
      setEmail("");
      setPassword("");
      setLocation("");
      setSelectedLocation(null);
      setErr("");
      setShowPassword(false);
    }
  }, [open]);


  /* ---------------------------------------------
        UNIFIED INPUT STYLE
  ---------------------------------------------- */
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 20px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
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
      <style>
        {`
/* GOOGLE AUTOCOMPLETE DROPDOWN */
.pac-container {
  background: rgba(10,10,10,0.92) !important;
  border: 1px solid rgba(255,255,255,0.12) !important;
  box-shadow: 0 10px 30px rgba(0,0,0,0.6) !important;
  border-radius: 12px !important;
  backdrop-filter: blur(6px) !important;
  z-index: 999999 !important;
}

/* EACH ITEM */
.pac-item {
  padding: 12px 16px !important;
  color: rgba(255,255,255,0.85) !important;
  font-size: 14px !important;
  border-bottom: 1px solid rgba(255,255,255,0.06) !important;
  background: transparent !important;
}

/* LAST ITEM SHOULD NOT HAVE BORDER */
.pac-item:last-child {
  border-bottom: none !important;
}

/* MAIN TEXT */
.pac-item .pac-item-query {
  color: #d8c48d !important; /* gold highlight */
  font-weight: 600 !important;
}

/* SMALLER DESC TEXT */
.pac-item span {
  color: rgba(255,255,255,0.55) !important;
}

/* LOCATION ICON */
.pac-icon {
  filter: brightness(0) invert(1) sepia(80%) saturate(300%) hue-rotate(20deg);
  opacity: 0.8 !important;
}

/* ACTIVE / HOVER STATE */
.pac-item:hover,
.pac-item-selected {
  background: rgba(255,255,255,0.08) !important;
}
`}

      </style>

      <style>
        {`
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0px 1000px rgba(255,255,255,0.05) inset !important;
  box-shadow: 0 0 0px 1000px rgba(255,255,255,0.05) inset !important;
  -webkit-text-fill-color: #fff !important;
  caret-color: #fff !important;
  border: 1px solid rgba(255,255,255,0.12) !important;
  transition: background-color 9999s ease-in-out 0s;
}
`}
      </style>

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
          overflow: "auto",
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

        {/* FORM WRAPPER (ALIGN EVERYTHING) */}
        <div
          style={{
            width: "100%",
            maxWidth: 360,
            margin: "0 auto",
          }}
        >
          {/* TITLE */}
          <h2
            style={{
              margin: 0,
              fontSize: 34,
              fontFamily: "Playfair Display",
              color: "#d8c48d",
              fontWeight: 700,
              textAlign: "left",
            }}
          >
            {mode === "signup" ? "Join Us" : "Welcome Back"}
          </h2>

          {/* DESCRIPTION */}
          <p
            style={{
              marginTop: 6,
              color: "rgba(255,255,255,0.55)",
              fontSize: 15,
              marginBottom: 20,
              textAlign: "left",
            }}
          >
            {mode === "signup"
              ? "Create your account"
              : "Sign in to continue"}
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            {/* NAME FIELD */}
            {mode === "signup" && (
              <div style={{ marginBottom: 16 }}>
                <input
                  style={inputStyle}
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="off"
                  name="name-field"
                />

              </div>
            )}

            {/* EMAIL */}
            <div style={{ marginBottom: 16 }}>
              <input
                style={inputStyle}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div style={{ marginBottom: 16, position: "relative" }}>
              <input
                style={{ ...inputStyle, paddingRight: 46 }}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                name="password-field"
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

            {/* LOCATION */}
            {mode === "signup" && (
              <div style={{ marginBottom: 18, position: "relative" }}>
                <FiMapPin
                  size={16}
                  color="#d8c48d"
                  style={{
                    position: "absolute",
                    left: 16,
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
                    paddingLeft: 44,
                  }}
                />
              </div>
            )}

            {/* ERROR MESSAGE */}
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
                padding: "14px 20px",
                background: "linear-gradient(135deg,#b89c58,#d8c48d)",
                borderRadius: 12,
                color: "#000",
                fontWeight: 700,
                border: "none",
                cursor: busy ? "not-allowed" : "pointer",
                fontSize: 15,
                boxSizing: "border-box",
              }}
            >
              {busy
                ? "Please wait…"
                : mode === "signup"
                  ? "Create Account"
                  : "Sign In"}
            </button>

            {/* MODE SWITCH */}
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

          </form>
          {/* SEPARATOR LINE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "18px 0",
            }}
          >
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.15)" }}></div>
            <span
              style={{
                margin: "0 10px",
                color: "rgba(255,255,255,0.45)",
                fontSize: 13,
              }}
            >
              or
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.15)" }}></div>
          </div>

          {/* GOOGLE SIGN IN BUTTON */}
          <button
            type="button"
            onClick={google}
            style={{
              width: "100%",
              padding: "12px",
              background: "#fff",
              borderRadius: 12,
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 15,
              color: "#000",
            }}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              style={{ width: 20, height: 20 }}
            />
            Continue with Google
          </button>
        </div>
      </div>

      {/* ANIMATION */}
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1); }
          }
        `}
      </style>
    </div>
  );
}
