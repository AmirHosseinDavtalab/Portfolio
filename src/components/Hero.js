import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroBackgroundImage from "../img/bgcopy.png"; // مسیر تصویر پس‌زمینه خود را بررسی کنید

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const subtitleRef = useRef(null);
  const bgRef = useRef(null); // ref برای پس‌زمینه همچنان استفاده می‌شود اما نه برای انیمیشن GSAP
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useLayoutEffect(() => {
    if (!leftRef.current || !rightRef.current || !subtitleRef.current || !heroRef.current) {
      console.warn("Hero section text refs not available for GSAP in Hero.js.");
      return;
    }

    const ctx = gsap.context(() => {
      // فقط انیمیشن‌های متن
      gsap.set([leftRef.current, rightRef.current, subtitleRef.current], {
        opacity: 0,
        y: -100,
      });

      const mountTl = gsap.timeline();
      mountTl
        .to(leftRef.current, {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          delay: 0.5,
        })
        .to(
          rightRef.current,
          { y: 0, opacity: 1, duration: 1.2, ease: "power2.out" },
          "-=0.8"
        )
        .to(
          subtitleRef.current,
          { y: 0, opacity: 1, duration: 1.5, ease: "power2.out" },
          "-=0.6"
        );
      // حذف تمام انیمیشن‌های مربوط به bgRef.current از mountTl

      // حذف انیمیشن حلقه‌ای پس‌زمینه
      // gsap.to(bgRef.current, { scale: 1.1, ... });

      // فقط انیمیشن‌های متن هنگام اسکرول
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=300", // طول اسکرول برای تکمیل انیمیشن‌های متن
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      scrollTl
        .to(leftRef.current, { x: "-100vw", autoAlpha: 0, ease: "power1.inOut" }, 0)
        .to(rightRef.current, { x: "100vw", autoAlpha: 0, ease: "power1.inOut" }, 0)
        .to(subtitleRef.current, { y: -50, autoAlpha: 0, ease: "power1.inOut" }, 0);
      // حذف انیمیشن مربوط به bgRef.current از scrollTl
        
    }, heroRef); 

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="hero-section min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white relative overflow-hidden"
    >
      {/* div پس‌زمینه بدون انیمیشن GSAP، با opacity کامل از ابتدا */}
      <div
        ref={bgRef} // ref همچنان برای دسترسی احتمالی نگه‌داشته شده، اما GSAP آن را تغییر نمی‌دهد
        className="absolute inset-0 bg-cover opacity-100" // اطمینان از opacity کامل
        style={{
          backgroundImage: `url(${heroBackgroundImage})`,
          backgroundPosition: isMobile ? "50% 105%" : "50% 80%", // برای موبایل نور بسیار پایین‌تر می‌آید (105% را می‌توانید تنظیم کنید)
          backgroundRepeat: "no-repeat",
          // backgroundSize: "cover", // این در className هست
        }}
      />
      <div className="text-center z-10 flex flex-col gap-2 px-4 pt-16 pb-8 md:pt-0 md:pb-0">
        <div className="flex flex-col md:flex-row justify-center items-center gap-x-2 md:gap-x-0">
          <span
            ref={leftRef}
            className="block text-3xl xxs:text-4xl xs:text-5xl sm:text-6xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent md:mr-2 lg:mr-4"
          >
            WELCOME TO
          </span>
          <span
            ref={rightRef}
            className="block text-3xl xxs:text-4xl xs:text-5xl sm:text-6xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent md:ml-2 lg:ml-4"
          >
            MY WEBSITE
          </span>
        </div>
        <p
          ref={subtitleRef}
          className="text-base sm:text-lg md:text-lg lg:text-xl mt-4 text-gray-300 max-w-md sm:max-w-lg md:max-w-2xl mx-auto px-2"
        >
          Web Developer | Creating Modern Experiences
        </p>
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
