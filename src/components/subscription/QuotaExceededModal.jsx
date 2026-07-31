import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Zap, Sparkles, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuotaExceededModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNavigateToPricing = () => {
    onClose();
    navigate('/researcher/subscription');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-amber-500/30 bg-[#0E131F] p-6 shadow-2xl text-slate-100"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center pt-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-900/20">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">
              Daily AI Quota Limit Reached
            </h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              You have exhausted your daily AI token allowance. Upgrade your account to continue performing real-time trend analytics and paper suggestions.
            </p>
          </div>

          {/* Upgrade Options Card */}
          <div className="mt-6 space-y-3">
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm text-white">Pro Tier</div>
                  <div className="text-xs text-slate-300">20 queries / 24 hours (199k)</div>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-medium border border-purple-500/30">
                20 Tokens
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={handleNavigateToPricing}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/30 transition-all"
            >
              <span>View Pricing Plans</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Dismiss for now
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
