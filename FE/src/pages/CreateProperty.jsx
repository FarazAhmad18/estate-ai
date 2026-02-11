import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, ImagePlus, ArrowLeft } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

const TYPES = ['House', 'Apartment', 'Villa', 'Commercial', 'Land'];
const PURPOSES = ['Sale', 'Rent'];

export default function CreateProperty() {
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
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.price || !form.location || !form.area || !form.description) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/properties', {
        ...form,
        price: parseFloat(form.price),
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
        area: parseFloat(form.area),
      });

      const propertyId = res.data.property.id;

      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((img) => formData.append('images', img.file));
        await api.post(`/properties/${propertyId}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      toast.success('Property created!');
      navigate(`/properties/${propertyId}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="text-3xl font-semibold text-primary tracking-tight mb-2">Create Listing</h1>
        <p className="text-sm text-muted mb-10">Add a new property to your portfolio.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Images */}
          <div>
            <label className="block text-xs font-medium text-secondary mb-3">Photos</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-surface">
                  <img src={img.preview} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80"
                  >
                    <X size={12} />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 text-[10px] font-medium bg-white/90 px-2 py-0.5 rounded-full">
                      Cover
                    </span>
                  )}
                </div>
              ))}
              {images.length < 10 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors">
                  <ImagePlus size={20} className="text-muted" />
                  <span className="text-[10px] text-muted mt-1">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageAdd}
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
              <label className="block text-xs font-medium text-secondary mb-2">
                Price (PKR) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
                required
                className="w-full px-4 py-3 bg-surface rounded-xl text-sm border border-border/50 focus:border-accent transition-colors"
                placeholder="e.g. 15000000"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">
                Area (sq ft) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                value={form.area}
                onChange={(e) => update('area', e.target.value)}
                required
                className="w-full px-4 py-3 bg-surface rounded-xl text-sm border border-border/50 focus:border-accent transition-colors"
                placeholder="e.g. 2500"
              />
            </div>
          </div>

          {/* Location & Bedrooms */}
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-secondary mb-2">
                Location <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                required
                className="w-full px-4 py-3 bg-surface rounded-xl text-sm border border-border/50 focus:border-accent transition-colors"
                placeholder="e.g. DHA Phase 5, Lahore"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Bedrooms</label>
              <input
                type="number"
                value={form.bedrooms}
                onChange={(e) => update('bedrooms', e.target.value)}
                className="w-full px-4 py-3 bg-surface rounded-xl text-sm border border-border/50 focus:border-accent transition-colors"
                placeholder="e.g. 4"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-secondary mb-2">
              Description <span className="text-danger">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              required
              rows={5}
              className="w-full px-4 py-3 bg-surface rounded-xl text-sm border border-border/50 focus:border-accent transition-colors resize-none"
              placeholder="Describe the property in detail..."
            />
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Listing'}
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
