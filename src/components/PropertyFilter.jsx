import React from 'react';

const PropertyFilter = ({ currentCategory, onSetCategory }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0 border-l-4 border-blue-600 pl-3">รายการบ้านล่าสุด</h2>
            <div className="flex space-x-2">
                {['all', 'new', 'hot'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => onSetCategory(cat)}
                        className={`px-4 py-1 rounded-full text-sm transition ${currentCategory === cat
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                    >
                        {cat === 'all' ? 'ทั้งหมด' : cat === 'new' ? 'มาใหม่' : 'ยอดนิยม'}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PropertyFilter;
