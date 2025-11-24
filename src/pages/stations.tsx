"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import GoogleMapWithStrayMarkers from "../components/GoogleMapWithStrayMarkers";
import Loading from "../components/Loading";

export default function StationsPage() {
  const [spots, setSpots] = useState<any[]>([]);
  const [filteredSpots, setFilteredSpots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const snapshot = await getDocs(collection(db, "pets"));

        const list = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            (item: any) =>
              item.coordinates?.lat && item.coordinates?.lng
          );

        setSpots(list);
        setFilteredSpots(list);
      } catch (err) {
        console.error("Error fetching stray spots:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpots();
  }, []);

  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredSpots(spots);
      return;
    }

    const lower = search.toLowerCase();

    const results = spots.filter((spot) =>
      spot.location?.toLowerCase().includes(lower)
    );

    if (results.length === 0) {
      alert("❗ No strays found here. Try another location.");
    }

    setFilteredSpots(results);
  };

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "80px 24px",
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <h1
      className="section-title"
        style={{
          textAlign: "center",
          fontFamily: "Playfair Display",
          fontSize: "52px",
          marginBottom: "5px",
          color: "#fff",
        }}
      >
        Stray Stations Map
      </h1>
<p 
  className="section-subtitle"
style={{
  textAlign: "center",
  color: "rgba(255,255,255,0.65)",
  fontSize: "18px",
  marginBottom: "20px",
  marginTop:'10px'
}}>
  Here's where our little stray friends were last spotted. Hope it helps someone reach them sooner. ❤️
</p>

      {/* Map */}
      {!loading && (
        <GoogleMapWithStrayMarkers
          spots={filteredSpots.map((item) => ({
            id: item.id,
            lat: item.coordinates.lat,
            lng: item.coordinates.lng,
            name: item.name,
            location: item.location,
          }))}
        />
      )}

      {loading && <Loading />}
        <style>
                {`
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
                  
                }
                `}
            </style>
    </div>
  );
}
