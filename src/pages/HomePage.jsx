import React, { useState, useEffect } from 'react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import PropertyFilter from '../components/PropertyFilter';
import PropertyList from '../components/PropertyList';
import Footer from '../components/Footer';
import PropertyModal from '../components/PropertyModal';
import Toast from '../components/Toast';

const HomePage = ({ properties, onPropertyView }) => {
    const [filteredProperties, setFilteredProperties] = useState(properties);
    const [filters, setFilters] = useState({ text: '', type: 'all', category: 'all' });
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [toasts, setToasts] = useState([]);

    // Update filtered properties when properties prop changes
    useEffect(() => {
        setFilteredProperties(properties);
    }, [properties]);

    // Filter Logic
    useEffect(() => {
        const filtered = properties.filter(prop => {
            const matchText = prop.title.toLowerCase().includes(filters.text.toLowerCase()) ||
                prop.location.toLowerCase().includes(filters.text.toLowerCase());
            const matchType = filters.type === 'all' || prop.type === filters.type;
            const matchCategory = filters.category === 'all' || prop.category === filters.category;
            return matchText && matchType && matchCategory;
        });
        setFilteredProperties(filtered);
    }, [filters, properties]);

    const handleSearch = (text) => setFilters(prev => ({ ...prev, text }));
    const handleFilterType = (type) => setFilters(prev => ({ ...prev, type }));
    const handleSetCategory = (category) => setFilters(prev => ({ ...prev, category }));

    const handleResetFilters = () => {
        setFilters({ text: '', type: 'all', category: 'all' });
        window.location.reload();
    };

    const handlePropertyClick = async (property) => {
        setSelectedProperty(property);
        document.body.style.overflow = 'hidden';

        // Increment view count if property is not sold
        if (property.status !== 'sold') {
            try {
                const propertyRef = doc(db, "properties", property.id);
                await updateDoc(propertyRef, {
                    views: increment(1)
                });
            } catch (error) {
                console.error("Error updating view count:", error);
            }
        }

        if (onPropertyView) {
            onPropertyView(property.id);
        }
    };

    const closePropertyModal = () => {
        setSelectedProperty(null);
        document.body.style.overflow = 'auto';
    };

    const handleContact = (e) => {
        e.preventDefault();
        closePropertyModal();
        showToast("ส่งข้อมูลติดต่อเรียบร้อย! เจ้าหน้าที่จะติดต่อกลับภายใน 24 ชม.");
    };

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-700">
            <Navbar />

            <Hero onSearch={handleSearch} onFilterType={handleFilterType} />

            <div id="listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <PropertyFilter currentCategory={filters.category} onSetCategory={handleSetCategory} />
                <PropertyList
                    properties={filteredProperties}
                    onPropertyClick={handlePropertyClick}
                    onReset={handleResetFilters}
                />
            </div>

            <div id="about" className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">ทำไมต้อง RenoHome?</h2>
                        <p className="text-gray-500">เราคัดสรรบ้านโครงสร้างดี รีโนเวทด้วยวัสดุเกรดพรีเมียม เพื่อคุณภาพชีวิตที่ดีกว่า</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 text-2xl">
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <h3 className="text-xl font-bold mb-2">พร้อมเข้าอยู่</h3>
                            <p className="text-gray-600">บ้านทุกหลังผ่านการตรวจสอบระบบน้ำ ไฟ และโครงสร้าง รีโนเวทเสร็จสมบูรณ์ หิ้วกระเป๋าเข้าอยู่ได้เลย</p>
                        </div>
                        <div className="p-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 text-2xl">
                                <i className="fas fa-drafting-compass"></i>
                            </div>
                            <h3 className="text-xl font-bold mb-2">ดีไซน์ทันสมัย</h3>
                            <p className="text-gray-600">ออกแบบโดยสถาปนิกและอินทีเรียมืออาชีพ ตอบโจทย์ไลฟ์สไตล์คนรุ่นใหม่ ทั้ง Minimal, Nordic และ Loft</p>
                        </div>
                        <div className="p-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 text-2xl">
                                <i className="fas fa-file-contract"></i>
                            </div>
                            <h3 className="text-xl font-bold mb-2">ดูแลสินเชื่อ</h3>
                            <p className="text-gray-600">มีทีมงานช่วยประเมินวงเงินและยื่นกู้สินเชื่อบ้านมือสองกับธนาคารพันธมิตร ฟรี!</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            <PropertyModal
                property={selectedProperty}
                onClose={closePropertyModal}
                onContact={handleContact}
            />

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

export default HomePage;
