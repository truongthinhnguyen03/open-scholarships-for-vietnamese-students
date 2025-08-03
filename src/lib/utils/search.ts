/**
 * Highlights search terms in text by wrapping them in HTML span elements
 * @param text - The text to search in
 * @param searchQuery - The search query to highlight
 * @returns HTML string with highlighted search terms
 */
export function highlightSearchTerms(text: string, searchQuery: string): string {
  if (!searchQuery.trim() || !text) {
    return text;
  }

  const query = searchQuery.toLowerCase();
  const lowerText = text.toLowerCase();
  
  // Escape HTML characters in the original text
  const escapedText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  // Find all occurrences of the search query (case-insensitive)
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  
  return escapedText.replace(regex, '<mark class="bg-yellow-200 font-semibold">$1</mark>');
}

/**
 * Checks if text contains the search query (case-insensitive)
 * @param text - The text to search in
 * @param searchQuery - The search query to find
 * @returns True if the text contains the search query
 */
export function containsSearchQuery(text: string, searchQuery: string): boolean {
  if (!searchQuery.trim() || !text) {
    return false;
  }
  
  return text.toLowerCase().includes(searchQuery.toLowerCase());
}

/**
 * Filters scholarships based on search query
 * @param scholarships - Array of scholarships to filter
 * @param searchQuery - The search query
 * @returns Filtered array of scholarships
 */
export function filterScholarshipsBySearch(scholarships: any[], searchQuery: string): any[] {
  if (!searchQuery.trim()) {
    return scholarships;
  }

  const query = searchQuery.toLowerCase();
  
  return scholarships.filter(scholarship => 
    scholarship.name.toLowerCase().includes(query) ||
    scholarship.eligibility.toLowerCase().includes(query) ||
    scholarship.includes.toLowerCase().includes(query)
  );
} 