import api from './api';
import { parseNaturalLanguageQuery } from '@/utils/nlpParser';

export const aiService = {
  /**
   * FR-10.1: Natural language paper search via backend AI endpoint.
   */
  naturalLanguageSearch: async (query) => {
    const response = await api.post('/api/ai/search', { query });
    return response.data;
  },

  /**
   * R-10.4: Get personalized research recommendations from backend.
   */
  getRecommendations: async () => {
    const response = await api.get('/api/ai/recommendations');
    return response.data;
  },

  /**
   * FR-10.2: Answer trend Q&A via backend AI endpoint.
   */
  answerTrendQuestion: async (question, keyword = null) => {
    const response = await api.post('/api/ai/trend-qa', { question, keyword });
    return response.data;
  },

  /**
   * FR-10.6: AI Abstract assistant (CLEANUP, SPELLCHECK, SUGGEST_MISSING, EVALUATE).
   */
  processAbstract: async (action, text) => {
    const response = await api.post('/api/ai/abstract', { action, text });
    return response.data;
  },

  /**
   * Summarize research paper via backend AI endpoint.
   */
  summarizePaper: async (paper) => {
    if (!paper) throw new Error('Paper object is required for summarization.');
    const response = await api.post('/api/ai/summarize', {
      title: paper.title || 'Untitled',
      abstractText: paper.abstractText || paper.abstract || '',
      authors: paper.authors?.map?.(a => a.name || a)?.join(', ') || 'Unknown Authors',
      year: paper.year ? String(paper.year) : 'N/A'
    });
    return response.data;
  },

  /**
   * Rerank papers via backend AI endpoint.
   */
  rerankPapers: async (queryText, papers) => {
    if (!papers || !Array.isArray(papers) || papers.length === 0) return papers;
    try {
      const response = await api.post('/api/ai/rerank', { query: queryText, papers });
      return response.data || papers;
    } catch (err) {
      console.error('AI rerank API failed:', err);
      return papers;
    }
  },

  /**
   * Analyzes user message to classify whether it is general chat conversation, recommendation, or search request.
   */
  analyzeUserMessage: async (userMessageText, history = []) => {
    if (!userMessageText || !userMessageText.trim()) return { intent: 'chat', reply: 'How can I assist you today?' };

    const cleanText = userMessageText.trim().toLowerCase();
    const commonGreetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'greetings', 'yo', 'hello!', 'xin chào', 'chào bạn', 'chào', 'chào ai', 'chào chatbot', 'hi chatbot'];
    const commonQuestions = ['who are you', 'who are you?', 'what can you do', 'what can you do?', 'help', 'help me', 'how do you work', 'how does this work', 'test', 'bạn là ai', 'bạn làm được gì', 'giúp tôi', 'giúp mình', 'hướng dẫn', 'chatbot làm được gì'];

    if (commonGreetings.includes(cleanText)) {
      return {
        intent: 'chat',
        reply: "Hello! I am your AI Research Assistant. You can ask me general questions about research, tell me what papers you are looking for in natural language, or ask for personalized research recommendations based on your bookmarks and follow list!"
      };
    }
    if (commonQuestions.includes(cleanText)) {
      return {
        intent: 'chat',
        reply: "I am TrendScholar's AI Research Assistant! I can analyze your bookmarks, follow list, and search history to recommend new emerging topics, help you find scientific publications, and answer research questions. Just tell me what you need!"
      };
    }

    const recKeywords = ['gợi ý', 'follow thêm', 'topic nào', 'keyword nào', 'recommend', 'suggestion', 'dựa trên research', 'liên quan đến bài', 'nên follow', 'chủ đề đang nổi', 'chưa theo dõi', 'keyword liên quan', 'bookmark'];
    const isRecommendationIntent = recKeywords.some(kw => cleanText.includes(kw));

    if (isRecommendationIntent) {
      try {
        const recData = await aiService.getRecommendations();
        const rationale = recData?.rationale || '';
        const isNoBookmark = /haven't bookmarked|no bookmarked|no bookmarks|haven't saved|welcome to trendscholar|emerging research areas/i.test(rationale);

        const recList = [];
        if (recData?.suggestedKeywords) {
          recData.suggestedKeywords.forEach(k => {
            const defaultReason = isNoBookmark 
              ? 'Popular emerging keyword in the scientific community (No bookmarks yet)' 
              : 'Recommended keyword aligned with your bookmarked research papers';
            recList.push({ name: k, type: 'KEYWORD', reason: defaultReason });
          });
        }
        if (recData?.suggestedTopics) {
          recData.suggestedTopics.forEach(t => {
            const defaultReason = isNoBookmark 
              ? 'High-impact trending research topic to explore (No bookmarks yet)' 
              : 'Recommended research topic tailored to your bookmarks and profile';
            recList.push({ name: t, type: 'TOPIC', reason: defaultReason });
          });
        }
        return {
          intent: 'recommendation',
          isNoBookmark,
          recommendationSummary: rationale || (isNoBookmark 
            ? "Welcome! Since you haven't bookmarked any papers yet, here are top emerging research areas currently popular in the scientific community:"
            : "Based on your bookmarked research papers and profile, here are personalized topics and keywords for you:"),
          recommendations: recList
        };
      } catch (err) {
        console.error('Failed to get recommendations from backend:', err);
        return {
          intent: 'chat',
          reply: `Lỗi từ Backend khi lấy gợi ý research: ${err.response?.data?.message || err.message || 'Không thể kết nối tới máy chủ'}.`
        };
      }
    }

    const trendKeywords = ['xu hướng', 'trend', 'tại sao', 'trending', 'why is', 'analysis of', 'forecast', 'phân tích xu hướng'];
    const isTrendIntent = trendKeywords.some(kw => cleanText.includes(kw));
    if (isTrendIntent) {
      try {
        const trendAns = await aiService.answerTrendQuestion(userMessageText);
        const replyText = trendAns?.answer || trendAns?.dataContext?.insight || (typeof trendAns === 'string' ? trendAns : null) || "Backend không phản hồi nội dung phân tích xu hướng.";
        return {
          intent: 'chat',
          reply: replyText
        };
      } catch (err) {
        console.error('Trend QA failed:', err);
        return {
          intent: 'chat',
          reply: `Lỗi từ Backend khi phân tích xu hướng: ${err.response?.data?.message || err.message || 'Không thể kết nối tới máy chủ'}.`
        };
      }
    }

    return null;
  },

  /**
   * Helper for query parsing fallback if needed by frontend
   */
  parseQueryWithAI: async (queryText) => {
    return parseNaturalLanguageQuery(queryText);
  }
};

export default aiService;
