'use client';
import { useState, useEffect } from 'react';
import { pb } from '../lib/pocketbase';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faBriefcase, faClock, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import { safeAsyncOperation } from '../lib/errorHandler';

export default function TherapistInfoCard() {
    const [therapists, setTherapists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsClient(true);

        const fetchData = async () => {
            // Only proceed if pb is available (client-side)
            if (!pb) {
                setIsLoading(false);
                return;
            }

            await safeAsyncOperation(
                async () => {
                    const data = await pb.collection('therapist_profile').getFullList({
                        expand: 'user'
                    });
                    setTherapists(data);
                },
                setIsLoading,
                setError
            );
        };

        fetchData();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-purple-950">Our Therapists</h1>

            {error ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="text-red-600 text-lg mb-4">⚠️ {error}</div>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-purple-900 text-white px-4 py-2 rounded-md hover:bg-purple-800"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            ) : isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {therapists.map((therapist) => (
                        <div key={therapist.id} className="bg-[#fffbf3] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                            {/* Card Header with Gradient */}
                            <div className="bg-[#ffdadf90] px-6 py-4">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-[#dfbec3] rounded-full flex items-center justify-center mr-4">
                                        <FontAwesomeIcon icon={faUserMd} className="text-purple-800 text-xl" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-purple-950">{therapist.expand?.user?.name || 'Therapist'}</h2>
                                        <p className="text-black text-sm">{therapist.qualification || 'Therapist'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 flex-grow">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                                        <FontAwesomeIcon icon={faBriefcase} className="text-purple-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Qualification</p>
                                        <p className="font-medium text-gray-800">{therapist.qualification || 'Not specified'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center mb-6">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                                        <FontAwesomeIcon icon={faClock} className="text-purple-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Experience</p>
                                        <p className="font-medium text-gray-800">{therapist.experience || '0'} years</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-start mb-2">
                                        <FontAwesomeIcon icon={faQuoteLeft} className="text-pink-400 text-xl mr-2" />
                                        <p className="text-sm text-gray-500">Professional Statement</p>
                                    </div>
                                    <p className="text-gray-700 text-sm line-clamp-3">{therapist.bio || 'No bio available'}</p>
                                </div>

                                {/* Specializations */}
                                {therapist.specializations && therapist.specializations.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-500 mb-2">Specializations</p>
                                        <div className="flex flex-wrap gap-2">
                                            {therapist.specializations.map((spec, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs"
                                                >
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Card Footer */}
                            <div className="px-6 py-4 bg-[#fffbf3] border-t border-gray-100 text-center">
                                <Link href={`/ViewProfile/${therapist.id}`}>
                                    <button className="bg-purple-950 text-white px-9 py-2 rounded-lg transition-colors duration-300 border-2 border-transparent hover:border-purple-950 hover:bg-transparent hover:text-black">
                                        View Profile
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* No Results State */}
            {!isLoading && therapists.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No therapists found. Please check back later.</p>
                </div>
            )}
        </div>
    );
}