import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link to="/" className="text-xl font-semibold tracking-tight text-primary">
              Estate<span className="text-accent">AI</span>
            </Link>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              Discover your perfect property with AI-powered insights and a seamless experience.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">Explore</h4>
            <div className="space-y-3">
              <Link to="/properties" className="block text-sm text-secondary hover:text-accent transition-colors">Properties</Link>
              <Link to="/properties?purpose=Sale" className="block text-sm text-secondary hover:text-accent transition-colors">Buy</Link>
              <Link to="/properties?purpose=Rent" className="block text-sm text-secondary hover:text-accent transition-colors">Rent</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">Company</h4>
            <div className="space-y-3">
              <span className="block text-sm text-secondary">About</span>
              <span className="block text-sm text-secondary">Careers</span>
              <span className="block text-sm text-secondary">Contact</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">Legal</h4>
            <div className="space-y-3">
              <span className="block text-sm text-secondary">Privacy</span>
              <span className="block text-sm text-secondary">Terms</span>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-border/50 text-center">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} EstateAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
