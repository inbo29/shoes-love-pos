import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardScreen from '../screens/pos/dashboard/PosDashboardScreen';
import OrderListScreen from '../screens/pos/order/OrderListScreen';
import OrderFlowScreen from '../screens/pos/order/OrderFlowScreen';
import DayManagementScreen from '../screens/pos/management/DayManagementScreen';
import CashSubmissionScreen from '../screens/pos/finance/CashSubmissionScreen';
import CashReportScreen from '../screens/pos/finance/CashReportScreen';
import CardManagementScreen from '../screens/pos/cards/CardManagementScreen';
import ReceiveListScreen from '../screens/pos/receive/ReceiveListScreen';
import ReceiveDetailScreen from '../screens/pos/receive/ReceiveDetailScreen';


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

            {/* Management & Finance */}
            <Route path="management">
                <Route path="day" element={<DayManagementScreen />} />
            </Route>

            <Route path="cash-submit" element={<CashSubmissionScreen />} />
            <Route path="cash-report" element={<CashReportScreen />} />

            {/* Placeholders for other features as per rule.md */}
            {/* 수령 (Handover) */}
            <Route path="receive">
                <Route index element={<ReceiveListScreen />} />
                <Route path=":id/step/:step" element={<ReceiveDetailScreen />} />
                {/* Fallback to step 1 */}
                <Route path=":id" element={<Navigate to="step/1" replace />} />
            </Route>

            <Route path="returns/*" element={<PlaceholderScreen title="Returns" />} />
            <Route path="shipments/*" element={<PlaceholderScreen title="Shipments" />} />
            <Route path="cards/*" element={<CardManagementScreen />} />
            <Route path="cash-report/*" element={<PlaceholderScreen title="Cash Report" />} />

            <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
    );
};

export default PosRoutes;
