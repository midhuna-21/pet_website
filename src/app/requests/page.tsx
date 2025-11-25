"use client";

import { useEffect, useState } from "react";
import RequestsPage from "../../components/RequestsPage";
import { getIncomingRequests, updateRequestStatus} from "../../hooks/firestoreaction";
import Loading from "../../components/Loading";

export default function RequestsRoute() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getIncomingRequests();  
      setRequests(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <RequestsPage
      requests={requests}
      handleRequestAction={async (id, status) => {
        await updateRequestStatus(id, status);

        // refresh after action
        const updated = await getIncomingRequests();
        setRequests(updated);
      }}
    />
  );
}
