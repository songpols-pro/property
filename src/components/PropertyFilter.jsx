import React from 'react';

const PropertyFilter = ({ currentCategory, onSetCategory, sortBy, onSortChange }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-blue-600 pl-3">รายการบ้านล่าสุด</h2>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* Category Buttons */}
                <div className="flex space-x-2">
                    {['all', 'new', 'hot'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => onSetCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-sm transition font-medium ${currentCategory === cat
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {cat === 'all' ? 'ทั้งหมด' : cat === 'new' ? 'มาใหม่' : 'ยอดนิยม'}
                        </button>
                    ))}
                </div>

                {/* Sort Dropdown */}
                <div className="relative group">
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="appearance-none bg-white border border-gray-200 text-gray-700 py-1.5 pl-4 pr-8 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium shadow-sm hover:border-blue-300 transition"
                    >
                        <option value="date-desc">ล่าสุด (ใหม่ - เก่า)</option>
                        <option value="date-asc">วันที่ (เก่า - ใหม่)</option>
                        <option value="price-asc">ราคา (ต่ำ - สูง)</option>
                        <option value="price-desc">ราคา (สูง - ต่ำ)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyFilter;
