import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

const Hero = ({ onSearch, onFilterType, onFilterProvince, onFilterDistrict, selectedProvinces = [], selectedDistricts = [], selectedTypes = [], addressData = [] }) => {
    const [availableDistricts, setAvailableDistricts] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null); // 'province', 'district', or null
    const [provinceSearch, setProvinceSearch] = useState('');
    const [districtSearch, setDistrictSearch] = useState('');
    const dropdownRef = useRef(null);

    // Update available districts when selected provinces change
    useEffect(() => {
        if (selectedProvinces.length > 0 && addressData.length > 0) {
            const districts = [];
            selectedProvinces.forEach(provinceName => {
                const provinceData = addressData.find(p => p.name_th === provinceName);
                if (provinceData && provinceData.districts) {
                    districts.push(...provinceData.districts.map(d => ({
                        name: d.name_th,
                        province: provinceName
                    })));
                }
            });
            setAvailableDistricts(districts);
        } else {
            setAvailableDistricts([]);
        }
    }, [selectedProvinces, addressData]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = (name) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const provinces = addressData.map(p => p.name_th);
    const filteredProvinces = provinces.filter(p => p.includes(provinceSearch));
    const filteredDistricts = availableDistricts.filter(d => d.name.includes(districtSearch));

    return (
        <div className="relative h-[500px] flex items-center justify-center text-white bg-blue-500">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center mix-blend-multiply"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")' }}
            ></div>
            <div className="absolute inset-0 bg-black opacity-40"></div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">เปลี่ยนบ้านเก่า ให้เป็นบ้านในฝัน</h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-200 drop-shadow-md">แหล่งรวมบ้านมือสองรีโนเวทใหม่ สไตล์โมเดิร์น พร้อมเข้าอยู่ทันที</p>

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-lg shadow-2xl max-w-3xl mx-auto flex flex-col md:flex-row gap-3 text-gray-700" ref={dropdownRef}>
                    <div className="flex-grow relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="ค้นหาทำเล, ชื่อโครงการ..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </div>

                    {/* Province Multi-Select */}
                    <div className="relative md:w-1/4">
                        <button
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-left flex justify-between items-center"
                            onClick={() => toggleDropdown('province')}
                        >
                            <span className="truncate">
                                {selectedProvinces.length === 0 ? 'ทุกจังหวัด' : `เลือก ${selectedProvinces.length} จังหวัด`}
                            </span>
                            <svg className={`w-4 h-4 text-gray-500 transition-transform ${openDropdown === 'province' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        {openDropdown === 'province' && (
                            <div className="absolute top-full left-0 min-w-full w-64 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-20 p-2">
                                <input
                                    type="text"
                                    placeholder="ค้นหาจังหวัด..."
                                    className="w-full px-2 py-1 mb-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                                    value={provinceSearch}
                                    onChange={(e) => setProvinceSearch(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <div className="max-h-60 overflow-y-auto">
                                    {filteredProvinces.map(province => (
                                        <label key={province} className="flex items-center p-2 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                                                checked={selectedProvinces.includes(province)}
                                                onChange={() => onFilterProvince(province)}
                                            />
                                            {province}
                                        </label>
                                    ))}
                                    {filteredProvinces.length === 0 && <div className="text-center text-gray-400 text-sm p-2">ไม่พบข้อมูล</div>}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* District Multi-Select */}
                    <div className="relative md:w-1/4">
                        <button
                            className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-left flex justify-between items-center ${selectedProvinces.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={selectedProvinces.length === 0}
                            onClick={() => toggleDropdown('district')}
                        >
                            <span className="truncate">
                                {selectedDistricts.length === 0 ? 'ทุกอำเภอ' : `เลือก ${selectedDistricts.length} อำเภอ`}
                            </span>
                            <svg className={`w-4 h-4 text-gray-500 transition-transform ${openDropdown === 'district' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        {openDropdown === 'district' && selectedProvinces.length > 0 && (
                            <div className="absolute top-full left-0 min-w-full w-64 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-20 p-2">
                                <input
                                    type="text"
                                    placeholder="ค้นหาอำเภอ..."
                                    className="w-full px-2 py-1 mb-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                                    value={districtSearch}
                                    onChange={(e) => setDistrictSearch(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <div className="max-h-60 overflow-y-auto">
                                    {filteredDistricts.map((district, idx) => (
                                        <label key={`${district.province}-${district.name}-${idx}`} className="flex items-center p-2 hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                                                checked={selectedDistricts.includes(district.name)}
                                                onChange={() => onFilterDistrict(district.name)}
                                            />
                                            <span className="text-sm">{district.name} <span className="text-xs text-gray-400">({district.province})</span></span>
                                        </label>
                                    ))}
                                    {filteredDistricts.length === 0 && <div className="text-center text-gray-400 text-sm p-2">ไม่พบข้อมูล</div>}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Type Multi-Select */}
                    <div className="relative md:w-1/4">
                        <button
                            className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-left flex justify-between items-center`}
                            onClick={() => toggleDropdown('type')}
                        >
                            <span className="truncate">
                                {selectedTypes.length === 0 ? 'ทุกประเภท' : `เลือก ${selectedTypes.length} ประเภท`}
                            </span>
                            <svg className={`w-4 h-4 text-gray-500 transition-transform ${openDropdown === 'type' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        {openDropdown === 'type' && (
                            <div className="absolute top-full left-0 min-w-full w-48 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-20 p-2">
                                {[
                                    { value: 'house', label: 'บ้านเดี่ยว' },
                                    { value: 'townhome', label: 'ทาวน์โฮม' },
                                    { value: 'condo', label: 'คอนโด' }
                                ].map(type => (
                                    <label key={type.value} className="flex items-center p-2 hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                                            checked={selectedTypes.includes(type.value)}
                                            onChange={() => onFilterType(type.value)}
                                        />
                                        {type.label}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md font-bold transition w-full md:w-auto">
                        ค้นหา
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Hero;
