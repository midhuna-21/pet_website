"use client"
import { useState, useEffect } from 'react';
import { MapPin, Clock, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "./Header";
import Loading from './Loading';

export default function AvailableHelpersPage({
  availableHelpers = [],
  setSelectedHelper,
}) {
  const router = useRouter();

  return (
    <>
      <style>
        {`
    /*  MOBILE (max-width: 640px)  */
    @media (max-width: 640px) {

      .container {
        padding: 20px !important;
      }

      .helpers-title {
        font-size: 26px !important;
      }

      .helpers-subtext {
        font-size: 13px !important;
        margin-bottom: 20px !important;
        margin-top: 4px !important;
      }

      .helper-card {
        padding: 14px !important;
        border-radius: 14px !important;
      }

      .helper-name {
        font-size: 15px !important;
      }

      .send-btn {
        padding: 6px 8px !important;
        font-size: 12px !important;
        border-radius: 8px !important;
      }

      .available-text {
        font-size: 11px !important;
      }

      .available-clock {
        width: 10px !important;
        height: 10px !important;
      }

      .grid-wrapper {
        grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)) !important;
        gap: 16px !important;
      }
    }
  `}
      </style>

      <div
        className="container"
        style={{
          minHeight: "100vh",
          background: "#000",
          color: "#fff",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >

        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            marginTop: "80px",
            marginBottom: "50px",
          }}
        >
          {/* Page Title */}
          <h1
            className="helpers-title"
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
            className="helpers-subtext"
            style={{
              color: "rgba(255,255,255,0.55)",
              marginBottom: 30,
            }}
          >
            These kind folks near you are currently active and ready to help ❤️
          </p>

          {/* No Helpers */}
          {(!Array.isArray(availableHelpers) ||
            availableHelpers.length === 0) && (
              <p style={{ marginTop: 20, color: "rgba(255,255,255,0.45)" }}>
                No helpers available at the moment.
              </p>
            )}

          {/* Helpers Grid */}
          <div
            className="grid-wrapper"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 28,
            }}
          >
            {availableHelpers.map((helper) => (
              <div
                key={helper.id}
                className="helper-card"
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
                {/* Top Row */}
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
                      className="helper-name"
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        marginBottom: 2,
                      }}
                    >
                      {helper.name || "Unknown User"}
                    </div>

                    <div
                      className="available-text"
                      style={{
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                        color: "rgba(255,255,255,0.55)",
                        fontSize: 14,
                      }}
                    >
                      <Clock className="available-clock" size={14} />
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

                {/* Button */}
                <button
                  className="send-btn"
                  onClick={() => {
                    setSelectedHelper(helper);
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
    </>
  );
}
