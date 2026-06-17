import type { Institute, Agency, Representation } from './types';

// =====================================================================
// SEED / DEMO DATA
// ---------------------------------------------------------------------
// Institutes below are real New Zealand education providers.
//
// IMPORTANT: The AGENCY entries and the institute<->agency links are
// ILLUSTRATIVE PLACEHOLDERS for development and demo purposes only.
// Before publishing, replace these with data you have personally
// verified from each institute's official "authorized representatives"
// page, and set the correct source_url + last_verified_at.
// =====================================================================

export const institutes: Institute[] = [
  // ---------- Universities ----------
  { id: 'inst-uoa', name: 'University of Auckland', type: 'University', city_in_nz: 'Auckland', official_website: 'https://www.auckland.ac.nz', representative_page_url: 'https://www.auckland.ac.nz/en/study/applications-and-admissions/agents.html', last_checked_at: '2026-06-01' },
  { id: 'inst-otago', name: 'University of Otago', type: 'University', city_in_nz: 'Dunedin', official_website: 'https://www.otago.ac.nz', representative_page_url: 'https://www.otago.ac.nz/international/agents', last_checked_at: '2026-06-01' },
  { id: 'inst-vuw', name: 'Victoria University of Wellington', type: 'University', city_in_nz: 'Wellington', official_website: 'https://www.wgtn.ac.nz', representative_page_url: 'https://www.wgtn.ac.nz/study/international-students/agents', last_checked_at: '2026-06-01' },
  { id: 'inst-canterbury', name: 'University of Canterbury', type: 'University', city_in_nz: 'Christchurch', official_website: 'https://www.canterbury.ac.nz', representative_page_url: 'https://www.canterbury.ac.nz/study/international-students/agents', last_checked_at: '2026-06-01' },
  { id: 'inst-waikato', name: 'University of Waikato', type: 'University', city_in_nz: 'Hamilton', official_website: 'https://www.waikato.ac.nz', representative_page_url: 'https://www.waikato.ac.nz/international/agents', last_checked_at: '2026-06-01' },
  { id: 'inst-massey', name: 'Massey University', type: 'University', city_in_nz: 'Palmerston North', official_website: 'https://www.massey.ac.nz', representative_page_url: 'https://www.massey.ac.nz/study/international-students/agents', last_checked_at: '2026-06-01' },
  { id: 'inst-aut', name: 'Auckland University of Technology', type: 'University', city_in_nz: 'Auckland', official_website: 'https://www.aut.ac.nz', representative_page_url: 'https://www.aut.ac.nz/study/international/agents', last_checked_at: '2026-06-01' },
  { id: 'inst-lincoln', name: 'Lincoln University', type: 'University', city_in_nz: 'Lincoln', official_website: 'https://www.lincoln.ac.nz', representative_page_url: 'https://www.lincoln.ac.nz/study/international/agents', last_checked_at: '2026-06-01' },

  // ---------- Polytechnics / applied ----------
  { id: 'inst-unitec', name: 'Unitec Institute of Technology', type: 'Polytechnic', city_in_nz: 'Auckland', official_website: 'https://www.unitec.ac.nz', representative_page_url: 'https://www.unitec.ac.nz/international/agents', last_checked_at: '2026-06-01' },
  { id: 'inst-ara', name: 'Ara Institute of Canterbury', type: 'Polytechnic', city_in_nz: 'Christchurch', official_website: 'https://www.ara.ac.nz', representative_page_url: 'https://www.ara.ac.nz/international/agents', last_checked_at: '2026-06-01' },
  { id: 'inst-otagopoly', name: 'Otago Polytechnic', type: 'Polytechnic', city_in_nz: 'Dunedin', official_website: 'https://www.op.ac.nz', representative_page_url: 'https://www.op.ac.nz/international/agents', last_checked_at: '2026-06-01' },
  { id: 'inst-sit', name: 'Southern Institute of Technology', type: 'Polytechnic', city_in_nz: 'Invercargill', official_website: 'https://www.sit.ac.nz', representative_page_url: 'https://www.sit.ac.nz/international/agents', last_checked_at: '2026-06-01' },
  { id: 'inst-wintec', name: 'Wintec (Waikato Institute of Technology)', type: 'Polytechnic', city_in_nz: 'Hamilton', official_website: 'https://www.wintec.ac.nz', representative_page_url: 'https://www.wintec.ac.nz/international/agents', last_checked_at: '2026-06-01' },
  { id: 'inst-mit', name: 'Manukau Institute of Technology', type: 'Polytechnic', city_in_nz: 'Auckland', official_website: 'https://www.manukau.ac.nz', representative_page_url: 'https://www.manukau.ac.nz/international/agents', last_checked_at: '2026-06-01' },

  // ---------- Private / specialist ----------
  { id: 'inst-ais', name: 'Auckland Institute of Studies', type: 'Private Institute', city_in_nz: 'Auckland', official_website: 'https://www.ais.ac.nz', representative_page_url: 'https://www.ais.ac.nz/international/agents', last_checked_at: '2026-06-01' },
  { id: 'inst-yoobee', name: 'Yoobee College of Creative Innovation', type: 'Private Institute', city_in_nz: 'Auckland', official_website: 'https://www.yoobee.ac.nz', representative_page_url: 'https://www.yoobee.ac.nz/international/agents', last_checked_at: '2026-06-01' },
  { id: 'inst-icl', name: 'ICL Graduate Business School', type: 'Private Institute', city_in_nz: 'Auckland', official_website: 'https://www.icl.ac.nz', representative_page_url: 'https://www.icl.ac.nz/agents', last_checked_at: '2026-06-01' },
  { id: 'inst-aspire2', name: 'Aspire2 International', type: 'Private Institute', city_in_nz: 'Auckland', official_website: 'https://www.aspire2international.ac.nz', representative_page_url: 'https://www.aspire2international.ac.nz/agents', last_checked_at: '2026-06-01' },
];

// --- Placeholder agencies in Bangladesh (DEMO ONLY — verify before publishing) ---
export const agencies: Agency[] = [
  { id: 'ag-1', name: 'Global Education Consultancy (DEMO)', country: 'Bangladesh', city: 'Dhaka', address: 'House 12, Road 5, Dhanmondi, Dhaka 1205', phone: '+880 1XXX-XXXXXX', email: 'info@example-agency.com', website: 'https://example-agency.com', contact_person: 'Demo Contact', notes: 'Placeholder record for development. Verify authorization on the institute website.' },
  { id: 'ag-2', name: 'StudyBridge International (DEMO)', country: 'Bangladesh', city: 'Dhaka', address: 'Level 7, Gulshan Avenue, Gulshan-1, Dhaka 1212', phone: '+880 1XXX-XXXXXX', email: 'hello@example-agency.com', website: 'https://example-agency.com', contact_person: 'Demo Contact', notes: 'Placeholder record for development.' },
  { id: 'ag-3', name: 'Southern Overseas (DEMO)', country: 'Bangladesh', city: 'Chattogram', address: 'GEC Circle, Chattogram 4000', phone: '+880 1XXX-XXXXXX', email: 'contact@example-agency.com', website: 'https://example-agency.com', contact_person: 'Demo Contact', notes: 'Placeholder record for development.' },
  { id: 'ag-4', name: 'Sylhet Study Care (DEMO)', country: 'Bangladesh', city: 'Sylhet', address: 'Zindabazar, Sylhet 3100', phone: '+880 1XXX-XXXXXX', email: 'care@example-agency.com', website: 'https://example-agency.com', contact_person: 'Demo Contact', notes: 'Placeholder record for development.' },
];

// --- Placeholder representations (DEMO ONLY) ---
export const representations: Representation[] = [
  { id: 'r-1',  institute_id: 'inst-uoa',     agency_id: 'ag-1', source_url: 'https://www.auckland.ac.nz/en/study/applications-and-admissions/agents.html', authorization_status: 'authorized', last_verified_at: '2026-06-01' },
  { id: 'r-2',  institute_id: 'inst-uoa',     agency_id: 'ag-2', source_url: 'https://www.auckland.ac.nz/en/study/applications-and-admissions/agents.html', authorization_status: 'authorized', last_verified_at: '2026-06-01' },
  { id: 'r-3',  institute_id: 'inst-otago',   agency_id: 'ag-1', source_url: 'https://www.otago.ac.nz/international/agents', authorization_status: 'authorized', last_verified_at: '2026-06-01' },
  { id: 'r-4',  institute_id: 'inst-otago',   agency_id: 'ag-3', source_url: 'https://www.otago.ac.nz/international/agents', authorization_status: 'authorized', last_verified_at: '2026-06-01' },
  { id: 'r-5',  institute_id: 'inst-aut',     agency_id: 'ag-2', source_url: 'https://www.aut.ac.nz/study/international/agents', authorization_status: 'authorized', last_verified_at: '2026-06-01' },
  { id: 'r-6',  institute_id: 'inst-aut',     agency_id: 'ag-4', source_url: 'https://www.aut.ac.nz/study/international/agents', authorization_status: 'authorized', last_verified_at: '2026-06-01' },
  { id: 'r-7',  institute_id: 'inst-vuw',     agency_id: 'ag-1', source_url: 'https://www.wgtn.ac.nz/study/international-students/agents', authorization_status: 'authorized', last_verified_at: '2026-06-01' },
  { id: 'r-8',  institute_id: 'inst-canterbury', agency_id: 'ag-3', source_url: 'https://www.canterbury.ac.nz/study/international-students/agents', authorization_status: 'authorized', last_verified_at: '2026-06-01' },
  { id: 'r-9',  institute_id: 'inst-waikato', agency_id: 'ag-2', source_url: 'https://www.waikato.ac.nz/international/agents', authorization_status: 'authorized', last_verified_at: '2026-06-01' },
  { id: 'r-10', institute_id: 'inst-massey',  agency_id: 'ag-4', source_url: 'https://www.massey.ac.nz/study/international-students/agents', authorization_status: 'authorized', last_verified_at: '2026-06-01' },
  { id: 'r-11', institute_id: 'inst-unitec',  agency_id: 'ag-1', source_url: 'https://www.unitec.ac.nz/international/agents', authorization_status: 'authorized', last_verified_at: '2026-06-01' },
  { id: 'r-12', institute_id: 'inst-ara',     agency_id: 'ag-3', source_url: 'https://www.ara.ac.nz/international/agents', authorization_status: 'authorized', last_verified_at: '2026-06-01' },
  { id: 'r-13', institute_id: 'inst-sit',     agency_id: 'ag-2', source_url: 'https://www.sit.ac.nz/international/agents', authorization_status: 'authorized', last_verified_at: '2026-06-01' },
  { id: 'r-14', institute_id: 'inst-icl',     agency_id: 'ag-1', source_url: 'https://www.icl.ac.nz/agents', authorization_status: 'authorized', last_verified_at: '2026-06-01' },
  { id: 'r-15', institute_id: 'inst-aspire2', agency_id: 'ag-4', source_url: 'https://www.aspire2international.ac.nz/agents', authorization_status: 'authorized', last_verified_at: '2026-06-01' },
  { id: 'r-16', institute_id: 'inst-yoobee',  agency_id: 'ag-2', source_url: 'https://www.yoobee.ac.nz/international/agents', authorization_status: 'authorized', last_verified_at: '2026-06-01' },
];
