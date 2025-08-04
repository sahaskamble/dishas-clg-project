'use client';
import { pb } from '../lib/pocketbase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faUser, faEnvelope, faLock, faUserTag, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function SignUpPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user');
    const router = useRouter();

    const handleSignUp = async () => {
        try {
            // Check if required fields are filled
            if (!name || !email || !username || !password) {
                alert("Please fill all required fields");
                return;
            }

            // Check if passwords match
            if (password !== confirmPassword) {
                alert("Passwords do not match");
                return;
            }

            const res = await pb.collection('users').create({
                name: name,
                email: email,
                emailVisibility: true,
                username: username,
                password: password,
                passwordConfirm: confirmPassword,
                role: role
            });

            console.log("signup successful");
            alert("signup successful");

            if (res) {
                alert("you are logged in as a user");
                router.push("/user_login");
            } else {
                alert("signup unsuccessful");
            }

        } catch (error) {
            console.log(error);
            alert("signup unsuccessful: " + (error.message || "Unknown error"));
        }
    }

    return (
        <div className="relative w-full min-h-screen bg-gray-50">
            {/* Background with gradient overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/background-img.jpg"
                    alt="Registration Background"
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
                    <span>Back To Home Page</span>
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
                            <h1 className="text-2xl font-bold mb-3">User Registration</h1>
                            <p className="mb-6 text-purple-100">
                                Join our platform to access personalized healthcare services. Create your account to get started.
                            </p>
                            <div className="space-y-4 mt-8">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center mr-3">
                                        <FontAwesomeIcon icon={faUser} className="text-purple-200" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Personal Account</h3>
                                        <p className="text-sm text-purple-200">Access your personalized dashboard</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center mr-3">
                                        <FontAwesomeIcon icon={faLock} className="text-purple-200" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Secure Access</h3>
                                        <p className="text-sm text-purple-200">Your data is protected and private</p>
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
                            <h2 className="text-xl font-bold text-purple-950 mb-1 text-center">Create Your Account</h2>
                            <p className="text-gray-600 text-sm">Please enter your details below</p>
                        </div>

                        <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="name"
                                        className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faUserTag} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="username"
                                        className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Choose a username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        id="password"
                                        className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>


                            <div className="flex items-center justify-between pt-4">
                                <button
                                    type="button"
                                    className="w-full bg-purple-900 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded-md shadow transition-colors duration-200"
                                    onClick={handleSignUp}
                                >
                                    Sign Up
                                </button>
                            </div>

                            <div className="text-center mt-4">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{" "}
                                    <Link href="/user_login" className="text-purple-600 hover:text-purple-800 font-medium">
                                        Log in
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}