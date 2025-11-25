"use client";

import { useEffect, useState } from "react";
import { MapPin, Clock } from "lucide-react";
import { db } from "../../lib/firebase";
import { collection, getDocs, doc, getDoc, orderBy, query } from "firebase/firestore";
import AuthModal from "../../components/AuthModal";
import Loading from "../../components/Loading";

interface Pet {
    id: string;
    name?: string;
    location?: string;
    photoURL?: string;
    createdAt?: { seconds: number };
    userId?: string;
    reporterName?: string;

    coordinates?: {
        lat: number;
        lng: number;
    };
}


export default function SpottedPage() {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [reports, setReports] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);

    const handleSelectLocation = (place: any) => {
        console.log("User selected location:", place);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(reports.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = reports.slice(startIndex, startIndex + itemsPerPage);


    useEffect(() => {
        const fetchReports = async () => {
            try {
                const q = query(collection(db, "pets"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);

                const petsData: Pet[] = await Promise.all(
                    snapshot.docs.map(async (docSnap) => {
                        const petData = { id: docSnap.id, ...docSnap.data() } as Pet;
                        let reporterName = "";

                        if (petData.userId) {
                            try {
                                const userDoc = await getDoc(doc(db, "users", petData.userId));
                                if (userDoc.exists()) {
                                    const userData = userDoc.data();
                                    reporterName = userData.name || "Anonymous";
                                }
                            } catch (error) {
                                console.warn("Error fetching user:", error);
                            }
                        }

                        return { ...petData, reporterName };
                    })
                );

                setReports(petsData);
            } catch (error) {
                console.error("Error fetching reports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const getTimeAgo = (timestamp: any) => {
        if (!timestamp?.seconds) return "recently";
        const date = new Date(timestamp.seconds * 1000);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return "just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return "yesterday";
        if (diffInDays < 7) return `${diffInDays} days ago`;
        return date.toLocaleDateString();
    };


    const handleDirections = (lat?: number, lng?: number) => {
        if (!lat || !lng) return;

        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, "_blank");
    };



    return (
        <div
            style={{
                marginTop: "100px",
                marginBottom: "50px",
                minHeight: "100vh",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {showAuthModal && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.6)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                    onClick={() => setShowAuthModal(false)}
                >
                    <div onClick={(e) => e.stopPropagation()}>
                        <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} onSelect={handleSelectLocation} />
                    </div>
                </div>
            )}

            <style>
                {`
                /* GRID RESPONSIVENESS */
                @media (max-width: 1024px) {
                    .responsive-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                    .card { width: 100% !important; }
                }

                @media (max-width: 640px) {
                    .responsive-grid {
                        grid-template-columns: repeat(1, 1fr) !important;
                        gap: 18px !important;
                    }
                    .card { width: 100% !important; }
                    .card-img { height: 240px !important; }
                }

                /* ---------- YOUR REQUESTED CHANGES ---------- */

                /* MOBILE title even smaller */
                @media (max-width: 640px) {
                    .section-title {
                        font-size: 22px !important;
                         line-height: 1.1 !important;
                    }
                    .section-subtitle {
                           font-size:9px !important;
                           line-height: 1.2 !important;
                           margin-top: 5px !important;
                    }
                    .section-container {
                        margin-bottom: 30px !important;
                    }
                }
                `}
            </style>
<style jsx global>{`
  /* FIXED HEIGHT GRID WRAPPER FOR DESKTOP */
  .grid-wrapper {
    min-height: 560px; /* fits 2 rows of cards */
    display: flex;
    align-items: flex-start;
  }

  /* TABLET */
  @media (max-width: 1024px) {
    .grid-wrapper {
      min-height: auto; /* allow natural resizing */
    }
  }

  /* MOBILE */
  @media (max-width: 640px) {
    .grid-wrapper {
      min-height: auto;
    }
  }
`}</style>


            <div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                }}
            >

                {/* SECTION TITLE */}
                <div className="section-container" style={{ marginBottom: "40px", textAlign: "center" }}>
                    <h1
                        className="section-title"
                        style={{
                            fontSize: "52px",
                            color: "#fff",
                            fontFamily: "Playfair Display",
                            fontWeight: 700,
                            marginBottom: "10px",
                            marginTop: "10px",
                            lineHeight: "1.1",
                            letterSpacing: "-1px",
                        }}
                    >
                        Aww, Look Who We Ran Into!
                    </h1>

                    <p
                        className="section-subtitle"
                        style={{
                            fontSize: "18px",
                            color: "rgba(255,255,255,0.65)",
                            maxWidth: "580px",
                            margin: "0 auto",
                            lineHeight: "1.1",
                        }}
                    >
                        These sweet babies were seen around. Let’s make sure they’re okay.
                    </p>
                </div>


                {/* GRID */}
              <div className="grid-wrapper">
  <div
    className="responsive-grid"
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "24px",
      justifyItems: "center",
    }}
  >

                    {currentItems.map((item) => (
                        <div
                            key={item.id}
                            className="card"
                            style={{
                                width: "340px",
                                borderRadius: "22px",
                                overflow: "hidden",
                                background: "#000",
                                boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
                                transition: "0.35s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-6px)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                        >

                            <div
                                className="card-img"
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    height: "300px",
                                    overflow: "hidden",
                                }}
                            >
                                <img
                                    src={item.photoURL}
                                    alt={item.name}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        filter: "brightness(0.9)",
                                    }}
                                />

                                <div
                                    className="needs-you-badge"
                                    style={{
                                        position: "absolute",
                                        top: "16px",
                                        right: "16px",
                                        background: "linear-gradient(135deg,#b89c58 0%,#d8c48d 100%)",
                                        padding: "6px 18px",
                                        borderRadius: "16px",
                                        fontSize: "12px",
                                        fontWeight: 700,
                                        color: "#000",
                                    }}
                                >
                                    Needs You
                                </div>
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: "65%",
                                        background:
                                            "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.05))",
                                        padding: "20px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontSize: "24px",
                                            fontFamily: "Playfair Display",
                                            margin: 0,
                                            color: "#fff",
                                            marginBottom: "6px",
                                        }}
                                    >
                                        {item.name}
                                    </h3>

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "8px",
                                            alignItems: "center",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        <MapPin
                                            size={16}
                                            color="var(--gold-light)"
                                            className="mobile-location-icon"
                                        />
                                        <span
                                            className="mobile-location-text"
                                            style={{
                                                fontSize: "13px",
                                                color: "rgba(255,255,255,0.85)",
                                                maxWidth: "230px",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {item.location}
                                        </span>
                                    </div>


                                    <span
                                        className="mobile-reporter"
                                        style={{
                                            fontSize: "12px",
                                            color: "rgba(255,255,255,0.55)",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        Reported by {item.reporterName}
                                    </span>

                                    <div
                                        className="mobile-time"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            color: "rgba(255,255,255,0.65)",
                                            fontSize: "12px",
                                            marginBottom: "14px",
                                        }}
                                    >
                                        <Clock size={14} />
                                        <span>{getTimeAgo(item.createdAt)}</span>
                                    </div>


                                    <button
                                        className="mobile-directions-btn"
                                        onClick={() => handleDirections(item.coordinates?.lat, item.coordinates?.lng)}
                                        style={{
                                            padding: "10px 14px",
                                            background: "rgba(255,255,255,0.08)",
                                            border: "1px solid rgba(255,255,255,0.2)",
                                            color: "#fff",
                                            borderRadius: "8px",
                                            fontSize: "12px",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            backdropFilter: "blur(4px)",
                                            transition: "0.25s",
                                            width: "fit-content",
                                        }}
                                    >
                                        Get Directions →
                                    </button>


                                </div>
                            </div>
                        </div>
                    ))}

                </div>
                </div>
                {/* SHOW PAGINATION ONLY IF MORE THAN 1 PAGE */}
                {totalPages > 1 && (
                    <div
                        style={{
                            marginTop: "40px",
                            display: "flex",
                            justifyContent: "center",
                            gap: "10px",
                            alignItems: "center",
                        }}
                    >
                        {/* LEFT ARROW */}
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            style={{
                                padding: "8px 12px",
                                borderRadius: "8px",
                                background:
                                    currentPage === 1 ? "rgba(255,255,255,0.1)" : "var(--gold-light)",
                                color: currentPage === 1 ? "#666" : "#000",
                                border: "none",
                                fontSize: "16px",
                                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                transition: "0.25s",
                                fontWeight: 700,
                            }}
                        >
                            ◀
                        </button>

                        {/* PAGE NUMBERS */}
                        {[...Array(totalPages)].map((_, i) => {
                            const page = i + 1;
                            const active = page === currentPage;

                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    style={{
                                        padding: "8px 12px",
                                        borderRadius: "8px",
                                        border: active
                                            ? "2px solid var(--gold-light)"
                                            : "1px solid rgba(255,255,255,0.25)",
                                        background: active ? "rgba(184,156,88,0.12)" : "transparent",
                                        color: "#fff",
                                        fontWeight: active ? 700 : 500,
                                        cursor: "pointer",
                                    }}
                                >
                                    {page}
                                </button>
                            );
                        })}

                        {/* RIGHT ARROW */}
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            style={{
                                padding: "8px 12px",
                                borderRadius: "8px",
                                background:
                                    currentPage === totalPages
                                        ? "rgba(255,255,255,0.1)"
                                        : "var(--gold-light)",
                                color: currentPage === totalPages ? "#666" : "#000",
                                border: "none",
                                fontSize: "16px",
                                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                transition: "0.25s",
                                fontWeight: 700,
                            }}
                        >
                            ▶
                        </button>
                    </div>
                )}

            </div>
            <style jsx global>{`
  /* MOBILE ONLY (max-width: 480px) */
  @media (max-width: 480px) {
    .card .mobile-location-icon {
      width: 12px !important;
      height: 12px !important;
    }

    .card .mobile-location-text {
      font-size: 11px !important;
      max-width: 160px !important;
    }

    .card .mobile-reporter {
      font-size: 10px !important;
    }

    .card .mobile-time {
      font-size: 10px !important;
    }

    .card .mobile-time svg {
      width: 12px !important;
      height: 12px !important;
    }

    .card .mobile-directions-btn {
      padding: 6px 10px !important;
      font-size: 10px !important;
      border-radius: 6px !important;
    }
      
    .needs-you-badge {
      padding: 3px 10px !important;
      font-size: 10px !important;
      border-radius: 12px !important;
      top: 10px !important;
      right: 10px !important;
    
  }
  }
`}</style>
            {loading && <Loading />}
        </div>
    );
}
