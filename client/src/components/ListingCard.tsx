import { MapPin, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Listing {
  title: string;
  link: string;
  price: string;
  image: string;
}

export default function ListingCard({ listing }: { listing: Listing }) {
  // Estrae l'indirizzo dal titolo (tutto prima dell'ultima virgola)
  const addressParts = listing.title.split(",");
  const address = addressParts.slice(0, -1).join(",").trim();
  const zone = addressParts[addressParts.length - 1].trim();

  // Estrae il numero dal prezzo
  const priceNumber = listing.price.replace(/[^0-9]/g, "");

  return (
    <a
      href={listing.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full"
    >
      <div className="h-full flex flex-col bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform">
        {/* Image Container */}
        <div className="relative w-full h-48 overflow-hidden bg-gray-200">
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%' y='50%' font-size='20' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3EImmagine non disponibile%3C/text%3E%3C/svg%3E";
            }}
          />
          {/* Price Badge */}
          <div className="absolute bottom-3 right-3 bg-green-600 text-white px-3 py-1 rounded-lg font-bold text-sm shadow-lg">
            €{priceNumber}/mese
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Title */}
          <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
            {address}
          </h3>

          {/* Zone */}
          <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
            <MapPin size={16} className="text-blue-600 flex-shrink-0" />
            <span className="truncate">{zone}</span>
          </div>

          {/* Type */}
          <div className="flex items-center gap-1 text-gray-500 text-xs mb-4">
            <Home size={14} className="text-gray-400" />
            <span>Affitto</span>
          </div>

          {/* Button */}
          <Button
            className="mt-auto w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold"
            onClick={(e) => {
              e.preventDefault();
              window.open(listing.link, "_blank");
            }}
          >
            Visualizza Annuncio
          </Button>
        </div>
      </div>
    </a>
  );
}
