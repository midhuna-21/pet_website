"use client";

import { useAuth } from "../contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const publicPages = ["/"];

  useEffect(() => {
    if (!loading) {
      const isPublic = publicPages.includes(pathname);

      if (!isPublic && !user) {
        router.replace("/");
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) return null;

  if (!user && publicPages.includes(pathname)) {
    return children;
  }

  if (user) return children;

  return null;
}
