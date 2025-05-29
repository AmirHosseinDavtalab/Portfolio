import img1 from "../img/1.png";
import img2 from "../img/2.png";
import img3 from "../img/3.png";
import img4 from "../img/4.png";
import img5 from "../img/5.png";
import img6 from "../img/6.png";
import img7 from "../img/7.png";
import img8 from "../img/8.png";
import img9 from "../img/9.png";
import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react"; // Using lucide-react for icons

gsap.registerPlugin(ScrollTrigger);
const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9];


// Enhanced project data structure
const projectsData = images.map((img, i) => ({
  id: i + 1,
  // Using placeholders with a 16:9 aspect ratio, similar to website screenshots
  image: img,
  title: `Project Alpha ${i + 1}`,
  description: `This is a brief description of Project Alpha ${i + 1}, highlighting its key features, modern technology stack, and user-centric design.`,
  tags: ["React", "Tailwind CSS", "GSAP", "Node.js"].slice(0, Math.floor(Math.random() * 3) + 2), // Random tags
  liveLink: "#",
  sourceLink: "#",
}));

// Project Card Component
const ProjectCard = ({ project }) => {
  return (
    <div className="group project-card bg-slate-800/50 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-purple-500/30 hover:border-purple-600/70 w-full md:w-[calc(100vw/2.5)] lg:w-[calc(100vw/3.2)] xl:min-w-[500px] xl:max-w-[550px] flex-shrink-0">
      {/* Image Container with Aspect Ratio */}
      <div className="relative overflow-hidden aspect-video"> {/* 16:9 aspect ratio */}
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          onError={(e) => e.currentTarget.src = `https://placehold.co/800x450/333/fff?text=Image+Error&font=inter`}
        />
        {/* Subtle overlay on hover to enhance text visibility if text was on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content Area */}
      <div className="p-5 md:p-6 flex flex-col flex-grow">
        <h4 className="text-xl lg:text-2xl font-semibold text-purple-300 mb-2 group-hover:text-purple-200 transition-colors">
          {project.title}
        </h4>
        <p className="text-sm text-slate-300 mb-4 leading-relaxed flex-grow">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-slate-700 text-purple-300 px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-auto">
          <a
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-purple-500/50 shadow-md hover:shadow-lg"
          >
            Live Demo
          </a>
          <a
            href={project.sourceLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-slate-500/50 shadow-md hover:shadow-lg"
          >
            Source Code
          </a>
        </div>
      </div>
    </div>
  );
};


const Portfolio = () => {
  const containerRef = useRef(null);
  const horizontalRef = useRef(null);
  const [visibleProjects, setVisibleProjects] = useState(4); // Initial projects for mobile
  const [isMobile, setIsMobile] = useState(false); // Will be set in useEffect

  // Effect for determining mobile status
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile(); // Initial check
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // GSAP Animations Effect
  useLayoutEffect(() => {
    // Ensure refs are current
    if (!containerRef.current || !horizontalRef.current) {
        console.warn("Portfolio section refs not available.");
        return;
    }
    
    const ctx = gsap.context(() => {
      if (!isMobile) {
        // Desktop: Horizontal Scroll Animation
        const horizontal = horizontalRef.current;
        const container = containerRef.current;
        
        // Ensure children (cards) are loaded before calculating scrollWidth
        // This might require a small delay or a check if images are loaded if cards resize based on image
        // For now, assuming fixed card widths or widths that are set before this effect runs.
        const scrollableWidth = horizontal.scrollWidth;
        const visibleWidth = container.clientWidth;
        const scrollDistance = scrollableWidth - visibleWidth;

        if (scrollDistance > 0) {
          gsap.to(horizontal, {
            x: -scrollDistance,
            ease: "none",
            scrollTrigger: {
              trigger: container, // The section itself
              start: "top top",    // Pin when the top of the section hits the top of the viewport
              end: () => `+=${scrollDistance}`, // End scrolling after moving the full scrollDistance
              scrub: 1,          // Smooth scrubbing
              pin: true,           // Pin the container section
              anticipatePin: 1,    // Helps prevent jumps
              invalidateOnRefresh: true, // Recalculate on resize
              // markers: true, // For debugging
            },
          });
        } else {
             // If not enough content to scroll, ensure position is reset
             gsap.set(horizontal, { x: 0 });
        }
      } else {
        // Mobile: No horizontal scroll, ensure x is reset if it was set by desktop animation
        gsap.set(horizontalRef.current, { x: 0 });
      }
    }, containerRef); // Scope GSAP animations to this component

    return () => ctx.revert(); // Cleanup GSAP animations and ScrollTriggers on unmount or when dependencies change
  }, [isMobile]); // Re-run this effect when isMobile state changes

  const loadMore = () => {
    setVisibleProjects((prev) => Math.min(prev + 4, projectsData.length));
  };

  return (
    <section
      id="portfolio"
      ref={containerRef}
      className="min-h-screen flex flex-col bg-gradient-to-br from-[#100e1c] to-[#1d1635] text-white pt-25 pb-12 md:pt-10 md:pb-20 overflow-hidden" // Added overflow-hidden
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-4xl sm:text-5xl font-bold text-center mb-12 lg:mb-20">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400">
            My Creative Projects
          </span>
        </h3>
      </div>

      {/* Conditional rendering for horizontal scroll container vs vertical stack */}
      {isMobile ? (
        // Mobile: Vertical Stack
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={horizontalRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {projectsData
              .slice(0, visibleProjects)
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
          </div>
          {visibleProjects < projectsData.length && (
            <div className="text-center mt-10 md:mt-12">
              <button
                onClick={loadMore}
                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-purple-500/50 shadow-xl hover:shadow-2xl"
              >
                Load More <ChevronDown className="ml-2 h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        // Desktop: Horizontal Scroll Container
        // The horizontalRef div will be as wide as its content due to `w-fit` and `flex`.
        // Padding for the start/end of the scroll track is applied here.
        <div
          ref={horizontalRef}
          className="flex gap-6 md:gap-8 w-fit px-4 sm:px-8 md:px-12 lg:px-24" // Padding for visual spacing at start/end of scroll track
          style={{ willChange: "transform" }} // Hint for browser optimization
        >
          {projectsData.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Portfolio;
