import { Link } from 'react-router-dom';
import { Building2, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-primary text-white overflow-hidden">
      {/* Subtle decorative blur */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top CTA Strip */}
        <div className="py-10 border-b border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">List your property on EstateAI</h3>
              <p className="mt-1.5 text-sm text-white/50">Reach thousands of buyers across Pakistan. Free to join.</p>
            </div>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/90 transition-colors flex-shrink-0 shadow-lg shadow-black/10"
            >
              Become an Agent <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Building2 size={15} className="text-white" strokeWidth={2.25} />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Estate<span className="text-accent-light">AI</span>
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Verified property listings across Pakistan. Search, message agents, and find your next home — all in one place.
            </p>
            <div className="flex items-center gap-2 mt-6 text-sm text-white/40">
              <MapPin size={13} />
              <span>Lahore, Pakistan</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-5">Browse</h4>
            <div className="space-y-3.5">
              <Link to="/properties" className="block text-sm text-white/60 hover:text-white transition-colors">All Properties</Link>
              <Link to="/properties?purpose=Sale" className="block text-sm text-white/60 hover:text-white transition-colors">For Sale</Link>
              <Link to="/properties?purpose=Rent" className="block text-sm text-white/60 hover:text-white transition-colors">For Rent</Link>
              <Link to="/properties?type=House" className="block text-sm text-white/60 hover:text-white transition-colors">Houses</Link>
              <Link to="/properties?type=Apartment" className="block text-sm text-white/60 hover:text-white transition-colors">Apartments</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-5">Cities</h4>
            <div className="space-y-3.5">
              <Link to="/properties?location=Lahore" className="block text-sm text-white/60 hover:text-white transition-colors">Lahore</Link>
              <Link to="/properties?location=Karachi" className="block text-sm text-white/60 hover:text-white transition-colors">Karachi</Link>
              <Link to="/properties?location=Islamabad" className="block text-sm text-white/60 hover:text-white transition-colors">Islamabad</Link>
              <Link to="/properties?location=Rawalpindi" className="block text-sm text-white/60 hover:text-white transition-colors">Rawalpindi</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-5">Get in touch</h4>
            <div className="space-y-3.5">
              <a href="mailto:hello@estateai.pk" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <Mail size={13} />
                hello@estateai.pk
              </a>
              <a href="tel:+923001234567" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <Phone size={13} />
                +92 300 123 4567
              </a>
              <Link to="/register" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <Building2 size={13} />
                List a property
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} EstateAI. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Made in Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}
