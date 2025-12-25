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
import ReceiveFlowScreen from '../screens/pos/flow/ReceiveFlowScreen';
import ShipmentListScreen from '../screens/pos/shipment/ShipmentListScreen';
import ShipmentDispatchScreen from '../screens/pos/shipment/ShipmentDispatchScreen';
import ShipmentReceiveScreen from '../screens/pos/shipment/ShipmentReceiveScreen';
import ReturnListScreen from '../screens/pos/return/ReturnListScreen';
import ReturnFlowScreen from '../screens/pos/return/ReturnFlowScreen';
import ReturnIssueFlowScreen from '../screens/pos/return/ReturnIssueFlowScreen';
// Products module imports
import ProductSellScreen from '../screens/pos/products/sell/ProductSellScreen';
import ProductOrderScreen from '../screens/pos/products/order/ProductOrderScreen';
import InventoryListScreen from '../screens/pos/products/inventory/InventoryListScreen';
import TransferListScreen from '../screens/pos/products/transfer/TransferListScreen';
import ProductReturnScreen from '../screens/pos/products/return/ProductReturnScreen';
import ProductSellFlowScreen from '../screens/pos/products/sell/ProductSellFlowScreen';


// Placeholder for screens moving to new structure
const PlaceholderScreen: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex h-full items-center justify-center">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-300">{title}</h2>
            <p className="text-gray-400">Development in progress...</p>
        </div>
    </div>
);

const PosRoutes: React.FC<{ userName: string; selectedBranch: string }> = ({ userName, selectedBranch }) => {
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
            <Route path="cash-report" element={<CashReportScreen userName={userName} initialBranch={selectedBranch} />} />

            {/* 수령 (Handover) */}
            <Route path="receive">
                <Route index element={<ReceiveListScreen />} />
                <Route path=":id/step/:step" element={<ReceiveFlowScreen />} />
                <Route path=":id" element={<Navigate to="step/1" replace />} />
            </Route>

            {/* Returns */}
            <Route path="returns">
                <Route index element={<ReturnListScreen />} />
                <Route path="new/step/:step" element={<ReturnFlowScreen />} />
                <Route path="issue/step/:step" element={<ReturnIssueFlowScreen />} />
                <Route path=":id" element={<PlaceholderScreen title="Return Details" />} />
            </Route>

            {/* Shipments */}
            <Route path="shipments">
                <Route index element={<ShipmentListScreen />} />
                <Route path="new" element={<ShipmentDispatchScreen />} />
                <Route path="receive" element={<ShipmentReceiveScreen />} />
            </Route>

            <Route path="cards/*" element={<CardManagementScreen />} />

            {/* Products Module - Individual Routes */}
            <Route path="sell">
                <Route index element={<Navigate to="step/1" replace />} />
                <Route path="step/:step" element={<ProductSellFlowScreen />} />
            </Route>
            <Route path="order" element={<ProductOrderScreen />} />
            <Route path="inventory" element={<InventoryListScreen />} />
            <Route path="transfer" element={<TransferListScreen />} />
            <Route path="product-return" element={<ProductReturnScreen />} />

            <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
    );
};

export default PosRoutes;
