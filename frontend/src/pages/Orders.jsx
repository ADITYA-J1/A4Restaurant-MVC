import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user'));
                if (!userData) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`http://localhost:8080/api/orders/user/${userData.id}`);
                setOrders(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch orders');
                setLoading(false);
                console.error('Error fetching orders:', err);
            }
        };

        fetchOrders();
    }, [navigate]);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-orange-500">Your Orders</h1>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-gray-100 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Head over to our menu to place your first order!
                        </p>
                        <button
                            onClick={() => navigate('/menu')}
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
                        >
                            View Menu
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white overflow-hidden shadow rounded-lg"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            Order #{order.id}
                                        </h3>
                                        <span className={`px-2 py-1 text-sm rounded-full ${
                                            order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                            order.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Ordered on {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className="mt-2 text-lg font-semibold text-gray-900">
                                        ₹{order.totalAmount.toFixed(2)}
                                    </p>
                                    <div className="mt-4">
                                        <button
                                            onClick={() => navigate(`/orders/${order.id}`)}
                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 