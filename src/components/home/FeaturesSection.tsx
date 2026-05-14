import { BarChart3, Bell, Bookmark, GitCompare, Search, Shield } from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Trend Visualization',
    description: 'Interactive line charts showing publication volume for any keyword across years. Compare multiple topics side-by-side.',
    color: 'bg-primary-600/10 text-primary-400 border-primary-600/20',
  },
  {
    icon: Search,
    title: 'Smart Paper Search',
    description: 'Search by keyword, author, or journal with multi-condition filtering. Sort by relevance, year, or citation count.',
    color: 'bg-accent-500/10 text-accent-400 border-accent-500/20',
  },
  {
    icon: GitCompare,
    title: 'Keyword Comparison',
    description: 'Compare the growth trajectory of multiple research topics on the same chart to identify dominant and emerging themes.',
    color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  },
  {
    icon: Bell,
    title: 'Follow & Notify',
    description: 'Follow journals and research topics. Get notified when new papers matching your interests are published.',
    color: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  },
  {
    icon: Bookmark,
    title: 'Personal Bookmarks',
    description: 'Save papers and keywords with personal notes. Organize your reference list and revisit them anytime.',
    color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    description: 'Researcher, Lecturer/Student, and Admin roles. Advanced analytics unlocked for Researchers.',
    color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display font-bold text-3xl text-[#e6edf3] mb-4">
            Everything researchers need
          </h2>
          <p className="text-[#8b949e] max-w-xl mx-auto text-sm leading-relaxed">
            From broad trend discovery to deep paper analysis — TrendScholar covers the full research intelligence workflow.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="card hover:border-[#30363d] transition-all duration-200 group"
            >
              <div className={`inline-flex p-2.5 rounded-lg border ${color} mb-4`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-[#e6edf3] mb-2 text-sm">{title}</h3>
              <p className="text-[#8b949e] text-xs leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
