import React, { useState } from 'react';
import { lookupCustomerByPhone, Customer } from '../../../../services/mockCustomerService';

const Step1Info: React.FC = () => {
    const [phone, setPhone] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [address, setAddress] = useState('');
    const [membershipType, setMembershipType] = useState<'Энгийн' | 'VIP' | 'Байгууллага'>('Энгийн');
    const [isMember, setIsMember] = useState(false);

    // Auto-fill current date
    const currentDate = new Date().toLocaleDateString('en-CA').replace(/-/g, '.');

    const handlePhoneLookup = () => {
        const customer = lookupCustomerByPhone(phone);

        if (customer) {
            // Member found - auto-populate and set readonly
            setCustomerName(customer.name);
            setAddress(customer.address);
            setMembershipType(customer.membershipType);
            setIsMember(true);
        } else {
            // Non-member - clear fields and allow input
            setCustomerName('');
            setAddress('');
            setMembershipType('Энгийн');
            setIsMember(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto w-full h-full flex flex-col p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Left: Input Form */}
                <section className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col">
                    <div className="border-b border-gray-100 dark:border-gray-700 pb-4 mb-6">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
                            Захиалагчийн мэдээлэл
                        </h2>
                    </div>
                    <div className="space-y-5 flex-1">
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
                                Утасны дугаар <span className="text-red-500">*</span>
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="material-icons-round text-gray-400 text-xl">phone</span>
                                </div>
                                <input
                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 pl-10 focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm py-3"
                                    placeholder="9999-9999"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    onBlur={handlePhoneLookup}
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
                                Хэрэглэгчийн нэр {!isMember && <span className="text-red-500">*</span>}
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="material-icons-round text-gray-400 text-xl">person</span>
                                </div>
                                <input
                                    className={`block w-full rounded-lg border-gray-300 dark:border-gray-600 pl-10 focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm py-3 ${isMember ? 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed' : ''}`}
                                    placeholder="Нэр оруулах"
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    readOnly={isMember}
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
                                Хаяг
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="material-icons-round text-gray-400 text-xl">location_on</span>
                                </div>
                                <input
                                    className={`block w-full rounded-lg border-gray-300 dark:border-gray-600 pl-10 focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm py-3 ${isMember ? 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed' : ''}`}
                                    placeholder="Дүүрэг, хороо..."
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    readOnly={isMember}
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
                                Гишүүнчлэлийн төрөл
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="material-icons-round text-gray-400 text-xl">card_membership</span>
                                </div>
                                <select
                                    className={`block w-full rounded-lg border-gray-300 dark:border-gray-600 pl-10 focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm py-3 appearance-none ${isMember ? 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed' : ''}`}
                                    value={membershipType}
                                    onChange={(e) => setMembershipType(e.target.value as 'Энгийн' | 'VIP' | 'Байгууллага')}
                                    disabled={isMember}
                                >
                                    <option>Энгийн</option>
                                    <option>VIP</option>
                                    <option>Байгууллага</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <span className="material-icons-round text-gray-400">expand_more</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right: Receipt Info */}
                <section className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col relative">
                    <div className="border-b border-gray-100 dark:border-gray-700 pb-4 mb-6">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white uppercase tracking-wide flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                            Хүлээн авагчийн мэдээлэл
                        </h2>
                    </div>
                    <div className="space-y-5 flex-1">
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
                                Хүлээн авсан огноо <span className="text-red-500">*</span>
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="material-icons-round text-gray-400 text-xl">event</span>
                                </div>
                                <input
                                    className="bg-gray-50 dark:bg-gray-800 block w-full rounded-lg border-gray-300 dark:border-gray-600 pl-10 text-gray-500 dark:text-gray-400 sm:text-sm py-3 cursor-not-allowed"
                                    readOnly
                                    value={currentDate}
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
                                Хүлээн авсан ажилтан <span className="text-red-500">*</span>
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="material-icons-round text-gray-400 text-xl">badge</span>
                                </div>
                                <input
                                    className="bg-gray-50 dark:bg-gray-800 block w-full rounded-lg border-gray-300 dark:border-gray-600 pl-10 text-gray-500 dark:text-gray-400 sm:text-sm py-3 cursor-not-allowed"
                                    readOnly
                                    value="Админ"
                                    type="text"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Step1Info;
