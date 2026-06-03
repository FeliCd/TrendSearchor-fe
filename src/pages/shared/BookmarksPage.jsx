import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Bookmark, ExternalLink, Network, Search, Hash, ArrowRight, BookOpen, Loader2, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/ui/DashboardLayout';
import { bookmarkService } from '@/services/bookmarkService';

export default function BookmarksPage() {
  const [rawBookmarks, setRawBookmarks] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bookmarkService.getBookmarks({ page: 0, size: 100 });
      const bookmarks = data?.content || data || [];
      setRawBookmarks(Array.isArray(bookmarks) ? bookmarks : []);
    } catch (err) {
      console.error('Failed to fetch bookmarks:', err);
      setRawBookmarks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  // Transform bookmarks into graph nodes
  const nodes = useMemo(() => {
    return rawBookmarks
      .filter(b => b.paper || b.keyword)
      .map(b => {
        if (b.paper) {
          return {
            id: String(b.id),
            bookmarkId: b.id,
            title: b.paper.title || 'Untitled Paper',
            url: b.paper.paperUri || '#',
            summary: `${b.paper.year || 'N/A'} • ${b.paper.citationCount || 0} citations`,
            tags: b.paper.keywords || [],
            type: 'PAPER',
            externalId: b.paper.externalId,
          };
        } else {
          return {
            id: String(b.id),
            bookmarkId: b.id,
            title: b.keyword.displayName || b.keyword.name,
            url: '#',
            summary: `Keyword bookmark`,
            tags: [b.keyword.displayName || b.keyword.name],
            type: 'KEYWORD',
          };
        }
      });
  }, [rawBookmarks]);

  // Compute relations based on shared keywords
  const nodesWithRelations = useMemo(() => {
    return nodes.map(node => {
      const relatedIds = nodes
        .filter(other => other.id !== node.id && node.tags.some(t => other.tags.includes(t)))
        .map(other => other.id);
      return { ...node, relatedIds };
    });
  }, [nodes]);

  // Derive unique tags and their counts
  const tagsWithCounts = useMemo(() => {
    const counts = { 'All': nodesWithRelations.length };
    nodesWithRelations.forEach(node => {
      node.tags.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => {
      if (a[0] === 'All') return -1;
      if (b[0] === 'All') return 1;
      return b[1] - a[1];
    });
  }, [nodesWithRelations]);

  // Filter nodes for the middle pane
  const filteredNodes = useMemo(() => {
    return nodesWithRelations.filter(node => {
      const matchesSearch = search === '' || node.title.toLowerCase().includes(search.toLowerCase()) || node.summary.toLowerCase().includes(search.toLowerCase());
      const matchesTag = selectedTag === 'All' || node.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [nodesWithRelations, search, selectedTag]);

  // The currently selected node for the right pane
  const activeNode = useMemo(() => {
    return nodesWithRelations.find(n => n.id === selectedNodeId);
  }, [nodesWithRelations, selectedNodeId]);

  const handleDelete = async (bookmarkId) => {
    setDeleting(bookmarkId);
    try {
      await bookmarkService.removeBookmark(bookmarkId);
      setRawBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
      if (selectedNodeId === String(bookmarkId)) {
        setSelectedNodeId(null);
      }
    } catch (err) {
      console.error('Failed to delete bookmark:', err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <DashboardLayout 
      title="Knowledge Graph" 
      description="Navigate your bookmarks as an interconnected network of ideas."
    >
      <div className="h-[calc(100vh-180px)] min-h-[600px] flex gap-4 md:gap-6 flex-col lg:flex-row">
        
        {/* PANE 1: TAG EXPLORER (ROOTS) */}
        <div className="w-full lg:w-1/4 h-full flex flex-col bg-[#151515] border-2 border-gray-800">
          <div className="p-4 border-b-2 border-gray-800 bg-[#1e1e1e]">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-white flex items-center gap-2">
              <Hash className="w-4 h-4 text-[#0058be]" /> Tag Explorer
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 text-gray-500 animate-spin" /></div>
            ) : tagsWithCounts.length <= 1 ? (
              <div className="text-center py-10 text-[10px] font-black uppercase tracking-widest text-gray-500">
                No bookmarks yet
              </div>
            ) : (
              tagsWithCounts.map(([tag, count]) => (
                <button
                  key={tag}
                  onClick={() => { setSelectedTag(tag); setSelectedNodeId(null); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors border-l-4 ${
                    selectedTag === tag 
                      ? 'border-[#0058be] bg-[#0058be]/10 text-white' 
                      : 'border-transparent text-gray-400 hover:bg-[#1e1e1e] hover:text-white'
                  }`}
                >
                  <span className="text-sm font-bold truncate pr-2">{tag}</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 ${selectedTag === tag ? 'bg-[#0058be] text-white' : 'bg-gray-800 text-gray-400'}`}>
                    {count}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* PANE 2: NODE LIST (VERTICES) */}
        <div className="w-full lg:w-1/3 h-full flex flex-col bg-[#151515] border-2 border-gray-800">
          <div className="p-4 border-b-2 border-gray-800 bg-[#1e1e1e]">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search nodes..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#151515] border-2 border-gray-700 text-white pl-9 pr-4 py-2 text-xs font-bold focus:outline-none focus:border-[#0058be] transition-colors"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 text-gray-500 animate-spin" /></div>
            ) : filteredNodes.length === 0 ? (
              <div className="text-center py-10 text-[10px] font-black uppercase tracking-widest text-gray-500">
                {nodesWithRelations.length === 0 ? 'Bookmark papers to build your Knowledge Graph' : 'No nodes found'}
              </div>
            ) : (
              filteredNodes.map(node => (
                <div key={node.id} className="relative group">
                  <button
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`w-full text-left p-4 border-2 transition-all ${
                      selectedNodeId === node.id 
                        ? 'border-[#0058be] bg-[#0058be]/5' 
                        : 'border-gray-800 bg-[#1e1e1e] hover:border-gray-600'
                    }`}
                  >
                    <h3 className={`text-sm font-bold mb-2 line-clamp-2 ${selectedNodeId === node.id ? 'text-[#0058be]' : 'text-white'}`}>
                      {node.title}
                    </h3>
                    <p className="text-[10px] text-gray-500 mb-2">{node.summary}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {node.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-gray-500 bg-[#151515] px-1.5 py-0.5 border-2 border-gray-800">
                          {tag}
                        </span>
                      ))}
                      {node.tags.length > 2 && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 bg-[#151515] px-1.5 py-0.5 border-2 border-gray-800">
                          +{node.tags.length - 2}
                        </span>
                      )}
                    </div>
                    {node.relatedIds.length > 0 && (
                      <div className="mt-2 text-[9px] font-black text-[#0058be] uppercase tracking-widest">
                        {node.relatedIds.length} connection{node.relatedIds.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(node.bookmarkId); }}
                    disabled={deleting === node.bookmarkId}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 text-gray-600 hover:text-red-500 transition-all"
                    title="Remove bookmark"
                  >
                    {deleting === node.bookmarkId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PANE 3: NODE DETAILS (EDGES) */}
        <div className="w-full lg:flex-1 h-full bg-[#151515] border-2 border-gray-800 flex flex-col">
          {!activeNode ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-50">
              <Network className="w-16 h-16 text-gray-600 mb-4" />
              <p className="text-[11px] font-black uppercase tracking-widest text-white">Select a node to view connections</p>
            </div>
          ) : (
            <>
              {/* Detail Header */}
              <div className="p-6 md:p-8 border-b-2 border-gray-800 bg-[#1e1e1e]">
                <div className="flex flex-wrap gap-2 mb-4">
                  {activeNode.tags.map(tag => (
                    <button 
                      key={tag}
                      onClick={() => { setSelectedTag(tag); }}
                      className="text-[10px] font-black uppercase tracking-widest text-[#0058be] bg-[#0058be]/10 px-2.5 py-1 border-2 border-[#0058be]/20 hover:border-[#0058be] transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight">
                  {activeNode.title}
                </h2>
                <p className="text-sm text-gray-300 font-medium leading-relaxed border-l-4 border-gray-700 pl-4 py-1 mb-6">
                  {activeNode.summary}
                </p>
                <div className="flex gap-3">
                  {activeNode.url && activeNode.url !== '#' && (
                    <a 
                      href={activeNode.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-[#0058be] hover:bg-[#004a9f] text-white text-[10px] font-black uppercase tracking-widest transition-colors border-2 border-[#0058be]"
                    >
                      <ExternalLink className="w-4 h-4" /> Open Paper
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(activeNode.bookmarkId)}
                    disabled={deleting === activeNode.bookmarkId}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-gray-800 text-gray-400 hover:border-red-500 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors"
                  >
                    {deleting === activeNode.bookmarkId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Remove
                  </button>
                </div>
              </div>

              {/* Connected Nodes (Edges) */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#151515]">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2 mb-6">
                  <Network className="w-4 h-4 text-[#0058be]" /> Connected Nodes ({activeNode.relatedIds.length})
                </h3>
                
                {activeNode.relatedIds.length === 0 ? (
                  <p className="text-sm font-bold text-gray-600">No connections found. Bookmark more papers with shared keywords to build your knowledge graph.</p>
                ) : (
                  <div className="space-y-3">
                    {activeNode.relatedIds.map(rId => {
                      const relatedNode = nodesWithRelations.find(n => n.id === rId);
                      if (!relatedNode) return null;
                      const sharedTags = activeNode.tags.filter(t => relatedNode.tags.includes(t));
                      return (
                        <button
                          key={rId}
                          onClick={() => setSelectedNodeId(rId)}
                          className="w-full flex items-center justify-between p-4 border-2 border-gray-800 bg-[#1e1e1e] hover:border-[#0058be] group transition-all text-left"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <BookOpen className="w-4 h-4 text-gray-600 group-hover:text-[#0058be] transition-colors shrink-0" />
                              <span className="text-sm font-bold text-white truncate">{relatedNode.title}</span>
                            </div>
                            {sharedTags.length > 0 && (
                              <div className="flex gap-1 ml-7 mt-1">
                                {sharedTags.slice(0, 3).map(t => (
                                  <span key={t} className="text-[8px] font-black uppercase tracking-widest text-[#0058be] bg-[#0058be]/10 px-1 py-0.5">{t}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-[#0058be] transition-colors shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
