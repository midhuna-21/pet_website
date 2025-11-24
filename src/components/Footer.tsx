export default function Footer() {
  return (
    <footer
      style={{
        background: "#000",
        color: "#ccc",
        padding: "18px 10px",
        borderTop: "1px solid #222",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <span style={{ fontSize: "14px" }}>
        StrayPals — Helping hands for every stray in need.
      </span>

      <span style={{ fontSize: "14px" }}>
        © {new Date().getFullYear()} StrayPals. All rights reserved.
      </span>
    </footer>
  );
}
