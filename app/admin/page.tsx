"use client";

import { useRouter } from "next/navigation";
import { SongWithLyrics } from "@/types";
import ProtectedPageLayout from "@/components/shared/ProtectedPageLayout";
import CenteredLayout from "@/components/shared/CenteredLayout";
import SearchSongs from "@/components/admin/SearchSongs";
import SuccessMessage from "@/components/admin/SuccessMessage";
import { useSuccessMessage } from "@/hooks/useSuccessMessage";

function AdminContent() {
  const router = useRouter();
  const { showSuccess } = useSuccessMessage();

  const handleSongSelect = async (song: SongWithLyrics) => {
    router.push(`/admin/${song.id}`);
  };

  return (
    <CenteredLayout maxWidth="7xl">
      <SuccessMessage show={showSuccess} />

      <div className="w-full">
        <SearchSongs onSongSelect={handleSongSelect} />
      </div>
    </CenteredLayout>
  );
}

export default function AdminPage() {
  return (
    <ProtectedPageLayout>
      <AdminContent />
    </ProtectedPageLayout>
  );
}
