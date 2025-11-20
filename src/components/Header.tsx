"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import LoginWidget from "./LoginWidget";
import useAuthGuard from "../hooks/useAuthGuard";
import AuthModal from "./AuthModal";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { showAuthModal, setShowAuthModal, user } = useAuthGuard();

  const handleSelectLocation = () => {
    console.log("selected");
  };

  return (
    <header
      style={{
        width: "100%",
        position: "fixed",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(4px)",
        background: "rgba(0,0,0,0.45)",
      }}
    >
      {/* AUTH MODAL */}
      {showAuthModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowAuthModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <AuthModal
              open={showAuthModal}
              onClose={() => setShowAuthModal(false)}
              onSelect={handleSelectLocation}
            />
          </div>
        </div>
      )}

      {/* HEADER CONTENT */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 15px",
        }}
      >
     <a
  href="/"
  className="logo-text"
  style={{
    fontFamily: "Playfair Display",
    fontSize: "20px",
    fontWeight: 700,
    background:
      "linear-gradient(180deg, var(--gold-light), var(--gold-dark))",
    WebkitTextFillColor: "transparent",
    WebkitBackgroundClip: "text",
    letterSpacing: "0.2px",
    textDecoration: "none",
  }}
>
  StrayPals
</a>



        {/* DESKTOP NAV */}
        <nav
          className="desktop-nav"
          style={{
            display: "none",
            alignItems: "center",
            gap: "28px",
          }}
        >
          <HeaderLink href="/" user={user} setShowAuthModal={setShowAuthModal}>
            Home
          </HeaderLink>
          <HeaderLink href="/report" user={user} setShowAuthModal={setShowAuthModal}>
            Report
          </HeaderLink>
          <HeaderLink href="/strays" user={user} setShowAuthModal={setShowAuthModal}>
            Strays
          </HeaderLink>
          <HeaderLink href="/community" user={user} setShowAuthModal={setShowAuthModal}>
            Community
          </HeaderLink>
          <HeaderLink href="/tasks" user={user} setShowAuthModal={setShowAuthModal}>
            Tasks
          </HeaderLink>
          {/* <HeaderLink href="/stations" user={user} setShowAuthModal={setShowAuthModal}>
            Stations
          </HeaderLink> */}
          <HeaderLink
            href="/pass-the-bowl"
            user={user}
            setShowAuthModal={setShowAuthModal}
          >
            Pass the Bowl
          </HeaderLink>
          <HeaderLink
            href="/dashboard"
            user={user}
            setShowAuthModal={setShowAuthModal}
          >
            Dashboard
          </HeaderLink>
          <LoginWidget />
        </nav>

        {/* MOBILE MENU BUTTON */}
        <div
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
          className="mobile-only"
        >
          {mobileMenuOpen ? (
            <X size={26} color="var(--gold-light)" />
          ) : (
            <Menu size={26} color="var(--gold-light)" />
          )}
        </div>
      </div>

      {/* FULL-SCREEN MOBILE MENU WITH BLUR */}
      {mobileMenuOpen && (
        <div
          style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            background: "rgba(0, 0, 0, 0)",
            zIndex: 999,
            pointerEvents: "none",
          }}
        >

          <div className={`mobile-sidebar ${mobileMenuOpen ? "open" : ""}`}>
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            <MobileHeaderLink href="/">Home</MobileHeaderLink>
            <MobileHeaderLink href="/report">Report</MobileHeaderLink>
            <MobileHeaderLink href="/strays">Strays</MobileHeaderLink>
            <MobileHeaderLink href="/community">Community</MobileHeaderLink>
            <MobileHeaderLink href="/tasks">Tasks</MobileHeaderLink>
            {/* <MobileHeaderLink href="/stations">Stations</MobileHeaderLink> */}
            <MobileHeaderLink href="/pass-the-bowl">Pass the Bowl</MobileHeaderLink>
            <MobileHeaderLink href="/dashboard">Dashboard</MobileHeaderLink>
          </div>
        </div>
      )}



    </header>
  );
}

/* DESKTOP LINK */
function HeaderLink({ href, children, user, setShowAuthModal }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        if (!user && href !== "/") {
          e.preventDefault();
          setShowAuthModal(true);
        }
      }}
      style={{
        fontSize: "13px",
        color: "rgba(255,255,255,0.85)",
        textDecoration: "none",
        transition: "0.3s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-light)")}
      onMouseLeave={(e) =>
        (e.currentTarget.style.color = "rgba(255,255,255,0.85)")
      }
    >
      {children}
    </a>
  );
}

/* MOBILE LINK */
function MobileHeaderLink({ href, children }) {
  return (
    <a
      href={href}
      style={{
        padding: "9px 0",
        fontSize: "12px",
        color: "#ffffff",
        textDecoration: "none",
        transition: "0.3s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-light)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}
    >
      {children}
    </a>
  );
}
