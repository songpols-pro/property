import React, { useState } from 'react';
import { PlusCircle, Trash2, Pencil, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SellModal from '../components/SellModal';
import Toast from '../components/Toast';

const AdminPage = ({ properties, onAddListing, onDeleteListing, onUpdateListing }) => {
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const [toasts, setToasts] = useState([]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(price);
    };

    const handleOpenAdd = () => {
        setEditingProperty(null);
        setIsSellModalOpen(true);
    };

    const handleOpenEdit = (property) => {
        setEditingProperty(property);
        setIsSellModalOpen(true);
    };

    const handleSubmit = (listingData) => {
        if (editingProperty) {
            onUpdateListing(listingData);
            showToast("แก้ไขประกาศเรียบร้อยแล้ว");
        } else {
            onAddListing(listingData);
            showToast("เพิ่มประกาศเรียบร้อยแล้ว");
        }
        setIsSellModalOpen(false);
        setEditingProperty(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('คุณต้องการลบประกาศนี้ใช่หรือไม่?')) {
            onDeleteListing(id);
            showToast("ลบประกาศเรียบร้อยแล้ว", "error");
        }
    };

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="p-2 bg-white rounded-full shadow hover:bg-gray-50 transition">
                            <ArrowLeft className="w-6 h-6 text-gray-600" />
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-800">จัดการประกาศขาย</h1>
                    </div>
                    <button
                        onClick={handleOpenAdd}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition flex items-center shadow-lg"
                    >
                        <PlusCircle className="w-5 h-5 mr-2" /> เพิ่มประกาศใหม่
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-600">รูปภาพ</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">ชื่อประกาศ</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">ราคา</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">ประเภท</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">สถานะ</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-right">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {properties.map(prop => (
                                <tr key={prop.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <img src={prop.image} alt={prop.title} className="w-16 h-16 object-cover rounded-lg" />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{prop.title}</td>
                                    <td className="px-6 py-4 text-blue-600 font-bold">{formatPrice(prop.price)}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                                            {prop.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${prop.status === 'sold'
                                                ? 'bg-red-100 text-red-600'
                                                : 'bg-green-100 text-green-600'
                                            }`}>
                                            {prop.status === 'sold' ? 'ขายแล้ว' : 'ว่าง'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenEdit(prop)}
                                                className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-full transition"
                                                title="แก้ไข"
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(prop.id)}
                                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition"
                                                title="ลบ"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {properties.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            ยังไม่มีประกาศขาย
                        </div>
                    )}
                </div>
            </div>

            {isSellModalOpen && (
                <SellModal
                    onClose={() => setIsSellModalOpen(false)}
                    onSubmit={handleSubmit}
                    initialData={editingProperty}
                />
            )}

            <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default AdminPage;
