import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAdminToken } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { Agency, Institute, InstituteType, Representation } from '@/lib/types';
import { readStore, writeStore } from '@/lib/store';
import { revalidatePaths } from '@/lib/revalidate';
import {
  cleanOptionalText,
  cleanText,
  getCsvTemplate,
  normalizeStatus,
  parseCsvToRows,
  validateCsvRow,
  type CsvImportResultRow,
  type CsvImportSummary,
  type CsvImportRow,
} from '@/lib/csvImport';

function responseTemplate(res: NextApiResponse) {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  return res.status(200).send(getCsvTemplate());
}

async function readUploadedCsv(req: NextApiRequest): Promise<string> {
  const contentType = req.headers['content-type'] ?? '';

  if (contentType.includes('multipart/form-data')) {
    // Minimal implementation: accept a raw CSV file path via a multipart parser is overkill here.
    // We support browser upload by reading a base64-encoded payload in `csv` when needed.
    const csv = req.body?.csv;
    if (typeof csv === 'string') return csv;
    throw new Error('Multipart upload is not supported in this build. Send raw CSV in the csv field.');
  }

  if (typeof req.body === 'string') return req.body;
  if (req.body && typeof req.body.csv === 'string') return req.body.csv;
  throw new Error('No CSV content received.');
}

function makeSummary(rows: CsvImportResultRow[]): CsvImportSummary {
  return {
    totalRows: rows.length,
    created: rows.filter((r) => r.status === 'created').length,
    updated: rows.filter((r) => r.status === 'updated').length,
    skipped: rows.filter((r) => r.status === 'skipped').length,
    errors: rows.filter((r) => r.status === 'error').length,
    rows,
  };
}

function findInstituteByName(institutes: Institute[], name: string): Institute | undefined {
  const target = name.trim().toLowerCase();
  return institutes.find((inst) => inst.name.trim().toLowerCase() === target);
}

function findAgencyByName(agencies: Agency[], name: string): Agency | undefined {
  const target = name.trim().toLowerCase();
  return agencies.find((agency) => agency.name.trim().toLowerCase() === target);
}

function uniqueRepresentationKey(row: CsvImportRow): string {
  return [row.institute_id ?? row.institute_name ?? '', row.agency_id ?? row.agency_name ?? '', row.source_url ?? '']
    .map((part) => part.trim().toLowerCase())
    .join('|');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!checkAdminToken(req, res)) return;

  if (req.method === 'GET') {
    return responseTemplate(res);
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end();
  }

  try {
    const csv = await readUploadedCsv(req);
    const rows = parseCsvToRows(csv);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'CSV file has no data rows.' });
    }

    const summaryRows: CsvImportResultRow[] = [];
    const touchedInstituteIds = new Set<string>();
    const touchedAgencyIds = new Set<string>();

    if (!isSupabaseConfigured) {
      const store = readStore();
      const seen = new Set<string>();
      const originalState = JSON.stringify(store);

      for (let index = 0; index < rows.length; index += 1) {
        const row = rows[index];
        const rowNumber = index + 2;
        const errors = validateCsvRow(row);
        if (errors.length) {
          summaryRows.push({ rowNumber, status: 'error', message: errors.join('; ') });
          continue;
        }

        const key = uniqueRepresentationKey(row);
        if (seen.has(key)) {
          summaryRows.push({ rowNumber, status: 'skipped', message: 'Duplicate row in CSV; skipped.' });
          continue;
        }
        seen.add(key);

        const instituteName = cleanText(row.institute_name);
        const agencyName = cleanText(row.agency_name);
        const instituteId = cleanOptionalText(row.institute_id) ?? findInstituteByName(store.institutes, instituteName)?.id;
        const agencyId = cleanOptionalText(row.agency_id) ?? findAgencyByName(store.agencies, agencyName)?.id;

        let institute = instituteId ? store.institutes.find((item) => item.id === instituteId) : undefined;
        if (!institute) {
          institute = {
            id: instituteId ?? `local-inst-${rowNumber}`,
            name: instituteName,
            type: row.institute_type ?? 'University',
            city_in_nz: cleanText(row.institute_city_in_nz),
            official_website: cleanText(row.institute_official_website),
            representative_page_url: cleanText(row.institute_representative_page_url),
            last_checked_at: row.institute_last_checked_at ?? new Date().toISOString().split('T')[0],
          };
          store.institutes.push(institute);
        }

        let agency = agencyId ? store.agencies.find((item) => item.id === agencyId) : undefined;
        if (!agency) {
          agency = {
            id: agencyId ?? `local-ag-${rowNumber}`,
            name: agencyName,
            country: 'Bangladesh',
            city: cleanText(row.agency_city),
            address: cleanOptionalText(row.agency_address) ?? '',
            phone: cleanOptionalText(row.agency_phone) ?? '',
            email: cleanOptionalText(row.agency_email) ?? '',
            website: cleanOptionalText(row.agency_website) ?? '',
            contact_person: cleanOptionalText(row.agency_contact_person),
            notes: cleanOptionalText(row.agency_notes),
          };
          store.agencies.push(agency);
        }

        if (!institute || !agency) {
          summaryRows.push({ rowNumber, status: 'error', message: 'Could not resolve institute or agency.' });
          continue;
        }

        const existing = store.representations.find(
          (rep) => rep.institute_id === institute!.id && rep.agency_id === agency!.id
        );
        if (existing) {
          summaryRows.push({
            rowNumber,
            status: 'skipped',
            message: 'Representation already exists; skipped.',
            instituteId: institute.id,
            agencyId: agency.id,
            representationId: existing.id,
          });
          continue;
        }

        const representation: Representation = {
          id: `local-rep-${rowNumber}-${Date.now()}`,
          institute_id: institute.id,
          agency_id: agency.id,
          source_url: cleanText(row.source_url),
          authorization_status: normalizeStatus(row.authorization_status),
          last_verified_at: row.last_verified_at ?? new Date().toISOString().split('T')[0],
        };
        store.representations.push(representation);
        touchedInstituteIds.add(institute.id);
        touchedAgencyIds.add(agency.id);
        summaryRows.push({
          rowNumber,
          status: 'created',
          message: 'Imported successfully.',
          instituteId: institute.id,
          agencyId: agency.id,
          representationId: representation.id,
        });
      }

      if (JSON.stringify(store) !== originalState) {
        writeStore(store);
      }

      return res.status(200).json(makeSummary(summaryRows));
    }

    const sb = getSupabaseAdmin();
    if (!sb) {
      return res.status(500).json({ error: 'Supabase admin client is unavailable.' });
    }

    // Preload current rows for name matching / duplicate detection.
    const [institutesRes, agenciesRes, repsRes] = await Promise.all([
      sb.from('institutes').select('*'),
      sb.from('agencies').select('*'),
      sb.from('representations').select('*'),
    ]);

    if (institutesRes.error) return res.status(500).json({ error: institutesRes.error.message });
    if (agenciesRes.error) return res.status(500).json({ error: agenciesRes.error.message });
    if (repsRes.error) return res.status(500).json({ error: repsRes.error.message });

    let institutes = (institutesRes.data ?? []) as unknown as Institute[];
    let agencies = (agenciesRes.data ?? []) as unknown as Agency[];
    const representations = (repsRes.data ?? []) as unknown as Representation[];

    const seen = new Set<string>();

    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      const rowNumber = index + 2;
      const errors = validateCsvRow(row);
      if (errors.length) {
        summaryRows.push({ rowNumber, status: 'error', message: errors.join('; ') });
        continue;
      }

      const key = uniqueRepresentationKey(row);
      if (seen.has(key)) {
        summaryRows.push({ rowNumber, status: 'skipped', message: 'Duplicate row in CSV; skipped.' });
        continue;
      }
      seen.add(key);

      const instituteName = cleanText(row.institute_name);
      const agencyName = cleanText(row.agency_name);
      const instituteId = cleanOptionalText(row.institute_id) ?? findInstituteByName(institutes, instituteName)?.id;
      const agencyId = cleanOptionalText(row.agency_id) ?? findAgencyByName(agencies, agencyName)?.id;

      let institute = instituteId ? institutes.find((item) => item.id === instituteId) : undefined;
      if (!institute) {
        const payload = {
          ...(instituteId ? { id: instituteId } : {}),
          name: instituteName,
          type: (row.institute_type ?? 'University') as InstituteType,
          city_in_nz: cleanText(row.institute_city_in_nz),
          official_website: cleanText(row.institute_official_website),
          representative_page_url: cleanText(row.institute_representative_page_url),
          last_checked_at: row.institute_last_checked_at ?? new Date().toISOString().split('T')[0],
        };
        const result = await sb.from('institutes').insert(payload).select().single();
        if (result.error) return res.status(500).json({ error: result.error.message });
        institute = result.data as unknown as Institute;
        institutes = [...institutes, institute];
      }

      let agency = agencyId ? agencies.find((item) => item.id === agencyId) : undefined;
      if (!agency) {
        const payload = {
          ...(agencyId ? { id: agencyId } : {}),
          name: agencyName,
          country: 'Bangladesh',
          city: cleanText(row.agency_city),
          address: cleanOptionalText(row.agency_address) ?? '',
          phone: cleanOptionalText(row.agency_phone) ?? '',
          email: cleanOptionalText(row.agency_email) ?? '',
          website: cleanOptionalText(row.agency_website) ?? '',
          contact_person: cleanOptionalText(row.agency_contact_person),
          notes: cleanOptionalText(row.agency_notes),
        };
        const result = await sb.from('agencies').insert(payload).select().single();
        if (result.error) return res.status(500).json({ error: result.error.message });
        agency = result.data as unknown as Agency;
        agencies = [...agencies, agency];
      }

      if (!institute || !agency) {
        summaryRows.push({ rowNumber, status: 'error', message: 'Could not resolve institute or agency.' });
        continue;
      }

      const existing = representations.find(
        (rep) => rep.institute_id === institute!.id && rep.agency_id === agency!.id
      );
      if (existing) {
        summaryRows.push({
          rowNumber,
          status: 'skipped',
          message: 'Representation already exists; skipped.',
          instituteId: institute.id,
          agencyId: agency.id,
          representationId: existing.id,
        });
        continue;
      }

      const payload = {
        institute_id: institute.id,
        agency_id: agency.id,
        source_url: cleanText(row.source_url),
        authorization_status: normalizeStatus(row.authorization_status),
        last_verified_at: row.last_verified_at ?? new Date().toISOString().split('T')[0],
      };
      const result = await sb.from('representations').insert(payload).select().single();
      if (result.error) {
        if (result.error.code === '23505') {
          summaryRows.push({ rowNumber, status: 'skipped', message: 'Representation already exists; skipped.' });
          continue;
        }
        return res.status(500).json({ error: result.error.message });
      }
      const representation = result.data as unknown as Representation;
      summaryRows.push({
        rowNumber,
        status: 'created',
        message: 'Imported successfully.',
        instituteId: institute.id,
        agencyId: agency.id,
        representationId: representation.id,
      });
    }

    const touchedInstitutePaths = [...touchedInstituteIds].map((id) => `/institutes/${id}`);
    const touchedAgencyPaths = [...touchedAgencyIds].map((id) => `/agencies/${id}`);
    if (touchedInstitutePaths.length || touchedAgencyPaths.length) {
      await revalidatePaths(res, ['/institutes', '/agencies', '/', ...touchedInstitutePaths, ...touchedAgencyPaths]);
    }

    return res.status(200).json(makeSummary(summaryRows));
  } catch (error: unknown) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to import CSV',
    });
  }
}
