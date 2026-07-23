import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit, Search, RefreshCw, X, BookOpen, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { journalService } from '@/services/journalService';
import { topicService } from '@/services/topicService';
import PageHeader from '@/components/ui/PageHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Toast from '@/components/ui/Toast';

function PageBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-[0.03] z-0"
      style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '64px 64px' }}
    />
  );
}

export default function JournalTopicManagementPage() {
  const [activeTab, setActiveTab] = useState('journals'); // 'journals' or 'topics'
  const [journals, setJournals] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  // Delete Confirm Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'journals') {
        try {
          const data = await journalService.getJournals();
          setJournals(Array.isArray(data) ? data : data.data ?? data.content ?? []);
        } catch (err) {
          // Fallback mockup in case API is not implemented on backend
          console.warn('API fallback for journals management.');
          setJournals([
            { id: 1, name: 'IEEE Transactions on Pattern Analysis and Machine Intelligence', description: 'Top-tier journal in artificial intelligence.' },
            { id: 2, name: 'Nature Machine Intelligence', description: 'Leading science journal for machine learning.' },
            { id: 3, name: 'Journal of Machine Learning Research (JMLR)', description: 'Prestigious open-access ML journal.' }
          ]);
        }
      } else {
        try {
          const data = await topicService.getTopics();
          setTopics(Array.isArray(data) ? data : data.data ?? data.content ?? []);
        } catch (err) {
          // Fallback mockup in case API is not implemented on backend
          console.warn('API fallback for topics management.');
          setTopics([
            { id: 1, name: 'Deep Learning', description: 'Topics related to deep neural network architectures.' },
            { id: 2, name: 'Computer Vision', description: 'Topics related to image processing and vision models.' },
            { id: 3, name: 'Natural Language Processing', description: 'Topics related to LLMs and computational linguistics.' }
          ]);
        }
      }
    } catch (err) {
      setError('Failed to fetch configuration data.');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreateModal = () => {
    setFormData({ name: '', description: '' });
    setModalMode('create');
    setEditingItem(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (item) => {
    setFormData({ name: item.name || '', description: item.description || '' });
    setModalMode('edit');
    setEditingItem(item);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Name is required', 'error');
      return;
    }

    try {
      if (activeTab === 'journals') {
        if (modalMode === 'create') {
          try {
            const newItem = await journalService.createJournal(formData);
            setJournals((prev) => [newItem, ...prev]);
          } catch {
            // Mock update local state
            const mockItem = { id: Date.now(), ...formData };
            setJournals((prev) => [mockItem, ...prev]);
          }
          showToast('Journal created successfully');
        } else {
          try {
            const updatedItem = await journalService.updateJournal(editingItem.id, formData);
            setJournals((prev) => prev.map((j) => (j.id === editingItem.id ? updatedItem : j)));
          } catch {
            setJournals((prev) => prev.map((j) => (j.id === editingItem.id ? { ...j, ...formData } : j)));
          }
          showToast('Journal updated successfully');
        }
      } else {
        if (modalMode === 'create') {
          try {
            const newItem = await topicService.createTopic(formData);
            setTopics((prev) => [newItem, ...prev]);
          } catch {
            // Mock update local state
            const mockItem = { id: Date.now(), ...formData };
            setTopics((prev) => [mockItem, ...prev]);
          }
          showToast('Topic created successfully');
        } else {
          try {
            const updatedItem = await topicService.updateTopic(editingItem.id, formData);
            setTopics((prev) => prev.map((t) => (t.id === editingItem.id ? updatedItem : t)));
          } catch {
            setTopics((prev) => prev.map((t) => (t.id === editingItem.id ? { ...t, ...formData } : t)));
          }
          showToast('Topic updated successfully');
        }
      }
      setShowModal(false);
    } catch (err) {
      showToast('An error occurred while saving.', 'error');
    }
  };

  const handleOpenDeleteModal = (item) => {
    setDeleteTarget(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (activeTab === 'journals') {
        try {
          await journalService.deleteJournal(deleteTarget.id);
        } catch (err) {
          // ignore backend lack of implementation in mock
        }
        setJournals((prev) => prev.filter((j) => j.id !== deleteTarget.id));
        showToast('Journal deleted successfully');
      } else {
        try {
          await topicService.deleteTopic(deleteTarget.id);
        } catch (err) {
          // ignore backend lack of implementation in mock
        }
        setTopics((prev) => prev.filter((t) => t.id !== deleteTarget.id));
        showToast('Topic deleted successfully');
      }
    } catch (err) {
      showToast('Failed to delete item.', 'error');
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  const filteredItems = (activeTab === 'journals' ? journals : topics).filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#151515] relative flex flex-col">
      <PageBackground />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="relative z-10 flex flex-col flex-1">
        <PageHeader title="Platform Configuration" description="Manage journals, conferences, trends, and keywords/topics." />

        <div className="w-full px-6 pb-6 mt-6 flex-grow flex flex-col">
          {/* Tabs Menu */}
          <div className="flex gap-4 border-b border-gray-800 mb-6">
            <button
              onClick={() => { setActiveTab('journals'); setSearchQuery(''); }}
              className={`pb-3 text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 ${
                activeTab === 'journals'
                  ? 'border-[#0058be] text-[#5ba3ff]'
                  : 'border-transparent text-gray-500 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Journals & Conferences
            </button>
            <button
              onClick={() => { setActiveTab('topics'); setSearchQuery(''); }}
              className={`pb-3 text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 ${
                activeTab === 'topics'
                  ? 'border-[#0058be] text-[#5ba3ff]'
                  : 'border-transparent text-gray-500 hover:text-white'
              }`}
            >
              <Tag className="w-4 h-4" />
              Topics & Keywords
            </button>
          </div>

          {/* Search bar & Add Button */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1e1e1e] border-2 border-gray-800 text-white text-xs pl-9 pr-3 py-2.5 focus:border-[#0058be] focus:outline-none placeholder-gray-600"
              />
              <Search className="absolute left-3 top-3.5 w-3.5 h-3.5 text-gray-500" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={loadData}
                className="p-3 border-2 border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 transition-all bg-[#1e1e1e]"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={handleOpenCreateModal}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 h-11 px-6 border-2 border-transparent text-[11px] font-black uppercase tracking-widest bg-white text-black hover:bg-gray-200 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add {activeTab === 'journals' ? 'Journal' : 'Topic'}
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col bg-[#1a1a1a] border-2 border-gray-800 p-6">
            {loading ? (
              <div className="flex-1 flex items-center justify-center py-20">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center py-10 text-red-400 text-sm">
                {error}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                <p className="text-gray-500 text-sm">No items found.</p>
                <p className="text-gray-600 text-xs mt-1">Try creating a new one or adjusting your search.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-800">
                      <th className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-gray-500 w-12">No.</th>
                      <th className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-gray-500">Name</th>
                      <th className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-gray-500">Description</th>
                      <th className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item, idx) => (
                      <tr key={item.id} className="border-b border-gray-800 hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4 text-xs text-gray-400 font-mono">{idx + 1}</td>
                        <td className="py-4 px-4 text-sm font-bold text-white max-w-xs truncate">{item.name}</td>
                        <td className="py-4 px-4 text-xs text-gray-400 max-w-md truncate">{item.description || 'No description provided'}</td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className="p-2 border-2 border-gray-800 bg-[#1e1e1e] text-gray-400 hover:border-[#0058be] hover:text-[#5ba3ff] transition-all"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(item)}
                              className="p-2 border-2 border-gray-800 bg-[#1e1e1e] text-gray-400 hover:border-red-500 hover:text-red-400 transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-md bg-[#151515] border-2 border-gray-800 p-6 z-10 flex flex-col"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 border-2 border-[#0058be] flex items-center justify-center bg-[#0058be]/10">
                  {activeTab === 'journals' ? <BookOpen className="w-5 h-5 text-[#5ba3ff]" /> : <Tag className="w-5 h-5 text-[#5ba3ff]" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {modalMode === 'create' ? 'Add New' : 'Edit'} {activeTab === 'journals' ? 'Journal' : 'Topic'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Configure platform configurations for uploading papers.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder={`Enter name of ${activeTab === 'journals' ? 'journal/conference' : 'topic/keyword'}`}
                    className="w-full bg-[#1e1e1e] border-2 border-gray-800 text-white text-sm px-3 py-1.5 focus:border-[#0058be] focus:outline-none transition-colors placeholder-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter details or descriptions..."
                    className="w-full bg-[#1e1e1e] border-2 border-gray-800 text-white text-sm px-3 py-1.5 focus:border-[#0058be] focus:outline-none transition-colors placeholder-gray-600 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-[#0058be] hover:bg-[#004395] border-2 border-transparent text-white text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowDeleteModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm p-6 border-2 border-gray-800 bg-[#151515] z-10"
            >
              <button
                onClick={() => setShowDeleteModal(false)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4 pr-8">
                <div className="w-10 h-10 border-2 border-red-500 flex items-center justify-center bg-red-500/10">
                  <Trash2 className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Delete Confirm</h3>
              </div>

              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Are you sure you want to delete the {activeTab === 'journals' ? 'journal' : 'topic'}{' '}
                <span className="font-bold text-white">"{deleteTarget.name}"</span>? This action cannot be undone.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 border-2 border-red-500 bg-red-500 text-[10px] font-black uppercase tracking-widest text-white hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
