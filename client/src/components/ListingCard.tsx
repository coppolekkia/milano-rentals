import { MapPin, Chrome as Home, ImageOff } from "lucide-react";
import { useLocation } from "wouter";

interface Listing {
  title: string;
  link: string;
  price: string;
  image: string;
}

export default function ListingCard({ listing, index }: { listing: Listing; index: number }) {
  const [, setLocation] = useLocation();
  // Estrae l'indirizzo dal titolo (tutto prima dell'ultima virgola)
  const addressParts = listing.title.split(",");
  const address = addressParts.slice(0, -1).join(",").trim();
  const zone = addressParts[addressParts.length - 1].trim();

  // Estrae il numero dal prezzo
  const priceNumber = listing.price.replace(/[^0-9]/g, "");

  // Verifica se l'immagine è valida
  const hasValidImage = listing.image && listing.image.trim() !== "";

  const handleOpen = () => {
    setLocation(`/annuncio/${index}`);
  };

  return (
    <div
      className="group block h-full cursor-pointer"
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") handleOpen(); }}
    >
      <div className="h-full flex flex-col bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform">
        {/* Image Container */}
        <div className="relative w-full h-48 overflow-hidden bg-gray-200">
          {hasValidImage ? (
            <img
              src={listing.image}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  const placeholder = document.createElement("div");
                  placeholder.className =
                    "w-full h-full bg-gray-300 flex items-center justify-center";
                  placeholder.innerHTML =
                    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>';
                  parent.appendChild(placeholder);
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <ImageOff size={80} className="text-gray-400" />
            </div>
          )}
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
            onClick={handleOpen}
          >
            Visualizza Annuncio
          </Button>
        </div>
      </div>
    </div>
  );
}
