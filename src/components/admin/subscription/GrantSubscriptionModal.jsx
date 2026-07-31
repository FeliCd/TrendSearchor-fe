import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Sparkles, Zap, Calendar, Loader2 } from 'lucide-react';
import { PLAN_IDS } from '@/constants/subscriptionPlans';

const DURATION_OPTIONS = [
  { days: 30, label: '30 Days (1 Month)' },
  { days: 90, label: '90 Days (3 Months)' },
  { days: 180, label: '180 Days (6 Months)' },
  { days: 365, label: '365 Days (1 Year)' },
];

export default function GrantSubscriptionModal({ isOpen, onClose, targetUser, onGrant, isSubmitting }) {
  const [selectedPlanId, setSelectedPlanId] = useState(PLAN_IDS.PRO);
  const [selectedDuration, setSelectedDuration] = useState(30);

  if (!isOpen || !targetUser) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onGrant(targetUser.userId || targetUser.id, selectedPlanId, selectedDuration);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-[#0C101A] p-6 shadow-2xl text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Grant Subscription Access</h3>
                <p className="text-xs text-slate-400">Manual administrative grant for user account</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            {/* User Details Preview */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">{targetUser.userName}</div>
                <div className="text-xs text-slate-400">{targetUser.userEmail}</div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-mono">
                ID: {targetUser.userId || targetUser.id}
              </span>
            </div>

            {/* Plan Tier Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                Select Subscription Tier
              </label>
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPlanId(PLAN_IDS.PRO)}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    selectedPlanId === PLAN_IDS.PRO
                      ? 'border-purple-500 bg-purple-500/10 text-white ring-1 ring-purple-500/30'
                      : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">PRO Plan</div>
                    <div className="text-xs text-slate-400">20 tokens / 24h</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Duration Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                Grant Duration
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {DURATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.days}
                    type="button"
                    onClick={() => setSelectedDuration(opt.days)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium transition-all ${
                      selectedDuration === opt.days
                        ? 'border-indigo-500 bg-indigo-500/10 text-white'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <Calendar className="w-4 h-4 shrink-0 text-slate-400" />
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Granting...</span>
                  </>
                ) : (
                  <span>Confirm Grant</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
