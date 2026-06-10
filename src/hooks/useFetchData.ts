import { useState, useCallback, useRef } from 'react';

interface UseFetchDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetchData: (api: () => Promise<{ code: number; desc?: string; data: T }>) => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  refresh: () => void;
}

export function useFetchData<T>(): UseFetchDataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiRef = useRef<() => Promise<{ code: number; desc?: string; data: T }> | null>(null);

  const fetchData = useCallback(
    async (api: () => Promise<{ code: number; desc?: string; data: T }>) => {
      apiRef.current = api;
      try {
        setLoading(true);
        setError(null);
        const response = await api();

        if (response.code === 0) {
          setData(response.data);
        } else {
          setError(response.desc || '获取数据失败');
        }
      } catch {
        setError('网络请求失败');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const refresh = useCallback(() => {
    if (apiRef.current) {
      fetchData(apiRef.current as () => Promise<{ code: number; desc?: string; data: T }>);
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
