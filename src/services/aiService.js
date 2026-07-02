import { searchService } from './searchService';
import { trendService } from './trendService';
import { bookmarkService } from './bookmarkService';
import { followService } from './followService';
import { recentSearchService } from './recentSearchService';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const FALLBACK_MODEL = 'nvidia/nemotron-nano-9b-v2:free';

/**
 * Helper to make requests to OpenRouter API with automatic fallback if the configured model is unavailable.
 */
async function callOpenRouter(messages, options = {}) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const configuredModel = import.meta.env.VITE_OPENROUTER_MODEL || FALLBACK_MODEL;

  if (!apiKey) {
    throw new Error('OpenRouter API key is not configured in environment variables.');
  }

  const payload = {
    model: configuredModel,
    messages,
    temperature: options.temperature ?? 0.3,
  };

  if (options.responseFormat) {
    payload.response_format = options.responseFormat;
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': import.meta.env.VITE_APP_NAME || 'TrendScholar',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // If OpenRouter returns 404 or model error, retry with fallback model if different
    if (!response.ok || (data.error && (data.error.code === 404 || data.error.code === 400))) {
      if (configuredModel !== FALLBACK_MODEL) {
        console.warn(`Model ${configuredModel} failed or returned 404. Retrying with fallback model ${FALLBACK_MODEL}.`);
        const fallbackPayload = {
          ...payload,
          model: FALLBACK_MODEL,
        };
        const fallbackResponse = await fetch(OPENROUTER_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': import.meta.env.VITE_APP_NAME || 'TrendScholar',
          },
          body: JSON.stringify(fallbackPayload),
        });
        const fallbackData = await fallbackResponse.json();
        if (fallbackData.choices && fallbackData.choices[0]?.message?.content) {
          return fallbackData.choices[0].message.content;
        }
      }
      throw new Error(data.error?.message || `OpenRouter API request failed with status ${response.status}`);
    }

    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content;
    }

    throw new Error('Invalid response format received from OpenRouter API.');
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw error;
  }
}

let cachedSnapshot = null;
let lastSnapshotTime = 0;

async function getLiveDatabaseSnapshot() {
  const now = Date.now();
  if (cachedSnapshot && now - lastSnapshotTime < 60000) {
    return cachedSnapshot;
  }
  try {
    const [topKeywordsRes, emergingRes, topPapersRes] = await Promise.allSettled([
      trendService.getTopKeywords(10),
      trendService.getEmergingTopics(5),
      searchService.getTopPapers(5),
    ]);

    const topKeywords = topKeywordsRes.status === 'fulfilled' ? (topKeywordsRes.value?.map?.(k => k.keyword || k.name || k) || []) : [];
    const emergingTopics = emergingRes.status === 'fulfilled' ? (emergingRes.value?.map?.(t => t.keyword || t.topic || t.name || t) || []) : [];
    const topPapers = topPapersRes.status === 'fulfilled' ? (topPapersRes.value?.slice?.(0, 5) || []) : [];

    cachedSnapshot = {
      topKeywords: topKeywords.slice(0, 10).map(String),
      emergingTopics: emergingTopics.slice(0, 5).map(String),
      topPapers: topPapers.map(p => ({ title: p.title || 'Untitled', year: p.year || 'N/A', citations: p.citationCount || 0 })),
    };
    lastSnapshotTime = now;
    return cachedSnapshot;
  } catch (error) {
    console.warn('Failed to fetch live database snapshot for AI:', error);
    return null;
  }
}

async function getUserResearchProfile() {
  try {
    const [bookmarksRes, followsRes, searchesRes] = await Promise.allSettled([
      bookmarkService.getBookmarks({ page: 0, size: 20 }),
      followService.getFollows({ page: 0, size: 20 }),
      recentSearchService.getRecentSearches({ page: 0, size: 10 }),
    ]);

    const bookmarksList = bookmarksRes.status === 'fulfilled'
      ? (bookmarksRes.value?.content || bookmarksRes.value || [])
      : [];
    
    const bookmarkedPapers = [];
    const bookmarkedKeywords = [];
    bookmarksList.forEach(b => {
      if (b.paper && b.paper.title) {
        bookmarkedPapers.push(b.paper.title);
        if (b.paper.keywords) b.paper.keywords.forEach(k => bookmarkedKeywords.push(k));
      } else if (b.paperTitle) {
        bookmarkedPapers.push(b.paperTitle);
      }
      if (b.keyword && b.keyword.displayName) {
        bookmarkedKeywords.push(b.keyword.displayName);
      } else if (b.keyword && b.keyword.name) {
        bookmarkedKeywords.push(b.keyword.name);
      }
    });

    const followsList = followsRes.status === 'fulfilled'
      ? (followsRes.value?.content || followsRes.value || [])
      : [];
    
    const followedTopics = [];
    const followedJournals = [];
    followsList.forEach(f => {
      if (f.topic && f.topic.name) followedTopics.push(f.topic.name);
      if (f.journal && f.journal.name) followedJournals.push(f.journal.name);
    });

    const searchesList = searchesRes.status === 'fulfilled'
      ? (searchesRes.value?.content || searchesRes.value || [])
      : [];
    const recentSearches = searchesList.map(s => s.searchQuery || s.queryText || s).filter(Boolean);

    return {
      bookmarkedPapers: [...new Set(bookmarkedPapers)].slice(0, 10),
      bookmarkedKeywords: [...new Set(bookmarkedKeywords)].slice(0, 10),
      followedTopics: [...new Set(followedTopics)].slice(0, 10),
      followedJournals: [...new Set(followedJournals)].slice(0, 10),
      recentSearches: [...new Set(recentSearches)].slice(0, 10)
    };
  } catch (err) {
    console.warn('Failed to fetch user research profile for AI:', err);
    return null;
  }
}

export const aiService = {
  /**
   * Analyzes user message to classify whether it is general chat conversation or a paper search request.
   */
  analyzeUserMessage: async (userMessageText, history = []) => {
    if (!userMessageText || !userMessageText.trim()) return { intent: 'chat', reply: 'How can I assist you today?' };

    const cleanText = userMessageText.trim().toLowerCase();
    const commonGreetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'greetings', 'yo', 'hello!'];
    const commonQuestions = ['who are you', 'who are you?', 'what can you do', 'what can you do?', 'help', 'help me', 'how do you work', 'how does this work', 'test'];

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

    const recKeywords = ['gợi ý', 'follow thêm', 'topic nào', 'keyword nào', 'recommend', 'suggestion', 'dựa trên research', 'liên quan đến bài', 'nên follow', 'chủ đề đang nổi', 'chưa theo dõi'];
    const isRecommendationIntent = recKeywords.some(kw => cleanText.includes(kw));

    const dbSnapshot = await getLiveDatabaseSnapshot();

    if (isRecommendationIntent) {
      const profile = await getUserResearchProfile();
      const profileText = profile ? `
=== USER'S PERSONALIZED RESEARCH PROFILE ===
Bookmarked Papers: ${profile.bookmarkedPapers.join(' | ') || 'None yet'}
Bookmarked/Paper Keywords: ${profile.bookmarkedKeywords.join(', ') || 'AI, Deep Learning'}
Currently Followed Topics: ${profile.followedTopics.join(', ') || 'None yet'}
Currently Followed Journals: ${profile.followedJournals.join(', ') || 'None yet'}
Recent Search History: ${profile.recentSearches.join(', ') || 'None yet'}
============================================` : '';

      const systemPrompt = `You are TrendScholar's personalized AI academic research advisor.
${profileText}
Top Emerging Topics in Database: ${dbSnapshot?.emergingTopics?.join(', ') || 'Quantum Computing, Large Language Models, CRISPR Gene Editing, Neuromorphic Engineering'}
Top Keywords in Database: ${dbSnapshot?.topKeywords?.join(', ') || 'Deep Learning, NLP, Computer Vision, BioInformatics, Reinforcement Learning'}

The user is asking for personalized research recommendations: "${userMessageText}".
Analyze their bookmarked papers, keywords, followed topics, and recent searches.
Identify 3 to 5 NEW emerging topics and keywords that the user is NOT currently following, but which directly complement or connect to their existing bookmarks and search trajectory!

Return ONLY valid JSON with exact structure:
{
  "intent": "recommendation",
  "recommendationSummary": "Brief executive summary (2 sentences) analyzing their research profile and explaining where their field is heading.",
  "recommendations": [
    {
      "name": "string (Exact keyword or research topic name to explore)",
      "type": "TOPIC" | "KEYWORD",
      "reason": "string (Personalized 1-2 sentence explanation connecting this suggestion directly to their bookmarks or search history)"
    }
  ]
}`;

      try {
        const result = await callOpenRouter([
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessageText },
        ], { temperature: 0.3 });

        const cleanJson = result.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        if (parsed && Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0) {
          return {
            intent: 'recommendation',
            recommendationSummary: parsed.recommendationSummary || "Based on your research profile and bookmarks, here are emerging topics and keywords recommended for you:",
            recommendations: parsed.recommendations
          };
        }
      } catch (err) {
        console.error('Real AI recommendation generation failed:', err);
        throw new Error('Failed to generate personalized research recommendations from real AI. Please check your OpenRouter API key or connection.');
      }

      throw new Error('Real AI returned an unexpected recommendation structure.');
    }

    const snapshotText = dbSnapshot ? `
=== CURRENT LIVE TRENDSCHOLAR DATABASE & SEARCH ENGINE SNAPSHOT ===
Top Research Keywords in Database: ${dbSnapshot.topKeywords.join(', ') || 'AI, Deep Learning, CRISPR'}
Emerging Research Topics: ${dbSnapshot.emergingTopics.join(', ') || 'Quantum Computing, LLM Agents'}
Sample Highly Cited Papers Available in Database:
${dbSnapshot.topPapers.map(p => `- "${p.title}" (${p.year}, ${p.citations} citations)`).join('\n') || '- "Attention Is All You Need" (2017, 10000 citations)'}
==================================================================` : '';

    const systemPrompt = `You are TrendScholar's intelligent academic research AI assistant. You are integrated directly into TrendScholar's scientific database and analytics engine.
${snapshotText}

Analyze the user's latest message. Determine whether the user wants to perform an explicit PAPER SEARCH (filter/retrieve a list of individual paper cards matching criteria) or CHAT (ask general questions, ask what data/topics exist in our database, summarize research trends, or converse).

Return ONLY valid JSON with exact structure:
{
  "intent": "search" | "chat",
  "reply": "string (Required if intent is 'chat': write a comprehensive, intelligent response. If the user asks about what papers, topics, trends, keywords, or stats exist in our database, USE THE LIVE DATABASE SNAPSHOT above to answer with accurate, real facts from our database!)",
  "searchParams": {
    "keyword": "string (main search query if intent is 'search', empty otherwise)",
    "author": "string",
    "journal": "string",
    "year": "string",
    "dateFrom": "string",
    "dateTo": "string"
  }
}

Rules:
1. If the user asks about what papers, topics, trends, keywords, or data are in the database, or asks general questions -> set intent="chat" and answer thoroughly using the LIVE DATABASE SNAPSHOT provided above!
2. If the user explicitly asks to find, search, retrieve, or list individual papers matching specific criteria -> set intent="search".
3. If the user enters a topic name, scientific concept, or keyword phrase (e.g. "Large Language Models", "BioInformatics", "Deep Learning") -> set intent="search" with keyword set to that exact concept!`;

    try {
      const result = await callOpenRouter([
        { role: 'system', content: systemPrompt },
        ...history.slice(-4).map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text || '' })),
        { role: 'user', content: userMessageText },
      ], { temperature: 0.2 });

      const cleanJson = result.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed.intent === 'chat') {
        return {
          intent: 'chat',
          reply: parsed.reply || "I'm here to help! Ask me anything about academic research or tell me what papers you need."
        };
      }

      if (parsed.intent === 'search' && parsed.searchParams) {
        let dFrom = parsed.searchParams.dateFrom || '';
        let dTo = parsed.searchParams.dateTo || '';
        if (parsed.searchParams.year && (!dFrom || !dTo)) {
          const y = parseInt(parsed.searchParams.year, 10);
          if (!isNaN(y)) {
            if (!dFrom) dFrom = `${y}-01-01`;
            if (!dTo) dTo = `${y}-12-31`;
          }
        }
        return {
          intent: 'search',
          searchParams: {
            keyword: parsed.searchParams.keyword || userMessageText.trim(),
            author: parsed.searchParams.author || '',
            journal: parsed.searchParams.journal || '',
            year: parsed.searchParams.year || '',
            dateFrom: dFrom,
            dateTo: dTo,
          }
        };
      }
    } catch (error) {
      console.warn('AI intent classification fallback triggered:', error);
    }

    // Default to search intent if message wasn't classified as general chat or recommendation
    return null;
  },

  /**
   * Parses natural language query into structured academic search parameters using AI.
   */
  parseQueryWithAI: async (queryText) => {
    if (!queryText || !queryText.trim()) return null;

    const systemPrompt = `You are an academic search query extraction assistant. Parse the user's natural language research query into a valid JSON object with exact fields:
- keyword: string (main research topic/concepts without author/journal/year terms)
- author: string (author name if specified, empty string otherwise)
- journal: string (journal or conference name if specified, empty string otherwise)
- year: string (4-digit year if specified, empty string otherwise)
- dateFrom: string (YYYY-MM-DD if date range start specified, empty string otherwise)
- dateTo: string (YYYY-MM-DD if date range end specified, empty string otherwise)

Return ONLY valid JSON without markdown fences or extra explanations.`;

    try {
      const result = await callOpenRouter([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: queryText },
      ], { temperature: 0.1 });

      const cleanJson = result.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      let dFrom = parsed.dateFrom || '';
      let dTo = parsed.dateTo || '';
      if (parsed.year && (!dFrom || !dTo)) {
        const y = parseInt(parsed.year, 10);
        if (!isNaN(y)) {
          if (!dFrom) dFrom = `${y}-01-01`;
          if (!dTo) dTo = `${y}-12-31`;
        }
      }

      return {
        keyword: parsed.keyword || '',
        author: parsed.author || '',
        journal: parsed.journal || '',
        year: parsed.year || '',
        dateFrom: dFrom,
        dateTo: dTo,
      };
    } catch (error) {
      console.warn('AI query parsing fallback triggered due to error:', error);
      return null;
    }
  },

  /**
   * Generates a structured executive summary and research insights for a given paper.
   */
  summarizePaper: async (paper) => {
    if (!paper) throw new Error('Paper object is required for summarization.');

    const title = paper.title || 'Untitled';
    const abstract = paper.abstract || 'No abstract provided.';
    const authors = paper.authors?.map(a => a.name).join(', ') || 'Unknown Authors';
    const year = paper.year || 'N/A';

    const systemPrompt = `You are an expert AI academic researcher. Analyze the provided research paper metadata and generate a concise, highly structured research summary in valid JSON format with exact properties:
- executiveSummary: concise paragraph explaining main research goal and findings
- keyContributions: array of 3 bulleted key takeaways or methodologies
- practicalImplications: concise explanation of real-world or academic impact

Return ONLY valid JSON without markdown code fences or extra text.`;

    const userPrompt = `Title: ${title}
Authors: ${authors} (${year})
Abstract: ${abstract}`;

    try {
      const result = await callOpenRouter([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ], { temperature: 0.2 });

      const cleanJson = result.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error('AI paper summarization error:', error);
      throw error;
    }
  },

  /**
   * Reranks academic search results based on user query intent and adds relevance justifications.
   */
  rerankPapers: async (queryText, papers) => {
    if (!papers || !Array.isArray(papers) || papers.length === 0) return papers;
    if (papers.length === 1) return papers;

    const paperSummaries = papers.slice(0, 10).map((p, index) => ({
      index,
      id: p.externalId || p.id,
      title: p.title || '',
      abstract: (p.abstract || '').slice(0, 300),
    }));

    const systemPrompt = `You are an AI reranking engine powered by Nemotron models. Evaluate how well each academic paper matches the user's research query.
Return valid JSON containing an array of objects named "ranked":
{
  "ranked": [
    { "index": number, "relevanceScore": number (1 to 100), "reason": short explanation string }
  ]
}
Order the items from highest score to lowest score. Return ONLY valid JSON.`;

    const userPrompt = `Query: "${queryText}"
Papers:
${JSON.stringify(paperSummaries, null, 2)}`;

    try {
      const result = await callOpenRouter([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ], { temperature: 0.1 });

      const cleanJson = result.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed && Array.isArray(parsed.ranked)) {
        const rerankedList = [];
        const scoreMap = new Map();

        parsed.ranked.forEach((item) => {
          if (typeof item.index === 'number' && papers[item.index]) {
            const originalPaper = papers[item.index];
            const enhancedPaper = {
              ...originalPaper,
              aiRelevanceScore: item.relevanceScore || 70,
              aiRelevanceReason: item.reason || 'Relevant to query terms',
            };
            rerankedList.push(enhancedPaper);
            scoreMap.set(item.index, true);
          }
        });

        papers.forEach((p, idx) => {
          if (!scoreMap.has(idx)) {
            rerankedList.push(p);
          }
        });

        return rerankedList;
      }
    } catch (error) {
      console.warn('AI reranking fallback triggered due to error:', error);
    }

    return papers;
  },
};
export default aiService;
