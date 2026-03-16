import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface EventLocation {
  id: number;
  name: string;
  date: string;
  location: string;
  coordinates: [number, number];
  link: string;
}

interface TaiwanMapProps {
  events: EventLocation[];
}

export function TaiwanMap({ events }: TaiwanMapProps) {
  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-lg relative z-0">
      <MapContainer 
        center={[23.7, 120.9]} 
        zoom={7} 
        scrollWheelZoom={false}
        className="h-full w-full bg-slate-900"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {events.map((event) => (
          <Marker key={event.id} position={event.coordinates}>
            <Popup className="custom-popup">
              <div className="p-1">
                <h4 className="font-bold text-slate-900 mb-1">{event.name}</h4>
                <p className="text-sm text-slate-600 mb-1">{event.date}</p>
                <p className="text-sm text-slate-600 mb-2">{event.location}</p>
                <a 
                  href={event.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  查看詳情 &rarr;
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
