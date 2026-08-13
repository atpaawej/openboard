import { useEffect, useState } from 'react';
import type { HealthCheckResponse } from '@openboard/shared';

export interface HealthStatus {
  isConnected: boolean;
  data: HealthCheckResponse | null;
  loading: boolean;
  error: string | null;
}

/**
 * Deep hook for monitoring OpenBoard local server health.
 */
export function useHealthCheck(): HealthStatus {
  const [status, setStatus] = useState<HealthStatus>({
    isConnected: false,
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function checkHealth() {
      try {
        const response = await fetch('/api/health');
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        const data: HealthCheckResponse = await response.json();
        if (isMounted) {
          setStatus({
            isConnected: data.status === 'ok',
            data,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (isMounted) {
          setStatus({
            isConnected: false,
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Unable to connect to local server',
          });
        }
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return status;
}
