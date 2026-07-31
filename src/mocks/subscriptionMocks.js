import { PLAN_IDS } from '@/constants/subscriptionPlans';

export const mockCurrentUserSubscription = {
  id: 'sub_user_001',
  userId: 'user_researcher_123',
  userName: 'Dr. Alex Vance',
  userEmail: 'alex.vance@trendsearchor.io',
  planId: PLAN_IDS.FREE,
  status: 'ACTIVE', // 'ACTIVE', 'EXPIRED', 'CANCELLED'
  startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  endDate: null,
  autoRenew: false,
};

export const mockCurrentUserQuota = {
  userId: 'user_researcher_123',
  planId: PLAN_IDS.FREE,
  dailyLimit: 3,
  usedCount: 1,
  lastResetTime: new Date().toISOString(),
};

export const mockUserSubscriptionsList = [
  {
    id: 'sub_1',
    userId: 'user_1',
    userName: 'Dr. Alex Vance',
    userEmail: 'alex.vance@trendsearchor.io',
    role: 'RESEARCHER',
    planId: PLAN_IDS.FREE,
    status: 'ACTIVE',
    startDate: '2026-01-15T08:00:00.000Z',
    endDate: null,
    grantedByAdmin: false,
  },
  {
    id: 'sub_2',
    userId: 'user_2',
    userName: 'Sarah Jenkins',
    userEmail: 's.jenkins@stanford.edu',
    role: 'RESEARCHER',
    planId: PLAN_IDS.PRO,
    status: 'ACTIVE',
    startDate: '2026-07-01T10:00:00.000Z',
    endDate: '2026-07-31T10:00:00.000Z',
    grantedByAdmin: false,
  },
  {
    id: 'sub_3',
    userId: 'user_3',
    userName: 'Prof. Michael Chang',
    userEmail: 'mchang@mit.edu',
    role: 'RESEARCHER',
    planId: PLAN_IDS.PRO,
    status: 'ACTIVE',
    startDate: '2026-06-10T14:30:00.000Z',
    endDate: '2027-06-10T14:30:00.000Z',
    grantedByAdmin: true,
  },
  {
    id: 'sub_4',
    userId: 'user_4',
    userName: 'Elena Rostova',
    userEmail: 'elena.r@ethz.ch',
    role: 'RESEARCHER',
    planId: PLAN_IDS.PRO,
    status: 'EXPIRED',
    startDate: '2026-05-01T09:00:00.000Z',
    endDate: '2026-05-31T09:00:00.000Z',
    grantedByAdmin: false,
  },
  {
    id: 'sub_5',
    userId: 'user_5',
    userName: 'David Kim',
    userEmail: 'dkim@kaist.ac.kr',
    role: 'RESEARCHER',
    planId: PLAN_IDS.FREE,
    status: 'ACTIVE',
    startDate: '2026-02-20T11:15:00.000Z',
    endDate: null,
    grantedByAdmin: false,
  },
];
