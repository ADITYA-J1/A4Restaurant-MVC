import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function BookTable() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        guests: 1,
        specialRequests: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await axios.post('http://localhost:8080/api/reservations', {
                userId: user.id,
                ...formData
            });

            if (response.data) {
                alert('Table booked successfully!');
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to book table');
            console.error('Error booking table:', err);
        } finally {
            setLoading(false);
        }
    };

    // Get today's date in YYYY-MM-DD format for min date
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-orange-500">Book a Table</h1>
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

            <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                Date
                            </label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                min={today}
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                                Time
                            </label>
                            <select
                                id="time"
                                name="time"
                                required
                                value={formData.time}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            >
                                <option value="">Select a time</option>
                                <option value="11:00">11:00 AM</option>
                                <option value="12:00">12:00 PM</option>
                                <option value="13:00">1:00 PM</option>
                                <option value="14:00">2:00 PM</option>
                                <option value="15:00">3:00 PM</option>
                                <option value="18:00">6:00 PM</option>
                                <option value="19:00">7:00 PM</option>
                                <option value="20:00">8:00 PM</option>
                                <option value="21:00">9:00 PM</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
                                Number of Guests
                            </label>
                            <input
                                type="number"
                                id="guests"
                                name="guests"
                                min="1"
                                max="10"
                                required
                                value={formData.guests}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700">
                                Special Requests
                            </label>
                            <textarea
                                id="specialRequests"
                                name="specialRequests"
                                rows="3"
                                value={formData.specialRequests}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                placeholder="Any special requests or dietary requirements?"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Booking...' : 'Book Table'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
} 