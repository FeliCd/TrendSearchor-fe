import { searchService } from './searchService';
import { trendService } from './trendService';

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
        reply: "Hello! I am your AI Research Assistant. You can ask me general questions about research, or tell me what papers you are looking for in natural language (e.g., 'Find papers on deep learning by Yann LeCun in 2021'). How can I help you today?"
      };
    }
    if (commonQuestions.includes(cleanText)) {
      return {
        intent: 'chat',
        reply: "I am TrendScholar's AI Research Assistant powered by OpenRouter AI! I can help you find scientific publications, analyze paper relevance, summarize key findings, and answer research questions. Just describe what you're looking for!"
      };
    }

    const dbSnapshot = await getLiveDatabaseSnapshot();
    const snapshotText = dbSnapshot ? `
=== CURRENT LIVE TRENDSCHOLAR DATABASE & SEARCH ENGINE SNAPSHOT ===
Top Research Keywords in Database: ${dbSnapshot.topKeywords.join(', ') || 'AI, Deep Learning, CRISPR'}
Emerging Research Topics: ${dbSnapshot.emergingTopics.join(', ') || 'Quantum Computing, LLM Agents'}
Sample Highly Cited Papers Available in Database:
${dbSnapshot.topPapers.map(p => `- "${p.title}" (${p.year}, ${p.citations} citations)`).join('\n') || '- "Attention Is All You Need" (2017, 10000 citations)'}
===================================================================` : '';

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
2. If the user explicitly asks to find, search, retrieve, or list individual papers matching specific criteria -> set intent="search".`;

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
        return {
          intent: 'search',
          searchParams: {
            keyword: parsed.searchParams.keyword || userMessageText.trim(),
            author: parsed.searchParams.author || '',
            journal: parsed.searchParams.journal || '',
            year: parsed.searchParams.year || '',
            dateFrom: parsed.searchParams.dateFrom || '',
            dateTo: parsed.searchParams.dateTo || '',
          }
        };
      }
    } catch (error) {
      console.warn('AI intent classification fallback triggered:', error);
    }

    // Fallback heuristic if AI fails
    const searchKeywords = ['find', 'search', 'paper', 'article', 'publication', 'journal', 'author', 'about'];
    const hasSearchIntent = searchKeywords.some(kw => cleanText.includes(kw)) || cleanText.length > 25;
    if (!hasSearchIntent) {
      return {
        intent: 'chat',
        reply: "Hello! I am your AI Research Assistant. Let me know if you would like me to find specific scientific papers or assist with your research!"
      };
    }

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

      return {
        keyword: parsed.keyword || '',
        author: parsed.author || '',
        journal: parsed.journal || '',
        year: parsed.year || '',
        dateFrom: parsed.dateFrom || '',
        dateTo: parsed.dateTo || '',
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
