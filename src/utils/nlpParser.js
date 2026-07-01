/**
 * Parses a natural language query and extracts search filters:
 * - Keyword/Search Query
 * - Author name
 * - Journal name
 * - Year or Date ranges
 *
 * Examples:
 * - "deep learning papers by Yann LeCun in Nature in 2021"
 *   => { keyword: "deep learning", author: "Yann LeCun", journal: "Nature", year: "2021", dateFrom: "2021-01-01", dateTo: "2021-12-31" }
 * - "machine learning since 2020"
 *   => { keyword: "machine learning", author: "", journal: "", year: "", dateFrom: "2020-01-01", dateTo: "" }
 */
export function parseNaturalLanguageQuery(queryText) {
  if (!queryText) {
    return {
      keyword: '',
      author: '',
      journal: '',
      year: '',
      dateFrom: '',
      dateTo: '',
    };
  }

  let cleanText = queryText.trim();
  let keyword = '';
  let author = '';
  let journal = '';
  let year = '';
  let dateFrom = '';
  let dateTo = '';

  // 1. Extract date range patterns:
  // e.g. "from 2018 to 2022", "in 2022 to 2025", "2018-2022", etc.
  const rangeRegex = /\b(?:(?:from|between|in)\s+)?(19\d{2}|20\d{2})\s*(?:to|and|-|–)\s*(19\d{2}|20\d{2})\b/i;
  const rangeMatch = cleanText.match(rangeRegex);
  if (rangeMatch) {
    dateFrom = `${rangeMatch[1]}-01-01`;
    dateTo = `${rangeMatch[2]}-12-31`;
    cleanText = cleanText.replace(rangeRegex, '');
  } else {
    // Check for "since [year]" or "after [year]"
    const sinceRegex = /\b(?:since|after)\s+(\d{4})\b/i;
    const sinceMatch = cleanText.match(sinceRegex);
    if (sinceMatch) {
      dateFrom = `${sinceMatch[1]}-01-01`;
      cleanText = cleanText.replace(sinceRegex, '');
    } else {
      // Check for "before [year]" or "until [year]" or "to [year]"
      const beforeRegex = /\b(?:before|until)\s+(\d{4})\b/i;
      const beforeMatch = cleanText.match(beforeRegex);
      if (beforeMatch) {
        dateTo = `${beforeMatch[1]}-12-31`;
        cleanText = cleanText.replace(beforeRegex, '');
      } else {
        // Look for standalone 4-digit years like "in 2023" or "2023"
        const yearRegex = /\b(?:in\s+)?(19\d{2}|20\d{2})\b/i;
        const yearMatch = cleanText.match(yearRegex);
        if (yearMatch) {
          year = yearMatch[1];
          dateFrom = `${year}-01-01`;
          dateTo = `${year}-12-31`;
          cleanText = cleanText.replace(yearRegex, '');
        }
      }
    }
  }

  // 2. Extract author patterns:
  // Matches "by [Author Name]" or "written by [Author Name]"
  const authorRegex = /\b(?:written\s+)?by\s+([a-zA-Z\s.-]+?)(?=\s+(?:in|since|from|before|between|after|published|journal|about|on|with|under)\b|$)/i;
  const authorMatch = cleanText.match(authorRegex);
  if (authorMatch) {
    author = authorMatch[1].trim();
    cleanText = cleanText.replace(authorRegex, '');
  } else {
    // Alternate: "author [Author Name]"
    const authorAltRegex = /\bauthor\s+([a-zA-Z\s.-]+?)(?=\s+(?:in|since|from|before|between|after|published|journal|about|on|with|under)\b|$)/i;
    const authorAltMatch = cleanText.match(authorAltRegex);
    if (authorAltMatch) {
      author = authorAltMatch[1].trim();
      cleanText = cleanText.replace(authorAltRegex, '');
    }
  }

  // 3. Extract journal patterns:
  // Matches "in [Journal Name]" or "published in [Journal Name]" or "journal [Journal Name]"
  const journalRegex = /\b(?:published\s+)?in\s+([a-zA-Z\s.-]+?)(?=\s+(?:by|since|from|before|between|after|about|on|with|under|written)\b|$)/i;
  const journalMatch = cleanText.match(journalRegex);
  if (journalMatch) {
    journal = journalMatch[1].trim();
    cleanText = cleanText.replace(journalRegex, '');
  } else {
    // Alternate: "journal [Journal Name]"
    const journalAltRegex = /\bjournal\s+([a-zA-Z\s.-]+?)(?=\s+(?:by|since|from|before|between|after|about|on|with|under|written)\b|$)/i;
    const journalAltMatch = cleanText.match(journalAltRegex);
    if (journalAltMatch) {
      journal = journalAltMatch[1].trim();
      cleanText = cleanText.replace(journalAltRegex, '');
    }
  }

  // 4. Extract keyword (remaining text)
  // Clean off common query phrases at the start of the query
  keyword = cleanText
    .replace(/^\s*(?:find|search|show|get|retrieve)?\s*(?:papers|articles|publications|documents)?\s*(?:about|on|related to|for|discussing)?\s*/i, '')
    .trim();

  // If the extracted keyword is empty or too short, fallback to the cleaned query or original text
  if (!keyword || keyword.length < 2) {
    const backupKeyword = cleanText.trim();
    keyword = backupKeyword.length >= 2 ? backupKeyword : queryText.trim();
  }

  return {
    keyword,
    author,
    journal,
    year,
    dateFrom,
    dateTo,
  };
}
