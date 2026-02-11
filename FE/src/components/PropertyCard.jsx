import { Link } from 'react-router-dom';
import { MapPin, BedDouble, Maximize, ArrowUpRight, Heart } from 'lucide-react';

export default function PropertyCard({ property, isFavorited, onToggleFavorite }) {
  const formatPrice = (price) => {
    if (price >= 10000000) return `${(price / 10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `${(price / 100000).toFixed(1)} Lac`;
    return price.toLocaleString();
  };

  return (
    <Link
      to={`/properties/${property.id}`}
      className="group block bg-white rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg hover:shadow-black/5 transition-all duration-300"
    >
      <div className="aspect-[4/3] bg-surface overflow-hidden relative">
        {property.PropertyImages?.[0]?.image_url ? (
          <img
            src={property.PropertyImages[0].image_url}
            alt={property.location}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">
            <Maximize size={32} />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="text-[11px] font-medium bg-white/90 backdrop-blur-sm text-secondary px-3 py-1 rounded-full">
            {property.type}
          </span>
          <span className={`text-[11px] font-medium px-3 py-1 rounded-full backdrop-blur-sm ${
            property.purpose === 'Sale'
              ? 'bg-accent/10 text-accent'
              : 'bg-success/10 text-success'
          }`}>
            For {property.purpose}
          </span>
        </div>
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(property.id);
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
          >
            <Heart
              size={16}
              className={isFavorited ? 'fill-red-500 text-red-500' : 'text-secondary'}
            />
          </button>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-lg font-semibold text-primary">
              PKR {formatPrice(property.price)}
              {property.purpose === 'Rent' && <span className="text-sm font-normal text-muted">/mo</span>}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5 text-muted">
              <MapPin size={13} />
              <span className="text-sm">{property.location}</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
            <ArrowUpRight size={14} />
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50">
          {property.bedrooms && (
            <div className="flex items-center gap-1.5 text-sm text-muted">
              <BedDouble size={14} />
              <span>{property.bedrooms} Beds</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-sm text-muted">
            <Maximize size={14} />
            <span>{property.area?.toLocaleString()} sq ft</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
