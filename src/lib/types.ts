export type InstituteType =
  | 'University'
  | 'Polytechnic'
  | 'Private Institute'
  | 'English Language School';

export type AuthorizationStatus = 'authorized' | 'unverified' | 'expired';

export interface Institute {
  id: string;
  name: string;
  type: InstituteType;
  city_in_nz: string;
  official_website: string;
  representative_page_url: string;
  last_checked_at: string; // ISO date
}

export interface Agency {
  id: string;
  name: string;
  country: string; // "Bangladesh"
  city: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  contact_person?: string;
  notes?: string;
}

export interface Representation {
  id: string;
  institute_id: string;
  agency_id: string;
  source_url: string;
  authorization_status: AuthorizationStatus;
  last_verified_at: string; // ISO date
}

// Convenience shapes used by the UI
export interface AgencyForInstitute extends Agency {
  source_url: string;
  authorization_status: AuthorizationStatus;
  last_verified_at: string;
}

export interface InstituteForAgency extends Institute {
  source_url: string;
  authorization_status: AuthorizationStatus;
  last_verified_at: string;
}
