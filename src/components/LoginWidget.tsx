"use client";

import { useEffect, useState } from "react";
import { auth, googleProvider } from "../lib/firebase";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import AuthModal from "./AuthModal";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { db } from "../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function LoginWidget() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => onAuthStateChanged(auth, (u) => setUser(u)), []);

  const handleSelect = (place: { address: string; lat?: number; lng?: number }) => {
    console.log("Selected:", place);
  };

  function initial() {
    const n = user?.displayName || user?.email || "";
    return n ? n[0].toUpperCase() : "🙂";
  }

  return (
    <div style={{ position: "relative" }}>
      {/* INLINE CSS - MINIMAL TEXT + ICON BUTTON */}
      <style>{`
        .cta {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          color: #cbd5e1;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.25s ease;
        }

        .cta:hover {
          color: #ffffff;
        }

        .log-icon {
          transform: translateY(-1px);
        }

        /* 📱 MOBILE (smaller text/sign icon) */
        @media (max-width: 768px) {
          .cta {
            font-size: 0.78rem;
            gap: 0.3rem;
          }
          .log-icon {
            transform: scale(0.9);
          }
        }
      `}</style>

      {!user ? (
        <button className="cta" onClick={() => setOpen(true)}>
          <LogIn className="log-icon" size={15} />
          <span>Sign in</span>
        </button>
      ) : (
        <Link href="/profile">
          <div
            title={user?.email || ""}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: "1.5px solid #b8935f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "#b8935f",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(184,147,95,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {initial()}
          </div>
        </Link>
      )}

      {open && (
        <AuthModal
          open={open}
          onClose={() => setOpen(false)}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}
