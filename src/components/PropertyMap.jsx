import React, { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Fix for default marker icon in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to update map view when markers change
const MapUpdater = ({ markers }) => {
    const map = useMap();

    useEffect(() => {
        if (markers.length > 0) {
            const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [markers, map]);

    return null;
};

const PropertyMap = ({ properties }) => {
    const markers = useMemo(() => {
        return properties.map(property => {
            if (!property.mapUrl) return null;

            let lat = null;
            let lng = null;
            const url = property.mapUrl;

            // Try to extract coordinates from !3d and !4d (Standard Google Maps URL)
            const latMatch = url.match(/!3d([\d.]+)/);
            const lngMatch = url.match(/!4d([\d.]+)/);

            if (latMatch && lngMatch) {
                lat = parseFloat(latMatch[1]);
                lng = parseFloat(lngMatch[1]);
            } else {
                // Fallback: Try to extract from @lat,lng
                const atMatch = url.match(/@([\d.]+),([\d.]+)/);
                if (atMatch) {
                    lat = parseFloat(atMatch[1]);
                    lng = parseFloat(atMatch[2]);
                }
            }

            if (lat && lng) {
                return { ...property, lat, lng };
            }
            return null;
        }).filter(Boolean);
    }, [properties]);

    if (markers.length === 0) {
        return null;
    }

    // Calculate center (average of all points) or default to Bangkok
    const center = markers.length > 0
        ? [markers.reduce((sum, m) => sum + m.lat, 0) / markers.length, markers.reduce((sum, m) => sum + m.lng, 0) / markers.length]
        : [13.7563, 100.5018];

    return (
        <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-200 z-0 relative">
            <MapContainer center={center} zoom={10} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater markers={markers} />
                {markers.map(property => (
                    <Marker key={property.id} position={[property.lat, property.lng]}>
                        <Popup>
                            <div className="w-48">
                                <div className="h-32 w-full mb-2 overflow-hidden rounded">
                                    <img src={property.images?.[0] || property.image} alt={property.title} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="font-bold text-sm truncate">{property.title}</h3>
                                <p className="text-blue-600 font-bold">
                                    {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(property.price)}
                                </p>
                                <Link to={`/property/${property.id}`} className="text-xs text-blue-500 hover:underline block mt-1">
                                    ดูรายละเอียด
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default PropertyMap;
