import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import BillingAndOrderStatus from '../components/BillingAndOrderStatus';

export default function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user'));
                if (!userData) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`http://localhost:8080/api/orders/${id}`);
                setOrder(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch order details');
                setLoading(false);
                console.error('Error fetching order details:', err);
            }
        };

        fetchOrderDetails();
    }, [id, navigate]);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    if (!order) return <div className="flex justify-center items-center h-screen">Order not found</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-orange-500">Order Details</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/orders')}
                                className="bg-gray-100 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200"
                            >
                                Back to Orders
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-gray-100 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200"
                            >
                                Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Order #{order.id}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Placed on {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Status</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <span className={`px-2 py-1 text-sm rounded-full ${
                                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                        order.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {order.status}
                                    </span>
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    ₹{order.totalAmount.toFixed(2)}
                                </dd>
                            </div>
                            {order.specialInstructions && (
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Special Instructions</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {order.specialInstructions}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    <div className="px-4 py-5 sm:px-6">
                        <h4 className="text-lg font-medium text-gray-900">Order Items</h4>
                        <div className="mt-4">
                            <div className="flow-root">
                                <ul className="-my-6 divide-y divide-gray-200">
                                    {order.items.map((item) => (
                                        <li key={item.id} className="py-6">
                                            <div className="flex items-center">
                                                {item.menuItem.imageUrl && (
                                                    <img
                                                        src={item.menuItem.imageUrl}
                                                        alt={item.menuItem.name}
                                                        className="h-16 w-16 object-cover rounded"
                                                    />
                                                )}
                                                <div className="ml-4 flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h5 className="text-base font-medium text-gray-900">
                                                            {item.menuItem.name}
                                                        </h5>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            ₹{item.menuItem.price.toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Quantity: {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {order && (
                  <div className="mt-8">
                    <BillingAndOrderStatus order={order} onOrderSubmit={() => {}} />
                  </div>
                )}
            </div>
        </div>
    );
} 