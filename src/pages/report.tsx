"use client";

import { Camera, MapPin, Heart, Upload, X } from "lucide-react";
import { useState } from "react";

export default function ReportPage() {
  const [image, setImage] = useState(null);
  const [petName, setPetName] = useState("");
  const [location, setLocation] = useState("");
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
        },
        (error) => {
          alert("Unable to get location. Please enter manually.");
        }
      );
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      // background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      padding: "40px 20px",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    }}>
      {/* Background pattern */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.03,
        backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: "700px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Header Section */}
        <div style={{
          textAlign: "center",
          marginBottom: "48px",
        }}>
          <div style={{
            display: "inline-block",
            padding: "10px 20px",
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "30px",
            marginBottom: "20px",
          }}>
            <span style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#10b981",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}>
              🐾 Help a Friend in Need
            </span>
          </div>

          <h1 style={{
            margin: "0 0 16px 0",
            fontSize: "42px",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.5px",
            lineHeight: "1.2",
          }}>
            You're about to change a life
          </h1>

          <p style={{
            margin: 0,
            fontSize: "18px",
            color: "#94a3b8",
            lineHeight: "1.6",
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
          }}>
            Every stray you report brings them one step closer to safety, care, and love. 
            Thank you for being their voice.
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          background: "rgba(30, 41, 59, 0.6)",
          border: "1px solid rgba(51, 65, 85, 0.6)",
          borderRadius: "20px",
          padding: "40px",
          backdropFilter: "blur(10px)",
        }}>
          {/* Pet Name Field */}
          <div style={{ marginBottom: "32px" }}>
            <label style={{
              display: "block",
              marginBottom: "12px",
              fontSize: "15px",
              fontWeight: 600,
              color: "#f1f5f9",
              // display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <Heart size={18} style={{ color: "#f59e0b" }} />
              Give them a name (or a nickname!)
            </label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="e.g., Fluffy, Buddy, Spot..."
              style={{
                width: "100%",
                padding: "14px 18px",
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(71, 85, 105, 0.5)",
                borderRadius: "12px",
                fontSize: "16px",
                color: "#ffffff",
                outline: "none",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => {
                e.target.style.border = "1px solid #10b981";
                e.target.style.background = "rgba(15, 23, 42, 0.8)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid rgba(71, 85, 105, 0.5)";
                e.target.style.background = "rgba(15, 23, 42, 0.6)";
              }}
            />
            <p style={{
              marginTop: "8px",
              fontSize: "13px",
              color: "#64748b",
              fontStyle: "italic",
            }}>
              A name makes them real, makes them matter
            </p>
          </div>

          {/* Photo Upload */}
          <div style={{ marginBottom: "32px" }}>
            <label style={{
              display: "block",
              marginBottom: "12px",
              fontSize: "15px",
              fontWeight: 600,
              color: "#f1f5f9",
              // display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <Camera size={18} style={{ color: "#3b82f6" }} />
              Share a photo of your new friend
            </label>

            {!image ? (
              <label style={{
                display: "block",
                padding: "48px 24px",
                background: "rgba(15, 23, 42, 0.6)",
                border: "2px dashed rgba(71, 85, 105, 0.5)",
                borderRadius: "12px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = "2px dashed #10b981";
                e.currentTarget.style.background = "rgba(16, 185, 129, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = "2px dashed rgba(71, 85, 105, 0.5)";
                e.currentTarget.style.background = "rgba(15, 23, 42, 0.6)";
              }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                <Upload size={40} style={{ color: "#64748b", marginBottom: "12px" }} />
                <p style={{ margin: 0, fontSize: "16px", color: "#cbd5e1", marginBottom: "4px" }}>
                  Click to upload or drag and drop
                </p>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                  A picture speaks a thousand words
                </p>
              </label>
            ) : (
              <div style={{
                position: "relative",
                borderRadius: "12px",
                overflow: "hidden",
              }}>
                <img
                  src={image}
                  alt="Uploaded pet"
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <button
                  onClick={removeImage}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "rgba(239, 68, 68, 0.9)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#dc2626";
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.9)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <X size={18} style={{ color: "#ffffff" }} />
                </button>
              </div>
            )}
          </div>

          {/* Location Field */}
          <div style={{ marginBottom: "40px" }}>
            <label style={{
              display: "block",
              marginBottom: "12px",
              fontSize: "15px",
              fontWeight: 600,
              color: "#f1f5f9",
              // display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <MapPin size={18} style={{ color: "#10b981" }} />
              Where did you meet them?
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter address or coordinates..."
                style={{
                  flex: 1,
                  padding: "14px 18px",
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(71, 85, 105, 0.5)",
                  borderRadius: "12px",
                  fontSize: "16px",
                  color: "#ffffff",
                  outline: "none",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.border = "1px solid #10b981";
                  e.target.style.background = "rgba(15, 23, 42, 0.8)";
                }}
                onBlur={(e) => {
                  e.target.style.border = "1px solid rgba(71, 85, 105, 0.5)";
                  e.target.style.background = "rgba(15, 23, 42, 0.6)";
                }}
              />
              <button
                onClick={getCurrentLocation}
                style={{
                  padding: "14px 20px",
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "12px",
                  color: "#10b981",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(16, 185, 129, 0.25)";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(16, 185, 129, 0.15)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Use My Location
              </button>
            </div>
            <p style={{
              marginTop: "8px",
              fontSize: "13px",
              color: "#64748b",
              fontStyle: "italic",
            }}>
              This helps us coordinate care and find them again
            </p>
          </div>

          {/* Submit Button */}
          <button
            style={{
              width: "100%",
              padding: "16px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              border: "none",
              borderRadius: "12px",
              color: "#ffffff",
              fontSize: "17px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 20px rgba(16, 185, 129, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(16, 185, 129, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(16, 185, 129, 0.3)";
            }}
          >
            🐾 Help This Stray Find Care
          </button>

          {/* Encouraging Message */}
          <div style={{
            marginTop: "24px",
            padding: "20px",
            background: "rgba(16, 185, 129, 0.08)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            borderRadius: "12px",
            textAlign: "center",
          }}>
            <p style={{
              margin: 0,
              fontSize: "14px",
              color: "#cbd5e1",
              lineHeight: "1.6",
            }}>
              💚 Your kindness matters. By reporting this stray, you're connecting them with 
              local volunteers who can provide food, medical care, and maybe even a forever home.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}