import React, { useState } from 'react';
import { PlusCircle, Trash2, Pencil, ArrowLeft, Search, Filter, LogOut, UploadCloud, Wrench } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, addDoc, updateDoc, deleteDoc, doc, writeBatch, getDocs, deleteField } from 'firebase/firestore';
import { auth, db } from '../firebase';
import SellModal from '../components/SellModal';
import Toast from '../components/Toast';
import { initialProperties } from '../data/mockData';

const AdminPage = ({ properties, onAddListing, onDeleteListing, onUpdateListing }) => {
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const [toasts, setToasts] = useState([]);
    const navigate = useNavigate();

    // Search and Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(price);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const handleRepairData = async () => {
        if (window.confirm('คุณต้องการซ่อมแซมข้อมูล (ลบ ID ที่ซ้ำซ้อน) ใช่หรือไม่?')) {
            try {
                const querySnapshot = await getDocs(collection(db, "properties"));
                const batch = writeBatch(db);
                let updateCount = 0;

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.id) {
                        const docRef = doc.ref;
                        batch.update(docRef, { id: deleteField() });
                        updateCount++;
                    }
                });

                if (updateCount > 0) {
                    await batch.commit();
                    showToast(`ซ่อมแซมข้อมูล ${updateCount} รายการเรียบร้อยแล้ว`);
                } else {
                    showToast("ข้อมูลปกติอยู่แล้ว ไม่จำเป็นต้องซ่อมแซม");
                }
            } catch (error) {
                console.error("Error repairing data: ", error);
                showToast("เกิดข้อผิดพลาดในการซ่อมแซม", "error");
            }
        }
    };

    const handleImportData = async () => {
        if (window.confirm('คุณต้องการนำเข้าข้อมูลตัวอย่างไปยัง Database ใช่หรือไม่?')) {
            try {
                // Note: writeBatch has a limit of 500 operations. 
                // Since we have few items, we can loop and addDoc, but addDoc isn't supported in batch directly for auto-id in the same way as set.
                // So we will just use Promise.all with addDoc for simplicity.

                const promises = initialProperties.map(prop => {
                    // Remove the ID from mock data to let Firestore generate a new one
                    const { id, ...data } = prop;
                    return addDoc(collection(db, "properties"), data);
                });

                await Promise.all(promises);
                showToast("นำเข้าข้อมูลเรียบร้อยแล้ว");
            } catch (error) {
                console.error("Error importing data: ", error);
                showToast("เกิดข้อผิดพลาดในการนำเข้าข้อมูล", "error");
            }
        }
    };

    const handleOpenAdd = () => {
        setEditingProperty(null);
        setIsSellModalOpen(true);
    };

    const handleOpenEdit = (property) => {
        setEditingProperty(property);
        setIsSellModalOpen(true);
    };

    const handleSubmit = async (listingData) => {
        try {
            if (editingProperty) {
                // Update existing document
                const propertyRef = doc(db, "properties", editingProperty.id);
                await updateDoc(propertyRef, listingData);
                showToast("แก้ไขประกาศเรียบร้อยแล้ว");
            } else {
                // Add new document
                await addDoc(collection(db, "properties"), listingData);
                showToast("เพิ่มประกาศเรียบร้อยแล้ว");
            }
            setIsSellModalOpen(false);
            setEditingProperty(null);
        } catch (error) {
            console.error("Error saving document: ", error);
            showToast("เกิดข้อผิดพลาดในการบันทึก", "error");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('คุณต้องการลบประกาศนี้ใช่หรือไม่?')) {
            try {
                await deleteDoc(doc(db, "properties", id));
                showToast("ลบประกาศเรียบร้อยแล้ว", "error");
            } catch (error) {
                console.error("Error deleting document: ", error);
                showToast("เกิดข้อผิดพลาดในการลบ", "error");
            }
        }
    };

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    // Filter Logic
    const filteredProperties = properties.filter(prop => {
        const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prop.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || prop.type === filterType;
        const matchesStatus = filterStatus === 'all' || prop.status === filterStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

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
                    <div className="flex gap-3">
                        {/* Repair Button */}
                        <button
                            onClick={handleRepairData}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold transition flex items-center shadow-sm"
                        >
                            <Wrench className="w-5 h-5 mr-2" /> ซ่อมข้อมูล
                        </button>
                        {/* Temporary Import Button */}
                        <button
                            onClick={handleImportData}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold transition flex items-center shadow-sm"
                        >
                            <UploadCloud className="w-5 h-5 mr-2" /> นำเข้าข้อมูลตัวอย่าง
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-white hover:bg-gray-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg font-bold transition flex items-center shadow-sm"
                        >
                            <LogOut className="w-5 h-5 mr-2" /> ออกจากระบบ
                        </button>
                        <button
                            onClick={handleOpenAdd}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition flex items-center shadow-lg"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" /> เพิ่มประกาศใหม่
                        </button>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อประกาศ หรือทำเล..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-48">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <Filter className="w-4 h-4 text-gray-500" />
                            </div>
                            <select
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white appearance-none cursor-pointer"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="all">ทุกประเภท</option>
                                <option value="house">บ้านเดี่ยว</option>
                                <option value="townhome">ทาวน์โฮม</option>
                                <option value="condo">คอนโด</option>
                            </select>
                        </div>

                        <div className="relative w-full md:w-48">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <Filter className="w-4 h-4 text-gray-500" />
                            </div>
                            <select
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white appearance-none cursor-pointer"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">ทุกสถานะ</option>
                                <option value="available">ว่าง</option>
                                <option value="sold">ขายแล้ว</option>
                            </select>
                        </div>
                    </div>
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
                            {filteredProperties.map(prop => (
                                <tr key={prop.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <img src={prop.images[0]} alt={prop.title} className="w-16 h-16 object-cover rounded-lg" />
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

                    {filteredProperties.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            {properties.length === 0 ? "ยังไม่มีประกาศขาย" : "ไม่พบข้อมูลที่ค้นหา"}
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
