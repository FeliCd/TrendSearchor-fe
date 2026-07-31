import { useState, useEffect, useCallback } from 'react';
import { subscriptionService } from '@/services/subscriptionService';

export function useAiQuota() {
  const [quota, setQuota] = useState({
    dailyLimit: 3,
    usedCount: 0,
    remaining: 2,
    isUnlimited: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuota = useCallback(async () => {
    try {
      setLoading(true);
      const res = await subscriptionService.getAiQuota();
      if (res.success) {
        setQuota(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch AI quota:', err);
      setError('Unable to load AI token quota.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuota();
  }, [fetchQuota]);

  const consumeToken = useCallback(async () => {
    try {
      const res = await subscriptionService.consumeAiToken();
      if (res.success) {
        await fetchQuota();
        return { success: true, isUnlimited: res.isUnlimited };
      } else {
        return { success: false, error: res.error, message: res.message };
      }
    } catch (err) {
      console.error('Failed to consume AI token:', err);
      return { success: false, error: 'UNKNOWN', message: 'Token check failed' };
    }
  }, [fetchQuota]);

  const formattedRemainingLabel = quota.isUnlimited
    ? 'Unlimited'
    : `${quota.remaining} / ${quota.dailyLimit}`;

  return {
    quota,
    loading,
    error,
    formattedRemainingLabel,
    isUnlimited: quota.isUnlimited,
    isQuotaExceeded: !quota.isUnlimited && quota.remaining <= 0,
    consumeToken,
    refreshQuota: fetchQuota,
  };
}
