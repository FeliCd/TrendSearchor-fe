import { BarChart3, Bell, Bookmark, GitCompare, Search, Shield } from 'lucide-react';

export const heroData = {
  subTitle: 'Best Research & Analytics Platform',
  titleLine1: 'The First Step',
  titleLine2: 'To a New Career',
  highlightBadge: {
    line1: 'LEARN FROM',
    line2: 'INDUSTRY EXPERTS'
  },
  navigation: [
    { label: 'Search', to: '/search' },
    { label: 'Trends', to: '/trends' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' }
  ]
};

export const featuresData = {
  header: {
    badge: 'Platform Features',
    title: 'Everything researchers need',
    description: 'From broad trend discovery to deep paper analysis — TrendSearchor covers the full research intelligence workflow with style.'
  },
  items: [
    {
      icon: BarChart3,
      title: 'Trend Visualization',
      description: 'Interactive charts showing publication volume for any keyword across years. Compare multiple topics side-by-side.',
      color: '#7bf5ea', // Cyan
    },
    {
      icon: Search,
      title: 'Smart Paper Search',
      description: 'Search by keyword, author, or journal with multi-condition filtering. Sort by relevance, year, or citation count.',
      color: '#8233ff', // Purple
    },
    {
      icon: GitCompare,
      title: 'Keyword Comparison',
      description: 'Compare growth trajectories of multiple research topics on the same chart to identify dominant and emerging themes.',
      color: '#0e77ff', // Blue
    },
    {
      icon: Bell,
      title: 'Follow & Notify',
      description: 'Follow journals and topics. Get notified when new papers matching your interests are published.',
      color: '#ff86c8', // Pink
    },
    {
      icon: Bookmark,
      title: 'Personal Bookmarks',
      description: 'Save papers and keywords with personal notes. Organize your reference list and revisit them anytime.',
      color: '#5b58ff', // Indigo
    },
    {
      icon: Shield,
      title: 'Role-Based Access',
      description: 'Researcher, Lecturer/Student, and Admin roles. Advanced analytics unlocked for Researchers.',
      color: '#7bf5ea', // Cyan
    },
  ]
};

export const statsData = {
  stat1: { value: '50M+', label: 'Papers Indexed' },
  stat2: { value: '10K+', label: 'Active\\nResearchers', rawLabelPart1: 'Active', rawLabelPart2: 'Researchers' },
  stat3: { value: '24/7', label: 'Live Data' },
  stat4: { value: '200+', label: 'Global\\nInstitutions', rawLabelPart1: 'Global', rawLabelPart2: 'Institutions' },
};

export const ctaData = {
  badge: 'Get Started',
  description: 'Join thousands of researchers and lecturers using TrendSearchor to stay ahead of the scientific landscape.',
  primaryAction: {
    text: 'Create free account',
    to: '/register'
  },
  secondaryAction: {
    text: 'Explore dashboard',
    to: '/login'
  },
  trustBadges: ['No credit card', 'Free forever']
};
