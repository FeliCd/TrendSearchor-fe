import { Github, Twitter, Linkedin, ArrowRight } from 'lucide-react';
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
    <div className="flex flex-col gap-4">
      <h4 className="text-xs font-black text-white uppercase tracking-widest">{title}</h4>
      <ul className="flex flex-col gap-3">
        {links.map(({ label, href }) => (
          <li key={label}>
            <a href={href} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
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
    <footer className="w-full flex flex-col justify-center max-w-4xl mx-auto px-8 py-16">
      <div className="flex flex-col gap-8 w-full max-w-2xl">
        <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
          <Logo variant="footer" className="scale-110 origin-left" />
        </Link>

        <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed">
          AI-powered scientific journal trend tracking platform. Stay ahead of the curve with real-time insights from millions of research publications.
        </p>

        <div className="flex items-center gap-3">
          {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="w-10 h-10 rounded-sm bg-[#1e1e1e] flex items-center justify-center text-gray-400 hover:text-white transition-all"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>

      <div className="mt-16 w-full max-w-3xl">
        <div className="grid grid-cols-3 gap-8">
          <FooterLinkGroup title="Platform" links={PLATFORM_LINKS} />
          <FooterLinkGroup title="Resources" links={RESOURCE_LINKS} />
          <FooterLinkGroup title="Company" links={COMPANY_LINKS} />
        </div>
      </div>

      <div className="mt-20 pt-8 w-full">
        <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
          © {new Date().getFullYear()} TrendSearchor. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
