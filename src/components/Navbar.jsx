import React from 'react';
import { PaintRoller } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <PaintRoller className="text-blue-600 w-8 h-8 mr-2" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 leading-none">
                                Reno<span className="text-blue-600">Home</span>
                            </h1>
                            <p className="text-xs text-gray-500">บ้านรีโนเวทพร้อมอยู่</p>
                        </div>
                    </div>
                    <div className="hidden md:flex space-x-8 items-center">
                        <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition">หน้าแรก</a>
                        <a href="#listings" className="text-gray-600 hover:text-blue-600 font-medium transition">ค้นหาบ้าน</a>
                        <a href="#about" className="text-gray-600 hover:text-blue-600 font-medium transition">เกี่ยวกับเรา</a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
