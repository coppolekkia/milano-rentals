import { useState, useMemo } from "react";
import { Search, MapPin } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import listings from "@/data/listings.json";

interface Listing {
  title: string;
  link: string;
  price: string;
  image: string;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState<"all" | "under700" | "700to800" | "over800">("all");

  // Filter listings based on search and price, preserving original index
  const filteredListings = useMemo(() => {
    return (listings as Listing[])
      .map((listing, originalIndex) => ({ listing, originalIndex }))
      .filter(({ listing }) => {
        const matchesSearch =
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.price.toLowerCase().includes(searchTerm.toLowerCase());

        const priceNum = parseInt(listing.price.replace(/[^0-9]/g, ""));
        let matchesPrice = true;

        if (priceFilter === "under700") matchesPrice = priceNum < 700;
        else if (priceFilter === "700to800") matchesPrice = priceNum >= 700 && priceNum <= 800;
        else if (priceFilter === "over800") matchesPrice = priceNum > 800;

        return matchesSearch && matchesPrice;
      });
  }, [searchTerm, priceFilter]);

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
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-semibold text-gray-700">Filtra per prezzo:</span>
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
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600 font-semibold">
            {filteredListings.length} annunci trovati
            {searchTerm && ` per "${searchTerm}"`}
          </p>
        </div>

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map(({ listing, originalIndex }, index) => (
              <div key={originalIndex} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <ListingCard listing={listing} index={originalIndex} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">Nessun annuncio trovato</p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setPriceFilter("all");
              }}
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
