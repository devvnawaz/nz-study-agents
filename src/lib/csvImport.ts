import type { AuthorizationStatus, InstituteType } from './types';

export interface CsvImportRow {
  institute_name?: string;
  institute_id?: string;
  institute_type?: InstituteType;
  institute_city_in_nz?: string;
  institute_official_website?: string;
  institute_representative_page_url?: string;
  institute_last_checked_at?: string;

  agency_name?: string;
  agency_id?: string;
  agency_city?: string;
  agency_address?: string;
  agency_phone?: string;
  agency_email?: string;
  agency_website?: string;
  agency_contact_person?: string;
  agency_notes?: string;

  source_url?: string;
  authorization_status?: AuthorizationStatus;
  last_verified_at?: string;
}

export interface CsvImportResultRow {
  rowNumber: number;
  status: 'created' | 'updated' | 'skipped' | 'error';
  message: string;
  instituteId?: string;
  agencyId?: string;
  representationId?: string;
}

export interface CsvImportSummary {
  totalRows: number;
  created: number;
  updated: number;
  skipped: number;
  errors: number;
  rows: CsvImportResultRow[];
}

const REQUIRED_COLUMNS = [
  'institute_name',
  'agency_name',
  'agency_city',
  'source_url',
];

export function getCsvTemplate(): string {
  return [
    'institute_name,institute_type,institute_city_in_nz,institute_official_website,institute_representative_page_url,institute_last_checked_at,agency_name,agency_city,agency_address,agency_phone,agency_email,agency_website,agency_contact_person,agency_notes,source_url,authorization_status,last_verified_at',
    'University of Auckland,University,Auckland,https://www.auckland.ac.nz,https://www.auckland.ac.nz/en/study/applications-and-admissions/agents.html,2026-06-18,Test Agency BD,Dhaka,"House 12, Road 5, Dhanmondi, Dhaka 1205",+880 1XXX-XXXXXX,info@example.com,https://agency.example,Mr. Example,Demo notes,https://www.auckland.ac.nz/en/study/applications-and-admissions/agents.html,authorized,2026-06-18',
  ].join('\n');
}

function stripBom(input: string): string {
  return input.replace(/^﻿/, '');
}

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase();
}

function isBlank(value: unknown): boolean {
  return value === undefined || value === null || String(value).trim() === '';
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      cells.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
}

export function parseCsvToRows(csv: string): CsvImportRow[] {
  const lines = stripBom(csv)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) return [];

  const headers = parseCsvLine(lines[0]).map(normalizeHeader);
  const rows: CsvImportRow[] = [];

  for (const line of lines.slice(1)) {
    const values = parseCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? '';
    });
    rows.push(row as CsvImportRow);
  }

  return rows;
}

export function validateCsvRow(row: CsvImportRow): string[] {
  const errors: string[] = [];
  for (const field of REQUIRED_COLUMNS) {
    if (isBlank((row as Record<string, unknown>)[field])) {
      errors.push(`Missing required column: ${field}`);
    }
  }
  return errors;
}

export function cleanText(value?: string): string {
  return value?.trim() ?? '';
}

export function cleanOptionalText(value?: string): string | undefined {
  const cleaned = cleanText(value);
  return cleaned.length ? cleaned : undefined;
}

export function normalizeStatus(value?: string): AuthorizationStatus {
  const cleaned = cleanText(value).toLowerCase();
  if (cleaned === 'expired') return 'expired';
  if (cleaned === 'unverified') return 'unverified';
  return 'authorized';
}
