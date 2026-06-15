import { useParams, useLocation } from "wouter";
import { ArrowLeft, MapPin, Chrome as Home, ExternalLink, Loader as Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import listings from "@/data/listings.json";

interface Listing {
  title: string;
  link: string;
  price: string;
  image: string;
}

export default function ListingDetail() {
  const params = useParams<{ index: string }>();
  const [, setLocation] = useLocation();
  const [iframeLoading, setIframeLoading] = useState(true);

  const index = parseInt(params.index, 10);
  const listing = (listings as Listing[])[index];

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Annuncio non trovato</p>
          <Button onClick={() => setLocation("/")} className="bg-blue-700 hover:bg-blue-800">
            <ArrowLeft size={16} className="mr-2" />
            Torna alla lista
          </Button>
        </div>
      </div>
    );
  }

  const addressParts = listing.title.split(",");
  const address = addressParts.slice(0, -1).join(",").trim();
  const zone = addressParts[addressParts.length - 1].trim();
  const priceNumber = listing.price.replace(/[^0-9]/g, "");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-slate-700 hover:text-blue-700"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Torna alla lista</span>
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-slate-900 truncate">{address}</h1>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin size={12} className="text-blue-600 flex-shrink-0" />
              <span className="truncate">{zone}, Milano</span>
              <span className="text-green-700 font-bold">€{priceNumber}/mese</span>
            </div>
          </div>
          <a
            href={listing.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm" variant="outline" className="flex items-center gap-1.5 text-blue-700 border-blue-200 hover:bg-blue-50">
              <ExternalLink size={14} />
              <span className="hidden sm:inline">Apri su Immobiliare.it</span>
            </Button>
          </a>
        </div>
      </header>

      {/* Iframe content */}
      <div className="flex-1 relative">
        {iframeLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-blue-700" size={32} />
              <p className="text-gray-500 text-sm">Caricamento annuncio...</p>
            </div>
          </div>
        )}
        <iframe
          src={listing.link}
          className="w-full h-full border-0"
          style={{ minHeight: "calc(100vh - 56px)" }}
          title={listing.title}
          onLoad={() => setIframeLoading(false)}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
}
