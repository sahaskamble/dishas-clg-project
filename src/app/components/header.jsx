'use client';
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faBars, faTimes, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import Link from "next/link";
import { pb } from "../lib/pocketbase";
import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check if user is logged in when component mounts and when auth state changes
    useEffect(() => {
        // Set initial state
        setIsLoggedIn(pb.authStore.isValid);

        // Listen for auth state changes
        const unsubscribe = pb.authStore.onChange(() => {
            console.log("Auth state changed:", pb.authStore.isValid);
            setIsLoggedIn(pb.authStore.isValid);
        });

        // Cleanup listener on component unmount
        return () => {
            unsubscribe();
        };
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    // const handleProfileClick = async () => {
    //     console.log("Profile button clicked");
    //     router.push('/therapist_profile');

    //     if (!pb.authStore.isValid) {

    //         alert("login first");
    //         return;
    //     }

    try {
        // Get the current user ID safely
        // Note: We're using the model property despite the deprecation warning
        // This is a temporary solution until we update to the latest PocketBase version
        const userId = pb.authStore.model?.id;

        if (!userId) {
            console.log("User ID not found");
            router.push('/Login');
            return;
        }

        console.log("Checking if user is a therapist...");
        try {
            // Check if the user is a therapist
            const therapistRecord = await pb.collection('therapist_profile')
                .getFirstListItem(`therapist_id="${userId}"`);

            console.log("Therapist record found:", therapistRecord);

            // For debugging - also log the test route
            console.log("Test route:", `/test-therapist/${therapistRecord.id}`);

            // Navigate to the therapist profile
            router.push(`/TherapistProfile/${therapistRecord.id}`);
        } catch (error) {
            // Not a therapist, redirect to user profile
            console.log("Not a therapist, redirecting to user profile");
            console.log("Error details:", error);
            router.push(`/UserProfile/${userId}`);
        }
    } catch (error) {
        console.error("Error in profile navigation:", error);
        router.push('/Login');
    }
};

return (
    <header className="sticky top-0 z-50 w-full">
        <div className="header shadow-md flex items-center justify-between px-6">
            <div className="flex items-center">
                <div className="w-[60px] h-[60px] bg-purple-900 rounded-full inline-flex justify-center items-center">
                    <Image src="/logo.png" width={70} height={60} alt="logo" className="object-contain" />
                </div>
                <div className="logo-text font-bold flex ml-2">
                    <span className="text-xl text-purple-900 tracking-wide m-0">BLUE</span>
                    <span className="text-xl text-purple-900 tracking-wide m-0">SAGE</span>
                </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 text-lg font-semibold text-purple-900">
                <a href="#" className="hover:text-black transition-colors duration-200">REFERENCES</a>
                <a href="#" className="hover:text-black transition-colors duration-200">RESOURCES</a>
                <a href="#" className="hover:text-black transition-colors duration-200">HOME</a>
                <a href="#" className="hover:text-black transition-colors duration-200">BLOG</a>
                <button className="hover:text-black transition-colors duration-200">
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </nav>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-4">


                {!isLoggedIn ? (
                    <Link href="/therapist_login">
                        <button type="button" className="bg-purple-900 active:bg-purple-500 text-white py-2 px-4 rounded-md shadow transition-colors duration-200 flex items-center text-sm">
                            <FontAwesomeIcon icon={faUser} className="mr-2" />
                            LOGIN / SIGNUP
                        </button>
                    </Link>
                ) : (
                    <div className="flex space-x-2">
                        <button
                            type="button"
                            onClick={handleProfileClick}
                            className="bg-purple-900 active:bg-purple-500 text-white py-2 px-4 rounded-md shadow transition-colors duration-200 flex items-center text-sm"
                        >
                            <FontAwesomeIcon icon={faCircleUser} className="mr-2" />
                            YOUR PROFILE
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                pb.authStore.clear();
                                router.push('/');
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md shadow transition-colors duration-200 flex items-center text-sm"
                        >
                            LOGOUT
                        </button>
                    </div>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button
                className="md:hidden text-white text-2xl focus:outline-none"
                onClick={toggleMobileMenu}
            >
                <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
            </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
            <div className="md:hidden bg-[#2c3e50] text-[#f3dbac] py-4 px-6 shadow-lg">
                <nav className="flex flex-col space-y-4 text-lg font-semibold mb-6">
                    <a href="#" className="hover:text-white transition-colors duration-200">HOME</a>
                    <a href="#" className="hover:text-white transition-colors duration-200">REFERENCES</a>
                    <a href="#" className="hover:text-white transition-colors duration-200">RESOURCES</a>
                    <a href="#" className="hover:text-white transition-colors duration-200">BLOG</a>
                    <div className="flex items-center">
                        <span className="mr-2">Search:</span>
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                </nav>
                <div className="flex flex-col space-y-3">
                    <Link href="/CorporateLogin">
                        <button type="button" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-md shadow transition-colors duration-200 text-sm w-full">
                            CORPORATE LOGIN
                        </button>
                    </Link>

                    {!isLoggedIn ? (
                        <Link href="/Login">
                            <button type="button" className="bg-purple-900 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md shadow transition-colors duration-200 flex items-center justify-center text-sm w-full">
                                <FontAwesomeIcon icon={faUser} className="mr-2" />
                                LOGIN / SIGNUP
                            </button>
                        </Link>
                    ) : (
                        <div className="flex flex-col space-y-2">
                            <Link href="therpaist_profile">
                                <button
                                    type="button"
                                    // onClick={handleProfileClick}
                                    className="bg-purple-900 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md shadow transition-colors duration-200 flex items-center justify-center text-sm w-full"
                                >
                                    <FontAwesomeIcon icon={faCircleUser} className="mr-2" />
                                    YOUR PROFILE
                                </button>
                            </Link>
                            <button
                                type="button"
                                onClick={() => {
                                    pb.authStore.clear();
                                    router.push('/');
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md shadow transition-colors duration-200 flex items-center justify-center text-sm w-full"
                            >
                                LOGOUT
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )}
    </header>
);
};