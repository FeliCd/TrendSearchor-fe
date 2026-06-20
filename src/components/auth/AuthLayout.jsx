import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/layout/Logo';

export default function AuthLayout({
  children,
  title,
  subtitle,
  isWide = false,
}) {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const isRegister = location.pathname === '/register';
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#151515] p-6 text-white relative selection:bg-[#1231f4] selection:text-white">
      
      {/* Very subtle background noise/grid if desired, but keep it minimal */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        transition={{ duration: 0.4 }}
        className={`w-full ${isWide ? 'max-w-[700px]' : 'max-w-[480px]'} relative z-10 flex flex-col`}
      >
        {/* Centered Logo */}
        <div className="flex items-center justify-center mb-10">
          <Link to="/">
            <Logo variant="navbar" className="scale-125" />
          </Link>
        </div>

        {/* Tabs */}
        {(isLogin || isRegister) && (
          <div className="flex gap-4 mb-8">
            <Link
              to="/login"
              className={`flex-1 pb-3 text-center text-sm font-semibold tracking-wider uppercase transition-colors border-b-2 ${
                isLogin
                  ? 'text-white border-white'
                  : 'text-gray-500 border-gray-800 hover:text-gray-300'
              }`}
            >
              Log In
            </Link>
            <Link
              to="/register"
              className={`flex-1 pb-3 text-center text-sm font-semibold tracking-wider uppercase transition-colors border-b-2 ${
                isRegister
                  ? 'text-white border-white'
                  : 'text-gray-500 border-gray-800 hover:text-gray-300'
              }`}
            >
              Register
            </Link>
          </div>
        )}

        {/* Form Container */}
        <div className="w-full">
          {/* Header */}
          {title && (
            <div className="mb-8">
              <h1 className="text-3xl font-black text-white tracking-tight mb-2">{title}</h1>
              {subtitle && <p className="text-sm font-medium text-gray-400">{subtitle}</p>}
            </div>
          )}

          {children}

          {/* Footer */}
          <div className="mt-10 flex justify-center">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Return to homepage
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
