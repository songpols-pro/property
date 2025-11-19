import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Plus, Trash } from 'lucide-react';

const SellModal = ({ onClose, onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        location: '',
        type: 'house',
        beds: 1,
        baths: 1,
        area: 30,
        desc: '',
        images: ['https://images.unsplash.com/photo-151358468e774-c447475a968b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
        status: 'available',
        mapUrl: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                images: initialData.images || (initialData.image ? [initialData.image] : []),
                mapUrl: initialData.mapUrl || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const addImageField = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
    };

    const removeImageField = (index) => {
        if (formData.images.length > 1) {
            const newImages = formData.images.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, images: newImages }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            price: parseInt(formData.price),
            beds: parseInt(formData.beds),
            baths: parseInt(formData.baths),
            area: parseInt(formData.area),
            id: initialData ? initialData.id : Date.now(),
            category: initialData ? initialData.category : 'new',
            date: initialData ? initialData.date : new Date().toISOString().split('T')[0],
            images: formData.images.filter(img => img.trim() !== '') // Filter empty strings
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">รูปภาพบ้าน (URL)</label>
                        <div className="space-y-2">
                            {formData.images.map((img, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="url"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                                        placeholder={`URL รูปภาพที่ ${index + 1}`}
                                        value={img}
                                        onChange={(e) => handleImageChange(index, e.target.value)}
                                    />
                                    {formData.images.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeImageField(index)}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                                        >
                                            <Trash className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addImageField}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                        >
                            <Plus className="w-4 h-4 mr-1" /> เพิ่มรูปภาพ
                        </button>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">ทำเล / เขต <span className="text-red-500">*</span></label>
                            <input type="text" id="location" required className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="เช่น บางนา, กรุงเทพฯ" value={formData.location} onChange={handleChange} />
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

                    <div className="pt-4 border-t border-gray-100">
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition shadow-md flex justify-center items-center transform active:scale-95">
                            <CheckCircle className="w-5 h-5 mr-2" /> {initialData ? 'บันทึกการแก้ไข' : 'ลงประกาศทันที'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SellModal;
