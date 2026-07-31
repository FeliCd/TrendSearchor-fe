import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Zap, UserCheck, RefreshCw, PlusCircle, RotateCcw, Loader2 } from 'lucide-react';
import { PLAN_IDS } from '@/constants/subscriptionPlans';
import { useSubscription } from '@/hooks/useSubscription';
import GrantSubscriptionModal from '@/components/admin/subscription/GrantSubscriptionModal';

export default function SubscriptionManagementPage() {
  const {
    allSubscriptions,
    loading,
    submitting,
    fetchAllSubscriptions,
    grantUserAccess,
    revokeUserAccess,
  } = useSubscription();

  const [selectedUserForGrant, setSelectedUserForGrant] = useState(null);
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [filterPlan, setFilterPlan] = useState('ALL');

  useEffect(() => {
    fetchAllSubscriptions();
  }, [fetchAllSubscriptions]);

  const handleOpenGrantModal = (user) => {
    setSelectedUserForGrant(user);
    setIsGrantModalOpen(true);
  };

  const handleConfirmGrant = async (userId, planId, durationDays) => {
    const res = await grantUserAccess(userId, planId, durationDays);
    if (res.success) {
      setIsGrantModalOpen(false);
      setSelectedUserForGrant(null);
    }
  };

  const handleRevoke = async (userId) => {
    if (window.confirm('Are you sure you want to revoke this subscription and revert user to FREE tier?')) {
      await revokeUserAccess(userId);
    }
  };

  const filteredSubscriptions = allSubscriptions.filter((sub) => {
    if (filterPlan === 'ALL') return true;
    return sub.planId === filterPlan;
  });

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Administrative Controls</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            Subscription & Quota Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Overview of user plans, manual grant override, and tier revocations.
          </p>
        </div>

        <button
          onClick={fetchAllSubscriptions}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Table</span>
        </button>
      </div>

      {/* Filter Tabs & Counter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          {['ALL', PLAN_IDS.FREE, PLAN_IDS.PRO].map((plan) => (
            <button
              key={plan}
              onClick={() => setFilterPlan(plan)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterPlan === plan
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {plan === 'ALL' ? 'All Users' : plan}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400">
          Showing <span className="font-semibold text-white">{filteredSubscriptions.length}</span> active subscription entries
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0B0F1A] shadow-xl">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-slate-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
            <span>Fetching user subscriptions...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/90 text-xs font-semibold uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Current Plan Tier</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Granted Date</th>
                  <th className="px-6 py-4">Expiration Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredSubscriptions.map((item) => {
                  const isUnlimited = item.planId === PLAN_IDS.UNLIMITED;
                  const isPro = item.planId === PLAN_IDS.PRO;
                  const isFree = item.planId === PLAN_IDS.FREE;

                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-900/40 transition-colors"
                    >
                      {/* User Info */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{item.userName}</div>
                        <div className="text-xs text-slate-400">{item.userEmail}</div>
                      </td>

                      {/* Tier Badge */}
                      <td className="px-6 py-4">
                        {isUnlimited && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>UNLIMITED</span>
                          </span>
                        )}
                        {isPro && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                            <Zap className="w-3 h-3 text-purple-400" />
                            <span>PRO</span>
                          </span>
                        )}
                        {isFree && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                            <span>FREE</span>
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold ${
                            item.status === 'ACTIVE' ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{item.status}</span>
                        </span>
                        {item.grantedByAdmin && (
                          <span className="block text-[10px] text-purple-400 font-mono mt-0.5">
                            (Admin Override)
                          </span>
                        )}
                      </td>

                      {/* Granted Date */}
                      <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                        {item.startDate ? new Date(item.startDate).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Expiration Date */}
                      <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                        {item.endDate ? new Date(item.endDate).toLocaleDateString() : 'Permanent Free'}
                      </td>

                      {/* Action Buttons */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenGrantModal(item)}
                            disabled={submitting}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600 hover:text-white transition-all"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>Grant Plan</span>
                          </button>

                          {!isFree && (
                            <button
                              onClick={() => handleRevoke(item.userId || item.id)}
                              disabled={submitting}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white transition-all"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Revoke</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grant Modal */}
      <GrantSubscriptionModal
        isOpen={isGrantModalOpen}
        onClose={() => setIsGrantModalOpen(false)}
        targetUser={selectedUserForGrant}
        onGrant={handleConfirmGrant}
        isSubmitting={submitting}
      />
    </div>
  );
}
