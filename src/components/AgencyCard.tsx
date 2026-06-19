import Link from 'next/link';
import type { AgencyForInstitute } from '@/lib/types';
import { getStatusBadgeClass, getStatusLabel, formatDate, formatPhone } from '@/lib/utils';

interface AgencyCardProps {
  agency: AgencyForInstitute;
  /** when true, the card is not wrapped in a link */
  standalone?: boolean;
}

function CardBody({ agency }: { agency: AgencyForInstitute }) {
  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 leading-snug">{agency.name}</h3>
          <p className="text-sm text-gray-500">{agency.city}, Bangladesh</p>
        </div>
        <span className={getStatusBadgeClass(agency.authorization_status)}>
          {getStatusLabel(agency.authorization_status)}
        </span>
      </div>

      {/* Contact grid */}
      <dl className="mt-4 grid grid-cols-1 gap-y-2 text-sm sm:grid-cols-2">
        {agency.address && (
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide">Address</dt>
            <dd className="text-gray-700">{agency.address}</dd>
          </div>
        )}
        {agency.phone && (
          <div>
            <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide">Phone</dt>
            <dd>
              <a href={`tel:${formatPhone(agency.phone).replace(/\s/g, '')}`} className="text-brand-700 hover:underline">
                {formatPhone(agency.phone)}
              </a>
            </dd>
          </div>
        )}
        {agency.email && (
          <div>
            <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide">Email</dt>
            <dd>
              <a href={`mailto:${agency.email}`} className="text-brand-700 hover:underline break-all">
                {agency.email}
              </a>
            </dd>
          </div>
        )}
        {agency.website && (
          <div>
            <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide">Website</dt>
            <dd>
              <a
                href={agency.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-700 hover:underline break-all"
              >
                {agency.website.replace(/^https?:\/\//, '')}
              </a>
            </dd>
          </div>
        )}
        {agency.contact_person && (
          <div>
            <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide">Contact Person</dt>
            <dd className="text-gray-700">{agency.contact_person}</dd>
          </div>
        )}
      </dl>

      {/* Source + verified */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3 text-xs text-gray-400">
        <span>Verified: {formatDate(agency.last_verified_at)}</span>
        <span>·</span>
        <a
          href={agency.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand-600 transition"
          title="View source on institute website"
        >
          View Source ↗
        </a>
        <span className="ml-auto">
          <Link
            href={`/report?agency=${agency.id}`}
            className="hover:text-red-500 transition"
          >
            Report outdated info
          </Link>
        </span>
      </div>

      {agency.notes && (
        <p className="mt-2 rounded bg-yellow-50 px-3 py-2 text-xs text-yellow-800 border border-yellow-200">
          ⚠️ {agency.notes}
        </p>
      )}
    </div>
  );
}

export default function AgencyCard({ agency, standalone = false }: AgencyCardProps) {
  if (standalone) {
    return (
      <div className="card">
        <CardBody agency={agency} />
      </div>
    );
  }
  return (
    <div className="card">
      <CardBody agency={agency} />
    </div>
  );
}
