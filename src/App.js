import "./App.css";
import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react"; // useGSAP is a hook, not a plugin to register

import Bg from "./components/Bg";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader"; // Import the new Preloader

// Register GSAP plugins correctly
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

function App() {
  const main = useRef(null);
  const smoother = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSmootherInitialized, setIsSmootherInitialized] = useState(false);

  // Effect for preloader
  useEffect(() => {
    const handleLoad = () => {
      console.log("Window loaded");
      // Delay hiding preloader slightly to ensure smoother transition if GSAP is also initializing
      setTimeout(() => {
        setIsLoading(false);
      }, 500); // Adjust delay as needed, or remove if GSAP handles fade-out well
    };

    // Check if already loaded (for fast connections or cached resources)
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  // GSAP setup for ScrollSmoother
  useGSAP(
    () => {
      // Only initialize ScrollSmoother if not loading and it hasn't been initialized yet
      if (!isLoading && main.current && !smoother.current) {
        console.log("Initializing ScrollSmoother...");
        smoother.current = ScrollSmoother.create({
          wrapper: main.current, // Correct: pass the wrapper element
          content: "#smooth-content", // Correct: pass the content element selector or ref
          smooth: 1.5, // Adjusted smoothing
          effects: true, // Enable data-speed and data-lag
          smoothTouch: 0.1, // Enable smoothing on touch devices
        });
        console.log("ScrollSmoother initialized:", smoother.current);
        setIsSmootherInitialized(true); // Mark as initialized

        // It's crucial to refresh ScrollTrigger AFTER ScrollSmoother is created
        // and ideally after all content (especially images with dynamic heights) is loaded.
        // Since 'isLoading' false means window.load has fired, this should be a good time.
        ScrollTrigger.refresh();
      }
    },
    { scope: main, dependencies: [isLoading] } // Re-run when isLoading changes
  );

  // GSAP for preloader fade-out
  useGSAP(() => {
    if (!isLoading) {
      gsap.to(".preloader", { // Target the preloader by its class
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          // Optionally set display: none after fade out
          gsap.set(".preloader", { display: "none" });
        }
      });
    }
  }, { dependencies: [isLoading] });


  // Cleanup ScrollSmoother on component unmount
  useEffect(() => {
    return () => {
      if (smoother.current) {
        console.log("Destroying ScrollSmoother");
        smoother.current.kill();
        smoother.current = null;
        setIsSmootherInitialized(false);
      }
      // Kill all ScrollTriggers to prevent memory leaks
      // ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <>
      {/* Preloader will be visible initially based on isLoading state */}
      <Preloader isLoading={isLoading} />

      {/* Main content area for ScrollSmoother */}
      {/* Added a check to render main content only after smoother could potentially initialize */}
      <div id="smooth-wrapper" ref={main} style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
        <Bg />
        <div id="smooth-content">
          {/* Pass smoother instance to Header and Footer */}
          <Header smoother={smoother} isSmootherInitialized={isSmootherInitialized} />
          <Hero />
          <About />
          {/* Portfolio section itself should have id="portfolio" for ScrollTo to work */}
          {/* The class "portfolio-section" can be used for styling if needed */}
          <Portfolio />
          <Contact />
          <Footer smoother={smoother} isSmootherInitialized={isSmootherInitialized} />
        </div>
      </div>
    </>
  );
}

export default App;
