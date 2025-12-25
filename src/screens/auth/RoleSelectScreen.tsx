import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from '../../shared/components/Popup/Popup';
import PosDropdown from '../../shared/components/PosDropdown';

interface RoleSelectScreenProps {
    userName: string;
    selectedBranch: string;
    onBranchChange: (branch: string) => void;
    onLogout: () => void;
}

const RoleSelectScreen: React.FC<RoleSelectScreenProps> = ({ userName, selectedBranch, onBranchChange, onLogout }) => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [selectedSystem, setSelectedSystem] = useState<'POS' | 'ERP' | 'RMS' | null>(null);

    const isAdmin = userName === 'Админ';

    const branchOptions = [
        { label: 'Төв салбар', value: 'Төв салбар' },
        { label: 'Салбар 1', value: 'Салбар 1' },
        { label: 'Салбар 2', value: 'Салбар 2' },
    ];

    const handleSystemClick = (system: 'POS' | 'ERP' | 'RMS') => {
        if (system === 'POS') {
            setSelectedSystem('POS');
        } else {
            setSelectedSystem(system);
            setShowPopup(true);
        }
    };

    const handleEnter = () => {
        if (selectedSystem === 'POS') {
            navigate('/pos/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start pt-32 p-6 bg-[#F8FAFB] transition-colors duration-300 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none"></div>

            <header className="absolute top-0 left-0 right-0 h-16 bg-primary flex items-center justify-between px-6 shadow-md z-10">
                <div className="flex items-center gap-3">
                    <h1 className="text-white font-futuris text-2xl tracking-tighter uppercase">SHOES LOVE</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-white bg-white/10 px-5 py-2 rounded-2xl border border-white/5 shadow-inner">
                        <span className="font-artsans text-sm uppercase tracking-wider">{userName}</span>
                        <span className="material-icons-round text-lg">account_circle</span>
                    </div>
                    <button
                        onClick={onLogout}
                        className="p-2.5 rounded-2xl bg-white/10 hover:bg-red-500/80 text-white transition-all border border-white/10 active:scale-90"
                    >
                        <span className="material-icons-round">logout</span>
                    </button>
                </div>
            </header>

            <div className="z-10 w-full max-w-6xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <h2 className="text-4xl font-futuris text-center mb-12 text-gray-800 uppercase tracking-widest">Систем сонгох</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* POS Card - Cyan Color */}
                    <button
                        onClick={() => handleSystemClick('POS')}
                        className={`group relative flex flex-col items-center justify-center bg-white h-[380px] rounded-[48px] border-[3px] transition-all duration-500 ease-out hover:-translate-y-4 outline-none
                            ${selectedSystem === 'POS'
                                ? 'border-[#40C1C7] shadow-[0_40px_80px_rgba(64,193,199,0.25)] ring-8 ring-[#40C1C7]/5'
                                : 'border-transparent hover:border-[#40C1C7]/30 shadow-[0_20px_50px_rgba(0,0,0,0.05)]'}
                        `}
                    >
                        <div className="flex-1 flex items-center justify-center w-full">
                            <div className={`w-32 h-32 rounded-[32px] flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500
                                ${selectedSystem === 'POS' ? 'bg-[#40C1C7] text-white shadow-lg' : 'bg-[#40C1C7]/10 text-[#40C1C7]'}
                            `}>
                                <span className="material-icons-round text-[80px]">point_of_sale</span>
                            </div>
                        </div>
                        <div className="h-28 w-full flex items-start justify-center">
                            <span className={`text-4xl font-futuris tracking-tight uppercase transition-colors duration-300 ${selectedSystem === 'POS' ? 'text-[#40C1C7]' : 'text-gray-400 group-hover:text-[#40C1C7]'}`}>ПОС</span>
                        </div>
                        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-2.5 transition-all duration-300 ${selectedSystem === 'POS' ? 'bg-[#40C1C7] w-32' : 'bg-gray-100'} rounded-t-full`}></div>
                    </button>

                    {/* ERP Card - Blue Color (Changed) */}
                    <button
                        onClick={() => handleSystemClick('ERP')}
                        className="group relative flex flex-col items-center justify-center bg-white h-[380px] rounded-[48px] border-[3px] border-transparent hover:border-[#3B82F6]/30 transition-all duration-500 ease-out hover:-translate-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.05)] outline-none"
                    >
                        <div className="flex-1 flex items-center justify-center w-full">
                            <div className="w-32 h-32 rounded-[32px] bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] transform group-hover:scale-110 transition-transform duration-500">
                                <span className="material-icons-round text-[80px]">desktop_windows</span>
                            </div>
                        </div>
                        <div className="h-28 w-full flex items-start justify-center">
                            <span className="text-4xl font-futuris text-gray-400 group-hover:text-[#3B82F6] tracking-tight uppercase">ERP</span>
                        </div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-2.5 bg-gray-100 group-hover:bg-[#3B82F6] group-hover:w-32 transition-all duration-300 rounded-t-full"></div>
                    </button>

                    {/* RMS Card - Green Color (Changed) */}
                    <button
                        onClick={() => handleSystemClick('RMS')}
                        className="group relative flex flex-col items-center justify-center bg-white h-[380px] rounded-[48px] border-[3px] border-transparent hover:border-[#10B981]/30 transition-all duration-500 ease-out hover:-translate-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.05)] outline-none"
                    >
                        <div className="flex-1 flex items-center justify-center w-full">
                            <div className="w-32 h-32 rounded-[32px] bg-[#10B981]/10 flex items-center justify-center text-[#10B981] transform group-hover:scale-110 transition-transform duration-500">
                                <span className="material-icons-round text-[80px]">inventory_2</span>
                            </div>
                        </div>
                        <div className="h-28 w-full flex items-start justify-center">
                            <span className="text-4xl font-futuris text-gray-400 group-hover:text-[#10B981] tracking-tight uppercase">RMS</span>
                        </div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-2.5 bg-gray-100 group-hover:bg-[#10B981] group-hover:w-32 transition-all duration-300 rounded-t-full"></div>
                    </button>
                </div>

                {/* Branch Selection & Enter Button (Admin Only, for POS) */}
                {selectedSystem === 'POS' && (
                    <div className="mt-16 flex flex-col items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        {isAdmin && (
                            <div className="w-full max-w-sm">
                                <PosDropdown
                                    label="Орох салбар сонгох"
                                    icon="storefront"
                                    options={branchOptions}
                                    value={selectedBranch}
                                    onChange={onBranchChange}
                                    className="bg-white/50 backdrop-blur-sm p-2 rounded-2xl"
                                />
                            </div>
                        )}
                        <button
                            onClick={handleEnter}
                            className="group flex items-center gap-4 bg-primary text-white px-12 h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            <span className="text-sm">Нэвтрэх</span>
                            <span className="material-icons-round transition-transform group-hover:translate-x-1">arrow_forward</span>
                        </button>
                    </div>
                )}
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
