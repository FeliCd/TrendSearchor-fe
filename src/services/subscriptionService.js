import api from './api';
import { PLAN_IDS, SUBSCRIPTION_PLANS } from '@/constants/subscriptionPlans';
import { mockUserSubscriptionsList } from '@/mocks/subscriptionMocks';

const ADMIN_SUBS_STORAGE_KEY = 'trendsearchor_admin_subs';

function getStoredAdminSubs() {
  try {
    const raw = localStorage.getItem(ADMIN_SUBS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : mockUserSubscriptionsList;
  } catch {
    return mockUserSubscriptionsList;
  }
}

function setStoredAdminSubs(list) {
  try {
    localStorage.setItem(ADMIN_SUBS_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Error saving admin subs to storage:', err);
  }
}

export const subscriptionService = {
  /**
   * GET /api/plans
   * Fetch active subscription plans from backend.
   */
  async getPlans() {
    const response = await api.get('/api/plans');
    return response.data;
  },

  /**
   * GET /api/subscriptions/me
   * Fetch active subscription and quota details for current user.
   */
  async getMySubscription() {
    const response = await api.get('/api/subscriptions/me');
    const data = response.data;
    const planId = data.tier === 'ADMIN' ? PLAN_IDS.UNLIMITED : (data.tier || PLAN_IDS.FREE);
    const plan = SUBSCRIPTION_PLANS[planId] || SUBSCRIPTION_PLANS[PLAN_IDS.FREE];

    return {
      success: true,
      data: {
        id: data.status ? `sub_${data.tier}` : 'free_tier',
        tier: data.tier,
        planId,
        status: data.status || 'ACTIVE',
        proActive: data.proActive,
        planName: data.planName,
        startDate: data.startDate,
        endDate: data.endDate,
        plan,
        quota: data.quota,
      },
    };
  },

  /**
   * GET /api/ai/quota
   * Fetch current AI quota status for logged-in user.
   */
  async getAiQuota() {
    const response = await api.get('/api/ai/quota');
    const data = response.data;
    return {
      success: true,
      data: {
        tier: data.tier,
        planId: data.tier,
        dailyLimit: data.dailyLimit,
        usedCount: data.used ?? 0,
        remaining: data.unlimited ? Infinity : (data.remaining < 0 ? Infinity : (data.remaining ?? 0)),
        isUnlimited: !!data.unlimited,
        nextAvailableAt: data.nextAvailableAt,
      },
    };
  },

  /**
   * Consume AI Token / verify quota before action
   */
  async consumeAiToken() {
    const quotaRes = await this.getAiQuota();
    const quota = quotaRes.data;
    if (!quota.isUnlimited && quota.remaining <= 0) {
      return {
        success: false,
        error: 'QUOTA_EXCEEDED',
        message: 'Daily AI request limit reached. Upgrade to Pro for a higher limit.',
      };
    }
    return {
      success: true,
      remaining: quota.remaining,
      usedCount: quota.usedCount,
      dailyLimit: quota.dailyLimit,
      isUnlimited: quota.isUnlimited,
    };
  },

  /**
   * Subscribe to PRO plan:
   * Step 1: POST /api/subscriptions/subscribe -> returns PENDING transactionId
   * Step 2: POST /api/payments/mock-confirm -> activates subscription
   */
  async subscribePlan({ planId, paymentMethod = 'MOCK' }) {
    if (planId === PLAN_IDS.FREE) {
      return {
        success: true,
        message: 'You are currently using the Free tier.',
        data: {
          subscription: {
            id: 'free_tier',
            planId: PLAN_IDS.FREE,
            status: 'ACTIVE',
            startDate: new Date().toISOString(),
            endDate: null,
          },
          plan: SUBSCRIPTION_PLANS[PLAN_IDS.FREE],
        },
      };
    }

    const normalizedMethod = paymentMethod ? paymentMethod.toUpperCase() : 'MOCK';

    try {
      const subRes = await api.post('/api/subscriptions/subscribe', {
        planCode: planId,
        paymentMethod: normalizedMethod,
      });
      const transactionId = subRes.data?.transactionId;
      if (!transactionId) {
        throw new Error('Failed to initiate subscription transaction');
      }

      if (normalizedMethod === 'VNPAY') {
        const vnpRes = await api.post('/api/payments/vnpay/create-url', {
          transactionId,
        });
        const paymentUrl = vnpRes.data?.paymentUrl;
        if (!paymentUrl) {
          throw new Error('Failed to generate VNPay payment URL');
        }
        window.location.href = paymentUrl;
        return {
          success: true,
          isRedirect: true,
          paymentUrl,
        };
      }

      const confirmRes = await api.post('/api/payments/mock-confirm', {
        transactionId,
      });

      const targetPlan = SUBSCRIPTION_PLANS[planId] || SUBSCRIPTION_PLANS[PLAN_IDS.FREE];
      const activatedSub = {
        id: transactionId,
        planId: targetPlan.id,
        tier: targetPlan.id,
        status: 'ACTIVE',
        proActive: true,
        planName: targetPlan.name,
        startDate: new Date().toISOString(),
        endDate: confirmRes.data?.endDate,
        plan: targetPlan,
      };

      return {
        success: true,
        message: confirmRes.data?.message || `Successfully subscribed to ${targetPlan.name} Plan!`,
        data: {
          subscription: activatedSub,
          plan: targetPlan,
          transactionId,
          paymentStatus: confirmRes.data?.paymentStatus,
          subscriptionStatus: confirmRes.data?.subscriptionStatus,
          endDate: confirmRes.data?.endDate,
        },
      };
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.message;
      throw new Error(serverMessage || 'Subscription failed');
    }
  },


  // ─── Admin Subscription Management Endpoints ─────────────────────────────────

  /**
   * GET /api/dashboard/admin/stats
   * Fetch admin revenue statistics including total revenue, MRR, PRO subscribers, and monthly chart data.
   */
  async getAdminRevenueStats() {
    const response = await api.get('/api/dashboard/admin/stats');
    return {
      success: true,
      data: response.data,
    };
  },

  /**
   * Fetch user subscriptions list for admin.
   * Calls BE endpoint `/api/admin/subscriptions`.
   */
  async getAllUserSubscriptions() {
    try {
      const response = await api.get('/api/admin/subscriptions');
      if (response.data && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data,
        };
      }
    } catch (err) {
      console.error('Error fetching admin subscriptions:', err);
    }
    return {
      success: true,
      data: getStoredAdminSubs(),
    };
  },

  /**
   * Grant subscription to a user (Admin only).
   */
  async grantSubscription({ userId, planId, durationDays = 30 }) {
    try {
      const response = await api.post('/api/admin/subscriptions/grant', {
        userId,
        planCode: planId,
        durationDays,
      });
      const listRes = await this.getAllUserSubscriptions();
      return {
        success: true,
        message: response.data?.message || `Granted subscription access.`,
        data: listRes.data,
      };
    } catch {
      // Fallback for pending backend admin endpoint
      const list = getStoredAdminSubs();
      const index = list.findIndex((item) => item.userId === userId || item.id === userId);
      const targetPlan = SUBSCRIPTION_PLANS[planId] || SUBSCRIPTION_PLANS[PLAN_IDS.FREE];
      const now = new Date();
      const endDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();

      if (index !== -1) {
        list[index] = {
          ...list[index],
          planId: targetPlan.id,
          status: 'ACTIVE',
          startDate: now.toISOString(),
          endDate,
          grantedByAdmin: true,
        };
        setStoredAdminSubs(list);
      }
      return {
        success: true,
        message: `Granted ${targetPlan.name} access for ${durationDays} days.`,
        data: list,
      };
    }
  },

  /**
   * Revoke subscription from a user (Admin only).
   */
  async revokeSubscription(userId) {
    try {
      const response = await api.post(`/api/admin/subscriptions/revoke/${userId}`);
      const listRes = await this.getAllUserSubscriptions();
      return {
        success: true,
        message: response.data?.message || 'Subscription revoked.',
        data: listRes.data,
      };
    } catch {
      // Fallback for pending backend admin endpoint
      const list = getStoredAdminSubs();
      const index = list.findIndex((item) => item.userId === userId || item.id === userId);
      if (index !== -1) {
        list[index] = {
          ...list[index],
          planId: PLAN_IDS.FREE,
          status: 'ACTIVE',
          startDate: new Date().toISOString(),
          endDate: null,
          grantedByAdmin: false,
        };
        setStoredAdminSubs(list);
      }
      return {
        success: true,
        message: 'Subscription revoked to Free tier.',
        data: list,
      };
    }
  },

};
