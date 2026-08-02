import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  RefreshCw,
  FileText,
  MessageSquare,
  BookOpen,
  Tag,
  AlignLeft,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Plus,
  Info,
  ShieldCheck,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { paperUploadService } from '@/services/paperUploadService';
import { topicService } from '@/services/topicService';
import { LICENSE_OPTIONS, PUBLICATION_TYPE_OPTIONS } from '@/constants/paperOptions';

// Tag Input
function TagInput({ label, icon: Icon, values, onChange, placeholder, required, hint, validate, validationMessage }) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      if (validate && !validate(trimmed)) {
        setError(validationMessage || 'Invalid input');
        return;
      }
      if (!values.includes(trimmed)) {
        onChange([...values, trimmed]);
      }
    }
    setInputValue('');
    setError('');
  };

  const removeTag = (tag) => onChange(values.filter((t) => t !== tag));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div>
      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
        <Icon className="w-3.5 h-3.5" />
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          {values.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0058be]/10 border border-[#0058be]/30 text-[#5ba3ff] text-xs font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-red-400 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (error) setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-[#1e1e1e] border-2 border-gray-800 text-white text-sm px-3 py-1.5 focus:border-[#0058be] focus:outline-none transition-colors placeholder-gray-600"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-3 py-1.5 border-2 border-gray-700 bg-[#1e1e1e] text-gray-400 hover:border-[#0058be] hover:text-[#5ba3ff] transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {error && <p className="text-[10px] text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}

export default function EditAndResubmitModal({ paper, onClose, onSuccess }) {
  const abstractRef = useRef(null);

  const initialAuthors = (paper.authors || [])
    .map((a) => (typeof a === 'string' ? a : a.name))
    .filter(Boolean);

  const initialJournals = (paper.journals || [])
    .map((j) => (typeof j === 'string' ? j : j.name))
    .filter(Boolean);

  const initialKeywords = (paper.keywords || [])
    .map((k) => (typeof k === 'string' ? k : k.name))
    .filter(Boolean);

  const [form, setForm] = useState({
    title: paper.title || '',
    paperUri: paper.paperUri || '',
    authors: initialAuthors,
    journals: initialJournals,
    keywords: initialKeywords,
    license: paper.license || 'CC_BY',
    publicationType: paper.publicationType || 'ORIGINAL_RESEARCH',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const feedback = paper.statusComments || paper.rejectionReason;

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const abstractText = abstractRef.current?.innerHTML || paper.abstractText || '';
    const plainText = abstractRef.current?.textContent?.trim() || '';

    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!plainText && !paper.abstractText) {
      setError('Abstract is required.');
      return;
    }
    if (form.journals.length === 0) {
      setError('At least one journal or conference is required.');
      return;
    }
    if (form.keywords.length === 0) {
      setError('At least one keyword is required.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await paperUploadService.resubmitPaper(paper.id, {
        title: form.title.trim(),
        abstractText,
        paperUri: form.paperUri.trim(),
        authors: form.authors,
        journals: form.journals,
        keywords: form.keywords,
        year: paper.year || new Date().getFullYear(),
        license: form.license,
        publicationType: form.publicationType,
      });

      onSuccess('Paper resubmitted successfully! It is now back in the pending moderation queue.');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resubmit paper. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-[#1e1e1e] border-2 border-gray-800 text-white text-sm px-3 py-1.5 focus:border-[#0058be] focus:outline-none transition-colors placeholder-gray-600';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        className="relative w-full max-w-2xl bg-[#151515] border-2 border-gray-800 p-6 overflow-y-auto max-h-[90vh]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="w-10 h-10 border-2 border-[#0058be] flex items-center justify-center bg-[#0058be]/10">
            <RotateCcw className="w-5 h-5 text-[#5ba3ff]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Edit & Resubmit Paper</h3>
            <p className="text-xs text-gray-500 mt-0.5">Revise your paper based on admin feedback and resubmit for review.</p>
          </div>
        </div>

        {/* Admin Feedback Callout */}
        {feedback && (
          <div className="p-4 bg-red-500/10 border-2 border-red-500/30 mb-5">
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-widest mb-1">
              <MessageSquare className="w-4 h-4" />
              Admin Feedback / Rejection Reason
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{feedback}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
              <FileText className="w-3.5 h-3.5" />
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={handleChange('title')}
              required
              className={inputClass}
            />
          </div>

          {/* Paper URI */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
              <FileText className="w-3.5 h-3.5" />
              PDF / Article Link (URI)
            </label>
            <input
              type="url"
              value={form.paperUri}
              onChange={handleChange('paperUri')}
              placeholder="https://example.com/paper.pdf"
              className={inputClass}
            />
          </div>

          {/* License & Publication Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                License
              </label>
              <select
                value={form.license}
                onChange={handleChange('license')}
                className={`${inputClass} cursor-pointer`}
              >
                {LICENSE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                Publication Type
              </label>
              <select
                value={form.publicationType}
                onChange={handleChange('publicationType')}
                className={`${inputClass} cursor-pointer`}
              >
                {PUBLICATION_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Abstract */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
              <AlignLeft className="w-3.5 h-3.5" />
              Abstract <span className="text-red-400">*</span>
            </label>
            <div
              ref={abstractRef}
              contentEditable
              suppressContentEditableWarning
              dangerouslySetInnerHTML={{ __html: paper.abstractText || '' }}
              className="w-full min-h-[140px] max-h-[200px] bg-[#1e1e1e] border-2 border-gray-800 text-white text-sm px-4 py-3 focus:border-[#0058be] focus:outline-none transition-colors overflow-y-auto leading-relaxed"
            />
          </div>

          {/* Journals */}
          <TagInput
            label="Journals / Conferences"
            icon={BookOpen}
            values={form.journals}
            onChange={(journals) => setForm((prev) => ({ ...prev, journals }))}
            placeholder="Add journal name and press Enter..."
            required
          />

          {/* Keywords */}
          <TagInput
            label="Keywords / Topics"
            icon={Tag}
            values={form.keywords}
            onChange={(keywords) => setForm((prev) => ({ ...prev, keywords }))}
            placeholder="Add keyword and press Enter..."
            required
          />

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-red-400 flex items-center gap-2"
              >
                <XCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-3 pt-3 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#0058be] hover:bg-[#004395] border-2 border-transparent text-white text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-40"
            >
              {submitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4" />
              )}
              {submitting ? 'Resubmitting...' : 'Resubmit Paper'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
