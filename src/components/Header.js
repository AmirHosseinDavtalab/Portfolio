import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Home, Briefcase, Mail, UserCircle, Menu, X } from "lucide-react";

const iconProps = { className: "w-5 h-5", strokeWidth: 1.5 };

const menuItems = [
  { icon: <Home {...iconProps} />, label: "Home", section: "hero" },
  { icon: <Briefcase {...iconProps} />, label: "Portfolio", section: "portfolio" },
  { icon: <Mail {...iconProps} />, label: "Contact", section: "contact" },
  { icon: <UserCircle {...iconProps} />, label: "About Me", section: "about" },
];

const Avatar = () => (
  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 shadow-lg ring-2 ring-white/50">
    <span className="text-white text-xl font-bold select-none">A</span>
  </div>
);

// Accept smoother and isSmootherInitialized as props
const Header = ({ smoother, isSmootherInitialized }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);
  const navLinksRef = useRef([]);
  const mobileNavLinksRef = useRef([]);

  const scrollToSection = (sectionId) => {
    // Check if smoother is initialized and available
    if (isSmootherInitialized && smoother && smoother.current) {
      console.log(`Header: Scrolling to #${sectionId} with ScrollSmoother`);
      smoother.current.scrollTo(`#${sectionId}`, { smooth: true, speed: 0.8 }); // speed is optional
    } else {
      // Fallback to native scroll if smoother is not ready
      console.warn(`Header: ScrollSmoother not ready, falling back to native scroll for #${sectionId}`);
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  useGSAP(() => {
    if (!sidebarRef.current || !overlayRef.current) return;
    const tlOpen = gsap.timeline({ paused: true });
    tlOpen
      .to(overlayRef.current, { autoAlpha: 1, duration: 0.3, ease: "power2.inOut" })
      .fromTo(
        sidebarRef.current,
        { xPercent: 100, autoAlpha: 0 },
        { xPercent: 0, autoAlpha: 1, duration: 0.4, ease: "power3.out" },
        "-=0.2"
      )
      .fromTo(
        mobileNavLinksRef.current.filter(el => el),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.07, ease: "power2.out" },
        "-=0.2"
      );

    const tlClose = gsap.timeline({ paused: true });
    tlClose
      .to(mobileNavLinksRef.current.filter(el => el), {
        opacity: 0, y: 10, duration: 0.2,
        stagger: { amount: 0.15, from: "end" },
        ease: "power2.in",
      })
      .to(sidebarRef.current, {
        xPercent: 100, autoAlpha: 0, duration: 0.3, ease: "power3.in",
      }, "-=0.1")
      .to(overlayRef.current, {
        autoAlpha: 0, duration: 0.25, ease: "power2.inOut"
      }, "-=0.2");

    if (isMenuOpen) {
      tlClose.pause(0);
      tlOpen.play(0);
      document.body.style.overflow = 'hidden';
    } else {
      tlOpen.pause(0);
      if (tlClose.duration() > 0) {
        tlClose.play(0).then(() => {
          if (!isMenuOpen) {
            document.body.style.overflow = '';
          }
        });
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      tlOpen.kill();
      tlClose.kill();
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = '';
      }
    }
  }, { scope: headerRef, dependencies: [isMenuOpen] });

  useGSAP(() => {
    navLinksRef.current.forEach((link) => {
      if (!link) return;
      const underline = link.querySelector(".underline-anim");
      if (!underline) return;
      gsap.set(underline, { scaleX: 0, transformOrigin: "left center" });
      const mouseEnterHandler = () => gsap.to(underline, { scaleX: 1, duration: 0.3, ease: "power2.out", transformOrigin: "left center" });
      const mouseLeaveHandler = () => gsap.to(underline, { scaleX: 0, duration: 0.3, ease: "power2.out", transformOrigin: "right center" });
      link.addEventListener("mouseenter", mouseEnterHandler);
      link.addEventListener("mouseleave", mouseLeaveHandler);
      return () => {
        link.removeEventListener("mouseenter", mouseEnterHandler);
        link.removeEventListener("mouseleave", mouseLeaveHandler);
      };
    });
  }, { scope: headerRef, dependencies: [menuItems] });

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full bg-slate-900/80 backdrop-blur-lg z-[50] shadow-xl border-b border-slate-700/50"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16 md:h-20">
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); scrollToSection("hero"); }}
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            Amir Davtalab
          </a>
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-1">
            {menuItems.map((item, index) => (
              <a
                key={item.label}
                href={`#${item.section}`} // Keep href for semantics and fallback
                ref={(el) => (navLinksRef.current[index] = el)}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.section);
                }}
                className="relative flex items-center px-3 lg:px-4 py-2 text-slate-200 hover:text-white transition-colors duration-200 group"
              >
                <span className="mr-2 text-purple-400 group-hover:text-purple-300 transition-colors">
                  {item.icon}
                </span>
                <span className="text-sm lg:text-base font-medium">{item.label}</span>
                <span className="underline-anim absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 to-orange-400"></span>
              </a>
            ))}
          </nav>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              className="p-2 text-slate-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-md transition-all"
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </header>
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/70 z-[90]"
        style={{ autoAlpha: 0 }}
        onClick={() => setIsMenuOpen(false)}
      />
      <aside
        ref={sidebarRef}
        className="fixed top-0 right-0 h-full w-72 sm:w-80 max-w-[85vw] bg-slate-800 shadow-2xl z-[100]"
        style={{ autoAlpha: 0 }}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <Avatar />
          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
            className="p-2 text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-md transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 flex flex-col p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item, index) => (
            <a
              key={item.label}
              href={`#${item.section}`} // Keep href for semantics
              ref={(el) => (mobileNavLinksRef.current[index] = el)}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.section);
              }}
              className="flex items-center px-4 py-3 text-slate-200 hover:bg-slate-700/70 hover:text-white rounded-lg transition-all duration-200 group"
              style={{ opacity: 0 }}
            >
              <span className="mr-3 text-purple-400 group-hover:text-purple-300 transition-colors">
                {item.icon}
              </span>
              <span className="text-base font-medium">{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="p-4 mt-auto border-t border-slate-700">
            <p className="text-xs text-slate-500 text-center">© {new Date().getFullYear()} Amir Davtalab</p>
        </div>
      </aside>
    </>
  );
};

export default Header;
