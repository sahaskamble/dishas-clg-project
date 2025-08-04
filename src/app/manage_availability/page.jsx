'use client';
import { useState, useEffect, useCallback } from 'react';
import { pb } from '../lib/pocketbase';

export default function ManageAvailability() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [slots, setSlots] = useState([]);
    const [therapistId, setTherapistId] = useState(null);
    const [loading, setLoading] = useState(true);

    const timeSlots = [
        '9:00 AM', '10:00 AM', '11:00 AM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
    ];

    // Fetch therapist ID on mount
    useEffect(() => {
        const fetchTherapist = async () => {
            try {
                const userId = pb.authStore.model?.id;
                if (!userId) {
                    alert("Please log in first");
                    return;
                }
                const profile = await pb.collection('therapist_profile').getFirstListItem(`user="${userId}"`);
                setTherapistId(profile.id);
            } catch (err) {
                console.error("Error fetching therapist:", err);
                alert("Error loading profile");
            }
        };
        fetchTherapist();
    }, []);

    // Fetch slots when date or therapist changes
    const fetchSlots = useCallback(async () => {
        if (!therapistId || !selectedDate) return;

        setLoading(true);
        try {
            const dateStr = selectedDate.toISOString().split('T')[0];
            const records = await pb.collection('available_bookings').getFullList({
                filter: `therapist_id="${therapistId}" && date="${dateStr}"`,
                $autoCancel: false // Important for fresh data
            });
            setSlots(records);
        } catch (err) {
            console.error("Fetch error:", err);
            setSlots([]);
        } finally {
            setLoading(false);
        }
    }, [therapistId, selectedDate]);

    useEffect(() => {
        fetchSlots();
    }, [fetchSlots]);

    const handleDateChange = (e) => {
        setSelectedDate(new Date(e.target.value));
    };

    const handleSlotClick = async (time) => {
        if (!therapistId || loading) return;

        const dateStr = selectedDate.toISOString().split('T')[0];
        const existing = slots.find(s => s.time === time && s.date === dateStr);

        try {
            if (existing) {
                // Delete existing slot
                await pb.collection('available_bookings').delete(existing.id);
                setSlots(prev => prev.filter(s => s.id !== existing.id));
            } else {
                // Create new slot
                const newSlot = {
                    therapist_id: therapistId,
                    date: dateStr,
                    time,
                    status: 'available',
                    datetime: new Date(`${dateStr}T${convertTo24Hour(time)}`).toISOString(),
                    day: selectedDate.toLocaleDateString('en-US', { weekday: 'long' })
                };
                const record = await pb.collection('available_bookings').create(newSlot);
                setSlots(prev => [...prev, record]);
            }
        } catch (err) {
            console.error("Save error:", err);
            alert("Failed to update slot");
        }
    };

    const convertTo24Hour = (timeStr) => {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        if (period === 'PM' && hours !== '12') hours = String(Number(hours) + 12);
        if (period === 'AM' && hours === '12') hours = '00';
        return `${hours}:${minutes}:00`;
    };

    const getSlotStatus = (time) => {
        const slot = slots.find(s => s.time === time);
        return slot?.status || 'none';
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-purple-900 mb-6">Manage Availability</h1>

            <div className="mb-6">
                <label className="block text-gray-700 mb-2">Date:</label>
                <input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={handleDateChange}
                    className="border p-2 rounded"
                />
            </div>

            {loading ? (
                <div>Loading slots...</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {timeSlots.map(time => {
                        const status = getSlotStatus(time);
                        return (
                            <button
                                key={time}
                                onClick={() => handleSlotClick(time)}
                                className={`p-3 rounded-lg text-sm font-medium ${status === 'booked' ? 'bg-blue-200 text-blue-800 cursor-not-allowed' :
                                        status === 'available' ? 'bg-green-400 text-white hover:bg-green-500' :
                                            status === 'unavailable' ? 'bg-gray-400 text-white' :
                                                'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                disabled={status === 'booked'}
                            >
                                {time}
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="flex gap-4 text-sm">
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-400 mr-2 rounded"></div>
                    <span>Available</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-400 mr-2 rounded"></div>
                    <span>Unavailable</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-200 mr-2 rounded border"></div>
                    <span>Not Set</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-200 mr-2 rounded"></div>
                    <span>Booked</span>
                </div>
            </div>
        </div>
    );
}