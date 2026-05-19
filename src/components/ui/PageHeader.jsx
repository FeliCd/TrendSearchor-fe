import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PageHeader({ title, description, action, actionLabel, onAction }) {
  return (
    <div className="border-b border-white/[0.04] bg-[#0d1117]/70 backdrop-blur-xl sticky top-0 z-20">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white">{title}</h1>
              <div className="h-5 w-px bg-white/10 hidden sm:block" />
              {description && (
                <p className="text-sm text-[#8b949e] hidden sm:block">{description}</p>
              )}
            </div>
            {description && (
              <p className="text-sm text-[#8b949e] mt-0.5 sm:hidden">{description}</p>
            )}
          </div>
          {action && (
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={onAction}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold
                bg-blue-600 hover:bg-blue-500 text-white transition-all duration-200
                shadow-lg shadow-blue-600/20 border border-blue-600/30
                hover:shadow-blue-500/30"
            >
              {action}
              <span>{actionLabel}</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
