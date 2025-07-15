import { Suspense } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LoadingState from "@/components/common/LoadingState";

interface ProtectedPageLayoutProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedPageLayout({
  children,
  fallback = <LoadingState />,
}: ProtectedPageLayoutProps) {
  return (
    <ProtectedRoute>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ProtectedRoute>
  );
}
