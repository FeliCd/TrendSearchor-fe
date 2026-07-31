import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ShieldCheck, Zap, QrCode, Wallet, Loader2 } from 'lucide-react';
import { PAYMENT_METHODS } from '@/constants/subscriptionPlans';

const ICON_MAP = {
  Zap,
  QrCode,
  Wallet,
};

export default function CheckoutModal({ isOpen, onClose, selectedPlan, onConfirm, isSubmitting }) {
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);

  if (!isOpen || !selectedPlan) return null;

  const handleConfirm = () => {
    onConfirm(selectedPlan.id, selectedMethod);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-800 bg-[#0B0F17] p-6 shadow-2xl text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Confirm Subscription</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-medium">
                  {selectedPlan.name} Plan
                </span>
              </h3>
              <p className="text-sm text-slate-400 mt-0.5">
                Complete your transaction to unlock elevated AI capabilities
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Order Summary Box */}
          <div className="mt-5 p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Plan Selected</span>
              <span className="font-semibold text-white">{selectedPlan.name} Tier</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">AI Daily Token Quota</span>
              <span className="font-semibold text-purple-400">
                {selectedPlan.isUnlimited ? 'Unlimited (24/7)' : `${selectedPlan.dailyQuota} requests / 24h`}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Billing Duration</span>
              <span className="text-slate-300">{selectedPlan.billingPeriod}</span>
            </div>
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
              <span className="font-medium text-white">Total Amount Due</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                {selectedPlan.priceFormatted}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="mt-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Select Payment Method
            </label>
            <div className="space-y-2.5">
              {PAYMENT_METHODS.map((method) => {
                const IconComponent = ICON_MAP[method.iconName] || Zap;
                const isSelected = selectedMethod === method.id;

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-purple-500/80 bg-purple-500/10 text-white ring-1 ring-purple-500/40'
                        : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-white">{method.name}</div>
                        <div className="text-xs text-slate-400">{method.description}</div>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-5 flex items-center gap-2 text-xs text-slate-400 bg-slate-900/30 p-2.5 rounded-lg border border-slate-800/40">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Encrypted sandbox transaction for demo & presentation purposes.</span>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Activate {selectedPlan.name} Plan</span>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
