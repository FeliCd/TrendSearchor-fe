import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Users,
  Clock,
  Tag,
  BookOpen,
  Link2,
  ChevronLeft,
  Calendar,
} from 'lucide-react';
import { searchService } from '@/services/searchService';
import PageHeader from '@/components/ui/PageHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const ABSTRACT_STYLES = `
  .paper-article ul { list-style-type: disc; padding-left: 1.25rem; margin: 0.5rem 0; }
  .paper-article ol { list-style-type: decimal; padding-left: 1.25rem; margin: 0.5rem 0; }
  .paper-article b, .paper-article strong { font-weight: 700; color: #e5e7eb; }
  .paper-article i, .paper-article em { font-style: italic; }
  .paper-article u { text-decoration: underline; }
  .paper-article p { margin-bottom: 0.75rem; line-height: 1.7; }
  .paper-article h1, .paper-article h2, .paper-article h3 { font-weight: 700; color: white; margin-top: 1.5rem; margin-bottom: 0.75rem; }
`;

function PageBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.03] z-0"
      style={{
        backgroundImage:
          'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }}
    />
  );
}

export default function PaperDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        setLoading(true);
        const data = await searchService.getPaper(id);
        setPaper(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch paper details.');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchPaper();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#151515] flex flex-col items-center justify-center relative">
        <PageBackground />
        <LoadingSpinner />
        <p className="text-gray-400 mt-4 text-sm font-medium">Loading paper details...</p>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="min-h-screen bg-[#151515] flex flex-col items-center justify-center relative px-4 text-center">
        <PageBackground />
        <div className="w-16 h-16 border-2 border-red-500/20 bg-red-500/5 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Paper Not Found</h2>
        <p className="text-gray-500 mb-6">{error || 'The requested paper could not be found.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#1e1e1e] border-2 border-gray-800 text-gray-300 hover:text-white hover:border-gray-600 transition-all font-black uppercase tracking-widest text-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    );
  }

  const authors = paper.authors || [];
  const keywords = paper.keywords || [];
  const journals = paper.journals || [];

  return (
    <div className="min-h-screen bg-[#151515] relative">
      <PageBackground />
      <style>{ABSTRACT_STYLES}</style>

      <div className="relative z-10 w-full max-w-[95%] mx-auto pb-20">
        {/* Navigation Bar */}
        <div className="px-6 py-4 flex items-center mb-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <div className="px-6">
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a1a1a] border-2 border-gray-800"
          >
            {/* Article Header */}
            <header className="p-8 border-b-2 border-gray-800 bg-[#1e1e1e]">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {journals.map((journal) => {
                  const name = journal.name || journal;
                  return (
                    <span key={name} className="px-2.5 py-1 bg-[#0058be]/10 border border-[#0058be]/30 text-[#5ba3ff] text-[10px] font-black uppercase tracking-widest">
                      {name}
                    </span>
                  );
                })}
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-6">
                {paper.title}
              </h1>

              <div className="flex flex-col sm:flex-row gap-6 text-sm text-gray-400">
                {/* Authors list */}
                {authors.length > 0 && (
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                      <Users className="w-3.5 h-3.5" />
                      Authors
                    </div>
                    <p className="font-medium text-gray-300">
                      {authors.map(a => a.name || a).join(', ')}
                    </p>
                  </div>
                )}

                <div className="flex gap-6">
                  {/* Year */}
                  {paper.year && (
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        Published
                      </div>
                      <p className="font-medium text-gray-300">{paper.year}</p>
                    </div>
                  )}

                  {/* Uploader */}
                  {paper.uploadedBy && (
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                        <Clock className="w-3.5 h-3.5" />
                        Uploaded By
                      </div>
                      <p className="font-medium text-gray-300">{paper.uploadedBy}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Source Link */}
              {paper.paperUri && (
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <a
                    href={paper.paperUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#0058be] hover:bg-[#004395] text-white text-xs font-black uppercase tracking-widest transition-colors"
                  >
                    <Link2 className="w-4 h-4" />
                    Access Original Source
                  </a>
                </div>
              )}
            </header>

            {/* Article Body */}
            <div className="p-8">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0058be] mb-4 border-b border-gray-800 pb-2">
                <FileText className="w-4 h-4" />
                Abstract & Details
              </div>
              
              {paper.abstractText ? (
                <div
                  className="paper-article text-base text-gray-300 mb-10 prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: paper.abstractText }}
                />
              ) : (
                <p className="text-gray-500 italic mb-10">No abstract provided for this paper.</p>
              )}

              {/* Keywords */}
              {keywords.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-800">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
                    <Tag className="w-3.5 h-3.5" />
                    Keywords
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-3 py-1 bg-[#1e1e1e] border border-gray-700 text-gray-300 text-xs font-medium"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.article>
        </div>
      </div>
    </div>
  );
}
