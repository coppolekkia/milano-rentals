import { useState, useMemo } from "react";
import { Search, MapPin, X } from "lucide-react";
import ListingCard from "@/components/ListingCard";
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

  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const zones = useMemo(() => getAllZones(), []);
  const propertyTypes = useMemo(() => getAllPropertyTypes(), []);

  // Filter listings based on search and filters
  const filteredListings = useMemo(() => {
    let result = filterListings(searchTerm, priceFilter, typeFilter, zoneFilter);
    
    // Filtra per preferiti se richiesto
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
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
              <MapPin className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Milano Affitti</h1>
          </div>
          <p className="text-gray-600 text-sm">Scopri le migliori opportunità di affitto a Milano sotto i 900€</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Trova la tua casa a Milano</h2>
          <p className="text-blue-100 mb-6 max-w-2xl">
            Esplora {listings.length} annunci di affitto selezionati, tutti con prezzo massimo di 900€ al mese
          </p>

          {/* Search Bar */}
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
      <section className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="space-y-4">
            {/* Price Filters */}
            <div>
              <span className="text-sm font-semibold text-gray-700 block mb-2">Filtra per prezzo:</span>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={priceFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriceFilter("all")}
                  className={priceFilter === "all" ? "bg-blue-700 hover:bg-blue-800" : ""}
                >
                  Tutti
                </Button>
                <Button
                  variant={priceFilter === "under700" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriceFilter("under700")}
                  className={priceFilter === "under700" ? "bg-blue-700 hover:bg-blue-800" : ""}
                >
                  Sotto 700€
                </Button>
                <Button
                  variant={priceFilter === "700to800" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriceFilter("700to800")}
                  className={priceFilter === "700to800" ? "bg-blue-700 hover:bg-blue-800" : ""}
                >
                  700-800€
                </Button>
                <Button
                  variant={priceFilter === "over800" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriceFilter("over800")}
                  className={priceFilter === "over800" ? "bg-blue-700 hover:bg-blue-800" : ""}
                >
                  Oltre 800€
                </Button>
              </div>
            </div>

            {/* Type and Zone Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type Filter */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Tipo di immobile:</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
                >
                  <option value="all">Tutti i tipi</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Zone Filter */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Zona:</label>
                <select
                  value={zoneFilter}
                  onChange={(e) => setZoneFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
                >
                  <option value="all">Tutte le zone</option>
                  {zones.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Favorites and Reset */}
            <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-gray-200">
              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={showFavoritesOnly ? "bg-red-600 hover:bg-red-700" : ""}
              >
                ❤️ Preferiti ({favorites.length})
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <X size={16} className="mr-1" />
                  Ripristina filtri
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600 font-semibold">
            {filteredListings.length} annunci trovati
            {searchTerm && ` per "${searchTerm}"`}
            {showFavoritesOnly && " nei tuoi preferiti"}
          </p>
        </div>

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing, index) => {
              // Recupera l'indice originale nel dataset completo
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
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">
              {showFavoritesOnly && favorites.length === 0
                ? "Non hai ancora aggiunto annunci ai preferiti"
                : "Nessun annuncio trovato"}
            </p>
            <Button
              onClick={resetFilters}
              className="bg-blue-700 hover:bg-blue-800"
            >
              Ripristina filtri
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-3">Milano Affitti</h3>
              <p className="text-gray-400 text-sm">
                Il portale immobiliare che rende la ricerca di casa a Milano semplice e affidabile.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Link Utili</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="https://www.immobiliare.it" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                    Immobiliare.it
                  </a>
                </li>
                <li>
                  <a href="https://www.immobiliare.it/affitto-case/milano/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                    Tutti gli annunci Milano
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Informazioni</h4>
              <p className="text-gray-400 text-sm">
                Annunci aggiornati da Immobiliare.it
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 Milano Affitti. Tutti i dati sono forniti da Immobiliare.it</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
