import { useState, useCallback, useEffect, useRef } from 'react';

interface UseFetchDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetchData: (api: () => Promise<{ code: number; des?: string; data: T }>) => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  refresh: () => void;
}

export function useFetchData<T>(): UseFetchDataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiRef = useRef<() => Promise<{ code: number; des?: string; data: T }> | null>(null);

  const fetchData = useCallback(
    async (api: () => Promise<{ code: number; des?: string; data: T }>) => {
      apiRef.current = api;
      try {
        setLoading(true);
        setError(null);
        const response = await api();

        if (response.code === 0) {
          setData(response.data);
        } else {
          setError(response.des || '获取数据失败');
        }
      } catch (err) {
        setError('网络请求失败');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const refresh = useCallback(() => {
    if (apiRef.current) {
      fetchData(apiRef.current as () => Promise<{ code: number; des?: string; data: T }>);
    }
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    fetchData,
    setData,
    setError,
    refresh,
  };
}