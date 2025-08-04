'use client';
import { useState, useEffect } from 'react';
import { pb } from '../lib/pocketbase';

export default function Calendar({ onSelectSlot, therapistId }) {
    const [dateNow, setDateNow] = useState(new Date());
    const [selectedDayIndex, setSelectedDayIndex] = useState(1); // Default to middle day (index 1)
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);

    // Fetch available slots from the database
    useEffect(() => {
        setIsClient(true);

        async function fetchAvailableSlots() {
            // Only proceed if pb is available (client-side)
            if (!pb) {
                setLoading(false);
                return;
            }

            if (!therapistId) {
                console.log("No therapistId provided to Calendar component");
                setLoading(false);
                return;
            }

            try {
                console.log("Fetching available slots for therapist:", therapistId);

                // Filter for available slots for this therapist
                let filter = `therapist_id="${therapistId}" && status="available"`;
                console.log("Using filter:", filter);

                const records = await pb.collection('booking_slot').getList(1, 100, {
                    filter: filter,
                    sort: '+date,+time',
                });

                console.log("Fetched available slots:", records.items);
                setAvailableSlots(records.items);
            } catch (error) {
                console.error('Error fetching available slots:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchAvailableSlots();
    }, [therapistId]);

    const changeDate = (dateNow) => {
        const dateTom = new Date(dateNow);
        dateTom.setDate(dateTom.getDate() + 1);
        setDateNow(dateTom);
        setSelectedDayIndex(1); // Reset to middle day when changing dates
    }

    // Generate the 3 days
    const days = [0, 1, 2].map((offset) => {
        const day = new Date(dateNow);
        day.setDate(day.getDate() + offset - 1); // Adjust to make the middle day the current date
        return {
            index: offset,
            date: day,
            dayName: day.toLocaleDateString('en-US', { weekday: 'long' }),
            dayMonth: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        };
    });

    // Get the selected day
    const selectedDay = days.find(day => day.index === selectedDayIndex);

    // Handle slot selection
    const handleSlotSelect = (time, isAvailable) => {
        if (!isAvailable) return;

        const slot = {
            day: selectedDay,
            time: time
        };

        setSelectedSlot(slot);

        // If parent component provided a callback, call it
        if (onSelectSlot) {
            onSelectSlot(slot);
        }
    };

    return (
        <div className="calendar-container p-4 bg-white rounded-lg shadow-md">
            <div className="calendar-header flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-purple-900">
                    {dateNow.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => {
                            const prevDate = new Date(dateNow);
                            prevDate.setDate(prevDate.getDate() - 1);
                            setDateNow(prevDate);
                            setSelectedDayIndex(1); // Reset to middle day
                        }}
                        className="p-2 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => changeDate(dateNow)}
                        className="p-2 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Day buttons at the top */}
            <div className="day-buttons flex space-x-2 mb-4">
                {days.map((day) => (
                    <button
                        key={day.index}
                        onClick={() => setSelectedDayIndex(day.index)}
                        className={`flex-1 p-3 rounded-lg transition-all duration-200 ${selectedDayIndex === day.index
                                ? "bg-purple-600 text-white shadow-md"
                                : "bg-purple-100 text-purple-900 hover:bg-purple-200"
                            }`}
                    >
                        <div className="font-bold">{day.dayName}</div>
                        <div>{day.dayMonth}</div>
                    </button>
                ))}
            </div>

            {/* Time slots card for the selected day */}
            {selectedDay && (
                <div className="time-slots-card border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">
                        Available Times for {selectedDay.dayName}, {selectedDay.dayMonth}
                    </h3>

                    {/* Morning slots */}
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Morning</h4>
                        <div className="flex overflow-x-auto pb-2 space-x-3">
                            {['9:00 AM', '10:00 AM', '11:00 AM'].map((time, index) => {
                                // Check if this slot is available in the database
                                const dateStr = selectedDay.date.toISOString().split('T')[0];

                                // If we have slots from the database, use them
                                let isAvailable = false;

                                if (availableSlots.length > 0) {
                                    // Use database slots
                                    isAvailable = availableSlots.some(slot =>
                                        slot.date === dateStr &&
                                        slot.time === time &&
                                        slot.status === 'available'
                                    );
                                } else {
                                    // Fallback to mock data if no slots in database
                                    isAvailable = (selectedDay.date.getDate() + index) % 3 !== 0;
                                }

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleSlotSelect(time, isAvailable)}
                                        className={`flex-shrink-0 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${selectedSlot && selectedSlot.time === time && selectedSlot.day.index === selectedDay.index
                                                ? "bg-green-500 text-white hover:bg-green-600 hover:shadow-md transform hover:-translate-y-1"
                                                : isAvailable
                                                    ? "bg-yellow-400 text-purple-900 hover:bg-yellow-500 hover:shadow-md transform hover:-translate-y-1"
                                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                            }`}
                                        disabled={!isAvailable}
                                    >
                                        {time}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Afternoon slots */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Afternoon</h4>
                        <div className="flex overflow-x-auto pb-2 space-x-3">
                            {['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'].map((time, index) => {
                                // Check if this slot is available in the database
                                const dateStr = selectedDay.date.toISOString().split('T')[0];

                                // If we have slots from the database, use them
                                let isAvailable = false;

                                if (availableSlots.length > 0) {
                                    // Use database slots
                                    isAvailable = availableSlots.some(slot =>
                                        slot.date === dateStr &&
                                        slot.time === time &&
                                        slot.status === 'available'
                                    );
                                } else {
                                    // Fallback to mock data if no slots in database
                                    isAvailable = (selectedDay.date.getDate() + index + 3) % 3 !== 0;
                                }

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleSlotSelect(time, isAvailable)}
                                        className={`flex-shrink-0 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${selectedSlot && selectedSlot.time === time && selectedSlot.day.index === selectedDay.index
                                                ? "bg-green-500 text-white hover:bg-green-600 hover:shadow-md transform hover:-translate-y-1"
                                                : isAvailable
                                                    ? "bg-yellow-400 text-purple-900 hover:bg-yellow-500 hover:shadow-md transform hover:-translate-y-1"
                                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                            }`}
                                        disabled={!isAvailable}
                                    >
                                        {time}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {loading && (
                        <div className="text-center py-4 text-gray-500">
                            Loading available slots...
                        </div>
                    )}

                    {!loading && availableSlots.length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                            No available slots found for this therapist.
                        </div>
                    )}
                </div>
            )}

            <div className="mt-4 flex items-center justify-center space-x-6">
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Available</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-200 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Unavailable</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Selected</span>
                </div>
            </div>
        </div>
    );
}