import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Bookmark, ExternalLink, Network, Search, Hash,
  ArrowRight, BookOpen, Loader2, Trash2, LayoutList,
  Share2, MousePointerClick, Link2, X
} from 'lucide-react';
import ForceGraph2D from 'react-force-graph-2d';
import { bookmarkService } from '@/services/bookmarkService';
import { collectionService } from '@/services/collectionService';
import PageHeader from '@/components/ui/PageHeader';
import { Folder, FolderPlus } from 'lucide-react';

/* ─── Sub-components ──────────────────────────────────────────────── */

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

function SectionHeader({ icon: Icon, label, count, actions }) {
  return (
    <div className="h-12 px-4 border-b-2 border-gray-800 bg-[#1e1e1e] flex items-center justify-between shrink-0">
      <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white">
        <Icon className="w-4 h-4 text-[#0058be]" />
        {label}
      </span>
      <div className="flex items-center gap-2">
        {count !== undefined && (
          <span className="text-xs font-bold text-gray-400">{count}</span>
        )}
        {actions}
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-14 h-14 border-2 border-gray-800 bg-[#1e1e1e] flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-gray-600" />
      </div>
      <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">{title}</p>
      {subtitle && <p className="text-sm text-gray-600 max-w-[240px] leading-relaxed">{subtitle}</p>}
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────── */

export default function BookmarksPage() {
  const [rawBookmarks, setRawBookmarks]     = useState([]);
  const [networkData, setNetworkData]       = useState({ nodes: [], links: [] });
  const [collections, setCollections]       = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [search, setSearch]                 = useState('');
  const [tagSearch, setTagSearch]           = useState('');
  const [selectedTag, setSelectedTag]       = useState('All');
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [loading, setLoading]               = useState(true);
  const [deleting, setDeleting]             = useState(null);
  const [dragOverId, setDragOverId]         = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');
  const [creatingCollection, setCreatingCollection] = useState(false);
  
  const [deleteModalCollection, setDeleteModalCollection] = useState(null);
  const [deletingCollection, setDeletingCollection] = useState(false);
  // viewMode only controls Pane 3 content
  const [viewMode, setViewMode]             = useState('list');

  const graphRef = useRef(null);
  const [graphDim, setGraphDim] = useState({ w: 800, h: 600 });

  /* ── Data fetching ─────────────────────────────────────────────── */

  const fetchCollections = useCallback(async () => {
    try {
      const data = await collectionService.getCollections();
      setCollections(data || []);
    } catch (err) {
      console.error('Failed to fetch collections:', err);
    }
  }, []);

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: 0, size: 100 };
      if (selectedCollectionId) {
        params.collectionId = selectedCollectionId;
      }
      const data = await bookmarkService.getBookmarks(params);
      setRawBookmarks(Array.isArray(data?.content ?? data) ? (data?.content ?? data) : []);
      try {
        const net = await bookmarkService.getBookmarkNetwork(selectedCollectionId ? { collectionId: selectedCollectionId } : {});
        if (net?.nodes) setNetworkData(net);
        else setNetworkData({ nodes: [], links: [] });
      } catch { setNetworkData({ nodes: [], links: [] }); }
    } catch (err) {
      console.error('Failed to fetch bookmarks:', err);
      setRawBookmarks([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCollectionId]);

  useEffect(() => { fetchCollections(); }, [fetchCollections]);
  useEffect(() => { fetchBookmarks(); }, [fetchBookmarks]);

  // Measure Pane 3 when switching to graph
  useEffect(() => {
    if (viewMode === 'graph' && graphRef.current) {
      setGraphDim({
        w: graphRef.current.clientWidth,
        h: graphRef.current.clientHeight,
      });
    }
  }, [viewMode]);

  /* ── Derived data ──────────────────────────────────────────────── */

  const nodes = useMemo(() =>
    rawBookmarks
      .filter(b => b.paper || b.keyword)
      .map(b => b.paper
        ? {
            id:         String(b.id),
            bookmarkId: b.id,
            title:      b.paper.title || 'Untitled',
            url:        b.paper.paperUri || '#',
            year:       b.paper.year || '—',
            citations:  b.paper.citationCount ?? 0,
            tags:       b.paper.keywords || [],
            type:       'PAPER',
          }
        : {
            id:         String(b.id),
            bookmarkId: b.id,
            title:      b.keyword.displayName || b.keyword.name,
            url:        '#',
            year:       '—',
            citations:  0,
            tags:       [b.keyword.displayName || b.keyword.name],
            type:       'KEYWORD',
          }
      ),
  [rawBookmarks]);

  const nodesWithRelations = useMemo(() =>
    nodes.map(node => {
      const byTag = nodes
        .filter(o => o.id !== node.id && node.tags.some(t => o.tags.includes(t)))
        .map(o => o.id);
      const byCitation = (networkData.links || [])
        .filter(l => l.source === node.id || l.target === node.id)
        .map(l => l.source === node.id ? l.target : l.source);
      return { ...node, relatedIds: [...new Set([...byTag, ...byCitation])] };
    }),
  [nodes, networkData]);

  const graphData = useMemo(() => {
    const gNodes = nodes.map(n => ({ id: n.id, title: n.title }));
    const linkSet = new Set();
    const gLinks = [];
    nodesWithRelations.forEach(node => {
      node.relatedIds.forEach(tid => {
        const k1 = `${node.id}:${tid}`;
        const k2 = `${tid}:${node.id}`;
        if (!linkSet.has(k1) && !linkSet.has(k2)) {
          linkSet.add(k1);
          gLinks.push({ source: node.id, target: tid });
        }
      });
    });
    return { nodes: gNodes, links: gLinks };
  }, [nodes, nodesWithRelations]);

  const tagsWithCounts = useMemo(() => {
    const counts = { All: nodesWithRelations.length };
    nodesWithRelations.forEach(n => n.tags.forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
    return Object.entries(counts).sort(([a], [b]) => a === 'All' ? -1 : b === 'All' ? 1 : 0);
  }, [nodesWithRelations]);

  const filteredTagsWithCounts = useMemo(() => {
    if (!tagSearch) return tagsWithCounts;
    const q = tagSearch.toLowerCase();
    // Always keep 'All' if it exists, otherwise just filter by tag name
    return tagsWithCounts.filter(([tag]) => tag === 'All' || tag.toLowerCase().includes(q));
  }, [tagsWithCounts, tagSearch]);

  const filteredNodes = useMemo(() =>
    nodesWithRelations.filter(n => {
      const q = search.toLowerCase();
      return (!q || n.title.toLowerCase().includes(q)) &&
             (selectedTag === 'All' || n.tags.includes(selectedTag));
    }),
  [nodesWithRelations, search, selectedTag]);

  const activeNode = useMemo(
    () => nodesWithRelations.find(n => n.id === selectedNodeId),
    [nodesWithRelations, selectedNodeId],
  );

  /* ── Handlers ──────────────────────────────────────────────────── */

  const handleDelete = useCallback(async (bookmarkId) => {
    setDeleting(bookmarkId);
    try {
      if (selectedCollectionId) {
        await collectionService.removeBookmarkFromCollection(selectedCollectionId, bookmarkId);
        setRawBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
        if (selectedNodeId === String(bookmarkId)) setSelectedNodeId(null);
        fetchCollections();
      } else {
        await bookmarkService.removeBookmark(bookmarkId);
        setRawBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
        if (selectedNodeId === String(bookmarkId)) setSelectedNodeId(null);
        fetchCollections();
      }
    } catch (err) {
      console.error('Failed to delete bookmark:', err);
    } finally {
      setDeleting(null);
    }
  }, [selectedNodeId, selectedCollectionId, fetchCollections]);

  /* ── View Toggle (shared) ──────────────────────────────────────── */

  const ViewToggle = () => (
    <div className="flex items-center border-2 border-gray-700">
      {[
        { mode: 'list',  Icon: LayoutList, label: 'List'  },
        { mode: 'graph', Icon: Share2,     label: 'Graph' },
      ].map(({ mode, Icon, label }) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          title={`Switch to ${label} view`}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors
            ${viewMode === mode
              ? 'bg-[#0058be] text-white'
              : 'text-gray-500 hover:text-white hover:bg-[#252525]'}`}
        >
          <Icon className="w-3 h-3" />
          {label}
        </button>
      ))}
    </div>
  );

  /* ── Render ────────────────────────────────────────────────────── */

  return (
    <div className="bg-[#151515] flex flex-col h-screen overflow-hidden relative">
      <PageBackground />

      {/* Header */}
      <div className="relative z-10 shrink-0">
        <PageHeader
          title="Knowledge Graph"
          description="Navigate your bookmarks as an interconnected network."
        />
      </div>

      {/* Main Layout — 3 Pane */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col px-6 pb-6 pt-4">
        <div className="flex-1 min-h-0 flex overflow-hidden border-2 border-gray-800 shadow-2xl">

          {/* ── LEFT PANEL: Collections + Tags (260px) ── */}
          <div className="w-[300px] shrink-0 border-r-2 border-gray-800 bg-[#151515] flex flex-col min-h-0">
            
            {/* Collections Section */}
            <div className="flex-1 min-h-0 flex flex-col border-b-2 border-gray-800">
              <SectionHeader
                icon={Folder}
                label="Collections"
                actions={
                  <button 
                    className="p-1 hover:bg-[#1e1e1e] rounded text-[#0058be] transition-colors"
                    title="Create Collection"
                    onClick={() => {
                      setNewCollectionName('');
                      setNewCollectionDesc('');
                      setIsCreateModalOpen(true);
                    }}
                  >
                    <FolderPlus className="w-4 h-4" />
                  </button>
                }
              />
              <div className="flex-1 overflow-y-auto scrollbar-thin py-1" data-lenis-prevent="true">
                <button
                  onClick={() => { setSelectedCollectionId(null); setSelectedTag('All'); setSelectedNodeId(null); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors border-l-2
                    ${selectedCollectionId === null
                      ? 'border-[#0058be] bg-[#0058be]/10 text-white'
                      : 'border-transparent text-gray-400 hover:bg-[#1e1e1e] hover:text-white hover:border-gray-700'}`}
                >
                  <Folder className="w-4 h-4 shrink-0 text-[#0058be]" />
                  <span className="text-sm font-bold truncate">All Bookmarks</span>
                </button>
                {collections.map((col) => (
                  <div
                    key={col.id}
                    onClick={() => { setSelectedCollectionId(col.id); setSelectedTag('All'); setSelectedNodeId(null); }}
                    onDragOver={(e) => { e.preventDefault(); setDragOverId(col.id); }}
                    onDragLeave={() => setDragOverId(null)}
                    onDrop={async (e) => {
                      e.preventDefault();
                      setDragOverId(null);
                      const bId = e.dataTransfer.getData('bookmarkId');
                      if (bId) {
                        try {
                          await collectionService.addBookmarkToCollection(col.id, bId);
                          fetchCollections(); // refresh counts
                        } catch (err) {
                          console.error('Failed to add to collection:', err);
                        }
                      }
                    }}
                    className={`group relative w-full flex items-center gap-2 px-3 py-2 text-left transition-colors border-l-2 cursor-pointer
                      ${dragOverId === col.id 
                        ? 'border-[#0058be] bg-[#0058be]/30 text-white' 
                        : selectedCollectionId === col.id
                          ? 'border-[#0058be] bg-[#0058be]/10 text-white'
                          : 'border-transparent text-gray-400 hover:bg-[#1e1e1e] hover:text-white hover:border-gray-700'}`}
                  >
                    <Folder className={`w-3.5 h-3.5 shrink-0 ${dragOverId === col.id || selectedCollectionId === col.id ? 'text-[#0058be]' : 'text-gray-500'}`} />
                    <div className="flex-1 min-w-0 pr-6">
                      <span className="text-sm font-medium truncate block">{col.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 shrink-0 rounded group-hover:opacity-0 transition-opacity
                      ${(dragOverId === col.id || selectedCollectionId === col.id) ? 'bg-[#0058be] text-white' : 'bg-gray-800 text-gray-400'}`}>
                      {col.bookmarkCount}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteModalCollection(col);
                      }}
                      className="absolute right-3 opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-500 transition-all rounded z-10"
                      title="Delete Collection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags Section */}
            <div className="flex-1 min-h-0 flex flex-col">
              <SectionHeader
                icon={Hash}
                label="Tags"
                count={`${tagsWithCounts.length - 1}`}
              />
              <div className="px-3 py-2 border-b-2 border-gray-800 bg-[#1e1e1e]">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search tags..."
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    className="w-full h-8 pl-8 pr-3 bg-[#151515] border border-gray-800 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#0058be] transition-colors"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-thin py-1" data-lenis-prevent="true">
                {loading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                  </div>
                ) : filteredTagsWithCounts.length === 0 ? (
                  <p className="text-xs text-gray-600 text-center py-4 px-2">No matching tags</p>
                ) : (
                  filteredTagsWithCounts.map(([tag, count]) => (
                    <button
                      key={tag}
                      onClick={() => { setSelectedTag(tag); setSelectedNodeId(null); }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors border-l-2
                        ${selectedTag === tag
                          ? 'border-[#0058be] bg-[#0058be]/10 text-white'
                          : 'border-transparent text-gray-400 hover:bg-[#1e1e1e] hover:text-white hover:border-gray-700'}`}
                    >
                      <span className="text-xs font-medium truncate pr-2">{tag}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 shrink-0 rounded
                        ${selectedTag === tag ? 'bg-[#0058be] text-white' : 'bg-gray-800 text-gray-400'}`}>
                        {count}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ── CENTER PANEL: Papers / Graph (flex-1) ── */}
          <div className="flex-1 min-w-0 bg-[#151515] flex flex-col min-h-0 border-r-2 border-gray-800">
            
            {/* Top Bar for Center Panel */}
            <div className="h-12 px-4 border-b-2 border-gray-800 bg-[#1e1e1e] flex items-center justify-between shrink-0">
              {viewMode === 'list' ? (
                <div className="flex items-center flex-1 mr-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search bookmarks…"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full h-8 pl-9 pr-3 bg-[#151515] border border-gray-800 text-sm font-medium text-white placeholder:text-gray-600 focus:outline-none focus:border-[#0058be] transition-colors rounded-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white">
                  <Share2 className="w-4 h-4 text-[#0058be]" /> Network View
                </div>
              )}
              <ViewToggle />
            </div>

            {/* Content of Center Panel */}
            {viewMode === 'list' ? (
              <div className="flex-1 overflow-y-auto scrollbar-thin" data-lenis-prevent="true">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-6 h-6 text-gray-600 animate-spin" />
                  </div>
                ) : filteredNodes.length === 0 ? (
                  <EmptyState
                    icon={Bookmark}
                    title={nodesWithRelations.length === 0 ? 'No bookmarks yet' : 'No results'}
                    subtitle={nodesWithRelations.length === 0 ? 'Search for papers and bookmark them' : undefined}
                  />
                ) : (
                  <div className="p-4 grid grid-cols-1 gap-3">
                    {filteredNodes.map(node => (
                      <div 
                        key={node.id} 
                        className="relative group"
                        draggable="true"
                        onDragStart={(e) => {
                          e.dataTransfer.setData('bookmarkId', node.bookmarkId);
                          e.dataTransfer.effectAllowed = 'copyMove';
                        }}
                      >
                        <button
                          onClick={() => setSelectedNodeId(node.id)}
                          className={`w-full text-left p-4 border-2 transition-all flex flex-col
                            ${selectedNodeId === node.id
                              ? 'border-[#0058be] bg-[#0058be]/5'
                              : 'border-gray-800 bg-[#1e1e1e] hover:border-gray-700'}`}
                        >
                          <h3 className={`text-[15px] font-bold leading-snug mb-1.5
                            ${selectedNodeId === node.id ? 'text-[#0058be]' : 'text-white'}`}>
                            {node.title}
                          </h3>
                          <p className="text-xs text-gray-500 mb-3 font-medium">
                            {node.year} · {node.citations.toLocaleString()} citations
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {node.tags.slice(0, 4).map(tag => (
                              <span key={tag} className="text-[10px] font-semibold text-gray-400 bg-[#151515] px-2 py-0.5 border border-gray-800">
                                {tag}
                              </span>
                            ))}
                            {node.tags.length > 4 && (
                              <span className="text-[10px] font-semibold text-[#0058be] bg-[#0058be]/10 px-2 py-0.5 border border-[#0058be]/30">
                                +{node.tags.length - 4}
                              </span>
                            )}
                          </div>
                          {node.relatedIds.length > 0 && (
                            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-[#0058be] uppercase tracking-wider">
                              <Link2 className="w-3 h-3" />
                              {node.relatedIds.length} connection{node.relatedIds.length > 1 ? 's' : ''}
                            </div>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div ref={graphRef} className="flex-1 w-full h-full bg-[#0d0d0d] relative flex items-center justify-center overflow-hidden">
                <PageBackground />
                {loading ? (
                  <Loader2 className="w-7 h-7 text-gray-600 animate-spin" />
                ) : graphData.nodes.length === 0 ? (
                  <EmptyState
                    icon={Network}
                    title="No network data"
                    subtitle="Bookmark papers with shared topics to build the graph"
                  />
                ) : (
                  <ForceGraph2D
                    width={graphDim.w}
                    height={graphDim.h}
                    graphData={graphData}
                    backgroundColor="rgba(0,0,0,0)"
                    linkColor={() => '#374151'}
                    linkDirectionalArrowLength={4}
                    linkDirectionalArrowRelPos={1}
                    nodeCanvasObject={(node, ctx, gs) => {
                      const r = 5;
                      const label = node.title || '';
                      const fs = Math.max(10 / gs, 3);
                      ctx.beginPath();
                      ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
                      ctx.fillStyle = '#0058be';
                      ctx.fill();
                      ctx.strokeStyle = 'rgba(0,88,190,0.4)';
                      ctx.lineWidth = 2;
                      ctx.stroke();
                      if (gs > 1.5) {
                        ctx.font = `bold ${fs}px sans-serif`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'top';
                        ctx.fillStyle = 'rgba(21,21,21,0.85)';
                        const tw = ctx.measureText(label).width;
                        ctx.fillRect(node.x - tw / 2 - 2, node.y + r + 2, tw + 4, fs + 2);
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText(label, node.x, node.y + r + 3);
                      }
                    }}
                    nodePointerAreaPaint={(node, col, ctx) => {
                      ctx.fillStyle = col;
                      ctx.beginPath();
                      ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI);
                      ctx.fill();
                    }}
                    onNodeClick={(node) => {
                      setSelectedNodeId(node.id);
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT PANEL: Detail (380px) ── */}
          <div className="w-[380px] shrink-0 bg-[#151515] flex flex-col min-h-0">
            <div className="h-12 px-4 border-b-2 border-gray-800 bg-[#1e1e1e] flex items-center justify-between shrink-0">
              <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white">
                <MousePointerClick className="w-4 h-4 text-[#0058be]" /> 
                {activeNode ? 'Details' : 'Select Paper'}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin bg-[#151515]" data-lenis-prevent="true">
              {!activeNode ? (
                <EmptyState
                  icon={BookOpen}
                  title="No paper selected"
                  subtitle="Select a paper from the list or network to view its details."
                />
              ) : (
                <>
                  <div className="p-5 border-b-2 border-gray-800">
                    <h2 className="text-[15px] font-bold text-white leading-snug mb-2">
                      {activeNode.title}
                    </h2>
                    <p className="text-[13px] text-gray-400 mb-4 font-medium">
                      {activeNode.year} · {activeNode.citations.toLocaleString()} citations
                    </p>
                    
                    <div className="flex gap-2 mb-6">
                      {activeNode.url && activeNode.url !== '#' && (
                        <a
                          href={activeNode.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex justify-center items-center gap-1.5 px-3 py-2 bg-[#1e1e1e] hover:bg-[#252525] text-white text-[11px] font-bold uppercase tracking-wider transition-colors border-2 border-gray-700 hover:border-gray-500 rounded-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Open
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(activeNode.bookmarkId)}
                        disabled={deleting === activeNode.bookmarkId}
                        className="flex-1 flex justify-center items-center gap-1.5 px-3 py-2 bg-[#1e1e1e] hover:bg-red-500/10 text-red-500 text-[11px] font-bold uppercase tracking-wider transition-colors border-2 border-gray-700 hover:border-red-500/50 rounded-sm"
                        title="Remove bookmark"
                      >
                        {deleting === activeNode.bookmarkId ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        Remove
                      </button>
                    </div>

                    <div className="mb-6">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Collection</span>
                      <div className="relative group">
                        <button className="w-full flex items-center justify-between px-3 py-2.5 bg-[#1e1e1e] border border-gray-800 hover:border-gray-600 transition-colors text-left rounded-sm">
                          <div className="flex items-center gap-2 min-w-0">
                            <Folder className="w-4 h-4 text-[#0058be] shrink-0" />
                            <span className="text-xs font-bold text-gray-300 truncate">
                              {selectedCollectionId 
                                ? collections.find(c => c.id === selectedCollectionId)?.name || 'All Bookmarks'
                                : 'All Bookmarks'}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-bold uppercase">Change</span>
                        </button>
                        <div className="absolute top-full left-0 mt-1 w-full bg-[#1e1e1e] border-2 border-gray-800 hidden group-hover:block z-50 shadow-xl max-h-48 overflow-y-auto scrollbar-thin rounded-sm">
                          {collections.length === 0 ? (
                            <div className="p-3 text-xs text-gray-500 font-bold uppercase tracking-widest text-center">No collections</div>
                          ) : (
                            collections.map(c => (
                              <button
                                key={c.id}
                                onClick={async () => {
                                  try {
                                    await collectionService.addBookmarkToCollection(c.id, activeNode.bookmarkId);
                                    fetchCollections();
                                  } catch (err) {
                                    console.error('Failed:', err);
                                  }
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[#0058be] group/item transition-colors"
                              >
                                <Folder className="w-3.5 h-3.5 text-gray-500 group-hover/item:text-white" />
                                <span className="text-xs font-bold text-gray-400 group-hover/item:text-white">{c.name}</span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Tags</span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeNode.tags.slice(0, 6).map(tag => (
                          <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className="text-[11px] font-semibold text-gray-400 hover:text-white bg-[#1e1e1e] hover:bg-[#252525] px-2 py-1 border border-gray-800 hover:border-gray-600 transition-colors rounded-sm"
                          >
                            {tag}
                          </button>
                        ))}
                        {activeNode.tags.length > 6 && (
                          <span className="text-[11px] font-semibold text-gray-500 bg-[#151515] px-2 py-1 border border-gray-800 rounded-sm">
                            +{activeNode.tags.length - 6}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">
                      Connections ({activeNode.relatedIds.length})
                    </span>
                    {activeNode.relatedIds.length === 0 ? (
                      <p className="text-xs text-gray-600">No network connections yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {activeNode.relatedIds.map(rId => {
                          const related = nodesWithRelations.find(n => n.id === rId);
                          if (!related) return null;
                          const sharedTags = activeNode.tags.filter(t => related.tags.includes(t));
                          return (
                            <button
                              key={rId}
                              onClick={() => setSelectedNodeId(rId)}
                              className="w-full text-left p-3 bg-[#1e1e1e] border border-gray-800 hover:border-[#0058be] transition-colors rounded-sm group"
                            >
                              <div className="flex items-start gap-2">
                                <BookOpen className="w-4 h-4 text-gray-600 group-hover:text-[#0058be] mt-0.5 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-gray-300 group-hover:text-white line-clamp-2 mb-1 leading-snug">
                                    {related.title}
                                  </p>
                                  {sharedTags.length > 0 && (
                                    <p className="text-[10px] text-gray-500 truncate">
                                      Shared: {sharedTags.join(', ')}
                                    </p>
                                  )}
                                </div>
                              </div>
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

        </div>
      </div>

      {/* Create Collection Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#151515] border-2 border-gray-800 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-[#1e1e1e]">
              <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-[#0058be]" /> Create Collection
              </h3>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Collection Name</label>
                <input
                  type="text"
                  autoFocus
                  value={newCollectionName}
                  onChange={e => setNewCollectionName(e.target.value)}
                  placeholder="e.g. AI Research 2024"
                  className="w-full bg-[#0d0d0d] border border-gray-800 text-sm font-medium text-white px-3 py-2.5 focus:outline-none focus:border-[#0058be] transition-colors rounded-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Description (Optional)</label>
                <textarea
                  value={newCollectionDesc}
                  onChange={e => setNewCollectionDesc(e.target.value)}
                  placeholder="What is this collection about?"
                  rows={3}
                  className="w-full bg-[#0d0d0d] border border-gray-800 text-sm font-medium text-white px-3 py-2.5 focus:outline-none focus:border-[#0058be] transition-colors resize-none rounded-sm"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-800 bg-[#1e1e1e]">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!newCollectionName.trim() || creatingCollection}
                onClick={async () => {
                  if (!newCollectionName.trim()) return;
                  setCreatingCollection(true);
                  try {
                    await collectionService.createCollection(newCollectionName.trim());
                    await fetchCollections();
                    setIsCreateModalOpen(false);
                    setNewCollectionName('');
                    setNewCollectionDesc('');
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setCreatingCollection(false);
                  }
                }}
                className="px-4 py-2 bg-[#0058be] hover:bg-[#004a9f] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-widest transition-colors border-2 border-[#0058be] flex items-center gap-2 rounded-sm"
              >
                {creatingCollection ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Collection Modal */}
      {deleteModalCollection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#151515] border-2 border-gray-800 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-[#1e1e1e]">
              <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-500" /> Delete Collection
              </h3>
              <button 
                onClick={() => setDeleteModalCollection(null)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-sm font-medium text-gray-300">
                Are you sure you want to delete <span className="font-bold text-white">"{deleteModalCollection.name}"</span>?
              </p>
              <p className="text-[11px] text-gray-500 mt-2 font-medium">
                This action cannot be undone. Bookmarks inside will NOT be deleted, but they will be removed from this collection.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-800 bg-[#1e1e1e]">
              <button
                onClick={() => setDeleteModalCollection(null)}
                className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={deletingCollection}
                onClick={async () => {
                  setDeletingCollection(true);
                  try {
                    await collectionService.deleteCollection(deleteModalCollection.id);
                    if (selectedCollectionId === deleteModalCollection.id) {
                      setSelectedCollectionId(null);
                    }
                    await fetchCollections();
                    setDeleteModalCollection(null);
                  } catch (err) {
                    console.error('Failed to delete collection:', err);
                  } finally {
                    setDeletingCollection(false);
                  }
                }}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold uppercase tracking-widest transition-colors border border-red-500/50 hover:border-red-500 rounded-sm flex items-center gap-2"
              >
                {deletingCollection ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
