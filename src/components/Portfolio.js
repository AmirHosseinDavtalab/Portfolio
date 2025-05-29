import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import img1 from "../img/1.png";
import img2 from "../img/2.png";
import img3 from "../img/3.png";
import img4 from "../img/4.png";
import img5 from "../img/5.png";
import img6 from "../img/6.png";
import img7 from "../img/7.png";
import img8 from "../img/8.png";
import img9 from "../img/9.png";

gsap.registerPlugin(ScrollTrigger);

const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

const projectsData = images.map((img, i) => ({
  id: i + 1,
  image: img,
  title: `Project Alpha ${i + 1}`,
  description: `This is a brief description of Project Alpha ${i + 1}, highlighting its key features, modern technology stack, and user-centric design.`,
  tags: ["React", "Tailwind CSS", "GSAP", "Node.js"].slice(0, Math.floor(Math.random() * 3) + 2),
  liveLink: "#",
  sourceLink: "#",
}));

const ProjectCard = ({ project }) => {
  return (
    <div className="group project-card bg-slate-800/50 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-purple-500/30 hover:border-purple-600/70 w-full md:w-[calc(100vw/2.5)] lg:w-[calc(100vw/3.2)] xl:min-w-[500px] xl:max-w-[550px] flex-shrink-0">
      <div className="relative overflow-hidden aspect-video">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          onError={(e) => {
            if (!e.currentTarget.src.includes('placehold.co')) {
                e.currentTarget.src = `https://placehold.co/800x450/333/fff?text=Image+Error&font=inter`;
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
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
            href={project.liveLink} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-purple-500/50 shadow-md hover:shadow-lg"
          >
            Live Demo
          </a>
          <a
            href={project.sourceLink} target="_blank" rel="noopener noreferrer"
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
  const [visibleProjects, setVisibleProjects] = useState(4);
  const [isMobile, setIsMobile] = useState(false); // مقدار اولیه false است

  useEffect(() => {
    const checkMobile = () => {
      const mobileCheck = window.innerWidth <= 768;
      console.log(`Portfolio: checkMobile - window.innerWidth: ${window.innerWidth}, isMobile set to: ${mobileCheck}`);
      setIsMobile(mobileCheck);
    };
    checkMobile(); // بررسی اولیه در زمان mount
    window.addEventListener("resize", checkMobile);
    return () => {
      console.log("Portfolio: Cleaning up resize listener for checkMobile");
      window.removeEventListener("resize", checkMobile);
    };
  }, []); // این افکت یک بار پس از اولین رندر اجرا می‌شود

  useLayoutEffect(() => {
    console.log(`Portfolio: useLayoutEffect - Top. Current isMobile state: ${isMobile}`);
    
    // ایجاد context برای GSAP در ابتدای افکت
    // containerRef.current ممکن است در اولین اجرای useLayoutEffect هنوز null باشد اگر Portfolio شرطی رندر شود
    // اما در ساختار فعلی App.js، Portfolio همیشه رندر می‌شود.
    const currentContainerRef = containerRef.current; // Capture current value
    let ctx = gsap.context(() => {}, currentContainerRef); 
    let animationSetupTimer;

    if (!currentContainerRef || !horizontalRef.current) {
      console.warn("Portfolio: Refs not available for GSAP setup in useLayoutEffect.");
      return () => {
        // حتی اگر ref ها موجود نباشند، ctx.revert() را برای پاکسازی context خالی فراخوانی می‌کنیم
        if (ctx) ctx.revert();
      };
    }

    const setupAnimations = () => {
      // این تابع داخل setTimeout اجرا خواهد شد
      console.log(`Portfolio: setupAnimations - Running. Current isMobile state: ${isMobile}`);
      
      // پاک کردن انیمیشن‌های قبلی که به این context اضافه شده‌اند
      // این مهم است چون isMobile ممکن است تغییر کند و ما نیاز به تنظیم مجدد انیمیشن‌ها داریم
      ctx.revert();

      if (!isMobile) { // حالت دسکتاپ
        const horizontal = horizontalRef.current;
        const container = currentContainerRef; // استفاده از مقدار capture شده

        if (!horizontal || !container) {
            console.warn("Portfolio: Desktop - horizontal or container ref became null in timeout.");
            return;
        }

        const scrollableWidth = horizontal.scrollWidth;
        const visibleWidth = container.clientWidth;
        const scrollDistance = scrollableWidth - visibleWidth;

        console.log("Portfolio: Desktop GSAP calculations (inside setupAnimations):", {
            scrollableWidth, visibleWidth, scrollDistance, horizontalChildren: horizontal.children.length
        });

        if (horizontal.children.length === 0 && projectsData.length > 0) {
            console.warn("Portfolio: Desktop - horizontalRef has no children. Check ProjectCard rendering.");
        }

        if (scrollDistance > 0) {
            // اضافه کردن انیمیشن به context برای پاکسازی خودکار
            ctx.add(() => {
                gsap.to(horizontal, {
                    x: -scrollDistance,
                    ease: "none",
                    scrollTrigger: {
                        trigger: container, start: "top top", end: () => `+=${scrollDistance}`,
                        scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
                    },
                });
            });
        } else {
            console.log("Portfolio: Desktop - scrollDistance not positive. No horizontal scroll.");
            ctx.add(() => { gsap.set(horizontal, { x: 0 }); });
        }
      } else { // حالت موبایل
        console.log("Portfolio: Mobile - resetting horizontal scroll elements.");
        const horizontal = horizontalRef.current;
        if (horizontal) {
            // اضافه کردن عملیات ریست به context
            ctx.add(() => {
                gsap.killTweensOf(horizontal); // توقف هرگونه انیمیشن فعال روی این المان
                gsap.set(horizontal, { x: 0 }); // ریست کردن موقعیت x
            });
        } else {
            console.warn("Portfolio: Mobile - horizontalRef is null in timeout.");
        }
      }
    };

    // اجرای تابع راه‌اندازی با یک تأخیر کوچک
    animationSetupTimer = setTimeout(setupAnimations, 150); // کمی افزایش تاخیر برای اطمینان بیشتر در Vercel

    return () => {
      console.log(`Portfolio: useLayoutEffect - Cleanup. isMobile (stale value in closure): ${isMobile}`);
      clearTimeout(animationSetupTimer);
      ctx.revert(); // پاکسازی تمام انیمیشن‌های اضافه شده به این نمونه از context
    };
  }, [isMobile]); // اجرای مجدد این افکت فقط زمانی که isMobile تغییر می‌کند

  console.log(`Portfolio: Rendering with isMobile: ${isMobile}`);

  const loadMore = () => {
    setVisibleProjects((prev) => Math.min(prev + 4, projectsData.length));
  };

  return (
    <section
      id="portfolio"
      ref={containerRef}
      className="portfolio-section min-h-screen flex flex-col bg-gradient-to-br from-[#100e1c] to-[#1d1635] text-white pt-20 pb-12 md:pt-10 md:pb-20 overflow-hidden" // کلاس portfolio-section اضافه شد
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-4xl sm:text-5xl font-bold text-center mb-12 lg:mb-20">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400">
            My Creative Projects
          </span>
        </h3>
      </div>
      {/* رندر شرطی بر اساس isMobile */}
      {isMobile ? (
        // حالت موبایل: نمایش عمودی با دکمه "Load More"
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* ref={horizontalRef} در حالت موبایل هم به div والد کارت‌ها اشاره می‌کند */}
          {/* این div در حالت موبایل به صورت grid نمایش داده می‌شود */}
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
        // حالت دسکتاپ: اسکرول افقی
        // این div والد کارت‌ها برای اسکرول افقی است
        <div
          ref={horizontalRef}
          className="flex gap-6 md:gap-8 w-fit px-4 sm:px-8 md:px-12 lg:px-24"
          style={{ willChange: "transform" }}
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
