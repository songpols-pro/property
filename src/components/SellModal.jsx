import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Upload, Trash } from 'lucide-react';

const SellModal = ({ onClose, onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        location: '',
        province: '',
        district: '',
        subDistrict: '',
        zipCode: '',
        type: 'house',
        beds: 1,
        baths: 1,
        area: 30,
        desc: '',
        images: [],
        status: 'available',
        mapUrl: '',
        zones: []
    });

    const [addressData, setAddressData] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [amphures, setAmphures] = useState([]);
    const [tambons, setTambons] = useState([]);

    // Fetch Thai Address Data
    useEffect(() => {
        const fetchAddressData = async () => {
            try {
                const response = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/province_with_district_and_sub_district.json');
                const data = await response.json();
                setAddressData(data);
                setProvinces(data.map(p => p.name_th));
            } catch (error) {
                console.error("Error fetching address data:", error);
            }
        };
        fetchAddressData();
    }, []);

    // Handle Address Selection
    const handleProvinceChange = (e) => {
        const provinceName = e.target.value;
        const provinceData = addressData.find(p => p.name_th === provinceName);

        setFormData(prev => ({
            ...prev,
            province: provinceName,
            district: '',
            subDistrict: '',
            zipCode: ''
        }));

        if (provinceData) {
            setAmphures(provinceData.districts);
            setTambons([]);
        } else {
            setAmphures([]);
            setTambons([]);
        }
    };

    const handleAmphureChange = (e) => {
        const amphureName = e.target.value;
        const provinceData = addressData.find(p => p.name_th === formData.province);
        const amphureData = provinceData?.districts.find(a => a.name_th === amphureName);

        setFormData(prev => ({
            ...prev,
            district: amphureName,
            subDistrict: '',
            zipCode: ''
        }));

        if (amphureData) {
            setTambons(amphureData.sub_districts);
        } else {
            setTambons([]);
        }
    };

    const handleTambonChange = (e) => {
        const tambonName = e.target.value;
        const provinceData = addressData.find(p => p.name_th === formData.province);
        const amphureData = provinceData?.districts.find(a => a.name_th === formData.district);
        const tambonData = amphureData?.sub_districts.find(t => t.name_th === tambonName);

        setFormData(prev => ({
            ...prev,
            subDistrict: tambonName,
            zipCode: tambonData ? tambonData.zip_code : ''
        }));
    };

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                images: initialData.images || (initialData.image ? [initialData.image] : []),
                mapUrl: initialData.mapUrl || '',
                province: initialData.province || '',
                district: initialData.district || '',
                subDistrict: initialData.subDistrict || '',
                subDistrict: initialData.subDistrict || '',
                zipCode: initialData.zipCode || '',
                subDistrict: initialData.subDistrict || '',
                zipCode: initialData.zipCode || '',
                zones: (initialData.zones || []).map(z => ({
                    ...z,
                    images: z.images || (z.image ? [z.image] : [])
                }))
            });
        }
    }, [initialData]);

    // Pre-populate address dropdowns when addressData is loaded and we have initialData
    useEffect(() => {
        if (initialData && addressData.length > 0) {
            if (initialData.province) {
                const provinceData = addressData.find(p => p.name_th === initialData.province);
                if (provinceData) {
                    setAmphures(provinceData.districts);
                    if (initialData.district) {
                        const amphureData = provinceData.districts.find(a => a.name_th === initialData.district);
                        if (amphureData) {
                            setTambons(amphureData.sub_districts);
                        }
                    }
                }
            }
        }
    }, [addressData, initialData]);

    useEffect(() => {
        // Load Cloudinary Upload Widget script
        if (!window.cloudinary) {
            const script = document.createElement('script');
            script.src = 'https://upload-widget.cloudinary.com/global/all.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const openCloudinaryWidget = () => {
        if (!window.cloudinary) {
            alert('กำลังโหลด Cloudinary Widget... กรุณารอสักครู่แล้วลองใหม่');
            return;
        }

        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
                uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
                sources: ['local', 'url', 'camera'],
                multiple: true,
                maxFiles: 5,
                resourceType: 'image',
                clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
                maxImageFileSize: 5000000, // 5MB
                folder: 'properties',
                cropping: false,
                showSkipCropButton: true,
                styles: {
                    palette: {
                        window: '#FFFFFF',
                        windowBorder: '#3B82F6',
                        tabIcon: '#3B82F6',
                        menuIcons: '#5A616A',
                        textDark: '#000000',
                        textLight: '#FFFFFF',
                        link: '#3B82F6',
                        action: '#3B82F6',
                        inactiveTabIcon: '#9CA3AF',
                        error: '#EF4444',
                        inProgress: '#3B82F6',
                        complete: '#10B981',
                        sourceBg: '#F3F4F6'
                    }
                }
            },
            (error, result) => {
                if (!error && result && result.event === 'success') {
                    const imageUrl = result.info.secure_url;
                    setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, imageUrl]
                    }));
                }
            }
        );

        widget.open();
    };

    const handleAddImageByUrl = () => {
        const url = window.prompt("กรุณาวางลิงก์รูปภาพ (URL):");
        if (url && url.trim() !== "") {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, url.trim()]
            }));
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.images.length === 0) {
            alert('กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป');
            return;
        }

        onSubmit({
            ...formData,
            price: parseInt(formData.price),
            beds: parseInt(formData.beds),
            baths: parseInt(formData.baths),
            area: parseInt(formData.area),
            category: initialData ? initialData.category : 'new',
            date: initialData ? initialData.date : new Date().toISOString().split('T')[0],
            views: initialData ? (initialData.views || 0) : 0,
            views: initialData ? (initialData.views || 0) : 0,
            images: formData.images,
            zones: formData.zones || []
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto modal-scroll relative shadow-2xl animate-slide-in"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{initialData ? 'แก้ไขประกาศ' : 'ลงประกาศขายบ้าน'}</h2>
                        <p className="text-gray-500 text-sm">{initialData ? 'แก้ไขรายละเอียดบ้านของคุณ' : 'กรอกรายละเอียดบ้านรีโนเวทของคุณเพื่อลงขาย'}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Image Upload Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            รูปภาพบ้าน <span className="text-red-500">*</span>
                        </label>

                        {/* Image Previews */}
                        {formData.images.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mb-3">
                                {formData.images.map((imageUrl, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={imageUrl}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload Button */}
                        {formData.images.length < 5 && (
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={openCloudinaryWidget}
                                    className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
                                >
                                    <Upload className="w-5 h-5 mr-2 text-gray-500" />
                                    <span className="text-sm text-gray-600">
                                        อัปโหลดรูปภาพ
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddImageByUrl}
                                    className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition text-gray-500 hover:text-blue-600"
                                    title="เพิ่มจากลิงก์ (URL)"
                                >
                                    <span className="text-sm font-bold">URL</span>
                                </button>
                            </div>
                        )}

                        {formData.images.length === 0 && (
                            <p className="text-xs text-red-500 mt-1">กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">รองรับไฟล์: JPG, PNG, GIF, WebP (สูงสุด 5MB/รูป)</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อประกาศ <span className="text-red-500">*</span></label>
                            <input type="text" id="title" required className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="เช่น บ้านเดี่ยวหลังมุม รีโนเวทใหม่" value={formData.title} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ราคา (บาท) <span className="text-red-500">*</span></label>
                            <input type="number" id="price" required min="100000" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="เช่น 3500000" value={formData.price} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ประเภท <span className="text-red-500">*</span></label>
                            <select id="type" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-white" value={formData.type} onChange={handleChange}>
                                <option value="house">บ้านเดี่ยว</option>
                                <option value="townhome">ทาวน์โฮม</option>
                                <option value="condo">คอนโด</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ <span className="text-red-500">*</span></label>
                            <select id="status" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-white" value={formData.status || 'available'} onChange={handleChange}>
                                <option value="available">ว่าง (Available)</option>
                                <option value="sold">ขายแล้ว (Sold)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">จังหวัด <span className="text-red-500">*</span></label>
                            <select
                                id="province"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-white"
                                value={formData.province}
                                onChange={handleProvinceChange}
                            >
                                <option value="">เลือกจังหวัด</option>
                                {provinces.map((p, idx) => (
                                    <option key={idx} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">เขต / อำเภอ <span className="text-red-500">*</span></label>
                            <select
                                id="district"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-white"
                                value={formData.district}
                                onChange={handleAmphureChange}
                                disabled={!formData.province}
                            >
                                <option value="">เลือกอำเภอ</option>
                                {amphures.map((a, idx) => (
                                    <option key={idx} value={a.name_th}>{a.name_th}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">แขวง / ตำบล <span className="text-red-500">*</span></label>
                            <select
                                id="subDistrict"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-white"
                                value={formData.subDistrict}
                                onChange={handleTambonChange}
                                disabled={!formData.district}
                            >
                                <option value="">เลือกตำบล</option>
                                {tambons.map((t, idx) => (
                                    <option key={idx} value={t.name_th}>{t.name_th}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสไปรษณีย์</label>
                            <input
                                type="text"
                                id="zipCode"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-gray-50"
                                value={formData.zipCode}
                                readOnly
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดที่อยู่เพิ่มเติม (ซอย, หมู่บ้าน) <span className="text-red-500">*</span></label>
                            <input type="text" id="location" required className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="เช่น หมู่บ้านพฤกษา, ซอย 5" value={formData.location} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link</label>
                            <input type="url" id="mapUrl" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="https://maps.google.com/..." value={formData.mapUrl} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ห้องนอน</label>
                            <input type="number" id="beds" required min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-center" value={formData.beds} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ห้องน้ำ</label>
                            <input type="number" id="baths" required min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-center" value={formData.baths} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">พื้นที่ (ตร.ม.)</label>
                            <input type="number" id="area" required min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-center" value={formData.area} onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดเพิ่มเติม</label>
                        <textarea id="desc" rows="3" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" placeholder="อธิบายจุดเด่นของบ้าน การรีโนเวท หรือของแถม..." value={formData.desc} onChange={handleChange}></textarea>
                    </div>

                    {/* Zones Management */}
                    <div className="border-t border-gray-100 pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800">โซนต่างๆ ของบ้าน</h3>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({
                                    ...prev,
                                    zones: [...(prev.zones || []), { name: '', desc: '', size: '', images: [] }]
                                }))}
                                className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100 transition font-medium"
                            >
                                + เพิ่มโซน
                            </button>
                        </div>

                        <div className="space-y-6">
                            {(formData.zones || []).map((zone, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            zones: prev.zones.filter((_, i) => i !== index)
                                        }))}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">ชื่อโซน (เช่น ห้องนอนใหญ่)</label>
                                            <input
                                                type="text"
                                                value={zone.name}
                                                onChange={(e) => {
                                                    const newZones = [...formData.zones];
                                                    newZones[index].name = e.target.value;
                                                    setFormData(prev => ({ ...prev, zones: newZones }));
                                                }}
                                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">ขนาด (ระบุหน่วย)</label>
                                            <input
                                                type="text"
                                                value={zone.size}
                                                onChange={(e) => {
                                                    const newZones = [...formData.zones];
                                                    newZones[index].size = e.target.value;
                                                    setFormData(prev => ({ ...prev, zones: newZones }));
                                                }}
                                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                                placeholder="เช่น 4x5 ม."
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">รายละเอียดโซน</label>
                                        <textarea
                                            value={zone.desc}
                                            onChange={(e) => {
                                                const newZones = [...formData.zones];
                                                newZones[index].desc = e.target.value;
                                                setFormData(prev => ({ ...prev, zones: newZones }));
                                            }}
                                            rows="2"
                                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">รูปภาพโซน (สูงสุด 5 รูป)</label>

                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {(zone.images || []).map((img, imgIdx) => (
                                                <div key={imgIdx} className="relative group">
                                                    <img src={img} alt={`Zone ${index + 1} - ${imgIdx + 1}`} className="h-20 w-20 object-cover rounded border border-gray-300" />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newZones = [...formData.zones];
                                                            newZones[index].images = newZones[index].images.filter((_, i) => i !== imgIdx);
                                                            setFormData(prev => ({ ...prev, zones: newZones }));
                                                        }}
                                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {(zone.images || []).length < 5 && (
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (!window.cloudinary) return;
                                                        window.cloudinary.createUploadWidget(
                                                            {
                                                                cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
                                                                uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
                                                                sources: ['local', 'url', 'camera'],
                                                                multiple: true,
                                                                maxFiles: 5 - (zone.images || []).length,
                                                                resourceType: 'image',
                                                                folder: 'property-zones',
                                                            },
                                                            (error, result) => {
                                                                if (!error && result && result.event === 'success') {
                                                                    const newZones = [...formData.zones];
                                                                    newZones[index].images = [...(newZones[index].images || []), result.info.secure_url];
                                                                    setFormData(prev => ({ ...prev, zones: newZones }));
                                                                }
                                                            }
                                                        ).open();
                                                    }}
                                                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded border border-gray-300 transition flex items-center"
                                                >
                                                    <Upload className="w-3 h-3 mr-1" /> เพิ่มรูปภาพ
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const url = window.prompt("กรุณาวางลิงก์รูปภาพ (URL):");
                                                        if (url && url.trim() !== "") {
                                                            const newZones = [...formData.zones];
                                                            newZones[index].images = [...(newZones[index].images || []), url.trim()];
                                                            setFormData(prev => ({ ...prev, zones: newZones }));
                                                        }
                                                    }}
                                                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded border border-gray-300 transition font-bold"
                                                    title="เพิ่มจากลิงก์ (URL)"
                                                >
                                                    URL
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {(formData.zones || []).length === 0 && (
                                <p className="text-center text-gray-400 text-sm py-4">ยังไม่มีข้อมูลโซน กด "+ เพิ่มโซน" เพื่อเริ่มใส่ข้อมูล</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={formData.images.length === 0}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition shadow-md flex justify-center items-center transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <CheckCircle className="w-5 h-5 mr-2" /> {initialData ? 'บันทึกการแก้ไข' : 'ลงประกาศทันที'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SellModal;
