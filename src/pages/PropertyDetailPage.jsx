import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, Bed, Bath, Ruler, Calendar, Map, ArrowLeft, Phone, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const ZoneGallery = ({ images, name }) => {
    if (!images || images.length === 0) {
        return (
            <div className="w-full h-[300px] lg:h-[400px] rounded-2xl overflow-hidden shadow-lg bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">ไม่มีรูปภาพ</span>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((img, index) => {
                // Pattern: Large (2 cols), Small (1 col), Small (1 col)
                // Handle orphan: if last item would be a single small one, make it large
                const isLarge = index % 3 === 0 || (index === images.length - 1 && images.length % 3 === 2);

                return (
                    <div
                        key={index}
                        className={`w-full rounded-2xl overflow-hidden shadow-lg group relative ${isLarge ? 'md:col-span-2 h-[300px] md:h-[500px]' : 'md:col-span-1 h-[300px]'
                            }`}
                    >
                        <img
                            src={img}
                            alt={`${name} - ${index + 1}`}
                            className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-500" />
                    </div>
                );
            })}
        </div>
    );
};

const PropertyDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const docRef = doc(db, "properties", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProperty({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.log("No such document!");
                    navigate('/');
                }
            } catch (error) {
                console.error("Error fetching property:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!property) return null;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(price);
    };

    const typeMap = { 'house': 'บ้านเดี่ยว', 'townhome': 'ทาวน์โฮม', 'condo': 'คอนโด' };
    const images = property.images && property.images.length > 0 ? property.images : [property.image];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-700">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> ย้อนกลับ
                </button>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Image Gallery & Main Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Image Gallery */}
                        <div className="bg-gray-200 relative flex flex-col h-[400px] lg:h-[600px]">
                            <div className="w-full relative flex-1 h-full">
                                <img
                                    src={images[activeImageIndex]}
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                />
                                <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded text-sm font-bold shadow">พร้อมอยู่</span>
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImageIndex(idx)}
                                            className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition shadow-lg ${activeImageIndex === idx ? 'border-blue-600 scale-105' : 'border-white opacity-80 hover:opacity-100'
                                                }`}
                                        >
                                            <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Main Content */}
                        <div className="p-6 lg:p-10 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide">{typeMap[property.type]}</span>
                                <span className="text-3xl font-bold text-blue-600">{formatPrice(property.price)}</span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{property.title}</h1>

                            <div className="flex items-center text-gray-500 mb-6 text-lg">
                                <MapPin className="w-5 h-5 mr-2 text-red-500" />
                                <span>{property.location} {property.subDistrict} {property.district} {property.province} {property.zipCode}</span>
                            </div>

                            {/* Specs Grid */}
                            <div className="grid grid-cols-3 gap-6 mb-8 border-y border-gray-100 py-6">
                                <div className="text-center">
                                    <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Bed className="text-blue-500 w-6 h-6" />
                                    </div>
                                    <p className="text-gray-500 text-sm">ห้องนอน</p>
                                    <p className="text-xl font-bold text-gray-800">{property.beds}</p>
                                </div>
                                <div className="text-center border-l border-r border-gray-100">
                                    <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Bath className="text-blue-500 w-6 h-6" />
                                    </div>
                                    <p className="text-gray-500 text-sm">ห้องน้ำ</p>
                                    <p className="text-xl font-bold text-gray-800">{property.baths}</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Ruler className="text-blue-500 w-6 h-6" />
                                    </div>
                                    <p className="text-gray-500 text-sm">พื้นที่ใช้สอย</p>
                                    <p className="text-xl font-bold text-gray-800">{property.area} ตร.ม.</p>
                                </div>
                            </div>

                            <div className="mb-8 flex-grow">
                                <h3 className="text-xl font-bold text-gray-800 mb-3">รายละเอียดทรัพย์</h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                    {property.desc || "ไม่มีรายละเอียดเพิ่มเติม"}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-4 mt-auto">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition shadow-lg flex items-center justify-center">
                                    <Phone className="w-5 h-5 mr-2" /> โทรติดต่อ
                                </button>
                                <button className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition shadow-lg flex items-center justify-center">
                                    <MessageCircle className="w-5 h-5 mr-2" /> ไลน์สอบถาม
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Zones Section */}
                    {property.zones && property.zones.length > 0 && (
                        <div className="p-6 lg:p-10 border-t border-gray-100 bg-gray-50">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">เจาะลึกทุกมุมบ้าน</h2>
                            <div className="space-y-12">
                                {property.zones.map((zone, index) => (
                                    <div key={index} className={`flex flex-col lg:flex-row gap-8 items-start ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                                        <div className="w-full lg:w-1/2">
                                            <ZoneGallery images={zone.images || (zone.image ? [zone.image] : [])} name={zone.name} />
                                        </div>
                                        <div className="w-full lg:w-1/2 space-y-4 pt-4">
                                            <div className="flex items-center gap-3">
                                                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">{index + 1}</span>
                                                <h3 className="text-2xl font-bold text-gray-800">{zone.name}</h3>
                                            </div>
                                            <div className="pl-11">
                                                <p className="text-gray-600 text-lg leading-relaxed mb-4">{zone.desc}</p>
                                                {zone.size && (
                                                    <div className="inline-flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 text-blue-600 font-medium">
                                                        <Ruler className="w-4 h-4 mr-2" />
                                                        ขนาด: {zone.size}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Map Section */}
                    {property.mapUrl && (
                        <div className="p-6 lg:p-10 border-t border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <Map className="w-5 h-5 mr-2 text-blue-600" /> แผนที่ตั้งทรัพย์
                            </h3>
                            <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-md border border-gray-200">
                                <iframe
                                    src={(() => {
                                        const url = property.mapUrl;
                                        if (url.includes('embed')) return url;

                                        // Try to extract coordinates from !3d and !4d (Standard Google Maps URL)
                                        const latMatch = url.match(/!3d([\d.]+)/);
                                        const lngMatch = url.match(/!4d([\d.]+)/);

                                        if (latMatch && lngMatch) {
                                            return `https://maps.google.com/maps?q=${latMatch[1]},${lngMatch[1]}&z=15&output=embed`;
                                        }

                                        // Fallback: Try to extract from @lat,lng
                                        const atMatch = url.match(/@([\d.]+),([\d.]+)/);
                                        if (atMatch) {
                                            return `https://maps.google.com/maps?q=${atMatch[1]},${atMatch[2]}&z=15&output=embed`;
                                        }

                                        return url;
                                    })()}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <a
                                    href={property.mapUrl.includes('/embed')
                                        ? property.mapUrl.replace('/embed', '/maps')
                                        : property.mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center bg-white border border-gray-300 text-gray-700 hover:text-blue-600 hover:border-blue-600 px-4 py-2 rounded-lg font-medium text-sm transition shadow-sm"
                                >
                                    <Map className="w-4 h-4 mr-2" /> เปิดดูใน Google Maps แบบเต็ม
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PropertyDetailPage;
