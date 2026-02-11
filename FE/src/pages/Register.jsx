import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import heroExterior from '../assets/hero-exterior.png';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Buyer' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await register(form.name, form.email, form.password, form.role);
      toast.success('Account created!');
      navigate(data.user.role === 'Agent' ? '/dashboard' : '/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src={heroExterior} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-12 left-12 right-12">
          <h2 className="text-3xl font-semibold text-white tracking-tight leading-tight">
            Start your journey<br />with EstateAI.
          </h2>
          <p className="mt-3 text-white/60 text-sm max-w-sm">
            Create an account to browse listings, save favorites, or list your own properties.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm">
          <div className="mb-6">
            <Link to="/" className="text-xl font-semibold tracking-tight text-primary mb-5 block">
              Estate<span className="text-accent">AI</span>
            </Link>
            <h1 className="text-3xl font-semibold text-primary tracking-tight">Create account</h1>
            <p className="mt-1.5 text-sm text-muted">Join EstateAI today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-surface rounded-xl text-sm border border-border/50 focus:border-accent transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-secondary mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-surface rounded-xl text-sm border border-border/50 focus:border-accent transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-secondary mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 bg-surface rounded-xl text-sm border border-border/50 focus:border-accent transition-colors pr-10"
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-secondary mb-1.5">I am a</label>
              <div className="grid grid-cols-2 gap-2">
                {['Buyer', 'Agent'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => update('role', role)}
                    className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                      form.role === role
                        ? 'bg-primary text-white border-primary'
                        : 'bg-surface text-secondary border-border/50 hover:border-accent'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
