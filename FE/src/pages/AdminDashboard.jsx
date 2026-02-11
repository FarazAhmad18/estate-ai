import { useState, useEffect } from 'react';
import {
  Users, Building2, MessageSquare, Eye, Trash2, Search,
  TrendingUp, UserPlus, Activity, ChevronLeft, ChevronRight, Star,
} from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'users', label: 'Users' },
  { key: 'properties', label: 'Properties' },
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'visitors', label: 'Visitors' },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-primary tracking-tight">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Manage your platform</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface rounded-xl p-1 mb-8 w-fit overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                tab === t.key
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-muted hover:text-secondary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && <OverviewTab />}
        {tab === 'users' && <UsersTab currentUserId={user?.id} />}
        {tab === 'properties' && <PropertiesTab />}
        {tab === 'testimonials' && <TestimonialsTab />}
        {tab === 'visitors' && <VisitorsTab />}
      </div>
    </div>
  );
}

/* ─── Overview Tab ─── */
function OverviewTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then((res) => setStats(res.data))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="py-32" />;
  if (!stats) return null;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, bg: 'bg-primary/10', color: 'text-primary' },
    { label: 'Total Properties', value: stats.totalProperties, icon: Building2, bg: 'bg-emerald-50', color: 'text-emerald-600' },
    { label: 'Testimonials', value: stats.totalTestimonials, icon: MessageSquare, bg: 'bg-blue-50', color: 'text-blue-500' },
    { label: 'Visitors Today', value: stats.visitorsToday, icon: Eye, bg: 'bg-amber-50', color: 'text-amber-500' },
    { label: 'Visitors This Week', value: stats.visitorsThisWeek, icon: TrendingUp, bg: 'bg-purple-50', color: 'text-purple-500' },
    { label: 'New Users This Week', value: stats.newUsersThisWeek, icon: UserPlus, bg: 'bg-red-50', color: 'text-red-500' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-2xl border border-border/50 p-5">
          <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
            <c.icon size={18} className={c.color} />
          </div>
          <p className="text-2xl font-semibold text-primary">{c.value}</p>
          <p className="text-xs text-muted mt-0.5">{c.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Users Tab ─── */
function UsersTab({ currentUserId }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchUsers = (q = '') => {
    setLoading(true);
    api.get('/admin/users', { params: { search: q } })
      .then((res) => setUsers(res.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(search);
  };

  const handleDelete = async (id) => {
    if (deleting) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete user');
    } finally {
      setDeleting(null);
    }
  };

  const roleBadge = (role) => {
    const styles = {
      Admin: 'bg-red-50 text-red-600',
      Agent: 'bg-accent/10 text-accent',
      Buyer: 'bg-surface text-muted',
    };
    return (
      <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${styles[role] || styles.Buyer}`}>
        {role}
      </span>
    );
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  return (
    <>
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface rounded-xl text-sm border border-border/50 focus:border-accent transition-colors"
          />
        </div>
        <button type="submit" className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
          Search
        </button>
      </form>

      {loading ? (
        <Spinner className="py-32" />
      ) : users.length === 0 ? (
        <p className="text-center py-20 text-muted text-sm">No users found</p>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-4 bg-white rounded-xl border border-border/50 p-4 hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                {u.avatar_url ? (
                  <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-semibold text-primary">{u.name?.charAt(0)?.toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-primary truncate">{u.name}</p>
                  {roleBadge(u.role)}
                </div>
                <p className="text-xs text-muted truncate">{u.email}</p>
              </div>
              <p className="text-xs text-muted hidden sm:block">{formatDate(u.createdAt)}</p>
              <button
                onClick={() => handleDelete(u.id)}
                disabled={deleting === u.id || u.id === currentUserId}
                className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-muted hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title={u.id === currentUserId ? 'Cannot delete yourself' : 'Delete user'}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ─── Properties Tab ─── */
function PropertiesTab() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState(null);

  const fetchProperties = (q = '', p = 1) => {
    setLoading(true);
    api.get('/admin/properties', { params: { search: q, page: p, limit: 20 } })
      .then((res) => {
        setProperties(res.data.properties);
        setTotalPages(res.data.totalPages);
        setPage(res.data.page);
      })
      .catch(() => toast.error('Failed to load properties'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties(search, 1);
  };

  const handleDelete = async (id) => {
    if (deleting) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/properties/${id}`);
      toast.success('Property deleted');
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch {
      toast.error('Failed to delete property');
    } finally {
      setDeleting(null);
    }
  };

  const formatPrice = (price) => {
    if (price >= 10000000) return `${(price / 10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `${(price / 100000).toFixed(1)} Lac`;
    return price?.toLocaleString();
  };

  const statusColor = (status) => {
    switch (status) {
      case 'Sold': return 'bg-red-50 text-red-600 border-red-100';
      case 'Rented': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    }
  };

  return (
    <>
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by location..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface rounded-xl text-sm border border-border/50 focus:border-accent transition-colors"
          />
        </div>
        <button type="submit" className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
          Search
        </button>
      </form>

      {loading ? (
        <Spinner className="py-32" />
      ) : properties.length === 0 ? (
        <p className="text-center py-20 text-muted text-sm">No properties found</p>
      ) : (
        <>
          <div className="space-y-3">
            {properties.map((p) => (
              <div key={p.id} className="flex items-center gap-4 bg-white rounded-xl border border-border/50 p-4 hover:shadow-sm transition-shadow">
                <div className="w-16 h-16 rounded-xl bg-surface overflow-hidden flex-shrink-0">
                  {p.PropertyImages?.[0]?.image_url ? (
                    <img src={p.PropertyImages[0].image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted"><Building2 size={18} /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-medium bg-surface px-2 py-0.5 rounded text-muted">{p.type}</span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${statusColor(p.status)}`}>{p.status}</span>
                  </div>
                  <p className="font-semibold text-primary mt-1 text-sm">PKR {formatPrice(p.price)}</p>
                  <p className="text-xs text-muted truncate">{p.location}</p>
                </div>
                <div className="hidden sm:block text-right flex-shrink-0">
                  <p className="text-xs font-medium text-secondary">{p.User?.name || '—'}</p>
                  <p className="text-[10px] text-muted">{p.User?.email}</p>
                </div>
                <button
                  onClick={() => handleDelete(p.id)}
                  disabled={deleting === p.id}
                  className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-muted hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onChange={(p) => fetchProperties(search, p)} />
          )}
        </>
      )}
    </>
  );
}

/* ─── Testimonials Tab ─── */
function TestimonialsTab() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    api.get('/admin/testimonials')
      .then((res) => setTestimonials(res.data))
      .catch(() => toast.error('Failed to load testimonials'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (deleting) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/testimonials/${id}`);
      toast.success('Testimonial deleted');
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch {
      toast.error('Failed to delete testimonial');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  if (loading) return <Spinner className="py-32" />;
  if (testimonials.length === 0) return <p className="text-center py-20 text-muted text-sm">No testimonials found</p>;

  return (
    <div className="space-y-3">
      {testimonials.map((t) => (
        <div key={t.id} className="bg-white rounded-xl border border-border/50 p-5 hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                {t.User?.avatar_url ? (
                  <img src={t.User.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-semibold text-primary">{t.User?.name?.charAt(0)?.toUpperCase()}</span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">{t.User?.name || 'Unknown'}</p>
                <p className="text-xs text-muted">{t.User?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} className={s <= t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                ))}
              </div>
              <span className="text-xs text-muted">{formatDate(t.createdAt)}</span>
              <button
                onClick={() => handleDelete(t.id)}
                disabled={deleting === t.id}
                className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-muted hover:text-red-500 transition-colors disabled:opacity-50"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm text-secondary leading-relaxed">{t.content}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Visitors Tab ─── */
function VisitorsTab() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVisitors = (p = 1) => {
    setLoading(true);
    api.get('/admin/visitors', { params: { page: p, limit: 50 } })
      .then((res) => {
        setVisitors(res.data.visitors);
        setTotalPages(res.data.totalPages);
        setPage(res.data.page);
      })
      .catch(() => toast.error('Failed to load visitors'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchVisitors(); }, []);

  const formatDate = (d) => d ? new Date(d).toLocaleString('en-PK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  const truncate = (str, len = 40) => str && str.length > len ? str.slice(0, len) + '...' : str || '—';

  if (loading) return <Spinner className="py-32" />;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left py-3 px-3 text-xs font-medium text-muted uppercase tracking-wider">IP</th>
              <th className="text-left py-3 px-3 text-xs font-medium text-muted uppercase tracking-wider">Path</th>
              <th className="text-left py-3 px-3 text-xs font-medium text-muted uppercase tracking-wider">Method</th>
              <th className="text-left py-3 px-3 text-xs font-medium text-muted uppercase tracking-wider hidden md:table-cell">Referrer</th>
              <th className="text-left py-3 px-3 text-xs font-medium text-muted uppercase tracking-wider hidden lg:table-cell">User Agent</th>
              <th className="text-left py-3 px-3 text-xs font-medium text-muted uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody>
            {visitors.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-20 text-muted">No visitors recorded</td>
              </tr>
            ) : (
              visitors.map((v) => (
                <tr key={v.id} className="border-b border-border/30 hover:bg-surface/50 transition-colors">
                  <td className="py-3 px-3 text-secondary font-mono text-xs">{v.ip}</td>
                  <td className="py-3 px-3 text-secondary text-xs max-w-[200px] truncate">{v.path}</td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                      v.method === 'GET' ? 'bg-emerald-50 text-emerald-600' :
                      v.method === 'POST' ? 'bg-blue-50 text-blue-600' :
                      v.method === 'DELETE' ? 'bg-red-50 text-red-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {v.method}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs text-muted hidden md:table-cell max-w-[150px] truncate">{v.referrer || '—'}</td>
                  <td className="py-3 px-3 text-xs text-muted hidden lg:table-cell max-w-[200px] truncate">{truncate(v.user_agent, 50)}</td>
                  <td className="py-3 px-3 text-xs text-muted whitespace-nowrap">{formatDate(v.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onChange={fetchVisitors} />
      )}
    </>
  );
}

/* ─── Pagination ─── */
function Pagination({ page, totalPages, onChange }) {
  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-muted hover:text-primary transition-colors disabled:opacity-30"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="text-sm text-secondary">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-muted hover:text-primary transition-colors disabled:opacity-30"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
