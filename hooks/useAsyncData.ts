import { useState, useEffect, useCallback } from "react";

export interface AsyncDataResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UseAsyncDataOptions {
  immediate?: boolean; // Whether to load data immediately on mount
  fallbackErrorMessage?: string; // Default error message if none provided
}

export interface UseAsyncDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAsyncData<T>(
  asyncFunction: () => Promise<AsyncDataResult<T>>,
  dependencies: React.DependencyList = [],
  options: UseAsyncDataOptions = {}
): UseAsyncDataReturn<T> {
  const { immediate = true, fallbackErrorMessage = "Failed to load data" } =
    options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      if (!result.success) {
        throw new Error(result.error || fallbackErrorMessage);
      }
      setData(result.data || null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : fallbackErrorMessage;
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [...dependencies, asyncFunction, fallbackErrorMessage]);

  useEffect(() => {
    if (immediate) {
      loadData();
    }
  }, [loadData, immediate]);

  return {
    data,
    loading,
    error,
    refetch: loadData,
  };
}

// Specialized hook for simple data fetching without the result wrapper
export function useSimpleAsyncData<T>(
  asyncFunction: () => Promise<T>,
  dependencies: React.DependencyList = [],
  options: UseAsyncDataOptions = {}
): UseAsyncDataReturn<T> {
  const { immediate = true, fallbackErrorMessage = "Failed to load data" } =
    options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      setData(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : fallbackErrorMessage;
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [...dependencies, asyncFunction, fallbackErrorMessage]);

  useEffect(() => {
    if (immediate) {
      loadData();
    }
  }, [loadData, immediate]);

  return {
    data,
    loading,
    error,
    refetch: loadData,
  };
}
