import { useState, useMemo } from "react";
import { Search, MapPin, X, Map as MapIcon, LayoutGrid } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import Map from "@/components/Map";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import listings from "@/data/listings.json";
import { getAllZones, getAllPropertyTypes, filterListings } from "@/lib/listingFilters";
import { useFavorites } from "@/hooks/useFavorites";

interface Listing {
  title: string;
  link: string;
  price: string;
  image: string;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState<"all" | "under700" | "700to800" | "over800">("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const zones = useMemo(() => getAllZones(), []);
  const propertyTypes = useMemo(() => getAllPropertyTypes(), []);

  // Filter listings based on search and filters
  const filteredListings = useMemo(() => {
    let result = filterListings(searchTerm, priceFilter, typeFilter, zoneFilter);
    
    if (showFavoritesOnly) {
      result = result.filter((listing) => {
        const originalIndex = (listings as Listing[]).indexOf(listing);
        return isFavorite(originalIndex);
      });
    }

    return result;
  }, [searchTerm, priceFilter, typeFilter, zoneFilter, showFavoritesOnly, favorites]);

  const resetFilters = () => {
    setSearchTerm("");
    setPriceFilter("all");
    setTypeFilter("all");
    setZoneFilter("all");
    setShowFavoritesOnly(false);
  };

  const hasActiveFilters = searchTerm || priceFilter !== "all" || typeFilter !== "all" || zoneFilter !== "all" || showFavoritesOnly;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
                <MapPin className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 leading-none">Milano Affitti</h1>
                <p className="text-gray-500 text-xs mt-1">Sotto i 900€</p>
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === "grid" ? "bg-white shadow-sm text-blue-700" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <LayoutGrid size={16} />
                <span className="hidden sm:inline">Griglia</span>
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === "map" ? "bg-white shadow-sm text-blue-700" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <MapIcon size={16} />
                <span className="hidden sm:inline">Mappa</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Trova la tua casa a Milano</h2>
          <p className="text-blue-100 mb-6 max-w-2xl">
            Esplora {listings.length} annunci di affitto selezionati, tutti con prezzo massimo di 900€ al mese
          </p>

          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Cerca per zona, indirizzo o prezzo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 text-base bg-white text-slate-900 border-0"
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 sticky top-20 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Prezzo</span>
                <div className="flex flex-wrap gap-2">
                  {(["all", "under700", "700to800", "over800"] as const).map((p) => (
                    <Button
                      key={p}
                      variant={priceFilter === p ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPriceFilter(p)}
                      className={priceFilter === p ? "bg-blue-700 hover:bg-blue-800" : "text-gray-600"}
                    >
                      {p === "all" ? "Tutti" : p === "under700" ? "Sotto 700€" : p === "700to800" ? "700-800€" : "Oltre 800€"}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex-1 min-w-[200px]">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Tipologia</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 bg-gray-50"
                >
                  <option value="all">Tutte le tipologie</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Zona</span>
                <select
                  value={zoneFilter}
                  onChange={(e) => setZoneFilter(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 bg-gray-50"
                >
                  <option value="all">Tutte le zone</option>
                  {zones.map((zone) => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-gray-100">
              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={showFavoritesOnly ? "bg-red-600 hover:bg-red-700" : "text-gray-600"}
              >
                ❤️ Preferiti ({favorites.length})
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={14} className="mr-1" />
                  Ripristina
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600 font-medium">
            <span className="text-blue-700 font-bold">{filteredListings.length}</span> annunci trovati
            {searchTerm && <span> per "<span className="italic">{searchTerm}</span>"</span>}
          </p>
        </div>

        {viewMode === "grid" ? (
          /* Grid View */
          filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing, index) => {
                const originalIndex = (listings as Listing[]).indexOf(listing);
                return (
                  <div key={originalIndex} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <ListingCard 
                      listing={listing} 
                      index={originalIndex}
                      isFavorite={isFavorite(originalIndex)}
                      onToggleFavorite={toggleFavorite}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-dashed border-gray-200">
              <p className="text-gray-400 text-lg mb-4">Nessun annuncio corrisponde ai tuoi filtri</p>
              <Button onClick={resetFilters} className="bg-blue-700">Ripristina filtri</Button>
            </div>
          )
        ) : (
          /* Map View */
          <div className="h-[600px] w-full animate-fade-in">
            <Map listings={filteredListings} className="h-full w-full rounded-2xl shadow-lg border border-gray-200" />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="text-blue-500" size={20} />
                <h3 className="font-bold text-xl">Milano Affitti</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Il portale immobiliare indipendente dedicato a chi cerca casa a Milano con un budget accessibile.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Navigazione</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={resetFilters} className="hover:text-blue-400 transition">Tutti gli annunci</button></li>
                <li><button onClick={() => setShowFavoritesOnly(true)} className="hover:text-blue-400 transition">I tuoi preferiti</button></li>
                <li><a href="https://www.immobiliare.it" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">Fonte dati</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Info</h4>
              <p className="text-gray-400 text-sm">
                I dati vengono aggiornati periodicamente da fonti pubbliche. Prezzi e disponibilità possono variare.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-xs">
            <p>&copy; 2026 Milano Affitti. Built with ❤️ for Milanese Renters.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
