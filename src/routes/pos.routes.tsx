import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardScreen from '../screens/pos/dashboard/PosDashboardScreen';
import OrderListScreen from '../screens/pos/order/OrderListScreen';
import OrderFlowScreen from '../screens/pos/order/OrderFlowScreen';

// Placeholder for screens moving to new structure
const PlaceholderScreen: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex h-full items-center justify-center">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-300">{title}</h2>
            <p className="text-gray-400">Development in progress...</p>
        </div>
    </div>
);

const PosRoutes: React.FC = () => {
    return (
        <Routes>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<DashboardScreen />} />

            {/* Orders */}
            <Route path="orders">
                <Route index element={<OrderListScreen />} />
                <Route path="new/step/:step" element={<OrderFlowScreen />} />
                <Route path=":id/edit/step/:step" element={<OrderFlowScreen />} />
            </Route>

            {/* Placeholders for other features as per rule.md */}
            <Route path="receive/*" element={<PlaceholderScreen title="Receive" />} />
            <Route path="returns/*" element={<PlaceholderScreen title="Returns" />} />
            <Route path="shipments/*" element={<PlaceholderScreen title="Shipments" />} />
            <Route path="cards/*" element={<PlaceholderScreen title="Cards" />} />
            <Route path="closing/*" element={<PlaceholderScreen title="Daily Closing" />} />

            <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
    );
};

export default PosRoutes;
