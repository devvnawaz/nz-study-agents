import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import type { Institute, Agency, Representation, InstituteType, AuthorizationStatus } from '@/lib/types';
import type { Report } from '@/lib/store';
import { adminApi, getToken, setToken } from '@/hooks/useAdminApi';

// ─────────────────────────────────────────────────────────────────────
// Token gate
// ─────────────────────────────────────────────────────────────────────

function TokenGate({ onSuccess }: { onSuccess: () => void }) {
  const [token, setTokenInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setToken(token.trim());
    try {
      await adminApi.getAgencies();
      onSuccess();
    } catch {
      setError('Incorrect admin token. Try "dev" in demo mode.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="card w-full max-w-sm p-8">
        <div className="mb-6 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-nz-black text-white font-black mx-auto mb-3">NZ</span>
          <h1 className="text-xl font-bold text-gray-900">Admin panel</h1>
          <p className="mt-1 text-sm text-gray-500">Enter your admin token to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">Admin token</label>
            <input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="e.g. dev"
              autoFocus
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading || !token.trim()} className="w-full btn-primary justify-center">
            {loading ? 'Checking…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-4 text-xs text-center text-gray-400">In local demo mode the default token is <code className="bg-gray-100 px-1 rounded">dev</code></p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────

type Tab = 'agencies' | 'institutes' | 'links' | 'reports';

function TabButton({ label, active, onClick, badge }: { label: string; active: boolean; onClick: () => void; badge?: number }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition ${
        active
          ? 'border-brand-700 text-brand-700'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {label}
      {badge !== undefined && badge > 0 && (
        <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-semibold text-white leading-none">{badge}</span>
      )}
    </button>
  );
}

function FieldGroup({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';
const selectClass = inputClass;

// ─────────────────────────────────────────────────────────────────────
// Agencies tab
// ─────────────────────────────────────────────────────────────────────

const emptyAgency = { name: '', city: '', address: '', phone: '', email: '', website: '', contact_person: '', notes: '' };

function AgenciesTab() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [form, setForm] = useState<typeof emptyAgency>(emptyAgency);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setAgencies(await adminApi.getAgencies());
  }, []);
  useEffect(() => { load(); }, [load]);

  function startEdit(agency: Agency) {
    setEditingId(agency.id);
    setForm({
      name: agency.name,
      city: agency.city,
      address: agency.address,
      phone: agency.phone,
      email: agency.email,
      website: agency.website,
      contact_person: agency.contact_person ?? '',
      notes: agency.notes ?? '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyAgency);
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (editingId) {
        await adminApi.updateAgency(editingId, form);
        setSuccess(`Updated: ${form.name}`);
        setEditingId(null);
      } else {
        await adminApi.createAgency(form);
        setSuccess(`Added: ${form.name}`);
      }
      setForm(emptyAgency);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error saving agency');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(ag: Agency) {
    if (!confirm(`Delete "${ag.name}"? This will also remove all institute links for this agency.`)) return;
    try {
      await adminApi.deleteAgency(ag.id);
      await load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  const filtered = agencies.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) || a.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Form */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-4">
          {editingId ? '✏️ Edit agency' : '+ Add new agency'}
        </h2>
        {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {success && <p className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">✓ {success}</p>}
        <form onSubmit={handleSubmit} className="card p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Agency name" required>
              <input className={inputClass} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="ABC Education Consultancy" required />
            </FieldGroup>
            <FieldGroup label="City in Bangladesh" required>
              <input className={inputClass} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Dhaka" required />
            </FieldGroup>
          </div>
          <FieldGroup label="Address">
            <input className={inputClass} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="House 12, Road 5, Dhanmondi, Dhaka 1205" />
          </FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Phone">
              <input className={inputClass} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+880 1XXX-XXXXXX" />
            </FieldGroup>
            <FieldGroup label="Email">
              <input className={inputClass} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="info@agency.com" />
            </FieldGroup>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Website">
              <input className={inputClass} value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://agency.com" />
            </FieldGroup>
            <FieldGroup label="Contact person">
              <input className={inputClass} value={form.contact_person} onChange={e => setForm(f => ({ ...f, contact_person: e.target.value }))} placeholder="Name of contact" />
            </FieldGroup>
          </div>
          <FieldGroup label="Notes (visible to students)">
            <textarea className={inputClass} rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any important notes for students" />
          </FieldGroup>
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving…' : editingId ? 'Save changes' : 'Add agency'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-base font-bold text-gray-900">{agencies.length} agencies</h2>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search…"
            className="ml-auto rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {filtered.map(ag => (
            <div key={ag.id} className="card flex items-start justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-semibold text-sm text-gray-900 truncate">{ag.name}</p>
                <p className="text-xs text-gray-500">{ag.city} · {ag.phone || '—'}</p>
                {ag.email && <p className="text-xs text-gray-400 truncate">{ag.email}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => startEdit(ag)} className="rounded px-2 py-1 text-xs font-medium text-brand-700 hover:bg-brand-50">Edit</button>
                <button onClick={() => handleDelete(ag)} className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50">Delete</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No agencies found.</p>}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Institutes tab
// ─────────────────────────────────────────────────────────────────────

const TYPES: InstituteType[] = ['University', 'Polytechnic', 'Private Institute', 'English Language School'];
const emptyInstitute = { name: '', type: 'University' as InstituteType, city_in_nz: '', official_website: '', representative_page_url: '', last_checked_at: '' };

function InstitutesTab() {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [form, setForm] = useState<typeof emptyInstitute>(emptyInstitute);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = useCallback(async () => { setInstitutes(await adminApi.getInstitutes()); }, []);
  useEffect(() => { load(); }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      await adminApi.createInstitute({ ...form, last_checked_at: form.last_checked_at || new Date().toISOString().split('T')[0] });
      setSuccess(`Added: ${form.name}`);
      setForm(emptyInstitute);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally { setLoading(false); }
  }

  async function handleDelete(inst: Institute) {
    if (!confirm(`Delete "${inst.name}"? All agent links for this institute will also be removed.`)) return;
    try { await adminApi.deleteInstitute(inst.id); await load(); }
    catch (err: unknown) { alert(err instanceof Error ? err.message : 'Delete failed'); }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-4">+ Add new institute</h2>
        {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {success && <p className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">✓ {success}</p>}
        <form onSubmit={handleSubmit} className="card p-5 space-y-4">
          <FieldGroup label="Institute name" required>
            <input className={inputClass} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="University of Auckland" required />
          </FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Type" required>
              <select className={selectClass} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as InstituteType }))}>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </FieldGroup>
            <FieldGroup label="City in NZ" required>
              <input className={inputClass} value={form.city_in_nz} onChange={e => setForm(f => ({ ...f, city_in_nz: e.target.value }))} placeholder="Auckland" required />
            </FieldGroup>
          </div>
          <FieldGroup label="Official website" required>
            <input className={inputClass} value={form.official_website} onChange={e => setForm(f => ({ ...f, official_website: e.target.value }))} placeholder="https://www.auckland.ac.nz" required />
          </FieldGroup>
          <FieldGroup label="Representatives page URL" required>
            <input className={inputClass} value={form.representative_page_url} onChange={e => setForm(f => ({ ...f, representative_page_url: e.target.value }))} placeholder="https://www.auckland.ac.nz/agents" required />
          </FieldGroup>
          <FieldGroup label="Last checked date">
            <input className={inputClass} type="date" value={form.last_checked_at} onChange={e => setForm(f => ({ ...f, last_checked_at: e.target.value }))} />
          </FieldGroup>
          <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving…' : 'Add institute'}</button>
        </form>
      </div>
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-4">{institutes.length} institutes</h2>
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {institutes.map(inst => (
            <div key={inst.id} className="card flex items-start justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-semibold text-sm text-gray-900 truncate">{inst.name}</p>
                <p className="text-xs text-gray-500">{inst.type} · {inst.city_in_nz}</p>
              </div>
              <button onClick={() => handleDelete(inst)} className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 shrink-0">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Links (representations) tab
// ─────────────────────────────────────────────────────────────────────

const emptyLink = {
  institute_id: '',
  agency_id: '',
  source_url: '',
  authorization_status: 'authorized' as AuthorizationStatus,
  last_verified_at: '',
};

function LinksTab() {
  const [reps, setReps] = useState<Representation[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [form, setForm] = useState<typeof emptyLink>(emptyLink);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('');

  const load = useCallback(async () => {
    const [r, i, a] = await Promise.all([
      adminApi.getRepresentations(),
      adminApi.getInstitutes(),
      adminApi.getAgencies(),
    ]);
    setReps(r); setInstitutes(i); setAgencies(a);
  }, []);
  useEffect(() => { load(); }, [load]);

  function instName(id: string) { return institutes.find(i => i.id === id)?.name ?? id; }
  function agName(id: string) { return agencies.find(a => a.id === id)?.name ?? id; }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      await adminApi.createRepresentation({
        ...form,
        last_verified_at: form.last_verified_at || new Date().toISOString().split('T')[0],
      });
      setSuccess(`Linked: ${instName(form.institute_id)} ↔ ${agName(form.agency_id)}`);
      setForm(emptyLink);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally { setLoading(false); }
  }

  async function handleDelete(rep: Representation) {
    if (!confirm(`Remove link: ${instName(rep.institute_id)} ↔ ${agName(rep.agency_id)}?`)) return;
    try { await adminApi.deleteRepresentation(rep.id); await load(); }
    catch (err: unknown) { alert(err instanceof Error ? err.message : 'Delete failed'); }
  }

  const filtered = reps.filter(r => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return instName(r.institute_id).toLowerCase().includes(q) || agName(r.agency_id).toLowerCase().includes(q);
  });

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-1">+ Link an agency to an institute</h2>
        <p className="text-xs text-gray-500 mb-4">Creates the authorized representation relationship.</p>
        {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {success && <p className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">✓ {success}</p>}
        <form onSubmit={handleSubmit} className="card p-5 space-y-4">
          <FieldGroup label="Institute" required>
            <select className={selectClass} value={form.institute_id} onChange={e => setForm(f => ({ ...f, institute_id: e.target.value }))} required>
              <option value="">— Select institute —</option>
              {institutes.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </FieldGroup>
          <FieldGroup label="Agency (in Bangladesh)" required>
            <select className={selectClass} value={form.agency_id} onChange={e => setForm(f => ({ ...f, agency_id: e.target.value }))} required>
              <option value="">— Select agency —</option>
              {agencies.map(a => <option key={a.id} value={a.id}>{a.name} — {a.city}</option>)}
            </select>
          </FieldGroup>
          <FieldGroup label="Source URL (official institute page)" required>
            <input className={inputClass} value={form.source_url} onChange={e => setForm(f => ({ ...f, source_url: e.target.value }))} placeholder="https://www.auckland.ac.nz/agents" required />
          </FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Authorization status">
              <select className={selectClass} value={form.authorization_status} onChange={e => setForm(f => ({ ...f, authorization_status: e.target.value as AuthorizationStatus }))}>
                <option value="authorized">Authorized</option>
                <option value="unverified">Unverified</option>
                <option value="expired">Expired</option>
              </select>
            </FieldGroup>
            <FieldGroup label="Last verified">
              <input className={inputClass} type="date" value={form.last_verified_at} onChange={e => setForm(f => ({ ...f, last_verified_at: e.target.value }))} />
            </FieldGroup>
          </div>
          <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving…' : 'Create link'}</button>
        </form>
      </div>

      <div>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-base font-bold text-gray-900">{reps.length} links</h2>
          <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter…"
            className="ml-auto rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none" />
        </div>
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {filtered.map(rep => (
            <div key={rep.id} className="card p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 text-sm">
                  <p className="font-medium text-gray-900 truncate">{instName(rep.institute_id)}</p>
                  <p className="text-gray-500 truncate">↔ {agName(rep.agency_id)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    <span className={`mr-2 ${rep.authorization_status === 'authorized' ? 'text-green-600' : rep.authorization_status === 'expired' ? 'text-red-500' : 'text-yellow-600'}`}>
                      ● {rep.authorization_status}
                    </span>
                    Verified: {rep.last_verified_at}
                  </p>
                </div>
                <button onClick={() => handleDelete(rep)} className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 shrink-0">Remove</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No links found.</p>}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Reports tab
// ─────────────────────────────────────────────────────────────────────

function ReportsTab() {
  const [reports, setReports] = useState<Report[]>([]);
  const [showResolved, setShowResolved] = useState(false);

  const load = useCallback(async () => { setReports(await adminApi.getReports()); }, []);
  useEffect(() => { load(); }, [load]);

  async function handleResolve(id: string) {
    try { await adminApi.resolveReport(id); await load(); }
    catch (err: unknown) { alert(err instanceof Error ? err.message : 'Failed'); }
  }

  const filtered = reports.filter(r => showResolved || !r.resolved);
  const unresolved = reports.filter(r => !r.resolved).length;

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <h2 className="text-base font-bold text-gray-900">{unresolved} unresolved {unresolved === 1 ? 'report' : 'reports'}</h2>
        <label className="flex items-center gap-1.5 text-sm text-gray-600 ml-auto cursor-pointer">
          <input type="checkbox" checked={showResolved} onChange={e => setShowResolved(e.target.checked)} />
          Show resolved
        </label>
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-400">
          {showResolved ? 'No reports at all yet.' : 'No unresolved reports.'}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className={`card p-5 ${r.resolved ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{r.message}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-400">
                    {r.reporter_contact && <span>From: {r.reporter_contact}</span>}
                    {r.institute_id && <span>Institute ID: {r.institute_id}</span>}
                    {r.agency_id && <span>Agency ID: {r.agency_id}</span>}
                    <span>{new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    {r.resolved && <span className="text-green-600 font-medium">✓ Resolved</span>}
                  </div>
                </div>
                {!r.resolved && (
                  <button onClick={() => handleResolve(r.id)} className="btn-secondary shrink-0 text-xs">
                    Mark resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>('agencies');
  const [unresolvedCount, setUnresolvedCount] = useState(0);

  useEffect(() => {
    // If a token is already saved, test it silently
    if (getToken()) {
      adminApi.getAgencies()
        .then(() => setAuthed(true))
        .catch(() => {/* needs login */});
    }
    // Load unresolved report count
    adminApi.getReports()
      .then(r => setUnresolvedCount(r.filter(x => !x.resolved).length))
      .catch(() => {});
  }, []);

  function logout() {
    localStorage.removeItem('admin_token');
    setAuthed(false);
  }

  if (!authed) return <TokenGate onSuccess={() => setAuthed(true)} />;

  return (
    <>
      <Head><title>Admin — NZ Study Agent Directory</title></Head>

      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded bg-nz-black text-white text-xs font-black">NZ</span>
              <span className="font-bold text-gray-900">Admin Panel</span>
            </div>
            <div className="flex items-center gap-3">
              <a href="/" target="_blank" className="text-sm text-gray-500 hover:text-brand-700">← View site</a>
              <button onClick={logout} className="text-sm text-red-500 hover:text-red-700">Sign out</button>
            </div>
          </div>
          <div className="flex gap-0 border-t border-gray-100 -mb-px">
            <TabButton label="Agencies" active={tab === 'agencies'} onClick={() => setTab('agencies')} />
            <TabButton label="Institutes" active={tab === 'institutes'} onClick={() => setTab('institutes')} />
            <TabButton label="Links" active={tab === 'links'} onClick={() => setTab('links')} />
            <TabButton label="Reports" active={tab === 'reports'} onClick={() => setTab('reports')} badge={unresolvedCount} />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {tab === 'agencies'   && <AgenciesTab />}
        {tab === 'institutes' && <InstitutesTab />}
        {tab === 'links'      && <LinksTab />}
        {tab === 'reports'    && <ReportsTab />}
      </main>
    </>
  );
}
