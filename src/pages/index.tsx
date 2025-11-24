/* Updated responsive tweaks applied: reduced text size on smaller screens, reduced margin/padding, decreased overall hero section height. Only responsive additions added — original design untouched. */

"use client";

import Link from "next/link";
import { MapPin, Camera, Heart } from "lucide-react";
import { useState } from "react";
import Header from "../components/Header";
import HowItWorks from "../components/HowItWorks";

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const steps = [
    {
      icon: Camera,
      number: "01",
      title: "Spot a stray",
      description:
        "Take a picture or note the location. Use Report to upload and name them.",
      link: "/report",
      linkText: "Report a Stray",
      color: "#10b981",
    },
    {
      icon: MapPin,
      number: "02",
      title: "Mark the location",
      description:
        "Use your phone's GPS or drop a pin to mark where they were last seen.",
      color: "#3b82f6",
    },
    {
      icon: Heart,
      number: "03",
      title: "We coordinate care",
      description:
        "Volunteers & NGOs handle feeding, vaccinations, and medical care.",
      color: "#f59e0b",
    },
  ];

  return (
    <main>


      <div
        style={{
          backgroundImage: 'url("/images/hero-section.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
          margin: "0 auto",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {/* ---------------- HERO SECTION ---------------- */}
        <section
          className="satin-bg hero-section"
          style={{
            width: "100vw",
            marginLeft: "calc(50% - 50vw)",
            padding: "140px 0 190px 0",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              padding: "0 20px",
              flexWrap: "wrap",
            }}
          >
            {/* LEFT — TEXT */}
            <div
              style={{
                flex: "0 0 45%",
                minWidth: "320px",
                color: "white",
              }}
            >
              <h1
                className="hero-title"
                style={{
                  fontSize: "54px",
                  lineHeight: "1",
                  fontFamily: "Playfair Display",
                  fontWeight: 700,
                }}
              >

                Hey… saw a stray{" "}
                <span
                  className="hero-title-italic"
                  style={{
                    fontFamily: "Cormorant Italic",
                    color: "var(--gold-light)",
                    fontSize: "60px",
                    fontWeight: 600,
                    display: "block",
                    marginTop: "5px",
                  }}
                >
                  today?
                </span>
              </h1>

              <p
                className="hero-text"
                style={{
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: "1.3",
                  // maxWidth: "520px",
                  marginBottom: "17px",
                }}
              >
                Join thousands of animal lovers making a difference — one bowl at a
                time. Report local strays, find feeding stations, and coordinate
                care with your community.
              </p>

              <div
                className="button-wrapper"
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "nowrap",
                  alignItems: "center",
                }}
              >
                <a
                  href="/report"
                  className="hero-btn primary-btn stray-btn"
                  style={{
                    padding: "14px 36px",
                    background: "#1a1a1a",
                    color: "#e8d4b0",
                    fontFamily: "Playfair Display",
                    fontSize: "16px",
                    fontWeight: "600",
                    textDecoration: "none",
                    border: "1px solid #d4a574",
                    minWidth: "170px",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                  }}
                >
                  Report a Stray
                </a>

                <a
                  href="/stations"
                  className="hero-btn secondary-btn stray-btn"
                  style={{
                    padding: "14px 36px",
                    border: "2px solid #d4a574",
                    background: "transparent",
                    color: "#e8d4b0",
                    fontFamily: "Playfair Display",
                    fontSize: "16px",
                    fontWeight: "600",
                    textDecoration: "none",
                    minWidth: "170px",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                  }}
                >
                  Feeding Stations Near you
                </a>
              </div>
            </div>

            {/* RIGHT — IMAGE */}
            <div
              style={{
                flex: "0 0 45%",
                minWidth: "300px",
                position: "relative",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src="/images/hero-image.png"
                alt="Dog and human connection"
                className="dog-hero-img"
                style={{
                  width: "90%",
                  position: "relative",
                  zIndex: 2,
                }}
              />
            </div>
          </div>
        </section>

      </div>

      {/* ---------------- HOW IT WORKS SECTION ---------------- */}
      <HowItWorks />
    </main>
  );
}
