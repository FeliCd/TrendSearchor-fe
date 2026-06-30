import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Search,
  BookOpen,
  BarChart2,
  GraduationCap,
  FlaskConical,
  Shield,
  Bell,
  UserCircle,
  Upload,
  ClipboardCheck,
} from 'lucide-react';

const ACADEMIC_CONFIG = {
    roleLabel: 'Academic',
    subtitle: 'Academic Portal',
    accentColor: 'emerald-400',
    avatarBgColor: 'bg-emerald-500',
    HeaderIcon: GraduationCap,
    navItems: [
      { to: '/academic', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/academic/search', label: 'Search Papers', icon: Search },
      { to: '/academic/trends', label: 'Trends', icon: TrendingUp },
      { to: '/academic/bookmarks', label: 'Bookmarks', icon: BookOpen },
      { to: '/academic/notifications', label: 'Notifications', icon: Bell, comingSoon: true },
      { to: '/academic/profile', label: 'My Profile', icon: UserCircle },
    ],
};

export const ROLE_SIDEBAR_CONFIG = {
  ADMIN: {
    roleLabel: 'Admin Panel',
    subtitle: 'Management',
    accentColor: '[#0058be]',
    avatarBgColor: 'bg-[#246E52]',
    HeaderIcon: Shield,
    navItems: [
      { to: '/admin/users', label: 'User Management', icon: Users, end: false },
      { to: '/admin/papers/pending', label: 'Paper Moderation', icon: ClipboardCheck },
      { to: '/admin/profile', label: 'My Profile', icon: UserCircle },
    ],
  },
  LECTURER: ACADEMIC_CONFIG,
  STUDENT: ACADEMIC_CONFIG,
  RESEARCHER: {
    roleLabel: 'Researcher',
    subtitle: 'Research Portal',
    accentColor: 'purple-400',
    avatarBgColor: 'bg-purple-500',
    HeaderIcon: FlaskConical,
    navItems: [
      { to: '/researcher', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/researcher/search', label: 'Search Papers', icon: Search },
      { to: '/researcher/trends', label: 'Trends', icon: TrendingUp },
      { to: '/researcher/analytics', label: 'Analytics', icon: BarChart2, comingSoon: true },
      { to: '/researcher/bookmarks', label: 'Bookmarks', icon: BookOpen },
      { to: '/researcher/upload', label: 'Upload Paper', icon: Upload },
      { to: '/researcher/profile', label: 'My Profile', icon: UserCircle },
    ],
  },
};
