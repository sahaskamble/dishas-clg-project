'use client';

import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;
import Image from "next/image";
import Link from "next/link";
import { useRef } from 'react';
import TherapistInfoCard from "./components/therapist_infocard";
// import Logout from "./components/logout";
import Header from './components/header';

export default function Home() {
  const therapistRef = useRef(null);

  const scrollToTherapist = () => {
    therapistRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <Header />
      <section className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/background-img.jpg"
            fill
            alt="Healthcare background"
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-indigo-900/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-950 leading-tight mb-6 font-serif">
              Consult Trusted Therapists Online for Medical, Mental & Lifestyle Wellness
            </h1>
            <p className="text-xl md:text-2xl text-purple-800 max-w-3xl mx-auto mb-8">
              Your complete mental-healthcare solution – All in One Place
            </p>
            <button
              onClick={scrollToTherapist}
              className="bg-purple-900 hover:bg-purple-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              CONSULT WITH THERAPISTS AND WELLNESS EXPERTS
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-purple-900 mb-12">Our Services</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-purple-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-purple-800 mb-2">Mental Health Counseling</h3>
              <p className="text-gray-600 text-center">Professional support for anxiety, depression, and other mental health concerns.</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-purple-800 mb-2">Therapy Sessions</h3>
              <p className="text-gray-600 text-center">One-on-one therapy sessions with licensed professionals.</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-purple-800 mb-2">Wellness Programs</h3>
              <p className="text-gray-600 text-center">Comprehensive wellness programs for overall mental and physical health.</p>
            </div>
          </div>

          <div className="flex justify-center mt-12">
            <button
              onClick={scrollToTherapist}
              className="bg-purple-950 text-white px-9 py-2 rounded-lg transition-colors duration-300 border-2 border-transparent hover:border-purple-950 hover:bg-transparent hover:text-black"
            >
              BOOK APPOINTMENT
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <div className="card h-120  mt-15 bg-[#fffbf3] ">
        <h1 className='card-text text-xl md:text-2xl font-serif font-semibold text-[#1f0c4c] text-center leading-snug py-4'>Start Your Recovery with a Doctor-Led, Personalized Health Journey — Just a Few Clicks Away</h1>
        <p className="mt-1 text-base font-sans text-[#3e3e5e] text-center whitespace-nowrap overflow-hidden text-ellipsis">
          From accurate diagnosis to ongoing care, connect with certified doctors and specialists for complete physical, mental, and lifestyle wellness support
        </p>
        <div className="card-overall flex flex-row space-x-20 transition-transform duration-500 ease-in-out ">
          <div className="sm-cards bg-[#ffdadf38] mt-10 ml-20 ">
            <div className="chota-card bg-[#dfbec3] ">
              <Image src="/img1.png" width={70} height={60} alt="Choose Medical Service" className="card-img" />
            </div>
            <h1 className="text-[17px]   text-[#2d2e70] font-sans" >Choose The Right Medical <br /> Or Mental Health Service <br /> Tailored To Your Needs</h1>
          </div>
          <div className="sm-cards bg-[#ffdadf38] mt-10 ">
            <div className="chota-card bg-[#dfbec3] ">
              <Image src="/img2.png" width={70} height={60} alt="Schedule Consultation" className="card-img" />

            </div>
            <h1 className="text-[17px]   text-[#2d2e70] font-sans" >Schedule A Secure Video <br /> Consultation With A  <br /> Certified Doctor Or <br /> Psychologist</h1>
          </div>
          <div className="sm-cards bg-[#ffdadf38] mt-10">
            <div className="chota-card bg-[#dfbec3] ">
              <Image src="/img3.jpg" width={70} height={60} alt="Get Diagnosis" className="card-img" />
            </div>

            <h1 className="text-[17px]   text-[#2d2e70] font-sans" >Get An Accurate Diagnosis<br /> And Personalized Treatment  <br />Plan Instantly</h1></div>
          <div className="sm-cards bg-[#ffdadf38] mt-10">
            <div className="chota-card bg-[#dfbec3] ">
              <Image src="/image.png" width={70} height={60} alt="Digital Prescription" className="card-img " />
            </div>
            <h1 className="text-[17px]   text-[#2d2e70] font-sans" >Access Your Digital <br /> Prescription, Follow-Ups, And <br /> Ongoing Support - Anytime <br /> Anywhere</h1>
          </div>
        </div>

      </div>
      {/* Therapist Section */}
      <section ref={therapistRef} className="py-16">
        <TherapistInfoCard />
      </section>
    </div>
  );
}
