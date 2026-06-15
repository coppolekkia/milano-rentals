import { useParams, useLocation } from "wouter";
import { ArrowLeft, MapPin, ExternalLink, Home, CheckCircle2, Info, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import listings from "@/data/listings.json";
import { getPropertyType, getZone } from "@/lib/listingFilters";
import { useFavorites } from "@/hooks/useFavorites";

interface Listing {
  title: string;
  link: string;
  price: string;
  image: string;
}

export default function ListingDetail() {
  const params = useParams<{ index: string }>();
  const [, setLocation] = useLocation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<"info" | "original">("info");

  const index = parseInt(params.index ?? "0", 10);
  const listing = (listings as Listing[])[index];

  const details = useMemo(() => {
    if (!listing) return null;
    const addressParts = listing.title.split(",");
    return {
      address: addressParts.slice(0, -1).join(",").trim(),
      zone: getZone(listing.title),
      price: listing.price,
      priceNumber: listing.price.replace(/[^0-9]/g, ""),
      type: getPropertyType(listing.title),
      id: listing.link.split("/").filter(Boolean).pop()
    };
  }, [listing]);

  if (!listing || !details) {
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

  const isFav = isFavorite(index);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header Nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-700"
          >
            <ArrowLeft size={18} />
            <span>Torna alla ricerca</span>
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => toggleFavorite(index)}>
              <Heart size={18} className={isFav ? "fill-red-500 text-red-500" : "text-gray-400"} />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Share2 size={18} className="text-gray-400" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Tab Selector */}
        <div className="flex bg-gray-200 p-1 rounded-xl w-fit mb-8 mx-auto">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "info" ? "bg-white shadow-sm text-blue-700" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Scheda Annuncio
          </button>
          <button
            onClick={() => setActiveTab("original")}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "original" ? "bg-white shadow-sm text-blue-700" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sito Originale
          </button>
        </div>

        {activeTab === "info" ? (
          /* Rich Info View */
          <div className="max-w-5xl mx-auto animate-fade-in">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image Section */}
                <div className="relative h-[400px] lg:h-auto bg-gray-100">
                  {listing.image ? (
                    <img
                      src={listing.image.replace("xxs-c.jpg", "l.jpg")} // Tentativo di caricare immagine più grande
                      alt={listing.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = listing.image; // Fallback alla miniatura
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Home size={80} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-blue-700 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                    {details.type}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 lg:p-12 flex flex-col">
                  <div className="mb-6">
                    <h1 className="text-3xl font-black text-slate-900 mb-4 leading-tight">
                      {details.address}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-500 mb-6">
                      <MapPin size={20} className="text-blue-600" />
                      <span className="text-lg font-medium">{details.zone}, Milano</span>
                    </div>
                    <div className="inline-block bg-green-50 text-green-700 px-6 py-3 rounded-2xl border border-green-100">
                      <span className="text-4xl font-black">€{details.priceNumber}</span>
                      <span className="text-lg font-bold ml-1">/mese</span>
                    </div>
                  </div>

                  <div className="space-y-6 mb-10">
                    <div className="flex items-center gap-3 text-slate-700">
                      <CheckCircle2 className="text-green-500" size={20} />
                      <span className="font-medium">Prezzo verificato sotto i 900€</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <CheckCircle2 className="text-green-500" size={20} />
                      <span className="font-medium">Zona residenziale servita</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <Info className="text-blue-500" size={20} />
                      <span className="font-medium">ID Annuncio: {details.id}</span>
                    </div>
                  </div>

                  <div className="mt-auto space-y-4">
                    <a
                      href={listing.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-6 text-lg rounded-2xl shadow-lg shadow-blue-200 transition-all hover:scale-[1.02]">
                        <ExternalLink size={20} className="mr-2" />
                        Contatta su Immobiliare.it
                      </Button>
                    </a>
                    <p className="text-center text-gray-400 text-xs">
                      Verrai reindirizzato al portale originale per completare la richiesta.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-2">Posizione</h4>
                <p className="text-sm text-gray-500">Situato nel quartiere {details.zone}, una delle zone più ricercate di Milano.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-2">Tipologia</h4>
                <p className="text-sm text-gray-500">Questo {details.type.toLowerCase()} offre spazi ottimizzati per vivere al meglio la città.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-2">Budget</h4>
                <p className="text-sm text-gray-500">Con un canone di {details.price}, rientra perfettamente nella nostra selezione premium under 900€.</p>
              </div>
            </div>
          </div>
        ) : (
          /* Original Site View (Iframe with fallback message) */
          <div className="max-w-6xl mx-auto h-[70vh] animate-fade-in flex flex-col">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-4 flex items-center gap-3 text-amber-800 shadow-sm">
              <Info size={20} className="flex-shrink-0" />
              <p className="text-sm font-medium">
                Nota: Se non vedi l'anteprima qui sotto, è perché Immobiliare.it blocca la visualizzazione esterna. 
                In quel caso, usa il pulsante blu per aprire l'annuncio originale.
              </p>
              <a href={listing.link} target="_blank" rel="noopener noreferrer" className="ml-auto">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 whitespace-nowrap">Apri Esternamente</Button>
              </a>
            </div>
            <div className="flex-1 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 relative">
              <iframe
                src={listing.link}
                className="w-full h-full border-0"
                title={listing.title}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
