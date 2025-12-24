import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from '../../shared/components/Popup/Popup';

interface RoleSelectScreenProps {
    onLogout: () => void;
}

const RoleSelectScreen: React.FC<RoleSelectScreenProps> = ({ onLogout }) => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F8FAFB] transition-colors duration-300 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none"></div>

            <header className="absolute top-0 left-0 right-0 h-16 bg-primary flex items-center justify-between px-6 shadow-md z-10">
                <div className="flex items-center gap-3">
                    <h1 className="text-white font-futuris text-2xl tracking-tighter uppercase">SHOES LOVE</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-white bg-white/10 px-5 py-2 rounded-2xl border border-white/5 shadow-inner">
                        <span className="font-artsans text-sm uppercase tracking-wider">Админ</span>
                        <span className="material-icons-round">account_circle</span>
                    </div>
                    <button
                        onClick={onLogout}
                        className="p-2.5 rounded-2xl bg-white/10 hover:bg-red-500/80 text-white transition-all border border-white/10 active:scale-90"
                    >
                        <span className="material-icons-round">logout</span>
                    </button>
                </div>
            </header>

            <div className="z-10 w-full max-w-6xl px-4">
                <h2 className="text-4xl font-futuris text-center mb-20 text-gray-800 uppercase tracking-widest">Систем сонгох</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* POS Card - Cyan Color */}
                    <button
                        onClick={() => navigate('/pos/dashboard')}
                        className="group relative flex flex-col items-center justify-center bg-white h-[380px] rounded-[48px] border-[3px] border-[#40C1C7] transition-all duration-500 ease-out hover:-translate-y-4 shadow-[0_20px_50px_rgba(64,193,199,0.15)] hover:shadow-[0_40px_80px_rgba(64,193,199,0.25)] outline-none"
                    >
                        <div className="flex-1 flex items-center justify-center w-full">
                            <div className="w-32 h-32 rounded-[32px] bg-[#40C1C7]/10 flex items-center justify-center text-[#40C1C7] transform group-hover:scale-110 transition-transform duration-500">
                                <span className="material-icons-round text-[80px]">point_of_sale</span>
                            </div>
                        </div>
                        <div className="h-28 w-full flex items-start justify-center">
                            <span className="text-4xl font-futuris text-[#40C1C7] tracking-tight uppercase">ПОС</span>
                        </div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-2.5 bg-[#40C1C7] rounded-t-full"></div>
                    </button>

                    {/* ERP Card - Yellow Color */}
                    <button
                        onClick={() => setShowPopup(true)}
                        className="group relative flex flex-col items-center justify-center bg-white h-[380px] rounded-[48px] border-[3px] border-[#FFD400] transition-all duration-500 ease-out hover:-translate-y-4 shadow-[0_20px_50px_rgba(255,212,0,0.15)] hover:shadow-[0_40px_80px_rgba(255,212,0,0.25)] outline-none"
                    >
                        <div className="flex-1 flex items-center justify-center w-full">
                            <div className="w-32 h-32 rounded-[32px] bg-[#FFD400]/10 flex items-center justify-center text-[#FFD400] transform group-hover:scale-110 transition-transform duration-500">
                                <span className="material-icons-round text-[80px]">desktop_windows</span>
                            </div>
                        </div>
                        <div className="h-28 w-full flex items-start justify-center">
                            <span className="text-4xl font-futuris text-[#FFD400] tracking-tight uppercase">ERP</span>
                        </div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-2.5 bg-[#FFD400] rounded-t-full"></div>
                    </button>

                    {/* RMS Card - Blue Color */}
                    <button
                        onClick={() => setShowPopup(true)}
                        className="group relative flex flex-col items-center justify-center bg-white h-[380px] rounded-[48px] border-[3px] border-[#3B82F6] transition-all duration-500 ease-out hover:-translate-y-4 shadow-[0_20px_50px_rgba(59,130,246,0.15)] hover:shadow-[0_40px_80px_rgba(59,130,246,0.25)] outline-none"
                    >
                        <div className="flex-1 flex items-center justify-center w-full">
                            <div className="w-32 h-32 rounded-[32px] bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] transform group-hover:scale-110 transition-transform duration-500">
                                <span className="material-icons-round text-[80px]">inventory_2</span>
                            </div>
                        </div>
                        <div className="h-28 w-full flex items-start justify-center">
                            <span className="text-4xl font-futuris text-[#3B82F6] tracking-tight uppercase">RMS</span>
                        </div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-2.5 bg-[#3B82F6] rounded-t-full"></div>
                    </button>
                </div>
            </div>

            <div className="absolute bottom-8 text-gray-400 text-sm font-andale tracking-widest">
                © 2025 SHOES LOVE SYSTEMS
            </div>

            <Popup
                isOpen={showPopup}
                type="info"
                title="Мэдэгдэл"
                message="Систем бэлтгэгдэж байна"
                onClose={() => setShowPopup(false)}
            />
        </div>
    );
};

export default RoleSelectScreen;
