"use client";

import { useState, useEffect, useRef } from "react";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Loading from "../components/Loading";

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    lat: null,
    lng: null,
  });

  const [loading, setLoading] = useState(true);
  const locationRef = useRef<HTMLInputElement | null>(null);


  /* ------------------------------------------------
        LOAD user profile
  ------------------------------------------------ */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      const data = snap.exists() ? snap.data() : {};

      setForm({
        name: data.name || user.displayName || "",
        email: data.email || user.email || "",
        location: data.location || "",
        lat: data.lat || null,
        lng: data.lng || null,
      });

      setLoading(false);
    });

    return () => unsub();
  }, []);

  /* ------------------------------------------------
        LOAD Google Autocomplete
  ------------------------------------------------ */
  useEffect(() => {
    if (!editing) return;

    function initGoogle() {
      if (!locationRef.current || !window.google) {
        setTimeout(initGoogle, 100);
        return;
      }

      const autocomplete = new window.google.maps.places.Autocomplete(
        locationRef.current,
        {
          types: ["geocode"],
          componentRestrictions: { country: "in" },
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place || !place.geometry) return;

        setForm((prev) => ({
          ...prev,
          location: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        }));
      });
    }

    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    } else {
      initGoogle();
    }
  }, [editing]);

  /* ------------------------------------------------
        VALIDATE AND SAVE PROFILE
  ------------------------------------------------ */
  function validateForm() {
    if (!form.name.trim()) {
      setErrorMsg("Please enter your name.");
      return false;
    }

    if (!form.email.trim()) {
      setErrorMsg("Email is required.");
      return false;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(form.email.trim())) {
      setErrorMsg("Please enter a valid email address.");
      return false;
    }


    if (!form.location.trim()) {
      setErrorMsg("Please select your location.");
      return false;
    }

    setErrorMsg("");
    return true;
  }

  async function handleSave() {
    if (!validateForm()) return;

    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid), {
      name: form.name,
      email: form.email,
      location: form.location,
      lat: form.lat ?? null,
      lng: form.lng ?? null,
    });

    setEditing(false);
  }

  /* ------------------------------------------------
        UI
  ------------------------------------------------ */

  const goldButton = {
    padding: "12px 22px",
    background: "linear-gradient(90deg,#b89c58,#d8c48d)",
    color: "#000",
    fontWeight: 700,
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(216,196,141,0.12)",
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="profile-wrapper">
      <div className="content-container">
        <div className="content">
          {!editing ? (
            <>
              <h1
                style={{
                  fontSize: "54px",
                  lineHeight: "1",
                  fontFamily: "Playfair Display",
                  fontWeight: 700,
                }}
              >
                {form.name}
              </h1>

              <p className="sub">
                <span style={{ color: "#828080ff" }}>Email:</span> {form.email}
              </p>

              <p className="sub" style={{ display: "flex", gap: 6 }}>
                <span style={{ color: "#828080ff" }}>Lives in:</span>
                {form.location}
              </p>

              <p className="line">
                <span style={{ color: "#d8c48d" }}>❝</span> Every act of
                kindness makes a stray feel safe.
                <span style={{ color: "#d8c48d" }}>❞</span>
              </p>

              <div className="button-row">
                <button style={goldButton} onClick={() => setEditing(true)}>
                  Edit
                </button>
                <button className="logout" onClick={() => signOut(auth)}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Inputs */}
              <input
                className="input"
                value={form.name}
                placeholder="Your name"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />

              <input
                className="input"
                value={form.email}
                placeholder="Your email"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />

              <input
                ref={locationRef}
                className="input"
                value={form.location}
                placeholder="Search location"
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
              />

              {/* ERROR BOX — same width as inputs */}
              {errorMsg && (
                <div className="error-box">{errorMsg}</div>
              )}

              <div className="button-row">
                <button style={goldButton} onClick={handleSave}>
                  Save
                </button>
                <button className="logout" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
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

/* LAST ONE NO BORDER */
.pac-item:last-child {
  border-bottom: none !important;
}

/* MAIN TEXT IN GOLD */
.pac-item .pac-item-query {
  color: #d8c48d !important;
  font-weight: 600 !important;
}

/* SECONDARY SMALL TEXT */
.pac-item span {
  color: rgba(255,255,255,0.55) !important;
}

/* ICON COLOR */
.pac-icon {
  filter: brightness(0) invert(1) sepia(80%) saturate(300%) hue-rotate(20deg);
  opacity: 0.8 !important;
}

/* HOVER + SELECT STATE */
.pac-item:hover,
.pac-item-selected {
  background: rgba(255,255,255,0.08) !important;
}
`}</style>

      <style jsx>{`
        .profile-wrapper {
          width: 100%;
          min-height: 100vh;
          background-image: url("/images/stray-in-help.jpeg");
          background-size: cover;
          background-position: center;
          position: relative;
          padding-top: 120px;
        }

        .profile-wrapper::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.82);
          backdrop-filter: blur(6px);
        }

        .content-container {
          position: relative;
          z-index: 10;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .content {
          max-width: 480px;
        }

        .sub {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.75);
        }

        .line {
          margin-top: 28px;
          font-size: 17px;
          font-style: italic;
          color: #e8d4b0;
          line-height: 1.5;
          max-width: 420px;
        }

        .button-row {
          margin-top: 30px;
          display: flex;
          gap: 15px;
        }

        .logout {
          background: #333;
          color: #fff;
          padding: 12px 22px;
          border-radius: 12px;
          cursor: pointer;
        }

        .input {
          width: 100%;
          padding: 12px;
          margin-bottom: 12px;
          border-radius: 8px;
          border: 1px solid #555;
          background: rgba(0, 0, 0, 0.55);
          color: #fff;
        }

        /* ERROR BOX STYLING */
        .error-box {
          width: 100%;
          padding: 12px;
          background: rgba(255, 80, 80, 0.15);
          border: 1px solid rgba(255, 80, 80, 0.4);
          color: #ff6b6b;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 14px;
        }
      `}</style>
    </div>
  );
}
