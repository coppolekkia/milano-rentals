import listings from "@/data/listings.json";

interface Listing {
  title: string;
  link: string;
  price: string;
  image: string;
}

/**
 * Estrae la tipologia di immobile dal titolo
 * Es: "Monolocale via..." -> "Monolocale"
 */
export function getPropertyType(title: string): string {
  const types = ["Monolocale", "Bilocale", "Trilocale", "Appartamento", "Mansarda"];
  for (const type of types) {
    if (title.includes(type)) {
      return type;
    }
  }
  return "Appartamento"; // default
}

/**
 * Estrae la zona dal titolo (ultima parte dopo l'ultima virgola)
 * Es: "Monolocale via..., Vigentino - Fatima, Milano" -> "Vigentino - Fatima"
 */
export function getZone(title: string): string {
  const parts = title.split(",");
  if (parts.length >= 2) {
    // Prendi la penultima parte (la zona, prima di "Milano")
    return parts[parts.length - 2].trim();
  }
  return "Milano";
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
    // Filtro ricerca
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.price.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro prezzo
    const priceNum = parseInt(listing.price.replace(/[^0-9]/g, ""));
    let matchesPrice = true;
    if (priceFilter === "under700") matchesPrice = priceNum < 700;
    else if (priceFilter === "700to800") matchesPrice = priceNum >= 700 && priceNum <= 800;
    else if (priceFilter === "over800") matchesPrice = priceNum > 800;

    // Filtro tipologia
    let matchesType = true;
    if (typeFilter !== "all") {
      matchesType = getPropertyType(listing.title) === typeFilter;
    }

    // Filtro zona
    let matchesZone = true;
    if (zoneFilter !== "all") {
      matchesZone = getZone(listing.title) === zoneFilter;
    }

    return matchesSearch && matchesPrice && matchesType && matchesZone;
  });
}
