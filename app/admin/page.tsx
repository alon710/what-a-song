"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SongWithLyrics } from "@/types";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import SearchSongs from "@/components/admin/SearchSongs";
import SuccessMessage from "@/components/admin/SuccessMessage";
import LoadingState from "@/components/common/LoadingState";

function AdminContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleSongSelect = async (song: SongWithLyrics) => {
    // Navigate directly to the Spotify ID-based URL
    // The edit page will handle fetching data from database/APIs
    router.push(`/admin/${song.id}`);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <SuccessMessage show={showSuccess} />

        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          <div className="w-full">
            <SearchSongs onSongSelect={handleSongSelect} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingState />}>
        <AdminContent />
      </Suspense>
    </ProtectedRoute>
  );
}
