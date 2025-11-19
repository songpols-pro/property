import React, { useState } from 'react';
import { X, MapPin, Bed, Bath, Ruler, Calendar, Map } from 'lucide-react';

const PropertyModal = ({ property, onClose, onContact }) => {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    if (!property) return null;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(price);
    };

    const typeMap = { 'house': 'บ้านเดี่ยว', 'townhome': 'ทาวน์โฮม', 'condo': 'คอนโด' };
    const images = property.images && property.images.length > 0 ? property.images : [property.image];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto modal-scroll relative shadow-2xl animate-slide-in"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-white rounded-full p-2 text-gray-600 hover:text-red-500 transition z-10 shadow-md"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Image Gallery */}
                    <div className="bg-gray-200 relative flex flex-col">
                        <div className="h-64 lg:h-80 w-full relative">
                            <img
                                src={images[activeImageIndex]}
                                alt={property.title}
                                className="w-full h-full object-cover transition-opacity duration-300"
                            />
                            <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded text-sm font-bold shadow">พร้อมอยู่</span>
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-2 p-2 overflow-x-auto bg-gray-100">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition ${activeImageIndex === idx ? 'border-blue-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6 lg:p-8">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-blue-600 font-medium text-sm uppercase tracking-wide">{typeMap[property.type]}</span>
                            <span className="text-2xl font-bold text-gray-900">{formatPrice(property.price)}</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">{property.title}</h2>
                        <p className="text-gray-500 mb-2 flex items-center">
                            <MapPin className="w-4 h-4 mr-2" /> <span>{property.location}</span>
                        </p>
                        <p className="text-gray-400 text-sm mb-6 flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>ลงประกาศเมื่อ: {new Date(property.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </p>

                        {/* Specs */}
                        <div className="grid grid-cols-3 gap-4 mb-6 border-t border-b border-gray-100 py-4">
                            <div className="text-center">
                                <Bed className="text-gray-400 mb-1 w-6 h-6 mx-auto" />
                                <p className="text-sm text-gray-600"><span className="font-bold text-gray-800">{property.beds}</span> นอน</p>
                            </div>
                            <div className="text-center border-l border-r border-gray-100">
                                <Bath className="text-gray-400 mb-1 w-6 h-6 mx-auto" />
                                <p className="text-sm text-gray-600"><span className="font-bold text-gray-800">{property.baths}</span> น้ำ</p>
                            </div>
                            <div className="text-center">
                                <Ruler className="text-gray-400 mb-1 w-6 h-6 mx-auto" />
                                <p className="text-sm text-gray-600"><span className="font-bold text-gray-800">{property.area}</span> ตร.ม.</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-bold text-gray-800 mb-2">รายละเอียดการรีโนเวท</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                {property.desc || "ไม่มีรายละเอียดเพิ่มเติม"}
                            </p>
                            {property.mapUrl && (
                                <a
                                    href={property.mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition"
                                >
                                    <Map className="w-4 h-4 mr-1" /> ดูแผนที่บน Google Maps
                                </a>
                            )}
                        </div>

                        {/* Agent Contact */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-3">สนใจนัดดูบ้านหลังนี้?</h3>
                            <form onSubmit={onContact} className="space-y-3">
                                <input type="text" placeholder="ชื่อของคุณ" required className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm" />
                                <input type="tel" placeholder="เบอร์โทรศัพท์" required className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm" />
                                <div className="flex gap-2 mt-2">
                                    <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold transition">
                                        ติดต่อผู้ขาย
                                    </button>
                                    <button type="button" className="px-4 py-2 border border-green-500 text-green-600 rounded hover:bg-green-50 transition">
                                        LINE
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyModal;
