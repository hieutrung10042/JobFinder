// MyApplications.tsx — fetch từ GET /api/applications/my
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Building, MapPin, Clock, Search, Filter, MoreVertical, RefreshCw, FileX } from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Application {
  application_id: number;
  job_id: number;
  job_title: string;
  company_name: string;
  location: string;
  job_type: string;
  logo_url?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  applied_at: string;
  cover_letter?: string;
}

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<Application['status'], { label: string; className: string }> = {
  pending:  { label: 'Applied',      className: 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300' },
  reviewed: { label: 'Under Review', className: 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400' },
  accepted: { label: 'Interviewing', className: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' },
  rejected: { label: 'Rejected',     className: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' },
};

function StatusBadge({ status }: { status: Application['status'] }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 animate-pulse">
      <div className="flex gap-5">
        <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-slate-700 flex-shrink-0" />
        <div className="flex-1 space-y-2.5 py-1">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/5" />
          <div className="h-3 bg-gray-100 dark:bg-slate-700/60 rounded w-3/5" />
          <div className="h-3 bg-gray-100 dark:bg-slate-700/60 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filtered, setFiltered]         = useState<Application[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilter, setShowFilter]     = useState(false);

  // ── fetch ──────────────────────────────────────────────────────────────────
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get('/api/applications/my', { withCredentials: true });
      if (data.success) {
        setApplications(data.data);
        setFiltered(data.data);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  // ── client-side filter ────────────────────────────────────────────────────
  useEffect(() => {
    let result = applications;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.job_title.toLowerCase().includes(q) ||
        a.company_name.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter(a => a.status === statusFilter);
    }
    setFiltered(result);
  }, [search, statusFilter, applications]);

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              My Applications
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              {loading ? 'Loading…' : `${filtered.length} application${filtered.length !== 1 ? 's' : ''} found`}
            </p>
          </div>
          <button
            onClick={fetchApplications}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 dark:border-slate-700 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Filter bar */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:text-white"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilter(v => !v)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm"
            >
              <Filter className="w-4 h-4" />
              {statusFilter === 'all' ? 'Filter' : STATUS_CONFIG[statusFilter as Application['status']]?.label}
            </button>
            {showFilter && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg z-10 py-1 text-sm">
                {[
                  { value: 'all',      label: 'All Statuses' },
                  { value: 'pending',  label: 'Applied' },
                  { value: 'reviewed', label: 'Under Review' },
                  { value: 'accepted', label: 'Interviewing' },
                  { value: 'rejected', label: 'Rejected' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setStatusFilter(opt.value); setShowFilter(false); }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors
                      ${statusFilter === opt.value ? 'font-semibold text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-slate-300'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── States ── */}

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(n => <SkeletonCard key={n} />)}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <FileX className="w-7 h-7 text-red-500" />
            </div>
            <p className="text-gray-700 dark:text-slate-300 font-semibold">{error}</p>
            <button
              onClick={fetchApplications}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
              <FileX className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-gray-700 dark:text-slate-300 font-semibold">
              {search || statusFilter !== 'all' ? 'No results match your filters' : "You haven't applied to any jobs yet"}
            </p>
            {(search || statusFilter !== 'all') && (
              <button
                onClick={() => { setSearch(''); setStatusFilter('all'); }}
                className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* List */}
        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map(app => (
              <div
                key={app.application_id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">

                  {/* Logo + status (mobile) */}
                  <div className="flex items-start justify-between sm:hidden w-full">
                    <img
                      src={app.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.company_name)}&background=random&size=64`}
                      alt={app.company_name}
                      className="w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-slate-700"
                    />
                    <StatusBadge status={app.status} />
                  </div>

                  {/* Logo (desktop) */}
                  <img
                    src={app.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.company_name)}&background=random&size=64`}
                    alt={app.company_name}
                    className="hidden sm:block w-16 h-16 rounded-xl object-cover border border-gray-100 dark:border-slate-700 flex-shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1">
                    <Link
                      to={`/job/${app.job_id}`}
                      className="text-lg font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {app.job_title}
                    </Link>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-sm text-gray-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 font-medium text-gray-900 dark:text-slate-300">
                        <Building className="w-4 h-4 text-gray-400" />
                        {app.company_name}
                      </span>
                      {app.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {app.location}
                        </span>
                      )}
                      {app.job_type && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {app.job_type}
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-xs text-gray-500 dark:text-slate-500 font-medium">
                      Applied {formatDate(app.applied_at)}
                    </p>
                  </div>

                  {/* Status + actions (desktop) */}
                  <div className="hidden sm:flex flex-col items-end justify-between self-stretch">
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    <StatusBadge status={app.status} />
                  </div>

                  {/* View details (mobile) */}
                  <div className="sm:hidden border-t border-gray-100 dark:border-slate-700 pt-3 mt-1 flex justify-end">
                    <Link
                      to={`/job/${app.job_id}`}
                      className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
