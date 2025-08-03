export interface Scholarship {
  name: string;
  link: string;
  opens: string;
  deadline: string;
  level: StudyLevel[];
  eligibility: string;
  includes: string;
}

export type StudyLevel = 
  | 'undergraduate'
  | 'postgraduate'
  | 'short-term'
  | 'research';

export interface ScholarshipTableRow {
  scholarship: string; // Contains name and link in markdown format
  opens: string;
  deadline: string;
  level: string; // Can contain multiple levels separated by <br>
  eligibility: string;
  includes: string;
}

export interface ParsedScholarshipLink {
  name: string;
  url: string;
}

export interface ScholarshipValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface MarkdownParseResult {
  scholarships: Scholarship[];
  errors: string[];
  warnings: string[];
} 