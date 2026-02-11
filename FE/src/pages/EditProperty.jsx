import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, ImagePlus, ArrowLeft, Trash2 } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const TYPES = ['House', 'Apartment', 'Villa', 'Commercial', 'Land'];
const PURPOSES = ['Sale', 'Rent'];

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: 'House',
    purpose: 'Sale',
    price: '',
    location: '',
    bedrooms: '',
    area: '',
    description: '',
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/properties/${id}`),
      api.get(`/properties/${id}/images`),
    ])
      .then(([propRes, imgRes]) => {
        const p = propRes.data.property;
        setForm({
          type: p.type,
          purpose: p.purpose,
          price: p.price?.toString() || '',
          location: p.location || '',
          bedrooms: p.bedrooms?.toString() || '',
          area: p.area?.toString() || '',
          description: p.description || '',
        });
        setExistingImages(imgRes.data.images || []);
      })
      .catch(() => {
        toast.error('Property not found');
        navigate('/dashboard');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files || []);
    const total = existingImages.length + newImages.length + files.length;
    if (total > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }
    const imgs = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewImages((prev) => [...prev, ...imgs]);
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = async (imageId) => {
    try {
      await api.delete(`/properties/${id}/images/${imageId}`);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success('Image removed');
    } catch {
      toast.error('Failed to remove image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/properties/${id}`, {
        ...form,
        price: parseFloat(form.price),
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
        area: parseFloat(form.area),
      });

      if (newImages.length > 0) {
        const formData = new FormData();
        newImages.forEach((img) => formData.append('images', img.file));
        await api.post(`/properties/${id}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      toast.success('Property updated!');
      navigate(`/properties/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner className="min-h-screen pt-24" />;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="text-3xl font-semibold text-primary tracking-tight mb-2">Edit Property</h1>
        <p className="text-sm text-muted mb-10">Update your listing details.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Images */}
          <div>
            <label className="block text-xs font-medium text-secondary mb-3">Photos</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {existingImages.map((img) => (
                <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden bg-surface">
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80"
                  >
                    <X size={12} />
                  </button>
                  {img.is_primary && (
                    <span className="absolute bottom-1.5 left-1.5 text-[10px] font-medium bg-white/90 px-2 py-0.5 rounded-full">
                      Cover
                    </span>
                  )}
                </div>
              ))}
              {newImages.map((img, i) => (
                <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden bg-surface">
                  <img src={img.preview} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80"
                  >
                    <X size={12} />
                  </button>
                  <span className="absolute bottom-1.5 left-1.5 text-[10px] font-medium bg-accent/90 text-white px-2 py-0.5 rounded-full">
                    New
                  </span>
                </div>
              ))}
              {existingImages.length + newImages.length < 10 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors">
                  <ImagePlus size={20} className="text-muted" />
                  <span className="text-[10px] text-muted mt-1">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleNewImages}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Type & Purpose */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Property Type</label>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => update('type', type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      form.type === type
                        ? 'bg-primary text-white'
                        : 'bg-surface text-secondary border border-border/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Purpose</label>
              <div className="flex gap-2">
                {PURPOSES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => update('purpose', p)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      form.purpose === p
                        ? 'bg-primary text-white'
                        : 'bg-surface text-secondary border border-border/50'
                    }`}
                  >
                    For {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Price & Area */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Price (PKR)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
                required
                className="w-full px-4 py-3 bg-surface rounded-xl text-sm border border-border/50 focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Area (sq ft)</label>
              <input
                type="number"
                value={form.area}
                onChange={(e) => update('area', e.target.value)}
                required
                className="w-full px-4 py-3 bg-surface rounded-xl text-sm border border-border/50 focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Location & Bedrooms */}
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-secondary mb-2">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                required
                className="w-full px-4 py-3 bg-surface rounded-xl text-sm border border-border/50 focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Bedrooms</label>
              <input
                type="number"
                value={form.bedrooms}
                onChange={(e) => update('bedrooms', e.target.value)}
                className="w-full px-4 py-3 bg-surface rounded-xl text-sm border border-border/50 focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-secondary mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              required
              rows={5}
              className="w-full px-4 py-3 bg-surface rounded-xl text-sm border border-border/50 focus:border-accent transition-colors resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm text-muted hover:text-secondary transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
