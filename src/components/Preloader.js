import React, { useRef } from 'react'; // ایمپورت کردن useRef از react
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

// Simple preloader component
const Preloader = ({ isLoading }) => {
  const preloaderRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);

  // Entrance animation for preloader elements (runs once when it first appears)
  useGSAP(() => {
    // اطمینان از وجود ref ها قبل از استفاده
    if (isLoading && preloaderRef.current && logoRef.current && textRef.current) { 
      gsap.set(logoRef.current, { scale: 0.5, opacity: 0 });
      gsap.set(textRef.current, { y: 20, opacity: 0 });

      gsap.timeline()
        .to(logoRef.current, { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.7)", delay: 0.2 })
        .to(logoRef.current, { // Pulsating effect for logo
            scale: 1.15,
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        }, "-=0.5")
        .to(textRef.current, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, "-=1.2");
    }
  }, { scope: preloaderRef, dependencies: [isLoading] });


  // The fade-out animation is handled in App.js when isLoading becomes false.
  // This component just defines the preloader's appearance.
  // شرط زیر برای جلوگیری از رندر مجدد پس از پنهان شدن توسط GSAP است
  if (!isLoading && preloaderRef.current && preloaderRef.current.style.display === 'none') {
    return null; 
  }

  return (
    <div
      ref={preloaderRef}
      className="preloader fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-900 text-white"
      // GSAP opacity را برای محو شدن کنترل می‌کند. opacity اولیه ۱ است.
    >
      <div ref={logoRef} className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 shadow-2xl mb-6">
        <span className="text-white text-4xl md:text-5xl font-bold select-none">A</span>
      </div>
      <p ref={textRef} className="text-lg md:text-xl font-medium text-slate-300 tracking-wider">
        Loading Experience...
      </p>
    </div>
  );
};

export default Preloader;
