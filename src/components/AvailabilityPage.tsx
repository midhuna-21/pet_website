"use client";

import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateAvailability } from "../hooks/firestoreaction";

export default function AvailabilityPage({
  setCurrentPage,
  userAvailability,
  setUserAvailability,
  requests,
}) {
  const router = useRouter();

  // ✅ SAFE INITIAL EMPTY STATE (fixes undefined reading)
  const [formData, setFormData] = useState({
    location: "",
    radius: "",
  });

  // ✅ UPDATE WHEN userAvailability BECOMES AVAILABLE
  useEffect(() => {
    if (userAvailability) {
      setFormData({
        location: userAvailability.location || "",
        radius: userAvailability.radius || "",
      });
    }
  }, [userAvailability]);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // GO ONLINE
  const handleGoOnline = async () => {
    if (!formData.location || !formData.radius) {
      alert("Please enter location and radius");
      return;
    }

    setSaving(true);

    await updateAvailability({
      isAvailable: true,
      location: formData.location,
      radius: formData.radius,
    });

    setUserAvailability({
      isAvailable: true,
      location: formData.location,
      radius: formData.radius,
    });

    setSaving(false);
    setShowForm(false);
  };

  // GO OFFLINE
  const handleGoOffline = async () => {
    setSaving(true);

    await updateAvailability({
      isAvailable: false,
      location: userAvailability.location,
      radius: userAvailability.radius,
    });

    setUserAvailability({
      ...userAvailability,
      isAvailable: false,
    });

    setSaving(false);
  };

  const pendingCount =
    requests?.filter((r) => r.status === "pending")?.length || 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: "40px 20px",
        marginTop: "80px",
        marginBottom: "50px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* PAGE TITLE */}
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontFamily: "Playfair Display",
              fontSize: 42,
              fontWeight: 700,
              margin: 0,
            }}
          >
            Availability
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              marginTop: 10,
              maxWidth: 600,
              lineHeight: 1.6,
            }}
          >
            Set your availability so nearby people can request your help for
            stray animals.
          </p>
        </div>

        {/* CARD */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
          }}
        >
          {/* STATUS ROW */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: userAvailability.isAvailable
                    ? "#d8c48d"
                    : "#64748b",
                }}
              ></div>
              <div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: userAvailability.isAvailable
                      ? "#d8c48d"
                      : "rgba(255,255,255,0.6)",
                  }}
                >
                  {userAvailability.isAvailable ? "You Are Online" : "You Are Offline"}
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.35)",
                    marginTop: 4,
                  }}
                >
                  {userAvailability.isAvailable
                    ? `${userAvailability.location} • ${userAvailability.radius}`
                    : "Go online to appear for helpers near you"}
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            {userAvailability.isAvailable ? (
              <button
                onClick={handleGoOffline}
                disabled={saving}
                style={{
                  padding: "10px 18px",
                  background: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                {saving ? "Saving..." : "Go Offline"}
              </button>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                style={{
                  padding: "10px 18px",
                  background: "linear-gradient(135deg,#b89c58,#d8c48d)",
                  color: "#000",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Go Online
              </button>
            )}
          </div>

          {/* ONLINE FORM */}
          {showForm && !userAvailability.isAvailable && (
            <div
              style={{
                // padding: 20,
                borderRadius: 12,
                marginBottom: 20,
                marginTop: 10,
              }}
            >
              <label style={{ fontSize: 14 }}>Location</label>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  marginTop: 6,
                }}
              >
                {/* <MapPin size={16} color="#d8c48d" /> */}
                <input
                  type="text"
                  placeholder="Enter your location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                  }}
                />
              </div>

              <label style={{ marginTop: 16, display: "block", fontSize: 14 }}>
                Radius
              </label>

              <select
                value={formData.radius}
                onChange={(e) =>
                  setFormData({ ...formData, radius: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.08)",   // DARK BACKGROUND
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  marginTop: 6,
                  appearance: "none",
                  cursor: "pointer",
                }}
              >
                <option value="2km" style={{ background: "#000" }}>2 km</option>
                <option value="5km" style={{ background: "#000" }}>5 km</option>
                <option value="10km" style={{ background: "#000" }}>10 km</option>
                <option value="15km" style={{ background: "#000" }}>15 km</option>
              </select>

              {/* BUTTONS */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginTop: 20,
                }}
              >
                {/* Cancel */}
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: 14,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#fff",
                    borderRadius: 10,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                {/* Confirm */}
                <button
                  onClick={handleGoOnline}
                  disabled={saving}
                  style={{
                    padding: 14,
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                    borderRadius: 10,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {saving ? "Saving..." : "Confirm"}
                </button>
              </div>
            </div>
          )}


        </div>
        {/* ACTION BUTTONS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginTop: 12,
          }}
        >
          <button
            onClick={() => router.push("/available-helpers")}
            style={{
              padding: 14,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff",
              borderRadius: 12,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Find Helpers
          </button>

          <button
            onClick={() => router.push("/requests")}
            style={{
              padding: 14,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff",
              borderRadius: 12,
              fontWeight: 600,
              cursor: 'pointer',
              position: "relative",
            }}
          >
            My Requests
            {pendingCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  background: "#ef4444",
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  border: "2px solid #000",
                }}
              >
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
