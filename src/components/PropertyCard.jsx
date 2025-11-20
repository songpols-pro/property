import React from 'react';
import { MapPin, Bed, Bath, Ruler, Eye } from 'lucide-react';

const PropertyCard = ({ property, onClick }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(price);
    };

    const isNew = () => {
        if (!property.date) return false;
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return new Date(property.date) > oneMonthAgo;
    };

    return (
        <div
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group relative"
            onClick={() => onClick(property)}
        >
            <div className="relative h-64 overflow-hidden">
                <img
                    src={property.images && property.images.length > 0 ? property.images[0] : property.image}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                    {property.status === 'sold' ? (
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                            ขายแล้ว
                        </span>
                    ) : (
                        <>
                            {isNew() && (
                                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                                    มาใหม่
                                </span>
                            )}
                            {(property.category === 'hot' || (property.views > 100)) && (
                                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                                    ที่นิยม
                                </span>
                            )}
                        </>
                    )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white font-bold text-lg">{formatPrice(property.price)}</p>
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {property.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4 flex items-center">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">
                        {property.district ? `${property.district}, ${property.province}` : property.location}
                    </span>
                </p>

                <div className="flex justify-between items-center border-t border-gray-100 pt-4 text-sm text-gray-600">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {property.beds}</span>
                        <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {property.baths}</span>
                        <span className="flex items-center gap-1"><Ruler className="w-4 h-4" /> {property.area}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400 text-xs">
                        <span>{new Date(property.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
                        <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" /> {property.views || 0}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;
