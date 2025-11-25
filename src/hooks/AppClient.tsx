"use client";

import ProtectedPage from "../components/ProtectedRoute";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AppClient({ children }) {
  return (
    <ProtectedPage>
      <Header />
      {children}
      <Footer />
    </ProtectedPage>
  );
}
