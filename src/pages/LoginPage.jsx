import { Link } from 'react-router-dom';
import { User, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoginForm } from '@/hooks/useLoginForm';
import AuthLayout from '@/components/auth/AuthLayout';
import FormInput from '@/components/ui/FormInput';
import PasswordInput from '@/components/ui/PasswordInput';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const alertVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit:   { opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.2 } },
};

/* ─── Glassmorphism Button ───────────────────────────────────────────────── */
function GlassButton({ isLoading }) {
  return (
      <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={!isLoading ? { scale: 1.018, y: -1 } : {}}
          whileTap={!isLoading  ? { scale: 0.975 }        : {}}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          style={{
            /* Glass core */
            background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%)',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.22)',
            boxShadow: '0 4px 24px rgba(74,144,226,0.18), 0 1.5px 0 rgba(255,255,255,0.14) inset',
          }}
          className="
        relative w-full py-2.5 px-4 rounded-xl
        text-sm font-semibold text-white tracking-wide
        disabled:opacity-40 disabled:cursor-not-allowed
        flex items-center justify-center gap-2 mt-1
        overflow-hidden group
      "
      >
        {/* Shimmer sweep on hover */}
        <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)',
              backgroundSize: '200% 100%',
            }}
            initial={{ backgroundPosition: '-100% 0' }}
            whileHover={{ backgroundPosition: '200% 0' }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
        />

        {/* Blue glow accent */}
        <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ boxShadow: '0 0 22px rgba(74,144,226,0.35) inset' }}
        />

        <AnimatePresence mode="wait" initial={false}>
          {isLoading ? (
              <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
              >
                <LoadingSpinner label="Signing in..." />
              </motion.span>
          ) : (
              <motion.span
                  key="label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
              >
                Sign in
                <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ repeat: Infinity, repeatDelay: 2.5, duration: 0.6, ease: 'easeInOut' }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function LoginPage() {
  const {
    formData, errors, globalError,
    isLoading, rememberMe,
    handleChange, handleSubmit,
  } = useLoginForm();

  return (
      <AuthLayout
          title="Welcome back"
          subtitle="Sign in to access your dashboard and continue exploring research trends"
          footerText="Don't have an account?"
          footerLinkText="Create an account"
          footerLinkTo="/register"
      >
        <AnimatePresence>
          {globalError && (
              <motion.div
                  key="alert"
                  variants={alertVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
              >
                <Alert variant="error" message={globalError} />
              </motion.div>
          )}
        </AnimatePresence>

        <motion.form
            className="space-y-5"
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          {/* Username */}
          <motion.div variants={itemVariants}>
            <FormInput
                id="username"
                name="username"
                label="Username or Email"
                placeholder="admin"
                value={formData.username}
                onChange={handleChange}
                icon={User}
                autoFocus
                autoComplete="username"
                error={errors.username}
            />
          </motion.div>

          {/* Password */}
          <motion.div variants={itemVariants}>
            <PasswordInput
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                error={errors.password}
            />
          </motion.div>

          {/* Forgot password */}
          <motion.div variants={itemVariants} className="mb-1.5">
            <Link
                to="/forgot-password"
                className="text-xs text-[#4A90E2] hover:text-[#6ba3e0] transition-colors relative
              after:absolute after:left-0 after:-bottom-px after:h-px after:w-0
              after:bg-[#4A90E2]/60 after:transition-all after:duration-300
              hover:after:w-full"
            >
              Forgot password?
            </Link>
          </motion.div>

          {/* Remember me */}
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <motion.div
                className="relative flex items-center justify-center"
                whileTap={{ scale: 0.88 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            >
              <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleChange}
                  className="
                w-4 h-4 rounded border-white/20 bg-[#161b22]
                text-[#4A90E2] cursor-pointer
                focus:ring-2 focus:ring-[#4A90E2]/50 focus:ring-offset-0
              "
              />
            </motion.div>
            <label
                htmlFor="rememberMe"
                className="text-sm text-[#8b949e] cursor-pointer select-none hover:text-[#c9d1d9] transition-colors duration-200"
            >
              Keep me signed in
            </label>
          </motion.div>

          {/* Submit */}
          <motion.div variants={itemVariants}>
            <GlassButton isLoading={isLoading} />
          </motion.div>
        </motion.form>
      </AuthLayout>
  );
}