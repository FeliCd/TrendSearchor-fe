import { useState, useEffect, useCallback } from 'react';
import { subscriptionService } from '@/services/subscriptionService';
import { useToast } from '@/hooks/useToast';

export function useSubscription() {
  const [subscription, setSubscription] = useState(null);
  const [allSubscriptions, setAllSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const fetchMySubscription = useCallback(async () => {
    try {
      setLoading(true);
      const res = await subscriptionService.getMySubscription();
      if (res.success) {
        setSubscription(res.data);
      }
    } catch (err) {
      console.error('Failed to load subscription:', err);
      setError('Unable to load subscription details');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await subscriptionService.getAllUserSubscriptions();
      if (res.success) {
        setAllSubscriptions(res.data);
      }
    } catch (err) {
      console.error('Failed to load subscriptions list:', err);
      setError('Unable to load user subscriptions');
    } finally {
      setLoading(false);
    }
  }, []);

  const upgradePlan = async (planId, paymentMethod) => {
    try {
      setSubmitting(true);
      const res = await subscriptionService.subscribePlan({ planId, paymentMethod });
      if (res.success) {
        if (res.isRedirect) {
          return { success: true, isRedirect: true };
        }
        if (res.data?.subscription) {
          setSubscription(res.data.subscription);
        }
        if (toast?.success && res.message) {
          toast.success(res.message);
        }
        await fetchMySubscription();
        return { success: true };
      }
      return { success: false, message: 'Upgrade failed' };
    } catch (err) {
      console.error('Error during upgrade:', err);
      if (toast?.error) {
        toast.error(err.message || 'Upgrade failed');
      }
      return { success: false, message: err.message };
    } finally {
      setSubmitting(false);
    }
  };

  const grantUserAccess = async (userId, planId, durationDays) => {
    try {
      setSubmitting(true);
      const res = await subscriptionService.grantSubscription({ userId, planId, durationDays });
      if (res.success) {
        setAllSubscriptions(res.data);
        if (toast?.success) {
          toast.success(res.message);
        }
        await fetchMySubscription();
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      console.error('Error granting access:', err);
      if (toast?.error) {
        toast.error(err.message || 'Failed to grant access');
      }
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  const revokeUserAccess = async (userId) => {
    try {
      setSubmitting(true);
      const res = await subscriptionService.revokeSubscription(userId);
      if (res.success) {
        setAllSubscriptions(res.data);
        if (toast?.success) {
          toast.success(res.message);
        }
        await fetchMySubscription();
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      console.error('Error revoking access:', err);
      if (toast?.error) {
        toast.error(err.message || 'Failed to revoke access');
      }
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchMySubscription();
  }, [fetchMySubscription]);

  return {
    subscription,
    allSubscriptions,
    loading,
    submitting,
    error,
    refreshSubscription: fetchMySubscription,
    fetchAllSubscriptions,
    upgradePlan,
    grantUserAccess,
    revokeUserAccess,
  };
}
