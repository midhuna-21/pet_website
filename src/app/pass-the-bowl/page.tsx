"use client"

import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";

import AvailabilityPage from "../../components/AvailabilityPage";
import SendRequestPage from "../../components/SendRequestsPage";
import RequestsPage from "../../components/RequestsPage";

import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Loading from "../../components/Loading";

export default function PassTheBowlSystem() {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState("availability");
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);


  const [userAvailability, setUserAvailability] = useState({
    isAvailable: false,
    location: "",
    radius: "",
  });

  const [helpRequest, setHelpRequest] = useState({
    strayName: "",
    taskType: "",
    location: "",
    urgency: "normal",
    description: "",
    photo: null,
    photoPreview: null,
  });

  const [requests, setRequests] = useState([]);

  const handleRequestAction = (requestId, action) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: action } : req
      )
    );
  };

  useEffect(() => {
    const t = setTimeout(() => setPageLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (pageLoading) return <Loading />;

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
      {/* Availability */}
      {currentPage === "availability" && (
        <AvailabilityPage
          setCurrentPage={setCurrentPage}
          userAvailability={userAvailability}
          setUserAvailability={setUserAvailability}
          requests={requests}
        />
      )}

      {/* Send Request Page */}
      {currentPage === "send-request" && (
        <SendRequestPage
          setCurrentPage={setCurrentPage}
          selectedHelper={selectedHelper}
          helpRequest={helpRequest}
          setHelpRequest={setHelpRequest}
        />
      )}

      {/* Requests Page */}
      {currentPage === "requests" && (
        <RequestsPage
          requests={requests}
          handleRequestAction={handleRequestAction}
        />

      )}
    </div>
  );
}

