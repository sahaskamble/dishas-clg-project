'use client';
import { pb } from '../../lib/pocketbase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faUser, faLock, faArrowLeft, faUserPlus, faSave, faEdit, faGraduationCap, faBriefcase, faTags, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function UserViewPage() {
    const router = useRouter();
    const [userId, setUserId] = useState(null);
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [profession, setProfession] = useState('');
    const [profileExists, setProfileExists] = useState(false);
    const [profileId, setProfileId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [concerns, setConcerns] = useState(['']);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        console.log("auth check :", pb.authStore.isValid);
        if (pb.authStore.isValid && pb.authStore.model?.id) {
            setUserId(pb.authStore.model.id);
        } else {
            alert("please log in first");
            router.push('/user_login');
        }
    }, [router]);

    const fetchData = async () => {
        try {
            if (!userId) return;

            setIsLoading(true);
            console.log("fetching data", userId);

            const res = await pb.collection('user_profile').getFullList({
                filter: `user = "${userId}"`
            });

            if (res && res.length > 0) {
                // Profile exists, populate the form
                setProfileExists(true);
                setProfileId(res[0].id);
                setGender(res[0].gender || '');
                setAge(res[0].age || '');
                setProfession(res[0].profession || '');

                // Handle concerns array
                if (res[0].concerns && Array.isArray(res[0].concerns)) {
                    setConcerns(res[0].concerns);
                } else if (res[0].concerns) {
                    try {
                        const concernsArray = typeof res[0].concerns === 'string'
                            ? JSON.parse(res[0].concerns)
                            : res[0].concerns;
                        setConcerns(Array.isArray(concernsArray) ? concernsArray : [concernsArray]);
                    } catch (error) {
                        setConcerns([res[0].concerns.toString()]);
                    }
                } else {
                    setConcerns(['']);
                }

                setIsEditing(false);
            } else {
                // No profile exists, show empty form for creation
                setProfileExists(false);
                setIsEditing(true);
            }
        } catch (error) {
            console.log("Error fetching profile:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSave = async () => {
        try {
            const filteredConcerns = concerns.filter(concern => concern.trim() !== '');
            console.log("filteredConcerns", filteredConcerns);

            if (profileExists) {
                // Update existing profile
                await pb.collection('user_profile').update(profileId, {
                    gender,
                    age,
                    profession,
                    concerns: filteredConcerns,
                    user: userId
                });
                alert("Profile updated successfully");
                setIsEditing(false);
            } else {
                // Create new profile
                const record = await pb.collection('user_profile').create({
                    gender,
                    age,
                    profession,
                    concerns: filteredConcerns,
                    user: userId
                });
                setProfileId(record.id);
                setProfileExists(true);
                alert("Profile created successfully");
                setIsEditing(false);
            }
            await fetchData();
        } catch (error) {
            console.log("Error saving profile:", error);
            alert("Failed to save profile: " + error.message);
        }
    }



    const handleConcernChange = (index, value) => {
        const newConcerns = [...concerns];
        newConcerns[index] = value;
        setConcerns(newConcerns);
    };

    const addConcern = () => {
        if (concerns.length < 6) {
            setConcerns([...concerns, '']);
        }
    };

    const removeConcern = (index) => {
        if (concerns.length > 1) {
            const newConcerns = concerns.filter((_, i) => i !== index);
            setConcerns(newConcerns);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userId]);

    useEffect(() => {
        if (!profileExists) {
            setIsEditing(true);
        }
    }, [profileExists]);

    const fetchUserBookings = async () => {
        if (pb.authStore.isValid) {
            try {
                const user_id = pb.authStore.model.id;
                const bookingsData = await pb.collection('bookings').getList(1, 50, {
                    filter: `user_id="${user_id}"`,
                    sort: '-date',
                    expand: 'therapist_id'
                });
                setBookings(bookingsData.items);
            } catch (error) {
                console.log("error fetching bookings:", error);
            }
        }
    };

    useEffect(() => {
        fetchUserBookings();
    }, []);


    const onDeleteAccount = async () => {
        try {
            if (!profileId) {
                alert("No profile found to delete");
                return;
            }

            // Confirm before deletion
            const confirmDelete = window.confirm("Are you sure you want to delete your profile? This action cannot be undone.");
            if (!confirmDelete) {
                return;
            }

            console.log("Deleting profile with ID:", profileId);
            await pb.collection('user_profile').delete(profileId);
            alert("Profile deleted successfully");
            router.push('/user_login');
        } catch (error) {
            console.error("Error deleting profile:", error);
            alert("Failed to delete account: " + error.message);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-purple-800 font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-lg shadow-lg p-6 mb-8 text-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">
                                {profileExists ? 'Your User Profile' : 'Create Your User Profile'}
                            </h1>
                            <p className="mt-2 text-purple-100">
                                {profileExists
                                    ? 'Manage your personal information'
                                    : 'Set up your profile to get personalized care'}
                            </p>
                        </div>
                        {profileExists && !isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-white text-purple-800 px-4 py-2 rounded-md flex items-center hover:bg-purple-100 transition-colors"
                            >
                                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Main content card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Profile content */}
                    <div className="p-8">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="gender" className="flex items-center text-md font-medium text-gray-700 mb-2">
                                        <FontAwesomeIcon icon={faUser} className="mr-2 text-purple-600" />
                                        Gender
                                    </label>
                                    {isEditing ? (
                                        <select
                                            id="gender"
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                            <option value="prefer_not_to_say">Prefer not to say</option>
                                        </select>
                                    ) : (
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            {gender ? (
                                                <p className="text-gray-700 capitalize">{gender.replace('_', ' ')}</p>
                                            ) : (
                                                <p className="text-gray-400 italic">Not specified</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="age" className="flex items-center text-md font-medium text-gray-700 mb-2">
                                        <FontAwesomeIcon icon={faUser} className="mr-2 text-purple-600" />
                                        Age
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            id="age"
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            placeholder="Enter your age"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                            min="1"
                                            max="120"
                                        />
                                    ) : (
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            {age ? (
                                                <p className="text-gray-700">{age} years</p>
                                            ) : (
                                                <p className="text-gray-400 italic">Not specified</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="profession" className="flex items-center text-md font-medium text-gray-700 mb-2">
                                        <FontAwesomeIcon icon={faBriefcase} className="mr-2 text-purple-600" />
                                        Profession
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            id="profession"
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            placeholder="Enter your profession"
                                            value={profession}
                                            onChange={(e) => setProfession(e.target.value)}
                                        />
                                    ) : (
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            {profession ? (
                                                <p className="text-gray-700">{profession}</p>
                                            ) : (
                                                <p className="text-gray-400 italic">Not specified</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Health Concerns Section */}
                                <div>
                                    <label className="flex items-center text-md font-medium text-gray-700 mb-2">
                                        <FontAwesomeIcon icon={faTags} className="mr-2 text-purple-600" />
                                        Health Concerns
                                        {isEditing && concerns.length < 6 && (
                                            <button
                                                onClick={addConcern}
                                                className="ml-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                                                title="Add concern"
                                            >
                                                <FontAwesomeIcon icon={faPlus} className="text-xs" />
                                            </button>
                                        )}
                                    </label>

                                    {isEditing ? (
                                        <div className="space-y-3">
                                            {concerns.map((concern, index) => (
                                                <div key={index} className="flex items-center">
                                                    <input
                                                        type="text"
                                                        className="flex-grow border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                        placeholder={`Concern ${index + 1} (e.g., Anxiety, Depression)`}
                                                        value={concern}
                                                        onChange={(e) => handleConcernChange(index, e.target.value)}
                                                    />
                                                    {concerns.length > 1 && (
                                                        <button
                                                            onClick={() => removeConcern(index)}
                                                            className="ml-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                                                            title="Remove concern"
                                                        >
                                                            <FontAwesomeIcon icon={faTimes} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <p className="text-sm text-gray-500 mt-1">
                                                Add up to 6 health concerns you'd like to discuss with therapists
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            {concerns.filter(c => c.trim() !== '').length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {concerns
                                                        .filter(c => c.trim() !== '')
                                                        .map((concern, index) => (
                                                            <span
                                                                key={index}
                                                                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                                                            >
                                                                {concern}
                                                            </span>
                                                        ))
                                                    }
                                                </div>
                                            ) : (
                                                <p className="text-gray-400 italic">No health concerns listed</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {isEditing && (
                                <div className="flex justify-end space-x-3 pt-6">
                                    {profileExists && (
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                fetchData(); // Reset to original data
                                            }}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        onClick={handleSave}
                                        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-5 py-2 rounded-lg flex items-center transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                                        {profileExists ? 'Update Profile' : 'Create Profile'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="mt-8">
                            <h2 className="text-2xl font-bold text-purple-900 mb-4">Your Appointments</h2>

                            {bookings.length === 0 ? (
                                <p className="text-gray-500">You haven't booked any appointments yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {bookings.map(booking => (
                                        <div key={booking.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-lg">
                                                        {booking.expand?.therapist_id?.expand?.user?.name || 'Therapist'}
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        {new Date(booking.date).toLocaleDateString()} at {booking.time.substring(11, 16)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button className="bg-red-500 text-white px-9 py-2 rounded-lg transition-colors duration-300 border-2 border-transparent hover:border-red-900 hover:bg-transparent hover:text-black ml-75 mt-10 "
                            onClick={onDeleteAccount}
                        >Delete Account
                        </button>
                    </div>

                </div>



                <div className="mt-6">
                    <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors">
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Back to Home
                    </Link>
                </div>


            </div>
        </div>
    );
}