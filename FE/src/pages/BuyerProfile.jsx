import { useState, useEffect } from 'react';
import { User, Camera, Mail, Phone, Shield } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function BuyerProfile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/profile', profile);
      updateUser(res.data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await api.put('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(res.data.user);
      toast.success('Avatar updated');
    } catch {
      toast.error('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-3xl font-semibold text-primary tracking-tight mb-2">My Profile</h1>
        <p className="text-sm text-muted mb-10">Manage your account details.</p>

        {/* Profile Card */}
        <div className="bg-surface rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={36} className="text-muted" />
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg">
                <Camera size={15} />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-primary">{user?.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Shield size={12} className="text-accent" />
                <span className="text-sm text-muted">{user?.role}</span>
              </div>
              {uploadingAvatar && <p className="text-xs text-accent mt-2">Uploading avatar...</p>}
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-surface rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <Mail size={16} className="text-muted" />
              </div>
              <div>
                <p className="text-xs text-muted">Email</p>
                <p className="text-sm font-medium text-primary">{user?.email}</p>
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <Phone size={16} className="text-muted" />
              </div>
              <div>
                <p className="text-xs text-muted">Phone</p>
                <p className="text-sm font-medium text-primary">{user?.phone || 'Not set'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-5">Edit Details</h3>
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
                className="w-full px-4 py-3 bg-surface rounded-xl text-sm border border-border/50 focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                required
                className="w-full px-4 py-3 bg-surface rounded-xl text-sm border border-border/50 focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-2">Phone</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-3 bg-surface rounded-xl text-sm border border-border/50 focus:border-accent transition-colors"
                placeholder="+92 300 1234567"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
