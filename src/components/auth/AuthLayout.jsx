import { ArrowRight, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ 
  title, 
  subtitle, 
  icon, 
  children, 
  footerText, 
  footerLinkText, 
  footerLinkTo,
  iconColorClass = "text-primary-500",
  iconBgClass = "bg-primary-500/10",
  iconBorderClass = "border-primary-500/20",
  shadowClass = "shadow-primary-500/5",
  linkHoverClass = "text-primary-400 hover:text-primary-300"
}) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 animate-fade-in py-12">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center animate-slide-up">
          <div className={`mx-auto h-12 w-12 ${iconBgClass} rounded-xl flex items-center justify-center border ${iconBorderClass} mb-4`}>
            {icon}
          </div>
          <h2 className="text-3xl font-display font-bold tracking-tight text-white">
            {title}
          </h2>
          <p className="mt-2 text-sm text-[#8b949e]">
            {subtitle}
          </p>
        </div>

        <div className={`card shadow-2xl ${shadowClass} animate-slide-up`} style={{ animationDelay: '0.1s' }}>
          {children}
          
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#30363d]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#161b22] text-[#8b949e]">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-[#30363d] rounded-lg shadow-sm bg-[#0d1117] text-sm font-medium text-[#c9d1d9] hover:bg-[#21262d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0d1117] focus:ring-[#30363d] transition-colors"
            >
              <Github className="h-5 w-5 mr-2" />
              GitHub
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-[#8b949e] animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {footerText}{' '}
          <Link to={footerLinkTo} className={`font-medium ${linkHoverClass} transition-colors inline-flex items-center gap-1 group`}>
            {footerLinkText}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </p>
      </div>
    </div>
  );
}
