"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import {
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../lib/firebase";
import Header from "../components/Header";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function Dashboard() {
  const [uid, setUid] = useState<string | null>(null);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStrayReported, setTotalStrayReported] = useState(0);
  const [totalStrayReportedByYou, setTotalStrayReportedByYou] = useState(0);
  const [totalAccepted, setTotalAccepted] = useState(0);
  const [totalDeclined, setTotalDeclined] = useState(0);

  const [monthlyData, setMonthlyData] = useState(
    MONTHS.map((m) => ({ month: m, reports: 0 }))
  );

  const [trendData, setTrendData] = useState(
    MONTHS.map((m) => ({ month: m, reports: 0 }))
  );

  const [loading, setLoading] = useState(true);

  // Utility to safely parse Firestore Timestamp
  function parseCreatedAtToDate(createdAt: any): Date | null {
    if (!createdAt) return null;

    if (createdAt?.toDate) {
      try {
        return createdAt.toDate();
      } catch {}
    }
    if (createdAt?.seconds) return new Date(createdAt.seconds * 1000);

    if (typeof createdAt === "string") {
      const d = new Date(createdAt);
      return isNaN(d.getTime()) ? null : d;
    }

    return null;
  }

  // AUTH LISTENER
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid || null);
    });
    return () => unsub();
  }, []);

  // GENERAL COUNTS + COMMUNITY MONTHLY GRAPH
  useEffect(() => {
    const fetchGeneral = async () => {
      setLoading(true);

      try {
        // Users count
        const usersSnap = await getDocs(collection(db, "users"));
        setTotalUsers(usersSnap.size);

        // All stray reports count + compute monthly community data
        const petsSnap = await getDocs(collection(db, "pets"));
        setTotalStrayReported(petsSnap.size);

        const allCounts = new Array(12).fill(0);

        petsSnap.docs.forEach((doc) => {
          const data = doc.data();
          const dt = parseCreatedAtToDate(data.createdAt) || new Date();
          const m = dt.getMonth();
          allCounts[m]++;
        });

        setTrendData(
          MONTHS.map((m, i) => ({
            month: m,
            reports: allCounts[i] || 0,
          }))
        );
      } catch (err) {
        console.error("Error loading general data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGeneral();
  }, []);

  // USER SPECIFIC COUNTS + USER MONTHLY GRAPH
  useEffect(() => {
    if (!uid) return;

    const fetchUserData = async () => {
      try {
        // Fetch user's reports
        const qUser = query(collection(db, "pets"), where("userId", "==", uid));
        const petsSnap = await getDocs(qUser);

        setTotalStrayReportedByYou(petsSnap.size);

        // Monthly user counts
        const userCounts = new Array(12).fill(0);

        petsSnap.docs.forEach((doc) => {
          const data = doc.data();
          const dt = parseCreatedAtToDate(data.createdAt) || new Date();
          const m = dt.getMonth();
          userCounts[m]++;
        });

        setMonthlyData(
          MONTHS.map((m, i) => ({
            month: m,
            reports: userCounts[i] || 0,
          }))
        );

        // Accepted Requests
        try {
          const qAccepted = query(
            collection(db, "request"),
            where("userId", "==", uid),
            where("status", "==", "accepted")
          );
          const acceptedSnap = await getDocs(qAccepted);
          setTotalAccepted(acceptedSnap.size);
        } catch {
          setTotalAccepted(0);
        }

        // Declined Requests
        try {
          const qDeclined = query(
            collection(db, "request"),
            where("userId", "==", uid),
            where("status", "==", "declined")
          );
          const declinedSnap = await getDocs(qDeclined);
          setTotalDeclined(declinedSnap.size);
        } catch {
          setTotalDeclined(0);
        }
      } catch (err) {
        console.error("Error loading user data:", err);
      }
    };

    fetchUserData();
  }, [uid]);

  const formatTooltip = (value: any) =>
    `${value} report${value === 1 ? "" : "s"}`;

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff" }}>
   

      <div
        style={{
          padding: "40px 20px",
          maxWidth: "1100px",
          margin: "0 auto",
          marginTop: "50px",
          marginBottom: "50px",
        }}
      >
        {/* TITLE */}
        <h1
          style={{
            fontFamily: "Playfair Display",
            fontSize: 42,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Dashboard Overview
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.55)",
            marginBottom: 30,
            fontSize: 17,
            lineHeight: 1.6,
          }}
        >
          A quick look at how you and the community are helping strays.
        </p>

        {/* METRIC BOXES */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {[
            { label: "Total Users", value: totalUsers },
            { label: "Total Strays", value: totalStrayReported },
            { label: "You Reported", value: totalStrayReportedByYou },
            { label: "Accepted", value: totalAccepted },
            { label: "Declined", value: totalDeclined },
          ].map((card, i) => (
            <div
              key={i}
              style={{
                padding: "16px 18px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.55)",
                  paddingBottom: 6,
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {card.label}
              </span>

              <div
                style={{
                  marginTop: 10,
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#d8c48d",
                }}
              >
                {card.value}
              </div>
            </div>
          ))}
        </div>

        {/* TWO GRAPH GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            gap: 24,
          }}
        >
          {/* USER MONTHLY BAR CHART */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: 20,
              borderRadius: 16,
              boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
            }}
          >
            <h3
              style={{
                fontFamily: "Playfair Display",
                fontSize: 22,
                marginBottom: 16,
              }}
            >
              Your Reports by Month
            </h3>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={monthlyData}>
                  <CartesianGrid stroke="#1b1b1b" vertical={false} />
                  <XAxis dataKey="month" stroke="#ccc" />
                  <YAxis stroke="#ccc" allowDecimals={false} />
                  <Tooltip formatter={formatTooltip} />
                  <Bar
                    dataKey="reports"
                    fill="#d8c48d"
                    radius={[6, 6, 0, 0]}
                    barSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* COMMUNITY LINE GRAPH */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: 20,
              borderRadius: 16,
              boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
            }}
          >
            <h3
              style={{
                fontFamily: "Playfair Display",
                fontSize: 22,
                marginBottom: 16,
              }}
            >
              Community Monthly Trend
            </h3>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="reports"
                    stroke="#d8c48d"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#d8c48d" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
