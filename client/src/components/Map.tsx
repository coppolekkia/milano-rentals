import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { getListingCoordinates, getZone } from "@/lib/listingFilters";

// Fix per le icone di Leaflet in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Listing {
  title: string;
  link: string;
  price: string;
  image: string;
}

interface MapProps {
  listings: Listing[];
  onMarkerClick?: (index: number) => void;
  className?: string;
}

// Componente per centrare la mappa quando cambiano i risultati
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
  return null;
}

export default function Map({ listings, onMarkerClick, className }: MapProps) {
  const milanoCenter: [number, number] = [45.4642, 9.1900];

  return (
    <div className={className || "h-[400px] w-full rounded-xl overflow-hidden shadow-md border border-gray-200"}>
      <MapContainer
        center={milanoCenter}
        zoom={12}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <ChangeView center={milanoCenter} />

        {listings.map((listing) => {
          const coords = getListingCoordinates(listing.title);
          // In una versione reale useremmo un ID univoco, qui usiamo il titolo per semplicità nel marker
          return (
            <Marker 
              key={`${listing.title}-${listing.link}`} 
              position={coords}
            >
              <Popup>
                <div className="p-1 max-w-[200px]">
                  {listing.image && (
                    <img 
                      src={listing.image} 
                      alt={listing.title} 
                      className="w-full h-24 object-cover rounded mb-2" 
                    />
                  )}
                  <h4 className="font-bold text-sm mb-1 line-clamp-2">{listing.title.split(",")[0]}</h4>
                  <p className="text-blue-700 font-bold text-sm">{listing.price}</p>
                  <p className="text-gray-500 text-xs mt-1">{getZone(listing.title)}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
