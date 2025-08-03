import type { 
  Scholarship, 
  ScholarshipTableRow, 
  ParsedScholarshipLink, 
  ScholarshipValidationResult,
  MarkdownParseResult,
  StudyLevel 
} from '$lib/types/scholarship';

/**
 * Parse markdown table content and convert to scholarship objects
 */
export function parseMarkdownTable(markdownContent: string): MarkdownParseResult {
  const lines = markdownContent.trim().split('\n');
  const scholarships: Scholarship[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  // Find table start (look for header row)
  let tableStartIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('| Scholarship |') && lines[i].includes('| Opens |')) {
      tableStartIndex = i;
      break;
    }
  }

  if (tableStartIndex === -1) {
    errors.push('No valid scholarship table found in markdown content');
    return { scholarships, errors, warnings };
  }

  // Skip header and separator rows
  const dataRows = lines.slice(tableStartIndex + 2).filter(line => 
    line.trim().startsWith('|') && line.trim().endsWith('|')
  );

  for (let i = 0; i < dataRows.length; i++) {
    try {
      const row = parseTableRow(dataRows[i]);
      const validation = validateScholarshipData(row);
      
      if (validation.isValid) {
        const scholarship = convertRowToScholarship(row);
        scholarships.push(scholarship);
      } else {
        errors.push(`Row ${i + 1}: ${validation.errors.join(', ')}`);
        if (validation.warnings.length > 0) {
          warnings.push(`Row ${i + 1}: ${validation.warnings.join(', ')}`);
        }
      }
    } catch (error) {
      errors.push(`Row ${i + 1}: Failed to parse - ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return { scholarships, errors, warnings };
}

/**
 * Parse a single table row into structured data
 */
function parseTableRow(row: string): ScholarshipTableRow {
  const cells = row.split('|').slice(1, -1).map(cell => cell.trim());
  
  if (cells.length < 6) {
    throw new Error(`Invalid row format: expected 6 columns, got ${cells.length}`);
  }

  return {
    scholarship: cells[0],
    opens: cells[1],
    deadline: cells[2],
    level: cells[3],
    eligibility: cells[4],
    includes: cells[5]
  };
}

/**
 * Parse scholarship name and link from markdown format
 */
function parseScholarshipLink(scholarshipCell: string): ParsedScholarshipLink {
  // Handle format: [Scholarship Name](link) [(Application Link)](link)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const matches = Array.from(scholarshipCell.matchAll(linkRegex));
  
  if (matches.length === 0) {
    // No markdown link found, treat as plain text
    return {
      name: scholarshipCell.trim(),
      url: ''
    };
  }

  // Use the first link as the main scholarship link
  const [_, name, url] = matches[0];
  
  return {
    name: name.trim(),
    url: url.trim()
  };
}

/**
 * Parse study levels from the level cell
 */
function parseStudyLevels(levelCell: string): StudyLevel[] {
  const levels: StudyLevel[] = [];
  const levelText = levelCell.toLowerCase();
  
  // Split by <br> tags or newlines
  const levelParts = levelText.split(/<br\s*\/?>/i).map(part => part.trim());
  
  for (const part of levelParts) {
    const cleanPart = part.replace(/[^\w\s-]/g, '').trim();
    
    if (cleanPart.includes('undergraduate') || cleanPart.includes('bachelor')) {
      levels.push('undergraduate');
    } else if (cleanPart.includes('graduate') || cleanPart.includes('master') || cleanPart.includes('phd')) {
      levels.push('postgraduate');
    } else if (cleanPart.includes('short-term') || cleanPart.includes('short term')) {
      levels.push('short-term');
    } else if (cleanPart.includes('research')) {
      levels.push('research');
    }
  }
  
  // Remove duplicates
  return [...new Set(levels)];
}

/**
 * Validate scholarship data for required fields
 */
function validateScholarshipData(row: ScholarshipTableRow): ScholarshipValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required field validation
  if (!row.scholarship.trim()) {
    errors.push('Scholarship name is required');
  }

  if (!row.eligibility.trim()) {
    errors.push('Eligibility criteria is required');
  }

  if (!row.includes.trim()) {
    errors.push('Benefits/Includes information is required');
  }

  // Optional field warnings
  if (!row.opens.trim() || row.opens === '--') {
    warnings.push('Opening date not specified');
  }

  if (!row.deadline.trim() || row.deadline === '--') {
    warnings.push('Deadline not specified');
  }

  if (!row.level.trim() || row.level === '--') {
    warnings.push('Study level not specified');
  }

  // Link validation
  const parsedLink = parseScholarshipLink(row.scholarship);
  if (!parsedLink.url) {
    warnings.push('No application link provided');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Convert table row to scholarship object
 */
function convertRowToScholarship(row: ScholarshipTableRow): Scholarship {
  const parsedLink = parseScholarshipLink(row.scholarship);
  const levels = parseStudyLevels(row.level);

  return {
    name: parsedLink.name,
    link: parsedLink.url,
    opens: row.opens === '--' ? '' : row.opens,
    deadline: row.deadline === '--' ? '' : row.deadline,
    level: levels.length > 0 ? levels : [],
    eligibility: row.eligibility,
    includes: row.includes
  };
}

/**
 * Handle semi-structured data variations
 */
export function normalizeScholarshipData(scholarship: Scholarship): Scholarship {
  return {
    ...scholarship,
    name: scholarship.name.trim(),
    link: scholarship.link.trim(),
    opens: normalizeDate(scholarship.opens),
    deadline: normalizeDate(scholarship.deadline),
    level: scholarship.level.map(level => level.toLowerCase() as StudyLevel),
    eligibility: scholarship.eligibility.trim(),
    includes: scholarship.includes.trim()
  };
}

/**
 * Normalize date formats
 */
function normalizeDate(dateString: string): string {
  if (!dateString || dateString === '--') return '';
  
  // Handle common date variations
  const normalized = dateString
    .replace(/\s+/g, ' ')
    .trim();
  
  return normalized;
} 