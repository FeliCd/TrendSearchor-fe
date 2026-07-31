import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Shield, HelpCircle, Loader2 } from 'lucide-react';
import { SUBSCRIPTION_PLANS, PLAN_IDS } from '@/constants/subscriptionPlans';
import { useSubscription } from '@/hooks/useSubscription';
import { useAiQuota } from '@/hooks/useAiQuota';
import CheckoutModal from '@/components/subscription/CheckoutModal';

export default function SubscriptionPage() {
  const { subscription, loading: subLoading, submitting, upgradePlan } = useSubscription();
  const { quota, formattedRemainingLabel, refreshQuota } = useAiQuota();

  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const activePlanId = subscription?.planId || PLAN_IDS.FREE;

  const handleOpenCheckout = (plan) => {
    if (plan.id === activePlanId) return;
    setSelectedPlanForCheckout(plan);
    setIsCheckoutOpen(true);
  };

  const handleConfirmCheckout = async (planId, paymentMethod) => {
    const res = await upgradePlan(planId, paymentMethod);
    if (res.success) {
      setIsCheckoutOpen(false);
      setSelectedPlanForCheckout(null);
      await refreshQuota();
    }
  };

  const plansList = Object.values(SUBSCRIPTION_PLANS);

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 p-6 md:p-10 space-y-10">
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-[#0D121F] via-[#121829] to-[#18112C] p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Researcher AI Membership Plans</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Upgrade Your AI Research Quota
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Unlock advanced AI literature search, real-time citation analysis, and elevated token allowances designed for modern academic researchers.
            </p>
          </div>

          {/* Current Membership Widget */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-xl space-y-3 min-w-[260px]">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Current Active Status
            </div>
            {subLoading ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                <span>Loading quota...</span>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-white flex items-center gap-2">
                    {subscription?.plan?.name || 'Free'} Plan
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Active
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 text-xs flex justify-between items-center text-slate-300">
                  <span>AI Quota Remaining:</span>
                  <span className="font-bold text-purple-400">{formattedRemainingLabel}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Cards Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
        {plansList.map((plan) => {
          const isCurrentPlan = activePlanId === plan.id;
          const isPro = plan.id === PLAN_IDS.PRO;

          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all ${
                isPro
                  ? 'border border-purple-500/40 bg-gradient-to-b from-[#0F1424] to-[#0A0D18] shadow-xl'
                  : 'border border-slate-800 bg-[#0B0F1A]'
              }`}
            >
              {/* Badge for Pro */}
              {plan.badgeText && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-900/40">
                    {plan.badgeText}
                  </span>
                </div>
              )}

              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    {plan.name}
                    {isPro ? <Zap className="w-5 h-5 text-purple-400" /> : <Sparkles className="w-5 h-5 text-slate-400" />}
                  </h3>
                </div>

                <p className="text-xs text-slate-400 min-h-[36px] leading-relaxed">
                  {plan.tagline}
                </p>

                {/* Price Display */}
                <div className="my-6">
                  <div className="text-3xl font-extrabold text-white">
                    {plan.priceFormatted}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{plan.billingPeriod}</div>
                </div>

                {/* Feature Checklist */}
                <div className="space-y-3 pt-4 border-t border-slate-800/80">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs text-slate-300">
                      <div
                        className={`p-0.5 rounded-full mt-0.5 shrink-0 ${
                          isPro ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Action Button */}
              <div className="mt-8 pt-4">
                {isCurrentPlan ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl text-sm font-semibold bg-slate-800/80 text-slate-400 border border-slate-700/60 cursor-default"
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenCheckout(plan)}
                    className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-purple-900/30"
                  >
                    Upgrade to {plan.name}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* FAQ / Info Footer */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <HelpCircle className="w-5 h-5 text-purple-400 shrink-0" />
          <span>Need custom institution billing or enterprise licenses? Contact our team.</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>30-day money-back guarantee & cancellation anytime</span>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedPlan={selectedPlanForCheckout}
        onConfirm={handleConfirmCheckout}
        isSubmitting={submitting}
      />
    </div>
  );
}
