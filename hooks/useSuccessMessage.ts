import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";

export interface UseSuccessMessageOptions {
  duration?: number; // Duration to show the message in milliseconds
  searchParamKey?: string; // URL search param to check for success
  searchParamValue?: string; // Value to check for in the search param
}

export function useSuccessMessage(options: UseSuccessMessageOptions = {}) {
  const {
    duration = 5000,
    searchParamKey = "success",
    searchParamValue = "true",
  } = options;

  const [showSuccess, setShowSuccess] = useState(false);
  const searchParams = useSearchParams();

  // Check URL params on mount
  useEffect(() => {
    if (searchParams.get(searchParamKey) === searchParamValue) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), duration);
      return () => clearTimeout(timer);
    }
  }, [searchParams, searchParamKey, searchParamValue, duration]);

  // Manual trigger function
  const triggerSuccess = useCallback(() => {
    setShowSuccess(true);
    const timer = setTimeout(() => setShowSuccess(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  // Manual hide function
  const hideSuccess = useCallback(() => {
    setShowSuccess(false);
  }, []);

  return {
    showSuccess,
    triggerSuccess,
    hideSuccess,
  };
}
