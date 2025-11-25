"use client";

import {
  ArrowLeft,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "./Header";

export default function RequestsPage({ requests, handleRequestAction }) {
  const router = useRouter();

  return (
    <div
      className="requests-container"
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div
        className="requests-wrapper"
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          marginTop: "80px",
          marginBottom: "50px",
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontFamily: "Playfair Display",
            fontSize: 40,
            marginBottom: 10,
            fontWeight: 700,
          }}
        >
          Help Requests
        </h1>

        <p
          className="subtitle"
          style={{
            color: "rgba(255,255,255,0.55)",
            marginBottom: 30,
            maxWidth: 600,
            lineHeight: 1.6,
          }}
        >
          People nearby have reached out for help with stray animals.
        </p>

        {/* No Requests */}
        {requests.length === 0 && (
          <div
            className="empty-box"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 60,
              marginBottom: 40,
              textAlign: "center",
            }}
          >
            <AlertCircle
              className="empty-icon"
              size={56}
              style={{ opacity: 0.35, marginBottom: 12 }}
            />

            <p
              className="empty-text"
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: 20,
                fontWeight: 500,
              }}
            >
              No requests yet.
            </p>
          </div>
        )}

        {/* Request Cards */}
        {requests.map((req) => (
          <div
            key={req.id}
            className="request-card"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 18,
              padding: 24,
              marginBottom: 24,
              boxShadow: "0 12px 30px rgba(0,0,0,0.55)",
              transition: "0.3s",
            }}
          >
            {/* Name */}
            <h2
              style={{
                fontSize: 26,
                fontFamily: "Playfair Display",
                marginBottom: 8,
                fontWeight: 700,
              }}
            >
              {req.strayName || "Stray Request"}
            </h2>

            {/* Location */}
            <div
              className="location-row"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 14,
                color: "rgba(255,255,255,0.75)",
                fontSize: 16,
              }}
            >
              <MapPin size={16} color="var(--gold-light)" />
              {req.location}
            </div>

            {/* Description */}
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                marginBottom: 16,
                lineHeight: 1.6,
                fontSize: 15,
              }}
            >
              {req.description}
            </p>

            {/* Photo */}
            {req.photo && (
              <img
                className="request-photo"
                src={req.photo}
                style={{
                  width: "100%",
                  borderRadius: 12,
                  maxHeight: 260,
                  objectFit: "cover",
                  marginBottom: 16,
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
            )}

            {/* ACTION BUTTONS */}
            {req.status === "pending" ? (
              <div style={{ display: "flex", gap: 14, marginTop: 12 }}>
                {/* Accept */}
                <button
                  className="action-btn"
                  onClick={() => handleRequestAction(req.id, "accepted")}
                  style={{
                    flex: 1,
                    padding: "12px 0",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.09)",
                    color: "#fff",
                    fontWeight: 600,
                    display: "flex",
                    justifyContent: "center",
                    gap: 8,
                    cursor: "pointer",
                    transition: "0.25s",
                  }}
                >
                  <CheckCircle size={18} />
                  Accept
                </button>

                {/* Decline */}
                <button
                  className="action-btn"
                  onClick={() => handleRequestAction(req.id, "declined")}
                  style={{
                    flex: 1,
                    padding: "12px 0",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.05)",
                    color: "#fff",
                    fontWeight: 600,
                    display: "flex",
                    justifyContent: "center",
                    gap: 8,
                    cursor: "pointer",
                    transition: "0.25s",
                  }}
                >
                  <XCircle size={18} />
                  Decline
                </button>
              </div>
            ) : (
              <div
                className="status-badge"
                style={{
                  marginTop: 10,
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  fontWeight: 600,
                  width: "fit-content",
                  fontSize: 15,
                }}
              >
                Status: {req.status}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MOBILE RESPONSIVE CSS */}
      <style jsx>{`
        @media (max-width: 599px) {
          .requests-container {
            padding-left: 14px !important;
            padding-right: 14px !important;
            padding-top: 20px !important;
          }

          h1 {
            font-size: 26px !important;
            margin-bottom: 6px !important;
          }

          p,
          div,
          span {
            font-size: 13px !important;
            margin-bottom: 6px !important;
            line-height: 1.35 !important;
          }

          .subtitle {
            margin-bottom: 12px !important;
            line-height: 1.3 !important;
          }

          .empty-box {
            margin-top: 30px !important;
            margin-bottom: 20px !important;
          }

          .empty-box svg {
            width: 36px !important;
            height: 36px !important;
            margin-bottom: 2px !important;
          }

          .empty-text {
            font-size: 15px !important;
            margin-top: 4px !important;
          }

          .request-card {
            padding: 14px !important;
            border-radius: 14px !important;
            margin-bottom: 14px !important;
          }

          .request-card h2 {
            font-size: 18px !important;
            margin-bottom: 4px !important;
          }

          .location-row {
            font-size: 13px !important;
            gap: 4px !important;
            margin-bottom: 8px !important;
          }

          .location-row svg {
            width: 14px !important;
            height: 14px !important;
          }

          .request-photo {
            max-height: 150px !important;
            margin-bottom: 10px !important;
          }

          .action-btn {
            padding: 8px 0 !important;
            border-radius: 8px !important;
            font-size: 13px !important;
            gap: 6px !important;
          }

          .action-btn svg {
            width: 14px !important;
            height: 14px !important;
          }

          .status-badge {
            font-size: 12px !important;
            padding: 8px 10px !important;
            border-radius: 8px !important;
          }
        }
      `}</style>
    </div>
  );
}
