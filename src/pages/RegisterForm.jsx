import { ChevronDown, ArrowRight, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FormInput from '@/components/ui/FormInput';
import PasswordInput from '@/components/ui/PasswordInput';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.07, delayChildren: 0.05 },
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

/* ─── Glassmorphism Submit Button ────────────────────────────────────────── */
function GlassSubmitButton({ isLoading }) {
    return (
        <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={!isLoading ? { scale: 1.018, y: -1 } : {}}
            whileTap={!isLoading ? { scale: 0.975 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            style={{
                background:
                    'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                border: '1px solid rgba(255,255,255,0.22)',
                boxShadow:
                    '0 4px 24px rgba(74,144,226,0.18), 0 1.5px 0 rgba(255,255,255,0.14) inset',
            }}
            className="
        relative w-full py-2.5 px-4 rounded-xl
        text-sm font-semibold text-white tracking-wide
        disabled:opacity-40 disabled:cursor-not-allowed
        flex items-center justify-center gap-2 mt-2
        overflow-hidden group
      "
        >
            {/* Shimmer sweep on hover */}
            <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)',
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
                        <LoadingSpinner label="Creating account..." />
                    </motion.span>
                ) : (
                    <motion.span
                        key="label"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                    >
                        <UserPlus className="w-4 h-4" />
                        Create account
                        <motion.span
                            animate={{ x: [0, 3, 0] }}
                            transition={{
                                repeat: Infinity,
                                repeatDelay: 2.5,
                                duration: 0.6,
                                ease: 'easeInOut',
                            }}
                        >
                            <ArrowRight className="w-4 h-4" />
                        </motion.span>
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
}

/* ─── Gender Select ──────────────────────────────────────────────────────── */
function GenderSelect({ value, onChange, error }) {
    return (
        <motion.div variants={itemVariants} className="space-y-1.5">
            <label htmlFor="gender" className="text-sm font-medium text-[#c9d1d9]">
                Gender
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg
                        className={`w-4 h-4 ${error ? 'text-red-400/60' : 'text-[#8b949e]'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                </div>
                <select
                    id="gender"
                    name="gender"
                    value={value}
                    onChange={onChange}
                    className={`w-full pl-10 pr-9 py-2.5 bg-[#161b22] border rounded-xl text-[#c9d1d9] text-sm
            placeholder:text-[#484f58] focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
                        error
                            ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50'
                            : 'border-white/10 focus:ring-[#4A90E2]/50 focus:border-[#4A90E2]/50'
                    }`}
                >
                    <option value="" disabled className="text-[#484f58] bg-[#0d1117]">
                        Select gender
                    </option>
                    <option value="MALE" className="bg-[#0d1117]">Male</option>
                    <option value="FEMALE" className="bg-[#0d1117]">Female</option>
                    <option value="OTHERS" className="bg-[#0d1117]">Others</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#8b949e]">
                    <ChevronDown className="w-3.5 h-3.5" />
                </div>
            </div>
            <AnimatePresence>
                {error && (
                    <motion.p
                        key="gender-error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs text-red-400 mt-1"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ─── Register Form ──────────────────────────────────────────────────────── */
export default function RegisterForm({
                                         formData,
                                         errors,
                                         isLoading,
                                         handleChange,
                                         handleSubmit,
                                     }) {
    return (
        <motion.form
            className="space-y-5"
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                {/* Username */}
                <motion.div variants={itemVariants}>
                    <FormInput
                        id="username"
                        name="username"
                        label="Username"
                        placeholder="johndoe"
                        value={formData.username}
                        onChange={handleChange}
                        icon={() => (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        )}
                        autoFocus
                        autoComplete="username"
                        error={errors.username}
                    />
                </motion.div>

                {/* Email */}
                <motion.div variants={itemVariants}>
                    <FormInput
                        id="mail"
                        name="mail"
                        type="email"
                        label="Email address"
                        placeholder="you@example.com"
                        value={formData.mail}
                        onChange={handleChange}
                        icon={() => (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        )}
                        autoComplete="email"
                        error={errors.mail}
                    />
                </motion.div>

                {/* Password */}
                <motion.div variants={itemVariants}>
                    <PasswordInput
                        id="password"
                        name="password"
                        label="Password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        autoComplete="new-password"
                        helperText={
                            errors.password
                                ? undefined
                                : 'Min 9 chars: 1 uppercase, 1 number, 1 special char.'
                        }
                    />
                </motion.div>

                {/* Phone */}
                <motion.div variants={itemVariants}>
                    <FormInput
                        id="phone"
                        name="phone"
                        type="tel"
                        label="Phone Number"
                        placeholder="0912345678"
                        value={formData.phone}
                        onChange={handleChange}
                        icon={() => (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        )}
                        autoComplete="tel"
                        error={errors.phone}
                    />
                </motion.div>

                {/* Date of Birth */}
                <motion.div variants={itemVariants}>
                    <FormInput
                        id="dob"
                        name="dob"
                        type="date"
                        label="Date of Birth"
                        value={formData.dob}
                        onChange={handleChange}
                        icon={() => (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        )}
                        error={errors.dob}
                    />
                </motion.div>

                {/* Gender */}
                <GenderSelect
                    value={formData.gender}
                    onChange={handleChange}
                    error={errors.gender}
                />

                {/* Workplace — full width */}
                <motion.div variants={itemVariants} className="sm:col-span-2">
                    <FormInput
                        id="workplace"
                        name="workplace"
                        label="Workplace / University"
                        placeholder="FPT University"
                        value={formData.workplace}
                        onChange={handleChange}
                        icon={() => (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        )}
                        error={errors.workplace}
                    />
                </motion.div>

            </div>

            {/* Submit */}
            <motion.div variants={itemVariants}>
                <GlassSubmitButton isLoading={isLoading} />
            </motion.div>
        </motion.form>
    );
}