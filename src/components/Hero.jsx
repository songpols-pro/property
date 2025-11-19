import React from 'react';
import { MapPin } from 'lucide-react';

const Hero = ({ onSearch, onFilterType }) => {
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
                <div className="bg-white p-4 rounded-lg shadow-2xl max-w-3xl mx-auto flex flex-col md:flex-row gap-3 text-gray-700">
                    <div className="flex-grow relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="ค้นหาทำเล, ชื่อโครงการ..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="md:w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        onChange={(e) => onFilterType(e.target.value)}
                    >
                        <option value="all">ทุกประเภท</option>
                        <option value="house">บ้านเดี่ยว</option>
                        <option value="townhome">ทาวน์โฮม</option>
                        <option value="condo">คอนโด</option>
                    </select>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md font-bold transition w-full md:w-auto">
                        ค้นหา
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Hero;
