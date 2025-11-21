import React, { useState, useEffect } from 'react';
import { X, Save, Phone, MessageCircle } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ContactSettingsModal = ({ onClose, showToast }) => {
    const [phone, setPhone] = useState('');
    const [lineId, setLineId] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "settings", "contact");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setPhone(data.phone || '');
                    setLineId(data.lineId || '');
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
                showToast("ไม่สามารถโหลดข้อมูลการติดต่อได้", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [showToast]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await setDoc(doc(db, "settings", "contact"), {
                phone,
                lineId
            });
            showToast("บันทึกข้อมูลการติดต่อเรียบร้อยแล้ว");
            onClose();
        } catch (error) {
            console.error("Error saving settings:", error);
            showToast("เกิดข้อผิดพลาดในการบันทึก", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full shadow-2xl animate-slide-in">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">ตั้งค่าข้อมูลการติดต่อ</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Phone className="w-4 h-4 inline-block mr-1" /> เบอร์โทรศัพท์
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="เช่น 081-234-5678"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MessageCircle className="w-4 h-4 inline-block mr-1" /> Line ID / Link
                        </label>
                        <input
                            type="text"
                            value={lineId}
                            onChange={(e) => setLineId(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="เช่น @yourid หรือ https://line.me/..."
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">ใส่เป็น ID (มี @ ด้วยถ้าเป็น Official) หรือลิงก์เต็มก็ได้</p>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition shadow-md flex justify-center items-center disabled:opacity-50"
                        >
                            {saving ? 'กำลังบันทึก...' : (
                                <>
                                    <Save className="w-5 h-5 mr-2" /> บันทึกข้อมูล
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactSettingsModal;
