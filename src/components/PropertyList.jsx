import React from 'react';
import PropertyCard from './PropertyCard';
import { Search } from 'lucide-react';

const PropertyList = ({ properties, onPropertyClick, onReset }) => {
    if (properties.length === 0) {
        return (
            <div className="text-center py-20">
                <Search className="mx-auto text-gray-300 w-16 h-16 mb-4" />
                <h3 className="text-xl text-gray-500">ไม่พบข้อมูลบ้านที่คุณค้นหา</h3>
                <button onClick={onReset} className="mt-4 text-blue-600 hover:underline">ล้างคำค้นหา</button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map(prop => (
                <PropertyCard key={prop.id} property={prop} onClick={onPropertyClick} />
            ))}
        </div>
    );
};

export default PropertyList;
