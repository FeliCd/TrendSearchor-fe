import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  X, 
  Send, 
  Loader2, 
  BookOpen, 
  ExternalLink, 
  ArrowRight,
  FileText,
  RotateCcw,
  Square
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { parseNaturalLanguageQuery } from '@/utils/nlpParser';
import { searchService } from '@/services/searchService';
import { aiService } from '@/services/aiService';
import { useAuth } from '@/contexts/AuthContext';
import { ROLES } from '@/constants/roles';

export default function SearchChatbot() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(() => {
    const saved = sessionStorage.getItem('ts_chatbot_open');
    return saved === 'true';
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Paper preview modal state
  const [previewPaper, setPreviewPaper] = useState(null);

  // Chat message history
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('ts_chatbot_messages');
    return saved ? JSON.parse(saved) : [
      {
        id: 'welcome',
        sender: 'bot',
        text: 'Hello! I am your AI Search assistant. Ask me to find papers in natural language. For example:\n\n"Find papers about deep learning by Yann LeCun in Nature in 2021"',
        type: 'text'
      }
    ];
  });

  const messagesEndRef = useRef(null);
  const abortRef = useRef(false);

  const handleClearChat = () => {
    abortRef.current = true;
    setLoading(false);
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        sender: 'bot',
        text: 'Hello! I am your AI Search assistant. Ask me to find papers in natural language. For example:\n\n"Find papers about deep learning by Yann LeCun in Nature in 2021"',
        type: 'text'
      }
    ]);
  };

  const handleStopGeneration = () => {
    abortRef.current = true;
    setLoading(false);
    setMessages(prev => {
      const filtered = prev.filter(m => m.type !== 'loading');
      return [...filtered, {
        id: 'stopped-' + Date.now(),
        sender: 'bot',
        text: '[Stopped] AI response generation was aborted.',
        type: 'text'
      }];
    });
  };

  // Sync state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('ts_chatbot_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    sessionStorage.setItem('ts_chatbot_open', String(isOpen));
  }, [isOpen]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // If user is not logged in, do not render chatbot
  if (!user) return null;

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessageText = input.trim();
    setInput('');
    abortRef.current = false;
    setLoading(true);

    // Add user message to history
    const userMsgId = 'msg-' + Date.now();
    setMessages(prev => [...prev, {
      id: userMsgId,
      sender: 'user',
      text: userMessageText,
      type: 'text'
    }]);

    // First check intent: general chat or academic search
    const analysis = await aiService.analyzeUserMessage(userMessageText, messages);
    if (abortRef.current) return;

    if (analysis && analysis.intent === 'chat') {
      setMessages(prev => [...prev, {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: analysis.reply,
        type: 'text'
      }]);
      setLoading(false);
      return;
    }

    // Parse search query parameters
    let parsed = analysis?.searchParams || await aiService.parseQueryWithAI(userMessageText);
    if (abortRef.current) return;

    if (!parsed || !parsed.keyword) {
      parsed = parseNaturalLanguageQuery(userMessageText);
    }

    // Build the status message text
    let searchStatusText = `Searching for papers about "${parsed.keyword}"`;
    if (parsed.author) searchStatusText += ` by ${parsed.author}`;
    if (parsed.journal) searchStatusText += ` in ${parsed.journal}`;
    if (parsed.year) {
      searchStatusText += ` (year ${parsed.year})`;
    } else if (parsed.dateFrom || parsed.dateTo) {
      if (parsed.dateFrom && parsed.dateTo) {
        searchStatusText += ` (between ${parsed.dateFrom.slice(0, 4)} and ${parsed.dateTo.slice(0, 4)})`;
      } else if (parsed.dateFrom) {
        searchStatusText += ` (since ${parsed.dateFrom.slice(0, 4)})`;
      } else if (parsed.dateTo) {
        searchStatusText += ` (before ${parsed.dateTo.slice(0, 4)})`;
      }
    }
    searchStatusText += '...';

    // Add bot loading status message to history
    const loadingMsgId = 'loading-' + Date.now();
    setMessages(prev => [...prev, {
      id: loadingMsgId,
      sender: 'bot',
      text: searchStatusText,
      type: 'loading'
    }]);

    try {
      const params = {
        query: parsed.keyword || '',
        page: 0,
        size: 5,
        ...(parsed.author && { author: parsed.author }),
        ...(parsed.journal && { journal: parsed.journal }),
        ...(parsed.year && { year: parseInt(parsed.year, 10) }),
        ...(parsed.dateFrom && { dateFrom: parsed.dateFrom }),
        ...(parsed.dateTo && { dateTo: parsed.dateTo }),
      };

      const data = await searchService.searchPapers(params);
      if (abortRef.current) return;

      let papers = data.papers || [];
      const total = data.total || 0;

      // Enhance search results with AI reranking
      if (papers.length > 1) {
        try {
          setMessages(prev => prev.map(m => m.id === loadingMsgId ? { ...m, text: 'AI reranking and analyzing relevance...' } : m));
          papers = await aiService.rerankPapers(userMessageText, papers);
          if (abortRef.current) return;
        } catch (rerankErr) {
          console.warn('AI reranking failed:', rerankErr);
        }
      }
      if (abortRef.current) return;

      // Remove the loading message and add search results
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== loadingMsgId);
        return [...filtered, {
          id: 'results-' + Date.now(),
          sender: 'bot',
          text: `I found ${total} papers matching your query:`,
          type: 'results',
          data: {
            papers,
            total,
            params: parsed
          }
        }];
      });
    } catch (err) {
      if (abortRef.current) return;
      console.error(err);
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== loadingMsgId);
        return [...filtered, {
          id: 'error-' + Date.now(),
          sender: 'bot',
          text: 'Sorry, I encountered an error searching for papers. Please try again.',
          type: 'text'
        }];
      });
    } finally {
      if (!abortRef.current) {
        setLoading(false);
      }
    }
  };

  const handleOpenInSearchPage = (searchParams) => {
    // Determine the route based on role
    let path = '';
    if (user.role === ROLES.RESEARCHER) {
      path = '/researcher/search';
    } else if (user.role === ROLES.LECTURER || user.role === ROLES.STUDENT) {
      path = '/academic/search';
    } else {
      // Fallback or warning for roles like Admin who don't have a main search page
      return;
    }

    // Set values in sessionStorage so PaperSearchPage loads them automatically
    sessionStorage.setItem('ts_search_query', searchParams.keyword || '');
    sessionStorage.setItem('ts_search_hasSearched', 'true');
    
    // Save filters to sessionStorage including author and journal
    const filtersToSave = {
      yearFrom: searchParams.dateFrom ? searchParams.dateFrom.slice(0, 4) : (searchParams.year || ''),
      yearTo: searchParams.dateTo ? searchParams.dateTo.slice(0, 4) : (searchParams.year || ''),
      sortBy: 'relevance',
      author: searchParams.author || '',
      journal: searchParams.journal || '',
    };
    sessionStorage.setItem('ts_search_filters', JSON.stringify(filtersToSave));

    // Redirect to the search page with state so already mounted search page updates immediately
    navigate(`${path}?q=${encodeURIComponent(searchParams.keyword || '')}`, {
      state: {
        query: searchParams.keyword || '',
        filters: filtersToSave,
        triggerSearch: Date.now()
      }
    });
    setIsOpen(false);
  };

  const canNavigateToSearch = user.role === ROLES.RESEARCHER || user.role === ROLES.LECTURER || user.role === ROLES.STUDENT;

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center w-14 h-14 bg-gradient-to-r from-[#0058be] to-[#004395] text-white hover:from-[#004395] hover:to-[#0058be] shadow-[0_0_15px_rgba(0,88,190,0.5)] transition-all duration-300 border border-[#0058be]/40 hover:scale-105 active:scale-95 ${
            isOpen ? 'rotate-90' : ''
          }`}
          title="Search with AI Chatbot"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6 animate-pulse" />}
        </button>
      </div>

      {/* Chat Window Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-[92px] w-[420px] h-[600px] bg-[#151515] border-2 border-gray-800 shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b-2 border-gray-800 bg-[#1a1a1a]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#0058be]/10 border border-[#0058be]/50 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#0058be]" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">AI Search Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-[#282828] transition-colors rounded"
                  title="Start New Session"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-gray-500 hover:text-white hover:bg-[#282828] transition-colors rounded"
                  title="Close Assistant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div data-lenis-prevent className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-dark">
              {messages.map((msg) => {
                if (msg.sender === 'user') {
                  return (
                    <div key={msg.id} className="flex justify-end">
                      <div className="bg-[#0058be]/15 border border-[#0058be]/40 text-gray-100 max-w-[85%] px-4 py-2.5 text-sm select-text">
                        {msg.text}
                      </div>
                    </div>
                  );
                }

                // If loading message
                if (msg.type === 'loading') {
                  return (
                    <div key={msg.id} className="flex gap-3">
                      <div className="w-8 h-8 bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-[#0058be]" />
                      </div>
                      <div className="bg-[#1e1e1e] border border-gray-800 text-gray-300 px-4 py-2.5 text-sm flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#0058be]" />
                        <span>{msg.text}</span>
                      </div>
                    </div>
                  );
                }



                // If search results message
                if (msg.type === 'results') {
                  const { papers, total, params } = msg.data;
                  return (
                    <div key={msg.id} className="flex gap-3">
                      <div className="w-8 h-8 bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-[#0058be]" />
                      </div>
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="bg-[#1e1e1e] border border-gray-800 text-gray-300 px-4 py-2.5 text-sm">
                          {msg.text}
                        </div>
                        
                        {/* Results stack */}
                        <div className="space-y-2.5">
                          {papers.length === 0 ? (
                            <div className="p-4 border border-dashed border-gray-850 text-center text-xs text-gray-500 bg-[#1a1a1a]">
                              No matching papers found. Try adjusting the search filters.
                            </div>
                          ) : (
                            papers.map((paper) => (
                              <div 
                                key={paper.externalId || paper.id}
                                className="bg-[#1c1c1c] border border-gray-800 hover:border-gray-700 p-3 flex flex-col justify-between gap-2"
                              >
                                <div>
                                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                                    {paper.title}
                                  </h4>
                                  <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">
                                    {paper.authors?.map(a => a.name).join(', ') || 'Unknown Author'}
                                  </p>
                                  {paper.aiRelevanceScore && (
                                    <div className="flex items-center justify-between bg-[#0058be]/10 border border-[#0058be]/30 px-2 py-1 mt-1.5 text-[10px]">
                                      <span className="font-bold text-[#4A90E2] flex items-center gap-1">
                                        <Sparkles className="w-2.5 h-2.5" /> AI Score: {paper.aiRelevanceScore}%
                                      </span>
                                      <span className="text-gray-400 truncate max-w-[160px] text-[9px]" title={paper.aiRelevanceReason}>
                                        {paper.aiRelevanceReason}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-gray-850">
                                  <span className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 border border-gray-750">
                                    {paper.year || 'N/A'}
                                  </span>
                                  <button
                                    onClick={() => setPreviewPaper(paper)}
                                    className="text-[9px] font-black uppercase tracking-widest text-[#4A90E2] hover:text-[#0058be] transition-colors flex items-center gap-1"
                                  >
                                    Preview <ArrowRight className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Open in full search view button */}
                        {papers.length > 0 && canNavigateToSearch && (
                          <button
                            onClick={() => handleOpenInSearchPage(params)}
                            className="w-full flex items-center justify-center gap-2 py-2 border-2 border-gray-800 hover:border-[#0058be] bg-[#1e1e1e] hover:bg-[#0058be]/5 text-xs text-gray-300 hover:text-white font-bold uppercase tracking-wider transition-all"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            Open full list ({total} results)
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }

                // Standard text bot message
                return (
                  <div key={msg.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-[#0058be]" />
                    </div>
                    <div className="bg-[#1e1e1e] border border-gray-800 text-gray-300 max-w-[85%] px-4 py-2.5 text-sm whitespace-pre-line select-text">
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 border-t-2 border-gray-800 bg-[#1a1a1a] flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                placeholder="Find papers about AI by John Doe in..."
                className="flex-1 bg-[#151515] border border-gray-800 px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#0058be] transition-colors"
              />
              {loading ? (
                <button
                  type="button"
                  onClick={handleStopGeneration}
                  className="px-3 h-10 bg-red-600/80 hover:bg-red-600 text-white flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors border border-red-500/50"
                  title="Stop AI Generation"
                >
                  <Square className="w-3.5 h-3.5 fill-current" /> Stop
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-10 h-10 bg-[#0058be] text-white hover:bg-[#004395] disabled:opacity-50 disabled:hover:bg-[#0058be] flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Paper Preview Overlay Modal */}
      {previewPaper && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#151515] border-2 border-gray-800 w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-[#1e1e1e]">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#0058be] flex items-center gap-2">
                <FileText className="w-4 h-4" /> Paper Preview
              </h3>
              <button 
                onClick={() => setPreviewPaper(null)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div data-lenis-prevent className="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-dark">
              <div>
                <h2 className="text-lg font-bold text-white leading-snug">
                  {previewPaper.title}
                </h2>
                
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-semibold">
                  {previewPaper.year && (
                    <span className="px-2 py-0.5 border border-gray-800 text-gray-300 bg-[#1e1e1e]">
                      Year: {previewPaper.year}
                    </span>
                  )}
                  {previewPaper.citationCount > 0 && (
                    <span className="px-2 py-0.5 border border-[#0058be]/30 text-[#4A90E2] bg-[#0058be]/10">
                      {previewPaper.citationCount} Citations
                    </span>
                  )}
                  {previewPaper.openAccess && (
                    <span className="px-2 py-0.5 border border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                      Open Access
                    </span>
                  )}
                </div>
              </div>

              {/* Abstract */}
              {previewPaper.abstract && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Abstract</h4>
                  <p className="text-sm text-gray-300 leading-relaxed bg-[#1e1e1e] p-3.5 border border-gray-800">
                    {previewPaper.abstract}
                  </p>
                </div>
              )}

              {/* Authors */}
              {previewPaper.authors?.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Authors</h4>
                  <p className="text-sm text-gray-400">
                    {previewPaper.authors.map(a => a.name).join(', ')}
                  </p>
                </div>
              )}

              {/* Journal */}
              {previewPaper.journalName && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Journal / Publisher</h4>
                  <p className="text-sm text-gray-400">
                    {previewPaper.journalName}
                  </p>
                </div>
              )}

              {/* Keywords */}
              {previewPaper.keywords?.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Keywords</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {previewPaper.keywords.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 border border-[#0058be]/30 text-[#4A90E2] text-[10px] font-bold uppercase tracking-wider bg-[#0058be]/5">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-800 bg-[#1e1e1e] flex justify-end gap-2.5">
              {previewPaper.paperUri && (
                <a
                  href={previewPaper.paperUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-gray-800 hover:border-gray-700 bg-[#151515] text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white transition-colors"
                >
                  View PDF <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={() => setPreviewPaper(null)}
                className="px-4 py-2 border-2 border-gray-800 hover:border-[#0058be] bg-[#0058be] hover:bg-[#004395] text-xs font-bold uppercase tracking-wider text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


