"use client";

import { useState } from "react";
import { uploadImage, addHelpRequest } from "../hooks/firestoreaction";
import { auth } from "../lib/firebase";
import { X, Upload } from "lucide-react";

export default function SendRequestModal({ helper, onClose }) {
  const [form, setForm] = useState({
    strayName: "",
    location: "",
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!form.strayName || !form.location) {
      alert("Please fill all fields");
      return;
    }

    setUploading(true);

    let photoURL = null;
    if (photo) photoURL = await uploadImage(photo, "requests");

    await addHelpRequest({
      senderId: auth.currentUser?.uid,
      receiverId: helper.id,
      strayName: form.strayName,
      location: form.location,
      photo: photoURL,
      status: "pending",
    });

    setUploading(false);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(0,0,0,0.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 3000,
        animation: "fadeIn 0.3s ease",
        padding: "10px",
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* ---------- TABLET (max-width: 1024px) ---------- */
          @media (max-width: 1024px) {
            .modal-container {
              padding: 24px !important;
            }

            .modal-title {
              font-size: 24px !important;
            }

            .modal-subtext {
              font-size: 13px !important;
            }

            .modal-input {
              padding: 10px 14px !important;
              font-size: 14px !important;
            }

            .upload-box {
              padding: 20px !important;
            }

            .submit-btn,
            .cancel-btn {
              padding: 12px !important;
              font-size: 15px !important;
            }
          }

          /* ---------- MOBILE (max-width: 640px) ---------- */
          @media (max-width: 640px) {
            .modal-container {
              padding: 16px !important;
            }

            .modal-title {
              font-size: 20px !important;
            }

            .modal-subtext {
              font-size: 12px !important;
            }

            .modal-input {
              padding: 8px 12px !important;
              font-size: 13px !important;
            }

            .upload-box {
              padding: 16px !important;
            }

            .submit-btn,
            .cancel-btn {
              padding: 10px !important;
              font-size: 13px !important;
            }

            img.preview-img {
              width: 180px !important;
              height: 130px !important;
            }
          }
        `}
      </style>

      <div
        className="modal-container"
        style={{
          width: "100%",
          maxWidth: 520,
          backgroundColor: "rgba(20,20,20,0.65)",
          borderRadius: 18,
          padding: 32,
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 25px 70px rgba(0,0,0,0.65)",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <h2
            className="modal-title"
            style={{
              margin: 0,
              color: "#fff",
              fontSize: "28px",
              fontFamily: "Playfair Display",
              fontWeight: 700,
            }}
          >
            Request Help from {helper.name}
          </h2>

          <button
            onClick={onClose}
            style={{
              backgroundColor: "rgba(255,255,255,0.12)",
              border: "none",
              borderRadius: "50%",
              padding: 6,
              cursor: "pointer",
            }}
          >
            <X size={18} color="#fff" />
          </button>
        </div>

        <p className="modal-subtext" style={{ color: "rgba(255,255,255,0.55)", marginBottom: 20 }}>
          Provide details about the stray needing help ❤️
        </p>

        {/* INPUT FIELDS */}
        <label style={labelStyle}>Stray Name</label>
        <input
          className="modal-input"
          value={form.strayName}
          onChange={(e) => setForm({ ...form, strayName: e.target.value })}
          placeholder="Enter stray name"
          style={inputStyle}
        />

        <label style={{ ...labelStyle, marginTop: 16 }}>Location</label>
        <input
          className="modal-input"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder="Enter location"
          style={inputStyle}
        />

        {/* PHOTO UPLOAD */}
        <label style={{ ...labelStyle, marginTop: 16 }}>Photo</label>

        {!preview ? (
          <label className="upload-box" style={uploadBoxStyle}>
            <Upload size={30} color="#d8c48d" />
            <p style={{ marginTop: 8, color: "#d8c48d", fontSize: 14 }}>Upload Photo</p>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
          </label>
        ) : (
          <div style={{ position: "relative", marginTop: 10 }}>
            <img
              className="preview-img"
              src={preview}
              style={{
                width: 220,
                height: 160,
                objectFit: "cover",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            />
            <button
              onClick={() => {
                setPhoto(null);
                setPreview(null);
              }}
              style={removeBtnStyle}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* BUTTONS */}
        <button className="submit-btn" onClick={handleSubmit} disabled={uploading} style={submitButtonStyle}>
          {uploading ? "Sending..." : "Send Request"}
        </button>

        <button className="cancel-btn" onClick={onClose} style={cancelButtonStyle}>
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ---------- STYLES (unchanged) ---------- */

const labelStyle = {
  color: "rgba(255,255,255,0.65)",
  fontSize: 14,
  fontWeight: 500,
} as React.CSSProperties;

const inputStyle = {
  width: "100%",
  padding: "14px 20px",   // MATCH Upload box padding
  borderRadius: 14,       // MATCH Upload box radius
  backgroundColor: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff",
  fontSize: 15,
  outline: "none",
  marginTop: 6,
  boxSizing: "border-box",
} as React.CSSProperties;

const uploadBoxStyle = {
 border: "1px dashed rgba(255,255,255,0.2)",
  backgroundColor: "rgba(255,255,255,0.05)",
  padding: "14px 20px",   // MATCH INPUT padding
  borderRadius: 14,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  marginTop: 6,
  width: "100%",
  boxSizing: "border-box",
} as React.CSSProperties;

const removeBtnStyle = {
  position: "absolute",
  top: 8,
  right: 8,
  backgroundColor: "rgba(0,0,0,0.5)",
  color: "#fff",
  border: "none",
  padding: 6,
  borderRadius: "50%",
  cursor: "pointer",
} as React.CSSProperties;

const submitButtonStyle = {
 width: "100%",
  padding: "14px 20px",   // MATCH ALL
  borderRadius: 14,
  marginTop: 24,
  background: "linear-gradient(90deg,#b89c58,#d8c48d)",
  border: "none",
  cursor: "pointer",
  color: "#000",
  fontWeight: 700,
  fontSize: 16,
  boxSizing: "border-box",
} as React.CSSProperties;

const cancelButtonStyle = {
 width: "100%",
  padding: "14px 20px",
  borderRadius: 14,
  backgroundColor: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.1)",
  marginTop: 10,
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
  boxSizing: "border-box",
} as React.CSSProperties;
