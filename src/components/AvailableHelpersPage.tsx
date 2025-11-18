"use client";

import { ArrowLeft, MapPin, Clock, Send } from "lucide-react";
import { useRouter } from "next/router";
import Header from "./Header";

export default function AvailableHelpersPage({
  availableHelpers = [],
  setSelectedHelper
}) {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        // padding: "40px 20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <Header />

      <div style={{ maxWidth: 1100, margin: "0 auto",     marginTop: "80px",
          marginBottom: "50px", }}>
     

        {/* Page Title */}
        <h1
          style={{
            fontSize: 40,
            fontWeight: 700,
            fontFamily: "Playfair Display",
            marginBottom: 6,
          }}
        >
          Available Helpers
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.55)",
            marginBottom: 30,
          }}
        >
          These kind folks near you are currently active and ready to help ❤️
        </p>

        {/* NO HELPERS */}
        {(!Array.isArray(availableHelpers) ||
          availableHelpers.length === 0) && (
          <p style={{ marginTop: 20, color: "rgba(255,255,255,0.45)" }}>
            No helpers available at the moment.
          </p>
        )}

        {/* Helpers Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 28,
          }}
        >
          {availableHelpers.map((helper) => (
            <div
              key={helper.id}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 18,
                padding: 22,
                boxShadow: "0 12px 30px rgba(0,0,0,0.55)",
                transition: "0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              {/* Top row: Avatar + Info */}
              <div style={{ display: "flex", gap: 14 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: "var(--gold-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 20,
                    color: "#000",
                  }}
                >
                  {helper.avatar ||
                    helper.name?.charAt(0)?.toUpperCase() ||
                    "?"}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      marginBottom: 2,
                    }}
                  >
                    {helper.name || "Unknown User"}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      alignItems: "center",
                      color: "rgba(255,255,255,0.55)",
                      fontSize: 14,
                    }}
                  >
                    <Clock size={14} />
                    Available now
                  </div>
                </div>
              </div>

              {/* Location */}
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  marginTop: 14,
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 14,
                }}
              >
                <MapPin size={15} />
                {helper.location || "Not provided"}
              </div>

              {/* Send Request Button */}
              <button
                onClick={() => {
                  setSelectedHelper(helper);
                  // navigation happens from parent
                }}
                style={{
                  marginTop: 20,
                  width: "100%",
                  padding: "12px 0",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 600,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  transition: "0.25s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "rgba(255,255,255,0.12)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    "rgba(255,255,255,0.06)")
                }
              >
                <Send size={16} /> Send Request
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
