import { Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const PLATFORM_LINKS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Search', href: '/search' },
  { label: 'Trends', href: '/trends' },
];

const RESOURCE_LINKS = [
  { label: 'Documentation', href: '#' },
  { label: 'API Reference', href: '#' },
  { label: 'Research Blog', href: '#' },
];

const COMPANY_LINKS = [
  { label: 'About', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'Privacy Policy', href: '#' },
];

const SOCIAL_LINKS = [
  { icon: Github, label: 'GitHub', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
];

function FooterLinkGroup({ title, links }) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-white uppercase tracking-wider">{title}</h4>
      <ul className="space-y-2">
        {links.map(({ label, href }) => (
          <li key={label}>
            <a href={href} className="text-sm text-[#8b949e] hover:text-white transition-colors">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0d1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block group">
              <Logo variant="footer" />
            </Link>
            <p className="text-[#8b949e] text-sm leading-relaxed max-w-xs">
              AI-powered scientific journal trend tracking platform. Stay ahead of the curve with real-time insights from millions of research publications.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-[#161b22] border border-white/10 flex items-center
                    justify-center text-[#8b949e] hover:text-white hover:border-white/20 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterLinkGroup title="Platform" links={PLATFORM_LINKS} />
          <FooterLinkGroup title="Resources" links={RESOURCE_LINKS} />
          <FooterLinkGroup title="Company" links={COMPANY_LINKS} />
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#8b949e]">
            © {new Date().getFullYear()} TrendSearchor. All rights reserved.
          </p>
          <p className="text-xs text-[#8b949e]">
            Data powered by Semantic Scholar · OpenAlex · Crossref
          </p>
        </div>
      </div>
    </footer>
  );
}
