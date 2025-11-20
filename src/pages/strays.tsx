"use client";

import { useEffect, useState } from "react";
import { MapPin, Clock } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, getDocs, doc, getDoc, orderBy, query } from "firebase/firestore";
import AuthModal from "../components/AuthModal";

interface Pet {
    id: string;
    name?: string;
    location?: string;
    photoURL?: string;
    createdAt?: { seconds: number };
    userId?: string;
    reporterName?: string;
}

export default function SpottedPage() {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [reports, setReports] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);

    const handleSelectLocation = (place: any) => {
        console.log("User selected location:", place);
    };

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

    return (
        <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>


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

                /* TABLET title smaller */
                @media (max-width: 1024px) {
                    .section-title {
                        font-size: 26px !important;
                    }
                    .section-subtitle {
                        line-height: 1.4 !important;
                    }
                    .section-container {
                        margin-bottom: 35px !important;
                    }
                }

                /* MOBILE title even smaller */
                @media (max-width: 640px) {
                    .section-title {
                        font-size: 22px !important;
                    }
                    .section-subtitle {
                        font-size: 15px !important;
                        line-height: 1.4 !important;
                    }
                    .section-container {
                        margin-bottom: 30px !important;
                    }
                }
                `}
            </style>


            <div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    padding: "80px 24px",
                }}
            >

                {/* SECTION TITLE */}
                <div className="section-container" style={{ marginBottom: "60px", textAlign: "center" }}>
                    <h1
                        className="section-title"
                        style={{
                            fontSize: "46px",   // desktop size (unchanged)
                            fontWeight: 700,
                            color: "#ffffff",
                            fontFamily: "Playfair Display",
                            marginBottom: "14px",
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
                            lineHeight: "1.7",
                        }}
                    >
                        These sweet babies were seen around. Let’s make sure they’re okay.
                    </p>
                </div>


                {/* GRID */}
                <div
                    className="responsive-grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "24px",
                        justifyItems: "center",
                    }}
                >

                    {reports.map((item) => (
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
                                        <MapPin size={16} color="var(--gold-light)" />
                                        <span
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
                                        style={{
                                            fontSize: "12px",
                                            color: "rgba(255,255,255,0.55)",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        Reported by {item.reporterName}
                                    </span>

                                    <div
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
                                        onClick={() => {
                                            if (item.location) {
                                                const encoded = encodeURIComponent(item.location);
                                                window.open(
                                                    `https://www.google.com/maps/search/?api=1&query=${encoded}`,
                                                    "_blank"
                                                );
                                            }
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
        </div>
    );
}
