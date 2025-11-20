import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [filters, setFilters] = useState({ text: '', type: [], category: 'all', province: [], district: [] });
    const [sortBy, setSortBy] = useState('date-desc');
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [addressData, setAddressData] = useState([]);

    // Fetch Thai Address Data
    useEffect(() => {
        const fetchAddressData = async () => {
            try {
                const response = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/province_with_district_and_sub_district.json');
                const data = await response.json();
                setAddressData(data);
            } catch (error) {
                console.error("Error fetching address data:", error);
            }
        };
        fetchAddressData();
    }, []);

    // Update filtered properties when properties prop changes
    useEffect(() => {
        setFilteredProperties(properties);
    }, [properties]);

    // Filter and Sort Logic
    useEffect(() => {
        let result = properties.filter(prop => {
            const matchText = prop.title.toLowerCase().includes(filters.text.toLowerCase()) ||
                prop.location.toLowerCase().includes(filters.text.toLowerCase());
            const matchType = filters.type.length === 0 || filters.type.includes(prop.type);
            const matchCategory = filters.category === 'all' || prop.category === filters.category;
            const matchProvince = filters.province.length === 0 || filters.province.includes(prop.province);
            const matchDistrict = filters.district.length === 0 || filters.district.includes(prop.district);
            return matchText && matchType && matchCategory && matchProvince && matchDistrict;
        });

        // Sorting
        console.log("Sorting by:", sortBy);
        result.sort((a, b) => {
            let valA, valB;
            switch (sortBy) {
                case 'price-asc':
                    valA = Number(a.price);
                    valB = Number(b.price);
                    return valA - valB;
                case 'price-desc':
                    valA = Number(a.price);
                    valB = Number(b.price);
                    return valB - valA;
                case 'date-asc':
                    valA = new Date(a.date || 0);
                    valB = new Date(b.date || 0);
                    return valA - valB;
                case 'date-desc':
                default:
                    valA = new Date(a.date || 0);
                    valB = new Date(b.date || 0);
                    return valB - valA;
            }
        });

        console.log("Sorted result (top 3):", result.slice(0, 3).map(p => ({ id: p.id, price: p.price, date: p.date })));

        setFilteredProperties([...result]); // Create a new array reference just in case
    }, [filters, properties, sortBy]);

    const handleSearch = (text) => setFilters(prev => ({ ...prev, text }));
    const handleFilterType = (type) => {
        setFilters(prev => {
            const currentTypes = prev.type;
            if (currentTypes.includes(type)) {
                return { ...prev, type: currentTypes.filter(t => t !== type) };
            } else {
                return { ...prev, type: [...currentTypes, type] };
            }
        });
    };
    const handleFilterProvince = (province) => {
        setFilters(prev => {
            const currentProvinces = prev.province;
            let newProvinces;
            let newDistricts = prev.district;

            if (currentProvinces.includes(province)) {
                // Removing a province
                newProvinces = currentProvinces.filter(p => p !== province);

                // Find districts belonging to the removed province and filter them out
                const provinceData = addressData.find(p => p.name_th === province);
                if (provinceData && provinceData.districts) {
                    const provinceDistrictNames = provinceData.districts.map(d => d.name_th);
                    newDistricts = newDistricts.filter(d => !provinceDistrictNames.includes(d));
                }
            } else {
                // Adding a province
                newProvinces = [...currentProvinces, province];
            }

            return { ...prev, province: newProvinces, district: newDistricts };
        });
    };
    const handleFilterDistrict = (district) => {
        setFilters(prev => {
            const currentDistricts = prev.district;
            if (currentDistricts.includes(district)) {
                return { ...prev, district: currentDistricts.filter(d => d !== district) };
            } else {
                return { ...prev, district: [...currentDistricts, district] };
            }
        });
    };
    const handleSetCategory = (category) => setFilters(prev => ({ ...prev, category }));

    const handleResetFilters = () => {
        setFilters({ text: '', type: 'all', category: 'all', province: [], district: [] });
        window.location.reload();
    };

    const navigate = useNavigate();

    const handlePropertyClick = async (property) => {
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

        navigate(`/property/${property.id}`);
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

            <Hero
                onSearch={handleSearch}
                onFilterType={handleFilterType}
                onFilterProvince={handleFilterProvince}
                onFilterDistrict={handleFilterDistrict}
                selectedProvinces={filters.province}
                selectedDistricts={filters.district}
                selectedTypes={filters.type}
                addressData={addressData}
            />

            <div id="listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <PropertyFilter
                    currentCategory={filters.category}
                    onSetCategory={handleSetCategory}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                />
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
