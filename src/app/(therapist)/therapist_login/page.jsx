'use client';

import { pb } from '../../lib/pocketbase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faUser, faLock, faArrowLeft, faUserPlus } from '@fortawesome/free-solid-svg-icons';

export default function TherapistLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const validateForm = async () => {
        const newErrors = {};
        if (!email.trim()) {
            newErrors.email = "email is required";
        }

        if (!password.trim()) {
            newErrors.password = "password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleLogin = async () => {
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            const res = await pb.collection('users').authWithPassword(email, password);
            if (res) {
                alert("login successful");
                router.push('/');
            }

        } catch (error) {
            console.log(error);
            alert("login unsuccessful");
            setErrors({
                auth: "Invalid email or Password",
                email: " ",
                password: " "
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="relative w-full min-h-screen bg-gray-50">
            {/* Background with gradient overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/background-img.jpg"
                    alt="Login Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-indigo-900/80"></div>
            </div>

            {/* Back to home link */}
            <div className="relative z-10 pt-4 pl-4">
                <Link href="/" className="inline-flex items-center text-white hover:text-purple-200 transition-colors text-sm">
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-1 text-xs" />
                    <span>Back</span>
                </Link>
            </div>

            {/* Main content */}
            <div className="relative z-10 flex justify-center items-center min-h-screen py-12 px-4">
                <div className="bg-white rounded-lg shadow-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
                    {/* Left side - Brand information */}
                    <div className="bg-purple-900 text-white p-6 md:w-1/3 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center mb-4">
                                <FontAwesomeIcon icon={faBuilding} className="text-xl mr-2" />
                                <h2 className="text-lg font-bold">Blue Sage</h2>
                            </div>
                            <h1 className="text-2xl font-bold mb-3">Welcome Back</h1>
                            <p className="mb-6 text-purple-100">
                                Sign in to access your account and continue your healthcare journey with us.
                            </p>
                            <div className="space-y-4 mt-8">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center mr-3">
                                        <FontAwesomeIcon icon={faUser} className="text-purple-200" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Personal Dashboard</h3>
                                        <p className="text-sm text-purple-200">Access your health records and appointments</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center mr-3">
                                        <FontAwesomeIcon icon={faUserPlus} className="text-purple-200" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">New User?</h3>
                                        <p className="text-sm text-purple-200">
                                            <Link href="/Signup" className="underline hover:text-white transition-colors">
                                                Create an account
                                            </Link> to get started
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 pt-6 border-t border-purple-800">
                            <p className="text-sm text-purple-200">
                                &copy; 2023 Blue Sage Healthcare. All rights reserved.
                            </p>
                        </div>
                    </div>

                    {/* Right side - Form */}
                    <div className="p-6 md:w-2/3">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-1">Login to Your Account</h2>
                            <p className="text-gray-600 text-sm">Please enter your credentials below</p>
                        </div>

                        {errors.auth && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-800 rounded-md">
                                <p className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.auth}
                                </p>
                            </div>
                        )}
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className={errors.email ? "text-red-400" : "text-gray-400"}
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className={`pl-10 block w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-2 ${errors.username
                                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                                                : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                                                }`}
                                            placeholder="Enter your email address"
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (errors.email) {
                                                    setErrors({ ...errors, email: '' });
                                                }
                                            }}
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.email !== " " ? errors.email : ""}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FontAwesomeIcon
                                            icon={faLock}
                                            className={errors.password ? "text-red-400" : "text-gray-400"}
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            className={`pl-10 block w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-2 ${errors.password
                                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                                                : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                                                }`}
                                            placeholder="Enter your password"
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                if (errors.password) {
                                                    setErrors({ ...errors, password: '' });
                                                }
                                            }}
                                        />
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.password !== " " ? errors.password : ""}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>




                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-3 pt-4">
                                <button
                                    type="button"
                                    className={`w-full bg-purple-900 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded-md shadow transition-all duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    onClick={handleLogin}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Logging in...
                                        </span>
                                    ) : (
                                        'Log In'
                                    )}
                                </button>
                                <Link href="/therapist_register" className="w-full">
                                    <button
                                        type="button"
                                        className="w-full bg-white border border-purple-900 hover:bg-purple-50 text-purple-900 font-semibold py-2 px-4 rounded-md shadow transition-colors duration-200"
                                    >
                                        Create Account
                                    </button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}