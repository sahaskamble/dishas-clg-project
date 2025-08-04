'use client';
import { pb } from '@/app/lib/pocketbase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faUser, faLock, faArrowLeft, faUserPlus, faSave, faEdit, faGraduationCap, faBriefcase, faTags, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import ManageAvailability from '@/app/manage_availability/page';

export default function TherapistViewPage() {
    const router = useRouter();
    const [therapistId, setTherapistId] = useState(null);
    const [bio, setBio] = useState('');
    const [experience, setExperience] = useState('');
    const [qualification, setQualification] = useState('');
    const [profileExists, setProfileExists] = useState(false);
    const [profileId, setProfileId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [specializations, setSpecializations] = useState(['']);
    const [bookingRequests, setBookingRequests] = useState([]);

    const fetchBookingRequests = async () => {
        if (!therapistId) return;

        try {
            const requests = await pb.collection('booking_request').getList(1, 50, {
                filter: `therapist_id="${therapistId}" && (status="pending" || status="accepted" || status="declined")`,
                sort: '-created',
                expand: 'user_id'
            });
            setBookingRequests(requests.items);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (profileExists) {
            fetchBookingRequests();
        }
    }, [profileExists, therapistId]);


    useEffect(() => {
        console.log("auth check :", pb.authStore.isValid);
        if (pb.authStore.isValid && pb.authStore.model?.id) {
            setTherapistId(pb.authStore.model.id);
        } else {
            alert("please log in first");
            router.push('/therapist_login');
        }
    }, [router]);

    const handleAcceptRequest = async (requestId) => {
        if (!confirm("Are you sure you want to accept this booking request>")) {
            return;
        }

        try {
            await pb.collection('booking_request').update(requestId, { status: 'accepted' });
            fetchBookingRequests();
            alert("request accepted successfully");
        } catch (error) {
            console.log("error aacpeting request", error);
            alert("error in accpeting request");
        }
    };


    const handleDeclineRequest = async (requestId) => {
        if (!confirm("Are u sure you want to decline request?")) {
            return;
        }

        try {
            await pb.collection('booking_request').update(requestId, { status: 'declined' });
            fetchBookingRequests();
            alert("booking request declined successfully");
        } catch (error) {
            console.log("error declining request", error);
            alert("error in declining request");
        }
    }

    const fetchData = async () => {
        try {
            if (!therapistId) return;

            setIsLoading(true);
            console.log("fetching data", therapistId);


            const res = await pb.collection('therapist_profile').getFullList({
                filter: `user = "${therapistId}"`
            });

            if (res && res.length > 0) {
                // Profile exists, populate the form
                setProfileExists(true);
                setProfileId(res[0].id);
                setBio(res[0].bio || '');
                setExperience(res[0].experience || '');
                setQualification(res[0].qualification || '');
                setIsEditing(false);

                if (res[0].specializations && Array.isArray(res[0].specializations)) {
                    setSpecializations(res[0].specializations);
                } else if (res[0].specailizations) {
                    try {
                        const specArray = typeof res[0].specializations === 'string' ? JSON.parse(res[0].specializations) :
                            setSpecializations(Array.isArray(specArray) ? specArray : [specArray]);

                    } catch (error) {
                        setSpecializations([res[0].specailizations.toString()]);
                    }
                } else {
                    setSpecializations(['']);
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

            const filteredSpecializations = specializations.filter(spec => spec.trim() !== '');
            console.log("filteredSpecializations", filteredSpecializations);
            if (profileExists) {
                // Update existing profile
                await pb.collection('therapist_profile').update(profileId, {
                    bio,
                    experience,
                    qualification,
                    specializations: filteredSpecializations,
                    user: therapistId
                });
                alert("Profile updated successfully");
                setIsEditing(false);
            } else {
                // Create new profile
                const record = await pb.collection('therapist_profile').create({
                    bio,
                    experience,
                    qualification,
                    specializations: filteredSpecializations,
                    user: therapistId
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



    const handleSpecializationChange = (index, value) => {
        const newSpecializations = [...specializations];
        newSpecializations[index] = value;
        setSpecializations(newSpecializations);
    };

    const addSpecialization = () => {
        if (specializations.length < 6) {
            setSpecializations([...specializations, '']);
        }
    };

    const removeSpecialization = (index) => {
        if (specializations.length > 1) {
            const newSpecializations = specializations.filter((_, i) => i !== index);
            setSpecializations(newSpecializations);
        }
    };

    useEffect(() => {
        fetchData();
    }, [therapistId]);

    useEffect(() => {
        if (!profileExists) {
            setIsEditing(true);
        }
    }, [profileExists]);


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
            await pb.collection('therapist_profile').delete(profileId);
            await pb.collection('users').delete(therapistId);
            alert("Profile deleted successfully");
            router.push('/therapist_login');
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
                                {profileExists ? 'Your Therapist Profile' : 'Create Your Therapist Profile'}
                            </h1>
                            <p className="mt-2 text-purple-100">
                                {profileExists
                                    ? 'Manage your professional information visible to clients'
                                    : 'Set up your professional profile to connect with clients'}
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
                            <div>
                                <label htmlFor="bio" className="flex items-center text-md font-medium text-gray-700 mb-2">
                                    <FontAwesomeIcon icon={faUser} className="mr-2 text-purple-600" />
                                    Professional Bio
                                </label>
                                {isEditing ? (
                                    <textarea
                                        id="bio"
                                        rows="5"
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                        placeholder="Describe your approach, specialties, and philosophy as a therapist..."
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                    />
                                ) : (
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        {bio ? (
                                            <p className="text-gray-700 whitespace-pre-line">{bio}</p>
                                        ) : (
                                            <p className="text-gray-400 italic">No bio provided</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="experience" className="flex items-center text-md font-medium text-gray-700 mb-2">
                                        <FontAwesomeIcon icon={faBriefcase} className="mr-2 text-purple-600" />
                                        Years of Experience
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            id="experience"
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            placeholder="Enter years of experience"
                                            value={experience}
                                            onChange={(e) => setExperience(e.target.value)}
                                        />
                                    ) : (
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            {experience ? (
                                                <p className="text-gray-700">{experience} years</p>
                                            ) : (
                                                <p className="text-gray-400 italic">Not specified</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="qualification" className="flex items-center text-md font-medium text-gray-700 mb-2">
                                        <FontAwesomeIcon icon={faGraduationCap} className="mr-2 text-purple-600" />
                                        Qualifications
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            id="qualification"
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                            placeholder="Enter your qualifications (e.g., Ph.D., LMFT)"
                                            value={qualification}
                                            onChange={(e) => setQualification(e.target.value)}
                                        />
                                    ) : (
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            {qualification ? (
                                                <p className="text-gray-700">{qualification}</p>
                                            ) : (
                                                <p className="text-gray-400 italic">No qualifications listed</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Specializations Section */}
                                <div>
                                    <label className="flex items-center text-md font-medium text-gray-700 mb-2">
                                        <FontAwesomeIcon icon={faTags} className="mr-2 text-purple-600" />
                                        Specializations
                                        {isEditing && specializations.length < 6 && (
                                            <button
                                                onClick={addSpecialization}
                                                className="ml-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                                                title="Add specialization"
                                            >
                                                <FontAwesomeIcon icon={faPlus} className="text-xs" />
                                            </button>
                                        )}
                                    </label>

                                    {isEditing ? (
                                        <div className="space-y-3">
                                            {specializations.map((spec, index) => (
                                                <div key={index} className="flex items-center">
                                                    <input
                                                        type="text"
                                                        className="flex-grow border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                        placeholder={`Specialization ${index + 1} (e.g., Anxiety, Depression)`}
                                                        value={spec}
                                                        onChange={(e) => handleSpecializationChange(index, e.target.value)}
                                                    />
                                                    {specializations.length > 1 && (
                                                        <button
                                                            onClick={() => removeSpecialization(index)}
                                                            className="ml-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                                                            title="Remove specialization"
                                                        >
                                                            <FontAwesomeIcon icon={faTimes} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <p className="text-sm text-gray-500 mt-1">
                                                Add up to 6 specializations that describe your areas of expertise
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            {specializations.filter(s => s.trim() !== '').length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {specializations
                                                        .filter(s => s.trim() !== '')
                                                        .map((spec, index) => (
                                                            <span
                                                                key={index}
                                                                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                                                            >
                                                                {spec}
                                                            </span>
                                                        ))
                                                    }
                                                </div>
                                            ) : (
                                                <p className="text-gray-400 italic">No specializations listed</p>
                                            )}
                                        </div>
                                    )}
                                </div>


                            </div>

                            <div className="mt-8">
                                <h2 className="text-2xl font-bold text-purple-900 mb-4">Booking Requests</h2>

                                {bookingRequests.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">You don't have any booking requests yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {bookingRequests.map(request => (
                                            <div key={request.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold text-lg text-purple-900">
                                                            {request.expand?.user_id?.name || 'User'}
                                                        </h3>
                                                        <p className="text-gray-600 mt-1">
                                                            {new Date(request.date).toLocaleDateString('en-US', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })} at {request.time}
                                                        </p>
                                                        {request.message && (
                                                            <p className="text-gray-500 mt-2 text-sm italic">
                                                                "{request.message}"
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${request.status === 'pending' ? "bg-yellow-100 text-yellow-800" :
                                                                request.status === 'accepted' ? "bg-green-100 text-green-800" :
                                                                    "bg-red-100 text-red-800"
                                                            }`}>
                                                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                        </span>

                                                        {request.status === 'pending' && (
                                                            <div className="mt-2 flex space-x-2">
                                                                <button
                                                                    onClick={() => handleAcceptRequest(request.id)}
                                                                    className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
                                                                >
                                                                    Accept
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeclineRequest(request.id)}
                                                                    className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
                                                                >
                                                                    Decline
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
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