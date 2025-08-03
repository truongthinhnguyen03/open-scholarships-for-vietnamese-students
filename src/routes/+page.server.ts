import { readFileSync } from 'fs';
import { join } from 'path';
import { parseMarkdownTable, normalizeScholarshipData } from '$lib/utils/markdownParser';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    // Read the markdown file
    const markdownPath = join(process.cwd(), 'src/lib/data/scholarships.md');
    const markdownContent = readFileSync(markdownPath, 'utf-8');
    
    // Parse the markdown table
    const parseResult = parseMarkdownTable(markdownContent);
    
    // Normalize the scholarship data
    const normalizedScholarships = parseResult.scholarships.map(normalizeScholarshipData);
    
    return {
      scholarships: normalizedScholarships,
      totalCount: normalizedScholarships.length,
      errors: parseResult.errors,
      warnings: parseResult.warnings
    };
  } catch (error) {
    console.error('Error loading scholarship data:', error);
    
    return {
      scholarships: [],
      totalCount: 0,
      errors: [`Failed to load scholarship data: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: []
    };
  }
}; 