import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import PropertyCard from '../components/PropertyCard';
import Spinner from '../components/Spinner';

export default function SavedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSaved = async (p = page) => {
    setLoading(true);
    try {
      const res = await api.get('/favorites', { params: { page: p, limit: 12 } });
      setProperties(res.data.properties);
      setTotalPages(res.data.totalPages);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved(page);
  }, [page]);

  const handleToggleFavorite = async (propertyId) => {
    try {
      await api.post(`/favorites/${propertyId}`);
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      toast.success('Property removed from saved');
    } catch {
      toast.error('Failed to remove property');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-primary tracking-tight">Saved Properties</h1>
          <p className="mt-2 text-muted">Properties you've saved for later</p>
        </div>

        {loading ? (
          <Spinner className="py-32" />
        ) : properties.length === 0 ? (
          <div className="text-center py-32">
            <Heart size={48} className="mx-auto text-muted mb-4" />
            <p className="text-xl font-medium text-primary">No saved properties yet</p>
            <p className="mt-2 text-sm text-muted">Browse properties and click the heart icon to save them.</p>
            <Link
              to="/properties"
              className="inline-block mt-6 bg-primary text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  isFavorited={true}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-secondary disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pg;
                  if (totalPages <= 5) {
                    pg = i + 1;
                  } else if (page <= 3) {
                    pg = i + 1;
                  } else if (page >= totalPages - 2) {
                    pg = totalPages - 4 + i;
                  } else {
                    pg = page - 2 + i;
                  }
                  return (
                    <button
                      key={pg}
                      onClick={() => setPage(pg)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                        page === pg
                          ? 'bg-primary text-white'
                          : 'bg-surface text-secondary hover:bg-border/50'
                      }`}
                    >
                      {pg}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-secondary disabled:opacity-30"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
