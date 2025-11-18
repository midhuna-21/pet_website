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
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <div
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

        <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: 20 }}>
          Provide details about the stray needing help ❤️
        </p>

        {/* INPUT FIELDS */}
        <label style={labelStyle}>Stray Name</label>
        <input
          value={form.strayName}
          onChange={(e) => setForm({ ...form, strayName: e.target.value })}
          placeholder="Enter stray name"
          style={inputStyle}
        />

        <label style={{ ...labelStyle, marginTop: 16 }}>Location</label>
        <input
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder="Enter location"
          style={inputStyle}
        />

        {/* PHOTO UPLOAD */}
        <label style={{ ...labelStyle, marginTop: 16 }}>Photo</label>

        {!preview ? (
          <label style={uploadBoxStyle}>
            <Upload size={30} color="#d8c48d" />
            <p style={{ marginTop: 8, color: "#d8c48d", fontSize: 14 }}>
              Upload Photo
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>
        ) : (
          <div style={{ position: "relative", marginTop: 10 }}>
            <img
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
        <button
          onClick={handleSubmit}
          disabled={uploading}
          style={submitButtonStyle}
        >
          {uploading ? "Sending..." : "Send Request"}
        </button>

        <button onClick={onClose} style={cancelButtonStyle}>
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ---------- STYLES (NO TS ERRORS) ---------- */

const labelStyle = {
  color: "rgba(255,255,255,0.65)",
  fontSize: 14,
  fontWeight: 500,
} as React.CSSProperties;

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 12,
  backgroundColor: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff",
  fontSize: 15,
  outline: "none",
  marginTop: 6,
} as React.CSSProperties;

const uploadBoxStyle = {
  border: "1px dashed rgba(255,255,255,0.2)",
  backgroundColor: "rgba(255,255,255,0.05)",
  padding: "24px 20px",
  borderRadius: 14,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  marginTop: 6,
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
  padding: 14,
  marginTop: 28,
  background: "linear-gradient(90deg,#b89c58,#d8c48d)",
  borderRadius: 12,
  border: "none",
  cursor: "pointer",
  color: "#000",
  fontWeight: 700,
  fontSize: 16,
  boxShadow: "0 8px 25px rgba(216,196,141,0.25)",
} as React.CSSProperties;

const cancelButtonStyle = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  backgroundColor: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.1)",
  marginTop: 10,
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
} as React.CSSProperties;
