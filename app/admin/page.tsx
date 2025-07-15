"use client";

import { useRouter } from "next/navigation";
import { SongWithLyrics } from "@/types";
import ProtectedPageLayout from "@/components/shared/ProtectedPageLayout";
import SearchSongs from "@/components/admin/SearchSongs";
import SuccessMessage from "@/components/admin/SuccessMessage";
import { useSuccessMessage } from "@/hooks/useSuccessMessage";

function AdminContent() {
  const router = useRouter();
  const { showSuccess } = useSuccessMessage();

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
    <ProtectedPageLayout>
      <AdminContent />
    </ProtectedPageLayout>
  );
}
