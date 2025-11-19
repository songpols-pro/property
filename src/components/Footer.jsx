import React from 'react';
import { Phone, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h4 className="text-xl font-bold mb-4">Reno<span className="text-blue-400">Home</span></h4>
                        <p className="text-gray-400 text-sm">ผู้นำด้านตลาดซื้อขายบ้านรีโนเวทมือสอง คุณภาพเยี่ยม ราคาสมเหตุสมผล</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">เมนูลัด</h4>
                        <ul className="text-gray-400 text-sm space-y-2">
                            <li><a href="#" className="hover:text-white">หน้าแรก</a></li>
                            <li><a href="#" className="hover:text-white">ค้นหาบ้าน</a></li>
                            <li><a href="#" className="hover:text-white">บทความรีโนเวท</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">ติดต่อเรา</h4>
                        <ul className="text-gray-400 text-sm space-y-2">
                            <li className="flex items-center"><Phone className="w-4 h-4 mr-2" /> 02-123-4567</li>
                            <li className="flex items-center"><span className="font-bold mr-2">LINE</span> @renohome</li>
                            <li className="flex items-center"><Mail className="w-4 h-4 mr-2" /> contact@renohome.th</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">ติดตามข่าวสาร</h4>
                        <div className="flex gap-2">
                            <input type="email" placeholder="อีเมลของคุณ" className="bg-gray-800 border-none rounded px-3 py-2 text-sm w-full focus:ring-1 focus:ring-blue-500" />
                            <button className="bg-blue-600 px-3 py-2 rounded text-sm hover:bg-blue-700">ส่ง</button>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
                    &copy; 2024 RenoHome Thailand. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
