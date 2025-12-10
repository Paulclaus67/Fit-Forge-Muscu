import { useState, useCallback } from 'react';

interface UseAsyncOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true,
  options?: UseAsyncOptions
) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>(
    immediate ? 'pending' : 'idle'
  );
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      options?.onSuccess?.(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      setStatus('error');
      options?.onError?.(error);
      throw error;
    }
  }, [asyncFunction, options]);

  if (immediate) {
    // Execute on mount and when dependencies change
    const [executed, setExecuted] = useState(false);
    if (!executed) {
      setExecuted(true);
      execute().catch(() => {});
    }
  }

  return { execute, status, data, error };
}
