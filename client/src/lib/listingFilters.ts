import listings from "@/data/listings.json";

interface Listing {
  title: string;
  link: string;
  price: string;
  image: string;
}

// Coordinate approssimative per le principali zone di Milano
export const ZONE_COORDINATES: Record<string, [number, number]> = {
  "Vigentino - Fatima": [45.4312, 9.2015],
  "Dergano": [45.5034, 9.1764],
  "Martini - Insubria": [45.4542, 9.2215],
  "Udine": [45.4912, 9.2374],
  "Piazzale Siena": [45.4658, 9.1384],
  "Niguarda": [45.5184, 9.1915],
  "Sempione": [45.4794, 9.1684],
  "Barona": [45.4412, 9.1515],
  "Turro": [45.4984, 9.2215],
  "Morgagni": [45.4784, 9.2115],
  "Cimiano": [45.5012, 9.2384],
  "Istria": [45.4984, 9.1915],
  "Crescenzago": [45.5084, 9.2484],
  "Città Studi": [45.4784, 9.2284],
  "Bovisa": [45.5012, 9.1615],
  "Ponte Nuovo": [45.5084, 9.2284],
  "Giambellino": [45.4484, 9.1384],
  "Rovereto": [45.4912, 9.2184],
  "Ripamonti - Fondazione Prada": [45.4412, 9.2015],
  "Casoretto": [45.4884, 9.2215],
  "Gorla": [45.5034, 9.2184],
  "Washington": [45.4612, 9.1584],
  "Cermenate - Abbiategrasso": [45.4312, 9.1784],
  "Bruzzano": [45.5284, 9.1715],
  "Ticinese": [45.4512, 9.1815],
  "Dezza": [45.4584, 9.1684],
  "Piazza Napoli": [45.4512, 9.1484],
  "Vercelli - Wagner": [45.4684, 9.1584],
  "Farini": [45.4884, 9.1815],
  "Primaticcio": [45.4584, 9.1284],
  "Gambara": [45.4612, 9.1415],
  "Corso San Gottardo": [45.4512, 9.1784],
  "Famagosta": [45.4384, 9.1684],
  "Tripoli - Soderini": [45.4584, 9.1484],
  "Affori": [45.5184, 9.1715],
  "Moscova": [45.4784, 9.1884],
};

/**
 * Estrae la tipologia di immobile dal titolo
 */
export function getPropertyType(title: string): string {
  const types = ["Monolocale", "Bilocale", "Trilocale", "Appartamento", "Mansarda"];
  for (const type of types) {
    if (title.includes(type)) {
      return type;
    }
  }
  return "Appartamento";
}

/**
 * Estrae la zona dal titolo
 */
export function getZone(title: string): string {
  const parts = title.split(",");
  if (parts.length >= 2) {
    return parts[parts.length - 2].trim();
  }
  return "Milano";
}

/**
 * Ottiene le coordinate per un annuncio basandosi sulla sua zona
 */
export function getListingCoordinates(title: string): [number, number] {
  const zone = getZone(title);
  return ZONE_COORDINATES[zone] || [45.4642, 9.1900]; // Default centro Milano
}

/**
 * Ottiene tutte le zone uniche dal dataset
 */
export function getAllZones(): string[] {
  const zones = new Set<string>();
  (listings as Listing[]).forEach((listing) => {
    zones.add(getZone(listing.title));
  });
  return Array.from(zones).sort();
}

/**
 * Ottiene tutti i tipi di immobile unici dal dataset
 */
export function getAllPropertyTypes(): string[] {
  const types = new Set<string>();
  (listings as Listing[]).forEach((listing) => {
    types.add(getPropertyType(listing.title));
  });
  return Array.from(types).sort();
}

/**
 * Filtra gli annunci in base ai criteri forniti
 */
export function filterListings(
  searchTerm: string = "",
  priceFilter: "all" | "under700" | "700to800" | "over800" = "all",
  typeFilter: string = "all",
  zoneFilter: string = "all"
): Listing[] {
  return (listings as Listing[]).filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.price.toLowerCase().includes(searchTerm.toLowerCase());

    const priceNum = parseInt(listing.price.replace(/[^0-9]/g, ""));
    let matchesPrice = true;
    if (priceFilter === "under700") matchesPrice = priceNum < 700;
    else if (priceFilter === "700to800") matchesPrice = priceNum >= 700 && priceNum <= 800;
    else if (priceFilter === "over800") matchesPrice = priceNum > 800;

    let matchesType = true;
    if (typeFilter !== "all") {
      matchesType = getPropertyType(listing.title) === typeFilter;
    }

    let matchesZone = true;
    if (zoneFilter !== "all") {
      matchesZone = getZone(listing.title) === zoneFilter;
    }

    return matchesSearch && matchesPrice && matchesType && matchesZone;
  });
}
